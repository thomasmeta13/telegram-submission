import React from 'react';

interface Achievement {
  title: string;
  description: string;
  icon: string;
  progress: number;
  isUnlocked: boolean;
}

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AchievementsModal: React.FC<AchievementsModalProps> = ({ isOpen, onClose }) => {
  const achievements: Achievement[] = [
    { title: 'First 1M coins', description: 'Earn 1M coins', icon: '/images/coin_icon.png', progress: 100, isUnlocked: true },
    { title: 'Growing faster!', description: 'Buy 3 agents', icon: '/images/agent_icon.png', progress: 100, isUnlocked: true },
    { title: 'First 10M coins', description: 'Earn 10M coins', icon: '/images/coin_icon.png', progress: 30, isUnlocked: false },
    { title: 'Billionaire', description: 'Earn 10B coins', icon: '/images/coin_icon.png', progress: 5, isUnlocked: false },
    { title: 'Big command', description: 'Buy 10 agents', icon: '/images/agent_icon.png', progress: 40, isUnlocked: false },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-[#0A0E1F] to-[#0F1F3D] rounded-xl p-6 w-11/12 max-w-md">
        <h2 className="text-2xl font-bold mb-4">Achievements</h2>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Unlocked</h3>
          {achievements.filter(a => a.isUnlocked).map((achievement, index) => (
            <AchievementItem key={index} achievement={achievement} />
          ))}
          <h3 className="text-lg font-semibold mt-6">Locked</h3>
          {achievements.filter(a => !a.isUnlocked).map((achievement, index) => (
            <AchievementItem key={index} achievement={achievement} />
          ))}
        </div>
        <button 
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-full"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

const AchievementItem: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
  return (
    <div className="bg-gradient-to-br from-[#1A1F37] to-[#0D0F1A] rounded-xl p-4 flex items-center">
      <img src={achievement.icon} alt={achievement.title} className="w-12 h-12 mr-4" />
      <div className="flex-grow">
        <h4 className="font-semibold">{achievement.title}</h4>
        <p className="text-sm text-gray-400">{achievement.description}</p>
        {!achievement.isUnlocked && (
          <div className="mt-2 bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 rounded-full h-2" 
              style={{ width: `${achievement.progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementsModal;

