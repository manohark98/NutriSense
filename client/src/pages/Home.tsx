import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import Header from '../components/Header';
import UploadSection from '../components/UploadSection';
import LoadingState from '../components/LoadingState';
import ResultsSection from '../components/ResultsSection';
import Footer from '../components/Footer';
import { NutritionData } from '../types/NutritionData';
import { analyzeImage } from '../lib/api';

const Home: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: analyzeImage,
    onSuccess: (data) => {
      setNutritionData(data);
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your image. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleUpload = (file: File) => {
    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    
    // Upload the image for analysis
    uploadMutation.mutate(file);
  };

  const handleAnalyzeAnother = () => {
    // Reset states
    setImagePreview(null);
    setNutritionData(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 bg-neutral-50 min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {!uploadMutation.isPending && !nutritionData && (
          <UploadSection onUpload={handleUpload} />
        )}
        <LoadingState isVisible={uploadMutation.isPending} />
        <ResultsSection 
          nutritionData={nutritionData} 
          imagePreview={imagePreview}
          onAnalyzeAnother={handleAnalyzeAnother}
          isVisible={!uploadMutation.isPending && !!nutritionData}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
