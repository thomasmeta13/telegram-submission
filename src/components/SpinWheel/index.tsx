// src/components/SpinWheel.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SpinWheelProps {
  isOpen: boolean;
  onClose: () => void;
  onSpin: (result: string) => void;
  spins: number;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ isOpen, onClose, onSpin, spins }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [freeSpins, setFreeSpins] = useState(3); // Initialize with 3 free spins
  const [result, setResult] = useState('');
  
  useEffect(() => {
    // Reset state when the component opens
    if (isOpen) {
      setHasSpun(false);
      setRotation(0);
    }
  }, [isOpen]);

  const spinWheel = () => {
    if (!isSpinning && (spins > 0 || freeSpins > 0)) {
      setIsSpinning(true);
      const newRotation = rotation + 360 * 5 + Math.floor(Math.random() * 360);
      setRotation(newRotation);
      
      if (freeSpins > 0) {
        setFreeSpins(freeSpins - 1);
      } else {
        onSpin(''); // Deduct a regular spin
      }
  
      // Determine the result
      const segments = [
        { value: '1K', angle: 0 },
        { value: '100', angle: 45 },
        { value: '3K', angle: 90 },
        { value: '40', angle: 135 },
        { value: '4K', angle: 180 },
        { value: '40', angle: 225 },
        { value: '2K', angle: 270 },
        { value: '100', angle: 315 },
      ];
      const finalAngle = (360 - (newRotation % 360)) % 360; // Invert the angle
      const resultIndex = Math.floor(finalAngle / 45);
      const spinResult = segments[resultIndex].value;
      setResult(spinResult);
  
      setTimeout(() => {
        setIsSpinning(false);
        setHasSpun(true);
      }, 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        className="relative w-[90%] max-w-md rounded-lg p-6 overflow-hidden"
        style={{
          backgroundImage: "url('/images/spinwheel/bkgr.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <button onClick={onClose} className="absolute top-2 right-2 text-white text-2xl">&times;</button>
        
        <h2 className="text-white text-2xl font-bold mb-4">Spin Wheel</h2>
          <p className="text-white text-lg mb-4">
            {hasSpun ? `Congratulations! You've won ${result}!` : "Spin the wheel to win a reward!"}
          </p>        
        <div className="relative w-full aspect-square mx-auto mb-6 overflow-hidden">
          <motion.div 
            className="w-full h-full relative"
            style={{
              backgroundImage: "url('/images/spinwheel/spinwheel.png')",
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
            animate={{ rotate: rotation }}
            transition={{ duration: 3, ease: "easeOut" }}
          >
            {/* Wheel segments with numbers */}
            {[
              { value: '1K', angle: 0 },
              { value: '100', angle: 45 },
              { value: '3K', angle: 90 },
              { value: '40', angle: 135 },
              { value: '4K', angle: 180 },
              { value: '40', angle: 225 },
              { value: '2K', angle: 270 },
              { value: '100', angle: 315 },
            ].map((segment, index) => (
              <div 
                key={index}
                className="absolute w-full h-full flex items-center justify-center"
                style={{ 
                  transform: `rotate(${segment.angle}deg)`,
                }}
              >
                <span className="text-white text-xl font-bold absolute" style={{ transform: `translate(0, -100px) rotate(90deg)` }}>
                  {segment.value}
                </span>
              </div>
            ))}
            
            {/* Icons */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
              <div 
                key={index}
                className="absolute w-full h-full flex items-center justify-center"
                style={{ 
                  transform: `rotate(${angle}deg)`,
                }}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center absolute`} 
                     style={{ transform: `translate(0, -140px) rotate(90deg)`, backgroundColor: index % 2 === 0 ? '#FFD700' : '#32CD32' }}>
                  <span className="text-black text-xl font-bold">{index % 2 === 0 ? '$' : '¢'}</span>
                </div>
              </div>
            ))}
            
            {/* Center spin icon */}

          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center mb-2 mr-.5">
            <div className="relative">
              <img src="/images/spinwheel/spins.png" alt="Spins" className="w-16 h-16" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-lg font-bold">{freeSpins + spins}</span>
              </div>
            </div>
          </div>
        </div>
        
        {!hasSpun ? (
          <button 
            onClick={spinWheel} 
            disabled={isSpinning || (spins === 0 && freeSpins === 0)}
            className={`w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-full text-lg ${(isSpinning || (spins === 0 && freeSpins === 0)) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSpinning ? 'Spinning...' : (spins === 0 && freeSpins === 0) ? 'No Spins Left' : 'SPIN!'}
          </button>
        ) : (
          <button 
            onClick={() => {
              onClose();
              onSpin(result);
            }}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-full text-lg"
          >
            Claim Reward
          </button>
        )}
      </div>
    </div>
  );
};

export default SpinWheel;
