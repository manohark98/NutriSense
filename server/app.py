import os
import cv2
import pytesseract
import numpy as np
import requests
import json
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5000", 
            "http://0.0.0.0:5000", 
            "https://*.repl.co", 
            "https://*.replit.dev"
        ],
        "methods": ["GET", "POST", "OPTIONS", "DELETE"],
        "allow_headers": ["Content-Type"]
    }
})

def call_llm(context, question):
    """
    Call the LLM API via OpenRouter.
    The prompt instructs the model to answer solely based on the provided context extracted from uploaded food product labels.
    It is required to calculate the nutrition scores and generate the summary details.
    """
    # Use your API key here (or set it as environment variable)
    api_key = "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"
    if not api_key:
        return "API Key Missing"
    
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "HTTP-Referer": os.environ.get("SITE_URL", "https://example.com"),
        "X-Title": os.environ.get("SITE_NAME", "My Site"),
        "Content-Type": "application/json"
    }
    
    message = (
        "You are an AI assistant that calculates nutrition scores from food label data. "
        "Based solely on the provided context, calculate the following values using only the data present. "
        "Your response MUST have exactly the following nine lines (do not include any extra text):\n\n"
        "Line 1: Nutritional Benefit Score: <numeric value>\n"
        "Line 2: Nutritional Risk Score: <numeric value>\n"
        "Line 3: Overall Nutrition Score: <numeric value> (<Health Rating>)\n"
        "Line 4: Additives Percentage: <numeric value>\n"
        "Line 5: Sodium Percentage: <numeric value>\n"
        "Line 6: Overview: <one-sentence overview>\n"
        "Line 7: Recommendation: <one-sentence recommendation>\n"
        "Line 8: Positive Elements: <comma-separated list>\n"
        "Line 9: Areas for Improvement: <comma-separated list>\n\n"
        "Do not include any additional text or formatting.\n\n"
        "Context:\n" + context + "\n\n"
        "Question: " + question
    )
    
    data = {
        "model": "qwen/qwen2.5-vl-32b-instruct:free",
        "messages": [
            {"role": "user", "content": message}
        ]
    }
    
    response = requests.post(url, headers=headers, data=json.dumps(data))
    print("LLM HTTP response:", response)
    if response.status_code == 200:
        result = response.json()
        try:
            answer = result["choices"][0]["message"]["content"]
        except Exception:
            answer = "Error parsing response from LLM."
        return answer
    else:
        return f"Error from API: {response.status_code}, {response.text}"

def create_prompt():
    # A stricter prompt ensures the LLM outputs exactly the nine lines.
    prompt = """
You are given food product label and ingredient data. Using the following Yuka-inspired metric, calculate the nutrition scores and additional percentages.

1. Nutritional Benefit Score: Sum the % Daily Value (DV) of beneficial nutrients (fiber, protein, vitamins such as Vitamin D, and minerals like Calcium, Iron, Potassium).
2. Nutritional Risk Score: Sum the % DV of nutrients to limit (total fat, saturated fat, trans fat, cholesterol, sodium, added sugars).
3. Overall Nutrition Score: Calculate as (Nutritional Benefit Score) minus (Nutritional Risk Score).
4. Additives Percentage: Estimate the percentage of additives from the ingredient list.
5. Sodium Percentage: Extract the sodium % DV from the label.
6. Health Rating: 
   - Overall Nutrition Score ≥ +10 => "High Health Rating"
   - Overall Nutrition Score between 0 and +10 => "Medium Health Rating"
   - Overall Nutrition Score < 0 => "Low Health Rating"

Now, produce a summary that includes:
- Overview: one-sentence explanation of the overall nutritional quality.
- Recommendation: one-sentence recommendation.
- Positive Elements: a comma-separated list of positive nutritional aspects.
- Areas for Improvement: a comma-separated list of aspects that could be improved.

Output Format (exactly 9 lines):
Nutritional Benefit Score: <value>
Nutritional Risk Score: <value>
Overall Nutrition Score: <value> (<Health Rating>)
Additives Percentage: <value>
Sodium Percentage: <value>
Overview: <one-sentence overview>
Recommendation: <one-sentence recommendation>
Positive Elements: <comma-separated list>
Areas for Improvement: <comma-separated list>

Food Label Data:
<<INSERT LABEL/INGREDIENT DATA HERE>>
    """
    return prompt.strip()

