import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { MiniAppContext } from '../../routes/MiniAppContextProvider';

const robots = [
  { color: 'purple', image: '/images/bot.png', name: 'Nexus', stats: 'Enhanced GPU Processing' },
  { color: 'blue', image: '/images/bot_blue.png', name: 'Cipher', stats: 'Advanced Data Mining' },
  { color: 'green', image: '/images/bot_green.png', name: 'Quantum', stats: 'Efficient Energy Management' },
];

const RobotSelection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const { setSelectedRobot } = useContext(MiniAppContext);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x < -50 && currentIndex < robots.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (info.offset.x > 50 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleStart = () => {
    setSelectedRobot(robots[currentIndex].color);
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-[url('/images/background/home_background_color.png')] bg-cover bg-top bg-no-repeat flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-white mb-8">Choose Your Robot</h1>
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        className="w-[278px] h-[321px] mb-4"
      >
        <motion.img
          src={robots[currentIndex].image}
          alt={`${robots[currentIndex].color} robot`}
          className="w-full h-full object-contain"
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.95 }}
        />
      </motion.div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">{robots[currentIndex].name}</h2>
        <div className="bg-black bg-opacity-50 rounded-lg p-3">
          <p className="text-lg text-white font-semibold">{robots[currentIndex].stats}</p>
        </div>
      </div>
      <div className="flex justify-center space-x-2 mb-8">
        {robots.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-gray-400'
            }`}
          ></div>
        ))}
      </div>
      <button
        onClick={handleStart}
        className="bg-gradient-to-r from-[#03cea4] to-[#8e37fe] text-white font-bold py-3 px-6 rounded-full text-lg"
      >
        Start Adventure
      </button>
    </div>
  );
};

export default RobotSelection;
