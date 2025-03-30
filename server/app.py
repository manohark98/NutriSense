import os
import random
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/analyze', methods=['POST'])
def analyze_image():
    """
    Process the uploaded image and return nutrition scores.
    For testing, we'll generate random scores.
    """
    if 'image' not in request.files:
        return jsonify({'error': 'No image part in the request'}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({'error': 'No image selected for uploading'}), 400
    
    if file:
        filename = secure_filename(file.filename)
        
        # For this demo, we don't need to save the file as we're just generating random scores
        # In a real implementation, you would save the file and process it with an ML model
        
        # Generate random scores
        good_score = random.randint(10, 30)
        bad_score = random.randint(5, 25)
        net_score = good_score - bad_score
        
        # Determine health rating based on net score
        if net_score < -10:
            health_rating = "Poor"
        elif net_score > 10:
            health_rating = "Good"
        else:
            health_rating = "Medium"
        
        # Generate a summary based on the scores
        summary = generate_summary(good_score, bad_score, net_score, health_rating)
        
        # Return the nutrition data
        nutrition_data = {
            "goodScore": good_score,
            "badScore": bad_score,
            "netScore": net_score,
            "healthRating": health_rating,
            "summary": summary
        }
        
        return jsonify(nutrition_data)
    
    return jsonify({'error': 'Something went wrong'}), 500

def generate_summary(good_score, bad_score, net_score, health_rating):
    """
    Generate a summary based on the nutrition scores.
    """
    sign = "+" if net_score > 0 else ""
    overview = f"Based on our analysis, your food has a {health_rating.lower()} health rating with a net score of {sign}{net_score}%. "
    
    if health_rating == "Good":
        overview += "This indicates a nutritionally beneficial food with significantly more positive than negative nutritional elements."
        positive_elements = [
            "High in essential nutrients",
            "Good source of protein",
            "Rich in dietary fiber",
            "Contains healthy fats"
        ]
        areas_for_improvement = [
            "Contains some sodium",
            "Moderate sugar content",
            "Some processed ingredients"
        ]
        recommendation = "This food is a healthy choice and can be regularly incorporated into a balanced diet. Pair with other whole foods for a complete meal."
    
    elif health_rating == "Medium":
        overview += "This indicates a relatively balanced nutritional profile with slightly more positive than negative nutritional elements."
        positive_elements = [
            "Moderate protein content",
            "Contains fiber",
            "Some essential vitamins and minerals"
        ]
        areas_for_improvement = [
            "Relatively high sodium content",
            "Contains some processed ingredients",
            "Moderate sugar content"
        ]
        recommendation = "This food can be part of a balanced diet, but should be consumed in moderation. Consider pairing with fresh vegetables or fruits to improve the overall nutritional profile of your meal."
    
    else:  # Poor
        overview += "This indicates food with more negative than positive nutritional elements, which may not be ideal for regular consumption."
        positive_elements = [
            "Provides some calories for energy",
            "Contains small amounts of nutrients",
            "May contain some protein"
        ]
        areas_for_improvement = [
            "High in unhealthy fats",
            "High in sodium",
            "Contains added sugars",
            "Highly processed ingredients"
        ]
        recommendation = "This food should be consumed occasionally rather than regularly. Try to balance it with healthier options and consider alternatives with better nutritional profiles."
    
    return {
        "overview": overview,
        "positiveElements": positive_elements,
        "areasForImprovement": areas_for_improvement,
        "recommendation": recommendation
    }

# Serve the React app
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join('dist/public', path)):
        return send_from_directory('dist/public', path)
    else:
        return send_from_directory('dist/public', 'index.html')

if __name__ == '__main__':
    # Running on port 5000 as specified in requirements
    app.run(host='0.0.0.0', port=8000, debug=True)