def parse_llm_response(response_text):
    """
    Parse the LLM response text to extract the scores and summary.
    Expected keys:
      Nutritional Benefit Score, Nutritional Risk Score, Overall Nutrition Score (with Health Rating),
      Additives Percentage, Sodium Percentage, Overview, Recommendation, Positive Elements, Areas for Improvement.
    """
    result = {}
    lines = response_text.splitlines()
    for line in lines:
        if line.startswith("Nutritional Benefit Score:"):
            result['nutritionalBenefitScore'] = line.split(":", 1)[1].strip()
        elif line.startswith("Nutritional Risk Score:"):
            result['nutritionalRiskScore'] = line.split(":", 1)[1].strip()
        elif line.startswith("Overall Nutrition Score:"):
            part = line.split(":", 1)[1].strip()
            try:
                score, rating = part.split("(", 1)
                result['overallNutritionScore'] = score.strip()
                result['healthRating'] = rating.replace(")", "").strip()
            except Exception:
                result['overallNutritionScore'] = part
        elif line.startswith("Additives Percentage:"):
            result['additivesPercentage'] = line.split(":", 1)[1].strip()
        elif line.startswith("Sodium Percentage:"):
            result['sodiumPercentage'] = line.split(":", 1)[1].strip()
        elif line.startswith("Overview:"):
            result['overview'] = line.split(":", 1)[1].strip()
        elif line.startswith("Recommendation:"):
            result['recommendation'] = line.split(":", 1)[1].strip()
        elif line.startswith("Positive Elements:"):
            elements = line.split(":", 1)[1].strip()
            result['positiveElements'] = [elem.strip() for elem in elements.split(",") if elem.strip()]
        elif line.startswith("Areas for Improvement:"):
            areas = line.split(":", 1)[1].strip()
            result['areasForImprovement'] = [area.strip() for area in areas.split(",") if area.strip()]
    return result

def generate_summary(good_score, bad_score, net_score, health_rating, llm_summary_fields=None):
    """
    Generate a summary based on the nutrition scores.
    If llm_summary_fields (with keys: overview, recommendation, positiveElements, areasForImprovement)
    is provided and complete, use those values; otherwise, generate defaults.
    """
    if llm_summary_fields:
        overview = llm_summary_fields.get("overview", "").strip()
        recommendation = llm_summary_fields.get("recommendation", "").strip()
        positive_elements = llm_summary_fields.get("positiveElements", [])
        areas_for_improvement = llm_summary_fields.get("areasForImprovement", [])
        if overview and recommendation and positive_elements and areas_for_improvement:
            return {
                "overview": overview,
                "recommendation": recommendation,
                "positiveElements": positive_elements,
                "areasForImprovement": areas_for_improvement
            }
    
    # Fallback default generation if any field is missing
    sign = "+" if net_score > 0 else ""
    overview = f"Based on our analysis, your food has a {health_rating.lower()} health rating with a net score of {sign}{net_score}%. "
    
    if health_rating == "Good":
        overview += "It is nutritionally beneficial with many positive elements."
        positive_elements = [
            "High in essential nutrients",
            "Good source of protein",
            "Rich in dietary fiber",
            "Contains healthy fats"
        ]
        areas_for_improvement = [
            "Some sodium",
            "Moderate sugar",
            "Minor processing"
        ]
        recommendation = "Regular consumption is recommended as part of a balanced diet."
    elif health_rating == "Medium":
        overview += "It has a balanced nutritional profile with room for improvement."
        positive_elements = [
            "Moderate protein",
            "Contains fiber",
            "Some vitamins and minerals"
        ]
        areas_for_improvement = [
            "Relatively high sodium",
            "Some processed ingredients",
            "Moderate sugar"
        ]
        recommendation = "Consume in moderation and pair with fresh foods."
    else:
        overview += "It has more negative than positive nutritional aspects."
        positive_elements = [
            "Provides some energy",
            "Contains minimal nutrients"
        ]
        areas_for_improvement = [
            "High in unhealthy fats",
            "Excessive sodium",
            "Added sugars",
            "Highly processed"
        ]
        recommendation = "Consider alternatives with better nutritional profiles."
    
    return {
        "overview": overview,
        "recommendation": recommendation,
        "positiveElements": positive_elements,
        "areasForImprovement": areas_for_improvement
    }

