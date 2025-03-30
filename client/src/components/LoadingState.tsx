import React from 'react';

interface LoadingStateProps {
  isVisible: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="h-12 w-12 border-4 border-neutral-200 border-t-primary-500 rounded-full mb-4 animate-spin"></div>
      <p className="text-neutral-600 font-medium">Analyzing your food image...</p>
      <p className="text-neutral-400 text-sm mt-2">This might take a few seconds</p>
    </div>
  );
};

export default LoadingState;
