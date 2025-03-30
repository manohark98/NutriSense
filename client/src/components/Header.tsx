import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-10">
      <h1 className="text-3xl md:text-4xl font-semibold text-neutral-800 mb-2">NutriScore</h1>
      <p className="text-neutral-600 max-w-xl mx-auto">
        Upload food images and get instant nutrition analysis with our advanced AI scoring system.
      </p>
    </header>
  );
};

export default Header;
