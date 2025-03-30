export interface NutritionSummary {
  overview: string;
  positiveElements: string[];
  areasForImprovement: string[];
  recommendation: string;
}

export interface NutritionData {
  goodScore: number;
  badScore: number;
  netScore: number;
  healthRating: 'Poor' | 'Medium' | 'Good';
  summary: NutritionSummary;
}