@app.route('/api/analyze', methods=['POST'])
def analyze_image():
    """
    Process the uploaded image, extract text using pytesseract,
    call the LLM with the nutrition metric prompt, parse the response,
    and return the nutrition data with a summary.
    """
    print("Processing started.")
    if 'image' not in request.files:
        return jsonify({'error': 'No image part in the request'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No image selected for uploading'}), 400
    
    try:
        # Read image and decode it using OpenCV
        file_bytes = np.asarray(bytearray(file.read()), dtype=np.uint8)
        image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        print("Image decoded.")
        
        # Extract text from the image using pytesseract
        extracted_text = pytesseract.image_to_string(image)
        print("Extracted Text:", extracted_text)
        
        # Build the prompt using the extracted text
        prompt_instructions = create_prompt()
        
        # Call the LLM
        llm_response = call_llm(extracted_text, prompt_instructions)
        print("LLM Response:", llm_response)
        
        # Parse the LLM response
        parsed_result = parse_llm_response(llm_response)
        print("Parsed Result:", parsed_result)
        
        # Convert scores to integers if possible
        try:
            good_score = int(parsed_result.get('nutritionalBenefitScore', 0))
        except:
            good_score = 0
        try:
            bad_score = int(parsed_result.get('nutritionalRiskScore', 0))
        except:
            bad_score = 0
        try:
            net_score = int(parsed_result.get('overallNutritionScore', 0))
        except:
            net_score = 0
        
        # Normalize health rating
        health_rating = parsed_result.get('healthRating', "Medium")
        if "High" in health_rating or "Good" in health_rating:
            health_rating_norm = "Good"
        elif "Low" in health_rating or "Poor" in health_rating:
            health_rating_norm = "Poor"
        else:
            health_rating_norm = "Medium"
        
        # Build summary fields from the LLM output
        llm_summary_fields = {
            "overview": parsed_result.get('overview', "").strip(),
            "recommendation": parsed_result.get('recommendation', "").strip(),
            "positiveElements": parsed_result.get('positiveElements', []),
            "areasForImprovement": parsed_result.get('areasForImprovement', [])
        }
        
        # Generate the summary (LLM fields used if available)
        dynamic_summary = generate_summary(good_score, bad_score, net_score, health_rating_norm, llm_summary_fields)
        
        # Build final response
        nutrition_data = {
            "goodScore": good_score,
            "badScore": bad_score,
            "netScore": net_score,
            "healthRating": health_rating_norm,
            "additivesPercentage": parsed_result.get('additivesPercentage', "N/A"),
            "sodiumPercentage": parsed_result.get('sodiumPercentage', "N/A"),
            "summary": dynamic_summary
        }
        
        return jsonify(nutrition_data)
    
    except Exception as e:
        return jsonify({'error': 'Something went wrong', 'details': str(e)}), 500

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join('dist/public', path)):
        return send_from_directory('dist/public', path)
    else:
        return send_from_directory('dist/public', 'index.html')

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8000, debug=True)
