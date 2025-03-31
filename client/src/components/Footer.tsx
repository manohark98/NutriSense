import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white py-10 mt-auto">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="font-bold text-xl bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              NutriSense
            </div>
            <p className="text-slate-400 mt-2 text-sm">Smart nutritional analysis at your fingertips</p>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0">
            <div>
              <h4 className="font-semibold mb-2 text-sm uppercase tracking-wider text-slate-300">Features</h4>
              <ul className="space-y-1 text-sm text-slate-400">
                <li>Food Analysis</li>
                <li>Nutritional Scoring</li>
                <li>Dietary Recommendations</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 text-sm uppercase tracking-wider text-slate-300">Technology</h4>
              <ul className="space-y-1 text-sm text-slate-400">
                <li>AI-Powered Analysis</li>
                <li>Real-time Results</li>
                <li>Secure Image Processing</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
          <p>© {new Date().getFullYear()} NutriSense. All rights reserved.</p>
          <div className="flex items-center mt-3 md:mt-0">
            <span className="h-2 w-2 rounded-full bg-primary"></span>
            <span className="ml-2">Powered by advanced nutritional AI analysis</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
