import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-16 text-center text-neutral-500 text-sm">
      <p>© {new Date().getFullYear()} NutriScore. All rights reserved.</p>
      <p className="mt-1">Powered by advanced nutritional AI analysis</p>
    </footer>
  );
};

export default Footer;
