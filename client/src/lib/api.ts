import { NutritionData } from '../types/NutritionData';
import { apiRequest } from './queryClient';

export async function analyzeImage(image: File): Promise<NutritionData> {
  const formData = new FormData();
  formData.append('image', image);

  const response = await fetch('http://localhost:5000/api/analyze', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });


  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Analysis failed: ${response.status} ${text}`);
  }

  return await response.json();
}
