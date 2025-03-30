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
      case 'Poor': return 'text-red-500';
      case 'Medium': return 'text-amber-500';
      case 'Good': return 'text-primary';
      default: return 'text-amber-500';
    }
  };

  const getHealthRatingBg = () => {
    switch (healthRating) {
      case 'Poor': return 'bg-red-500';
      case 'Medium': return 'bg-amber-500';
      case 'Good': return 'bg-primary';
      default: return 'bg-amber-500';
    }
  };

  const getHealthRatingGradient = () => {
    switch (healthRating) {
      case 'Poor': return 'from-red-500 to-red-600';
      case 'Medium': return 'from-amber-500 to-amber-600';
      case 'Good': return 'from-primary to-blue-600';
      default: return 'from-amber-500 to-amber-600';
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
      <div className="relative mb-12">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-48 bg-primary/10 rounded-full -z-10 blur-3xl opacity-70"></div>
      </div>
    
      {/* Upload Another Image Button - Fixed at top */}
      <div className="mb-8 flex justify-center">
        <button 
          onClick={onAnalyzeAnother}
          className="btn-primary flex items-center justify-center space-x-2 relative overflow-hidden group animate-float"
        >
          <div className="absolute inset-0 w-0 bg-white/20 transition-all duration-300 ease-out group-hover:w-full"></div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          <span>Upload Another Image</span>
        </button>
      </div>
      
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
        Nutrition Analysis Results
      </h2>
      
      {/* Preview of uploaded image */}
      {imagePreview && (
        <div className="flex justify-center mb-10">
          <div className="relative rounded-xl overflow-hidden shadow-lg w-full max-w-2xl group transition-all duration-300 hover:shadow-2xl">
            <img 
              src={imagePreview} 
              alt="Uploaded food" 
              className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center mb-3">
                  <div className={`h-3 w-3 rounded-full ${getHealthRatingBg()} mr-2 animate-pulse`}></div>
                  <p className="text-white font-medium uppercase tracking-wider text-sm">{healthRating} Health Rating</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 inline-block">
                  <p className="text-white text-xl font-bold">{getNetScoreSign()}{getAbsNetScore}% Net Score</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
        {/* Good Score Card */}
        <div className="score-card flex flex-col items-center">
          <div className="text-center mb-4">
            <span className="text-emerald-500 font-semibold text-lg">Good Score</span>
          </div>
          <div className="relative" style={{ width: '150px', height: '150px' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-slate-800">{goodScore}%</span>
            </div>
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#e5e7eb" strokeWidth="3"></circle>
              <circle 
                ref={goodScoreCircleRef}
                cx="18" 
                cy="18" 
                r="15.91549430918954" 
                fill="transparent" 
                stroke="url(#goodGradient)" 
                strokeWidth="3.5" 
                strokeDasharray={`${goodScore}, 100`} 
                strokeDashoffset="0" 
                className="progress-ring__circle" 
                strokeLinecap="round"
              ></circle>
              <defs>
                <linearGradient id="goodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="mt-4 text-center">
            <p className="text-slate-600">Positive nutritional elements</p>
          </div>
        </div>

        {/* Bad Score Card */}
        <div className="score-card flex flex-col items-center">
          <div className="text-center mb-4">
            <span className="text-red-500 font-semibold text-lg">Bad Score</span>
          </div>
          <div className="relative" style={{ width: '150px', height: '150px' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-slate-800">{badScore}%</span>
            </div>
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#e5e7eb" strokeWidth="3"></circle>
              <circle 
                ref={badScoreCircleRef}
                cx="18" 
                cy="18" 
                r="15.91549430918954" 
                fill="transparent" 
                stroke="url(#badGradient)" 
                strokeWidth="3.5" 
                strokeDasharray={`${badScore}, 100`} 
                strokeDashoffset="0" 
                className="progress-ring__circle" 
                strokeLinecap="round"
              ></circle>
              <defs>
                <linearGradient id="badGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="mt-4 text-center">
            <p className="text-slate-600">Negative nutritional elements</p>
          </div>
        </div>

        {/* Net Score Card */}
        <div className="score-card flex flex-col items-center">
          <div className="text-center mb-4">
            <span className={getHealthRatingColor() + " font-semibold text-lg"}>Net Score</span>
          </div>
          <div className="relative" style={{ width: '150px', height: '150px' }}>
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <span className="text-4xl font-bold text-slate-800">{getNetScoreSign()}{getAbsNetScore}%</span>
            </div>
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#e5e7eb" strokeWidth="3"></circle>
              <circle 
                ref={netScoreCircleRef}
                cx="18" 
                cy="18" 
                r="15.91549430918954" 
                fill="transparent" 
                stroke={`url(#${healthRating.toLowerCase()}Gradient)`} 
                strokeWidth="3.5" 
                strokeDasharray={`${getAbsNetScore}, 100`} 
                strokeDashoffset="0" 
                className="progress-ring__circle"
                strokeLinecap="round"
              ></circle>
              <defs>
                <linearGradient id="poorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
                <linearGradient id="mediumGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="goodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="flex items-center space-x-2 mt-4 justify-center">
            <span className={`inline-block w-3 h-3 ${getHealthRatingBg()} rounded-full`}></span>
            <span className="text-slate-700 font-medium">{healthRating} Health Rating</span>
          </div>
        </div>
      </div>

      {/* Health Rating Scale */}
      <div className="card p-6 mb-10 max-w-4xl mx-auto">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
          <div className="bg-primary/10 p-2 rounded-full mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          Health Rating Scale
        </h3>
        <div className="flex items-center justify-between w-full h-5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-red-500 to-red-600" style={{ width: '33%' }}></div>
          <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600" style={{ width: '34%' }}></div>
          <div className="h-full bg-gradient-to-r from-primary to-blue-600" style={{ width: '33%' }}></div>
        </div>
        <div className="flex justify-between mt-3 text-sm text-slate-600">
          <span>Poor (Below -10%)</span>
          <span>Medium (-10% to +10%)</span>
          <span>Good (Above +10%)</span>
        </div>
        <div className="mt-6 relative">
          <div className="absolute left-0 right-0 h-0.5 bg-slate-200"></div>
          <div 
            className={`absolute h-6 w-6 ${getHealthRatingBg()} rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-md border-2 border-white animate-pulse`} 
            style={{ left: getHealthRatingPosition(), top: '0' }}
          ></div>
          <div className="pt-8 text-center">
            <p className="text-slate-700 font-medium">Your score: <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">{getNetScoreSign()}{getAbsNetScore}%</span></p>
            <p className={`mt-1 inline-block px-3 py-1 rounded-full text-white text-sm bg-gradient-to-r ${getHealthRatingGradient()}`}>
              {healthRating} Health Rating
            </p>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="card mb-10 max-w-4xl mx-auto overflow-hidden">
        <div className={`bg-gradient-to-r ${getHealthRatingGradient()} px-6 py-5`}>
          <h3 className="text-xl font-bold text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Nutrition Summary
          </h3>
        </div>
        <div className="p-8">
          <p className="text-slate-700 mb-6 text-lg leading-relaxed">
            {summary.overview}
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-emerald-50 rounded-xl p-5">
              <h4 className="font-semibold text-emerald-700 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Positive Elements
              </h4>
              <ul className="space-y-2">
                {summary.positiveElements.map((element, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 mr-2"></span>
                    <span className="text-slate-600">{element}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 rounded-xl p-5">
              <h4 className="font-semibold text-red-700 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Areas for Improvement
              </h4>
              <ul className="space-y-2">
                {summary.areasForImprovement.map((area, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-2"></span>
                    <span className="text-slate-600">{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6 p-5 border border-blue-100 bg-blue-50 rounded-xl">
            <h4 className="font-semibold text-blue-700 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Recommendation
            </h4>
            <p className="text-slate-600 leading-relaxed">
              {summary.recommendation}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
        <button 
          onClick={onAnalyzeAnother}
          className="btn-primary flex items-center justify-center group"
        >
          <div className="absolute inset-0 w-0 bg-white/20 transition-all duration-300 ease-out group-hover:w-full"></div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Upload Another Image
        </button>
        <button 
          className="btn-secondary flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Download Report
        </button>
      </div>
    </div>
  );
};

export default ResultsSection;
