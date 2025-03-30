import React, { useEffect, useRef } from 'react';
import { NutritionData } from '../types/NutritionData';

interface ResultsSectionProps {
  nutritionData: NutritionData | null;
  imagePreview: string | null;
  onAnalyzeAnother: () => void;
  isVisible: boolean;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ 
  nutritionData, 
  imagePreview, 
  onAnalyzeAnother, 
  isVisible 
}) => {
  const goodScoreCircleRef = useRef<SVGCircleElement>(null);
  const badScoreCircleRef = useRef<SVGCircleElement>(null);
  const netScoreCircleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (isVisible && nutritionData) {
      animateScoreCircles();
    }
  }, [isVisible, nutritionData]);

  if (!isVisible || !nutritionData) return null;

  const { goodScore, badScore, netScore, healthRating, summary } = nutritionData;
  
  const getHealthRatingColor = () => {
    switch (healthRating) {
      case 'Poor': return 'text-danger-500';
      case 'Medium': return 'text-warning-500';
      case 'Good': return 'text-primary-500';
      default: return 'text-warning-500';
    }
  };

  const getHealthRatingBg = () => {
    switch (healthRating) {
      case 'Poor': return 'bg-danger-500';
      case 'Medium': return 'bg-warning-500';
      case 'Good': return 'bg-primary-500';
      default: return 'bg-warning-500';
    }
  };

  const getNetScoreSign = () => {
    return netScore > 0 ? '+' : '';
  };

  const getAbsNetScore = Math.abs(netScore);

  const getHealthRatingPosition = () => {
    // Calculate position on the scale from -30% to +30%
    const scale = 100;
    const position = ((netScore + 30) / 60) * scale;
    return `${position}%`;
  };

  const animateScoreCircles = () => {
    if (goodScoreCircleRef.current && badScoreCircleRef.current && netScoreCircleRef.current) {
      // Reset the dasharray first
      goodScoreCircleRef.current.style.strokeDasharray = "0, 100";
      badScoreCircleRef.current.style.strokeDasharray = "0, 100";
      netScoreCircleRef.current.style.strokeDasharray = "0, 100";
      
      // Set a timeout to allow the browser to register the initial state
      setTimeout(() => {
        if (goodScoreCircleRef.current && badScoreCircleRef.current && netScoreCircleRef.current) {
          goodScoreCircleRef.current.style.strokeDasharray = `${goodScore}, 100`;
          badScoreCircleRef.current.style.strokeDasharray = `${badScore}, 100`;
          netScoreCircleRef.current.style.strokeDasharray = `${getAbsNetScore}, 100`;
        }
      }, 300);
    }
  };

  return (
    <div className={isVisible ? 'block' : 'hidden'}>
      <h2 className="text-2xl font-semibold text-neutral-800 mb-6 text-center">Nutrition Analysis Results</h2>
      
      {/* Preview of uploaded image */}
      {imagePreview && (
        <div className="flex justify-center mb-8">
          <div className="relative rounded-lg overflow-hidden shadow-md w-full max-w-md">
            <img 
              src={imagePreview} 
              alt="Uploaded food" 
              className="w-full h-64 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white font-medium text-lg">Your Food Image</p>
            </div>
          </div>
        </div>
      )}

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Good Score Card */}
        <div className="score-card bg-white rounded-xl shadow-md overflow-hidden p-5 flex flex-col items-center">
          <div className="text-center mb-4">
            <span className="text-primary-500 font-semibold text-lg">Good Score</span>
          </div>
          <div className="relative" style={{ width: '120px', height: '120px' }}>
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#e5e7eb" strokeWidth="2"></circle>
              <circle 
                ref={goodScoreCircleRef}
                cx="18" 
                cy="18" 
                r="15.91549430918954" 
                fill="transparent" 
                stroke="#10b981" 
                strokeWidth="2.5" 
                strokeDasharray={`${goodScore}, 100`} 
                strokeDashoffset="0" 
                className="progress-ring__circle" 
              ></circle>
              <text x="18" y="18.5" textAnchor="middle" className="text-3xl font-semibold" fill="#1f2937">{goodScore}%</text>
            </svg>
          </div>
          <div className="mt-2 text-center">
            <p className="text-neutral-600 text-sm">Positive nutritional elements</p>
          </div>
        </div>

        {/* Bad Score Card */}
        <div className="score-card bg-white rounded-xl shadow-md overflow-hidden p-5 flex flex-col items-center">
          <div className="text-center mb-4">
            <span className="text-danger-500 font-semibold text-lg">Bad Score</span>
          </div>
          <div className="relative" style={{ width: '120px', height: '120px' }}>
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#e5e7eb" strokeWidth="2"></circle>
              <circle 
                ref={badScoreCircleRef}
                cx="18" 
                cy="18" 
                r="15.91549430918954" 
                fill="transparent" 
                stroke="#ef4444" 
                strokeWidth="2.5" 
                strokeDasharray={`${badScore}, 100`} 
                strokeDashoffset="0" 
                className="progress-ring__circle" 
              ></circle>
              <text x="18" y="18.5" textAnchor="middle" className="text-3xl font-semibold" fill="#1f2937">{badScore}%</text>
            </svg>
          </div>
          <div className="mt-2 text-center">
            <p className="text-neutral-600 text-sm">Negative nutritional elements</p>
          </div>
        </div>

        {/* Net Score Card */}
        <div className="score-card bg-white rounded-xl shadow-md overflow-hidden p-5 flex flex-col items-center">
          <div className="text-center mb-4">
            <span className="text-warning-500 font-semibold text-lg">Net Score</span>
          </div>
          <div className="relative flex items-center justify-center" style={{ width: '120px', height: '120px' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-semibold text-neutral-800">{getNetScoreSign()}{getAbsNetScore}%</span>
            </div>
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#e5e7eb" strokeWidth="2"></circle>
              <circle 
                ref={netScoreCircleRef}
                cx="18" 
                cy="18" 
                r="15.91549430918954" 
                fill="transparent" 
                stroke="#f59e0b" 
                strokeWidth="2.5" 
                strokeDasharray={`${getAbsNetScore}, 100`} 
                strokeDashoffset="0" 
                className="progress-ring__circle"
              ></circle>
            </svg>
          </div>
          <div className="flex items-center space-x-2 mt-3 justify-center">
            <span className={`inline-block w-3 h-3 ${getHealthRatingBg()} rounded-full`}></span>
            <span className="text-neutral-700 font-medium">{healthRating} Health Rating</span>
          </div>
        </div>
      </div>

      {/* Health Rating Scale */}
      <div className="bg-white rounded-lg shadow-md p-5 mb-8">
        <h3 className="text-xl font-semibold text-neutral-800 mb-4">Health Rating Scale</h3>
        <div className="flex items-center justify-between w-full h-4 bg-neutral-100 rounded-full overflow-hidden">
          <div className="h-full bg-danger-500" style={{ width: '33%' }}></div>
          <div className="h-full bg-warning-500" style={{ width: '34%' }}></div>
          <div className="h-full bg-primary-500" style={{ width: '33%' }}></div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-neutral-600">
          <span>Poor (Below -10%)</span>
          <span>Medium (-10% to +10%)</span>
          <span>Good (Above +10%)</span>
        </div>
        <div className="mt-4 relative">
          <div className="absolute left-0 right-0 h-0.5 bg-neutral-200"></div>
          <div 
            className={`absolute h-4 w-4 ${getHealthRatingBg()} rounded-full transform -translate-x-1/2 -translate-y-1/2`} 
            style={{ left: getHealthRatingPosition(), top: '0' }}
          ></div>
          <div className="pt-6 text-center text-neutral-700">
            <p>Your score: <span className="font-medium">{getNetScoreSign()}{getAbsNetScore}%</span> ({healthRating} Health Rating)</p>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-neutral-800 px-6 py-4">
          <h3 className="text-xl font-semibold text-white">Nutrition Summary</h3>
        </div>
        <div className="p-6">
          <p className="text-neutral-700 mb-4">
            {summary.overview}
          </p>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-neutral-800 mb-1">Positive Elements</h4>
              <ul className="list-disc pl-5 text-neutral-600">
                {summary.positiveElements.map((element, index) => (
                  <li key={index}>{element}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-neutral-800 mb-1">Areas for Improvement</h4>
              <ul className="list-disc pl-5 text-neutral-600">
                {summary.areasForImprovement.map((area, index) => (
                  <li key={index}>{area}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-neutral-800 mb-1">Recommendation</h4>
              <p className="text-neutral-600">
                {summary.recommendation}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button 
          onClick={onAnalyzeAnother}
          className="px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-300 flex items-center justify-center"
        >
          <i className="ri-refresh-line mr-2"></i>
          Analyze Another Image
        </button>
        <button 
          className="px-6 py-3 bg-white border border-neutral-300 text-neutral-700 rounded-md hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:ring-offset-2 transition-colors duration-300 flex items-center justify-center"
        >
          <i className="ri-download-line mr-2"></i>
          Download Report
        </button>
      </div>
    </div>
  );
};

export default ResultsSection;
