import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const GamePage: React.FC = () => {
  const { gameTitle } = useParams<{ gameTitle: string }>();
  const navigate = useNavigate();

  const gameUrls: { [key: string]: string } = {
    'data-shoot': 'https://data-sthoot.vercel.app/',
    'touring-test': 'https://i.simmer.io/@akhmvfgsajhb/tmrwbgl',
  };

  const iframeUrl = gameUrls[gameTitle || ''] || '';

  return (
    <div className="fixed inset-0 w-full h-full bg-black">
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-4 left-4 z-10 bg-white bg-opacity-20 text-white rounded-full p-2 hover:bg-opacity-30 transition-all duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      {iframeUrl ? (
        <iframe
          src={iframeUrl}
          title={gameTitle}
          className="w-full h-full border-0"
          allow="geolocation; microphone; camera; midi; encrypted-media;"
          allowFullScreen
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white text-2xl">
          Game not found
        </div>
      )}
    </div>
  );
};

export default GamePage;
