import React from 'react';
import { useNavigate } from 'react-router-dom';

const DataShoot: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen">
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-4 left-4 z-10 bg-white bg-opacity-20 text-white rounded-full p-2 hover:bg-opacity-30 transition-all duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <iframe
        src="https://data-sthoot.vercel.app"
        title="Data Shoot Game"
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
};

export default DataShoot;
