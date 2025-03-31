import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-12 relative">
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-28 h-28 bg-primary/10 rounded-full -z-10 blur-2xl" />
      
      <div className="inline-block relative">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-3">
          NutriSense
        </h1>
        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary to-blue-600 rounded-full"></div>
      </div>
      
      <p className="text-slate-600 max-w-xl mx-auto mt-4 text-lg">
        Analyze your food with <span className="font-semibold text-primary">AI-powered</span> nutrition scoring
      </p>
      
      <div className="flex justify-center mt-6 space-x-3">
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse-ring"></div>
        <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse-ring" style={{ animationDelay: '0.2s' }}></div>
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse-ring" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </header>
  );
};

export default Header;
