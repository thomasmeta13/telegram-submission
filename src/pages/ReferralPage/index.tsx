import React, { useState, useEffect } from 'react';
import { FaCopy } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';
import BottomNavBar from '../../components/BottomNavBar';
import { MiniAppContext } from '../../routes/MiniAppContextProvider';
import TopNavBar from '../../components/TopNavBar';

interface ReferralInfo {
  referralCode: string;
  invitesUsed: number;
  invitesAvailable: number;
  friends: {
    userId: string;
    userName: string;
    daysAgo: number;
    coins: number;
  }[];
}

const ReferralPage: React.FC = () => {
  const { currentUser } = React.useContext(MiniAppContext);
  const [referralInfo, setReferralInfo] = useState<ReferralInfo | null>(null);
  
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch('https://detask-backend-4470455c72f3.herokuapp.com/leaderboard');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setReferralInfo(prevState => ({
          referralCode: prevState?.referralCode || '',
          invitesUsed: prevState?.invitesUsed || 0,
          invitesAvailable: prevState?.invitesAvailable || 5,
          friends: data
        }));
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };
    fetchLeaderboardData();
  }, []);
  
  const handleCopyReferralCode = () => {
    if (referralInfo) {
      navigator.clipboard.writeText(referralInfo.referralCode).then(() => {
        toast.success('Copied successfully!', {
          duration: 2000,
          position: 'bottom-center',
        });
      });
    }
  };
  
  const handleShareReferralCode = () => {
    if (referralInfo) {
      const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(`http://t.me/detask_ai_bot/detask/?start=ref=${referralInfo.referralCode}`)}&text=${encodeURIComponent('Join me on this awesome app!')}`;
      window.open(shareUrl, '_blank');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/referral/background.png')" }}>
      <TopNavBar />
      <div className="flex-grow flex flex-col overflow-y-auto">
        <div className="w-full">
          <img src="/images/referral/header.png" alt="Robot Friends" className="w-full object-cover" style={{ maxHeight: '34vh', marginTop: '-2vh' }} />
        </div>
        <div className="flex-grow px-4 pb-16">
          <div className="max-w-md mx-auto w-full mt-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-white font-space-grotesk">My Friends</h1>
            
            <div className="mb-4">
              <p className="text-center text-white font-space-grotesk flex items-center justify-between text-sm sm:text-base">
                <span className="text-gray-400">Invites used:</span>
                <span className="flex items-center">
                  <span className="font-bold">{referralInfo?.invitesUsed || 0}</span>
                  <span className="text-gray-400 mx-1">/</span>
                  <span className="text-gray-400">{referralInfo?.invitesAvailable || 5}</span>
                  <span className="ml-2 text-yellow-400">🪙 50</span>
                </span>
              </p>
              <div className="w-full bg-white bg-opacity-20 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full" 
                  style={{ width: `${((referralInfo?.invitesUsed || 0) / (referralInfo?.invitesAvailable || 5)) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm mb-2 text-gray-400 font-space-grotesk">Referral code</p>
              <div className="flex items-center space-x-2">
                <div className="flex-grow bg-white bg-opacity-10 rounded-2xl p-3 flex justify-between items-center border border-gray-600 border-opacity-26">
                  <span className="text-white font-space-grotesk text-sm sm:text-base">{currentUser.referralCode}</span>
                  <button 
                    className="bg-white bg-opacity-10 p-2 rounded-xl flex items-center justify-center"
                    onClick={handleCopyReferralCode}
                  >
                    <FaCopy className="text-white opacity-100" />
                  </button>
                </div>
                <button 
                  className="w-[58px] h-[58px] rounded-2xl border border-gray-600 border-opacity-26 bg-white bg-opacity-10 flex items-center justify-center flex-shrink-0"
                  onClick={handleShareReferralCode}
                >
                  <img src="/images/referral/share.png" alt="Share" className="w-6 h-6 opacity-60" />
                </button>
              </div>
            </div>

            <hr className="border-gray-600 border-opacity-50 my-6" />

            <div className="space-y-4">
              <div className="flex space-x-2">
                <div className="w-1/2 rounded-[18px] flex flex-col justify-center relative overflow-hidden border border-white border-opacity-10 p-3">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#000000] to-[#0F1F3D]"></div>
                  <div className="absolute inset-0 bg-[#9A91FF] opacity-30 blur-[90px]"></div>
                  <div className="relative z-10">
                    <div className="flex items-center mb-2">
                      <img src="/images/referral/star.png" alt="Star" className="w-6 h-6 mr-2" />
                      <span className="text-white text-sm font-space-grotesk">Invite Friend</span>
                    </div>
                    <span className="text-gray-400 text-xs font-space-grotesk block mb-2">Bonus for you and your friend</span>
                    <div className="flex items-center justify-end">
                      <span className="text-yellow-400 font-space-grotesk text-sm mr-1">+4.5K</span>
                      <img src="/images/coin_1.png" alt="Coin" className="w-4 h-4" />
                    </div>
                  </div>
                </div>
                
                <div className="w-1/2 rounded-[18px] flex flex-col justify-center relative overflow-hidden border border-white border-opacity-10 p-3">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#000000] to-[#0F1F3D]"></div>
                  <div className="absolute inset-0 bg-[#9A91FF] opacity-30 blur-[90px]"></div>
                  <div className="relative z-10">
                    <div className="flex items-center mb-1">
                      <img src="/images/referral/stars.png" alt="Stars" className="w-8 h-6 mr-2" />
                      <span className="text-white text-sm font-space-grotesk">Invite Friend with Telegram Premium</span>
                    </div>
                    <span className="text-gray-400 text-xs font-space-grotesk block mb-2">Bonus for you and your friend</span>
                    <div className="flex items-center justify-end">
                      <span className="text-yellow-400 font-space-grotesk text-sm mr-1">+9.5K</span>
                      <img src="/images/coin_1.png" alt="Coin" className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
              
              <h2 className="text-base font-medium text-white mt-6 mb-3 font-gilroy leading-[18.83px] tracking-[0.01em]">All Users</h2>

              <div className="space-y-2">
                {referralInfo?.friends?.map((user, index) => (
                  <div key={user.userId} className={`rounded-xl p-4 flex items-center justify-between ${
                    index < 3 ? 'bg-[linear-gradient(0deg,rgba(255,255,255,0.06),rgba(255,255,255,0.06)),' + 
                      (index === 0 ? 'linear-gradient(90deg,rgba(238,168,49,0.138)0%,rgba(238,168,49,0)74.78%)]' :
                       index === 1 ? 'linear-gradient(90deg,rgba(204,200,193,0.138)0%,rgba(204,200,193,0)74.78%)]' :
                       'linear-gradient(90deg,rgba(226,99,99,0.138)0%,rgba(226,99,99,0)74.78%)]' )
                      : 'bg-[#1A1F37]'
                    }`}>
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full mr-3 flex items-center justify-center bg-no-repeat bg-center bg-cover ${
                        index === 0 ? 'bg-[url("/images/leaderboard/1.png")]' :
                        index === 1 ? 'bg-[url("/images/leaderboard/2.png")]' :
                        index === 2 ? 'bg-[url("/images/leaderboard/3.png")]' :
                        'bg-[#0F1528]'
                      }`}>
                        <span className={`font-bold ${
                          index === 0 ? 'text-[#4A2C00]' :
                          index === 1 ? 'text-[#2A2A2A]' :
                          index === 2 ? 'text-[#4A1819]' :
                          'text-white'
                        }`}>
                          {index + 1}
                        </span>
                      </div>
                      <div className="w-12 h-12 bg-gray-600 rounded-full mr-3 flex items-center justify-center overflow-hidden">
                        <img src={`/images/avatars/robo${(index % 3) + 1}.webp`} alt={user.userName} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-white font-semibold">{user.userName}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-500 font-bold mr-1">{user.coins.toLocaleString()}</span>
                      <img src="/images/coin_1.png" alt="Coin" className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <BottomNavBar />
      <Toaster />
    </div>
  );
};

export default ReferralPage;

// Can probably add the invite friend function where you can send message in a second to your friend
