import React, { useContext, useState, useEffect, useCallback } from 'react';
import { MiniAppContext } from '../../routes/MiniAppContextProvider';
import TopNavBar from '../../components/TopNavBar';
import BottomNavBar from '../../components/BottomNavBar';
import friendsIcon from '/images/leaderboard/friends.png';
import globalIcon from '/images/leaderboard/global.png';
import axiosInstance from '../../api';

interface LeaderboardEntry {
  userId: string;
  userName: string;
  coins: number;
  rank: number;
}

const calculateUserRank = (userId: string, leaderboardData: LeaderboardEntry[]): number => {
  const sortedData = [...leaderboardData].sort((a, b) => b.coins - a.coins);
  const userIndex = sortedData.findIndex(entry => entry.userId === userId);
  return userIndex !== -1 ? userIndex + 1 : leaderboardData.length + 1;
};

const Leaderboard: React.FC = () => {
  const { currentUser } = useContext(MiniAppContext);
  const [activeTab, setActiveTab] = useState<'Friends' | 'Global'>('Global');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userRank = currentUser ? calculateUserRank(currentUser.userId, leaderboardData) : null;

  const fetchLeaderboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/leaderboard');
      setLeaderboardData(response.data);
    } catch (error) {
      console.error(`Error fetching ${activeTab.toLowerCase()} leaderboard:`, error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchLeaderboardData();
  }, [fetchLeaderboardData]);

  const getAvatarForUser = (() => {
    const avatarCache = new Map<string, string>();
    return (userId: string) => {
      if (!avatarCache.has(userId)) {
        const robotNumbers = [1, 2, 3];
        const randomIndex = Math.floor(Math.random() * robotNumbers.length);
        avatarCache.set(userId, `/images/avatars/robo${robotNumbers[randomIndex]}.webp`);
      }
      return avatarCache.get(userId)!;
    };
  })();

  return (
    <main className="fixed inset-0 overflow-y-auto pt-14 pb-20 w-full bg-[url('/images/background/workforce_tab_color.png')] bg-cover bg-top bg-no-repeat bg-[#5200FF64]">
      <TopNavBar />
      <div className="pt-20 pb-24 ">
        <div className="w-full mb-6">
          <img src="/images/leaderboard/headerr.png" alt="Leaderboard Header" className="w-full mb-4 -mt-20" />
          <h1 className="text-2xl font-bold text-white text-center mt-4 mb-6">Leaderboard</h1>
        </div>

        <div className="mb-6 px-4">
          <div className="flex rounded-2xl overflow-hidden bg-[#1A1F37] p-0.5 border border-[#FFFFFF20]">
            <button
              className={`flex-1 py-2 px-4 flex items-center justify-center rounded-xl ${
                activeTab === 'Friends'
                  ? "bg-gradient-to-r from-[#03CEA4] to-[#8E37FE] text-white"
                  : "bg-[#0F1528] text-gray-400"
              }`}
              onClick={() => setActiveTab('Friends')}
            >
              <img src={friendsIcon} alt="Friends" className="w-5 h-5 mr-2" />
              Friends
            </button>
            <button
              className={`flex-1 py-2 px-4 flex items-center justify-center rounded-xl ${
                activeTab === 'Global'
                  ? "bg-gradient-to-r from-[#03CEA4] to-[#8E37FE] text-white"
                  : "bg-[#0F1528] text-gray-400"
              }`}
              onClick={() => setActiveTab('Global')}
            >
              <img src={globalIcon} alt="Global" className="w-5 h-5 mr-2" />
              Global
            </button>
          </div>
        </div>

        <div className="space-y-2 px-4 pb-24 relative">
          {isLoading ? (
            <div className="text-white text-center">Loading...</div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            <>
              {leaderboardData.map((player, index) => (
                <div key={player.userId} className={`rounded-xl p-4 flex items-center justify-between ${
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
                      <img src={getAvatarForUser(player.userId)} alt={player.userName} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-white font-semibold">{player.userName}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-500 font-bold mr-1">
                      {player.coins != null ? player.coins.toLocaleString() : 'N/A'}
                    </span>
                    <img src="/images/coin_1.png" alt="Coin" className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        <div className="fixed bottom-0  left-0 right-0 h-64 bg-gradient-to-t from-[#130C2D] via-[rgba(23,9,39,0.91)] to-[rgba(26,6,33,0)] pointer-events-none"></div>
      </div>
        {/* User information floating above BottomNavBar */}
        <div className="fixed bottom-16 left-0 right-0 bg-[#29314F] p-4 rounded-2xl m-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-600 rounded-full mr-3 flex items-center justify-center overflow-hidden">
                <img src={getAvatarForUser(currentUser?.userId || '')} alt={currentUser?.userName || 'Guest'} className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{currentUser?.userName || 'Guest'}</h2>
                <div className="flex items-center mt-1">
                  <img src="/images/leaderboard/stars.png" alt="Rank" className="w-4 h-4 mr-1" />
                  <span className="text-sm text-gray-300">#{userRank !== null ? userRank : 'N/A'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-yellow-500 font-bold mr-1">{currentUser?.coins.toLocaleString() || '0'}</span>
              <img src="/images/coin_1.png" alt="Coin" className="w-5 h-5" />
            </div>
          </div>
        </div>
        <BottomNavBar />
      </main>
    );
};

export default Leaderboard;
