import React, { useContext, useState } from 'react';
import { MiniAppContext } from '../../routes/MiniAppContextProvider';
import TopNavBar from '../../components/TopNavBar';
import BottomNavBar from '../../components/BottomNavBar';
import AchievementsModal from '../../components/AchievementsModal';

const Badges: React.FC = () => {
  const { currentUser: _currentUser } = useContext(MiniAppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const topBadges = [
    { title: 'Friends Inviter', value: '5 Invites', icon: '/images/speaker.png' },
    { title: 'License', value: 'Basic', icon: '/images/license.png' },
    { title: 'Join Date', value: 'Beta', icon: '/images/game_experience.png' },
  ];

  const mainSections = [
    { title: 'Certificates', description: 'More rewards for tasks!', icon: '/images/Scroll.png', showAll: true },
    { title: 'Achievements', description: '2/204', icon: '/images/achievements.png', showAll: true },
    { title: 'Statistics', description: 'Some numbers about you', icon: '/images/statistics.png', showAll: true },
  ];

  const handleSectionClick = (title: string) => {
    if (title === 'Achievements') {
      setIsModalOpen(true);
    }
  };

  return (
    <main className="fixed inset-0 overflow-y-auto pt-14 pb-20 w-full bg-[url('/images/background/workforce_tab_color.png')] bg-cover bg-top bg-no-repeat bg-[#5200FF64]">
      <TopNavBar />
      <div className="px-4 mt-16 mb-6">
        <div className="mb-4">
          <h1 className="text-base font-gilroy font-medium text-white leading-none">
            Certificates and Rewards
          </h1>
        </div>

        <div className="overflow-x-scroll scrollbar-hide">
          <div className="flex gap-3 pb-4">
            {topBadges.map((badge, index) => (
              <div 
                key={index} 
                className={`flex-shrink-0 w-[140px] h-[160px] bg-gradient-to-b ${
                  badge.title === 'Friends Inviter' ? 'from-[#2D1B3B]' :
                  badge.title === 'License' ? 'from-[#2D1B3B]' :
                  'from-[#1B2D4B]'
                } to-[#0D0F1A] rounded-[24px] p-5 flex flex-col items-center relative`}
              >
                <div className="absolute top-3 right-3 w-4 h-4 bg-[url('/images/info_icon.png')] bg-cover opacity-50"></div>
                <div className="w-16 h-16 mb-5">
                  <img src={badge.icon} alt={badge.title} className="w-full h-full object-contain" />
                </div>
                <p className="text-sm text-center mb-2 text-gray-400 whitespace-nowrap">{badge.title}</p>
                <p className="font-gilroy font-semibold text-base text-white whitespace-nowrap">{badge.value}</p>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-[16px] font-gilroy font-semibold leading-[19.09px] tracking-[0.01em] mb-4">Main</h2>

        <div className="space-y-4">
          {mainSections.map((section, index) => (
            <div 
              key={index} 
              className="bg-gradient-to-br from-[#1A1F37] to-[#0D0F1A] rounded-xl p-4 flex justify-between items-center cursor-pointer"
              onClick={() => handleSectionClick(section.title)}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#2A2F47] to-[#1D1F2A] rounded-xl flex items-center justify-center mr-4">
                  <img src={section.icon} alt={section.title} className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-lg text-white">{section.title}</p>
                  <p className="text-sm text-gray-400">{section.description}</p>
                </div>
              </div>
              {section.showAll && (
                <div className="flex items-center text-blue-400">
                  <span className="mr-2">Show all</span>
                  <div className="w-6 h-6 bg-[url('/images/arrow_right.png')] bg-cover"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <AchievementsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <BottomNavBar />
    </main>
  );
};

export default Badges;
