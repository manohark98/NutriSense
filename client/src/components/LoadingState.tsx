import React from 'react';

interface LoadingStateProps {
  isVisible: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="flex flex-col items-center justify-center py-16 max-w-xl mx-auto">
      <div className="relative">
        <div className="h-20 w-20 border-4 border-primary/20 rounded-full"></div>
        <div className="absolute top-0 h-20 w-20 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
        <div className="absolute top-0 h-20 w-20 border-4 border-transparent border-b-blue-500 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
        
        {/* Animated dots */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-2">
          <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
          <div className="h-2 w-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
          <div className="h-2 w-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
          Analyzing Your Food
        </h3>
        <p className="text-slate-600">
          Our AI is examining nutritional content and generating insights
        </p>
        <div className="mt-6 space-y-1.5">
          <div className="h-2 w-48 mx-auto bg-slate-200 rounded-full overflow-hidden relative">
            <div className="h-full bg-primary absolute left-0 top-0 rounded-full"
                 style={{ width: '70%', animation: 'pulse-ring 2s infinite' }}></div>
          </div>
          <div className="h-2 w-48 mx-auto bg-slate-200 rounded-full overflow-hidden relative">
            <div className="h-full bg-blue-400 absolute left-0 top-0 rounded-full"
                 style={{ width: '40%', animation: 'pulse-ring 2s infinite', animationDelay: '0.4s' }}></div>
          </div>
          <div className="h-2 w-48 mx-auto bg-slate-200 rounded-full overflow-hidden relative">
            <div className="h-full bg-primary absolute left-0 top-0 rounded-full"
                 style={{ width: '90%', animation: 'pulse-ring 2s infinite', animationDelay: '0.8s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
