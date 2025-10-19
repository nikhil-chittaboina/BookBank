import React from 'react';
import { Link } from 'react-router-dom'; 
import MetricCard from '../components/MetricCard';
import HowItWorksCard from '../components/HowItWorksCard';

// Image URLs from the public folder
const HERO_IMAGE_URL = "/images/banner2.jpeg"; 
const BANNER_1_URL = "/images/collections_book1.png"; // Your first banner image
const BANNER_2_URL = "/images/collections_book2.png"; // Your second banner image

// Static Data (Metrics and Steps remain the same)
const metrics = [
  { value: '50,000+', label: 'Books Available' },
  { value: '5,000+', label: 'Active Members' },
  { value: '100+', label: 'Categories' },
  { value: '24/7', label: 'Online Access' },
];

const steps = [
  { step: 1, title: 'Sign Up', description: 'Create your free account and become a member of our library' },
  { step: 2, title: 'Browse & Search', description: 'Explore our vast collection and find your next favorite book' },
  { step: 3, title: 'Borrow & Read', description: 'Borrow books and enjoy reading at your own pace' },
];

// Define a subtle text shadow style object for the Hero text
const textShadowStyle = {
  textShadow: '0 0 4px rgba(0, 0, 0, 0.9)',
};

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* 1. HERO SECTION */}
      <div 
        className="relative py-32 px-4 sm:px-6 lg:px-8 bg-cover bg-center shadow-xl"
        style={{ backgroundImage: `url(${HERO_IMAGE_URL})` }}
      >
        <div className="absolute inset-0 bg-gray-900 opacity-60"></div>
        
        <div className="relative max-w-7xl mx-auto text-white">
          <div className="md:w-3/4 lg:w-2/3">
            <h1 
              className="text-5xl md:text-6xl font-extrabold leading-tight"
              style={textShadowStyle}
            >
              Access Knowledge, Anytime, Anywhere.
            </h1>
            <p 
              className="mt-4 text-xl text-gray-300"
              style={textShadowStyle}
            >
              The digital catalog for our shared physical library. Browse, check out, and manage every book in our collection.
            </p>
            <Link 
              to="/catalog"
              className="mt-8 inline-block px-8 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-xl hover:bg-indigo-700 transition transform hover:scale-105"
            >
              Start Browsing Now
            </Link>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        
        {/* --- 2. Metrics Section --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16 -mt-20 relative z-10">
          {metrics.map((metric, index) => (
            <MetricCard key={index} value={metric.value} label={metric.label} />
          ))}
        </div>

        {/* --- 3. How It Works Section --- */}
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step) => (
            <HowItWorksCard key={step.step} {...step} />
          ))}
        </div>

        {/* --- 4. Our Collection Preview (Updated to use Banners) --- */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Collection</h2>
        
        <div className="flex flex-col space-y-6">
            {/* Banner 1 */}
            <div className="rounded-xl shadow-2xl overflow-hidden border border-gray-200 cursor-pointer transition transform hover:scale-[1.01]">
                <img 
                    src={BANNER_1_URL} 
                    alt="Current Bestsellers Collection Banner" 
                    className="w-full object-cover" 
                />
            </div>
            
            {/* Banner 2 */}
            <div className="rounded-xl shadow-2xl overflow-hidden border border-gray-200 cursor-pointer transition transform hover:scale-[1.01]">
                <img 
                    src={BANNER_2_URL} 
                    alt="Genre Focus Collection Banner" 
                    className="w-full object-cover" 
                />
            </div>
        </div>
        
      </div>
    </div>
  );
};

export default Home;