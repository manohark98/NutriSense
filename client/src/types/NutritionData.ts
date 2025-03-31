export interface NutritionSummary {
  overview: string;
  positiveElements: string[];
  areasForImprovement: string[];
  recommendation: string;
  extracted_text: string;
}

export interface NutritionData {
  extracted_text: string;
  goodScore: number;
  badScore: number;
  netScore: number;
  healthRating: 'Poor' | 'Medium' | 'Good';
  summary: NutritionSummary;
}
