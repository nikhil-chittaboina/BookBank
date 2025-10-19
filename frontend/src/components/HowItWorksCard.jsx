import React from 'react';

const colors = ['bg-indigo-600', 'bg-green-600', 'bg-purple-600'];

const HowItWorksCard = ({ step, title, description }) => {
  const color = colors[step - 1] || colors[0];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
      <div className={`mx-auto w-8 h-8 flex items-center justify-center rounded-full text-white font-bold mb-4 ${color}`}>
        {step}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
};

export default HowItWorksCard;