import React, { useContext, useState, useEffect } from 'react';
import { MiniAppContext } from '../../routes/MiniAppContextProvider';
import TopNavBar from '../../components/TopNavBar';
import BottomNavBar from '../../components/BottomNavBar';
// import { useNavigate } from 'react-router-dom';
import { BsCheckCircleFill } from 'react-icons/bs';
import { FaCrown } from 'react-icons/fa';

// interface Task {
//   _id: string;
//   task_name: string;
//   description: string;
//   // Add other properties as needed
// }

const Profile: React.FC = () => {
  const { currentUser } = useContext(MiniAppContext);
  const [username, setUsername] = useState<string>('');
  const rating = 48;
  const invites = 14;

  // const certificates = [
  //   { title: 'Friends Inviter', value: '32 Invites', icon: '/images/license.png' },
  //   // { title: 'Referral Code', value: referralCode || 'N/A', icon: '/images/referrals.png' },
  //   { title: 'License', value: 'Pro', icon: '/images/license.png' },
  //   { title: 'Game experience', value: '2 Years', icon: '/images/game_experience.png' },
  //   { title: 'Achievements', value: '15 Completed', icon: '/images/achievements.png' },
  //   { title: 'Tournaments', value: '5 Won', icon: '/images/tournaments.png' },
  //   { title: 'Referrals', value: '10 Users', icon: '/images/referrals.png' },
  // ];

  useEffect(() => {
    const fetchUsername = async () => {
      if (!currentUser?.userId) {
        console.error('No user ID available');
        return;
      }
      try {
        const response = await fetch(`https://detask-backend-4470455c72f3.herokuapp.com/user/username/${currentUser.userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.userName) {
          setUsername(data.userName);
        } else {
          setUsername('Username not found');
        }
      } catch (error) {
        console.error('Error fetching username:', error);
        setUsername('Error loading username');
      }
    };

    fetchUsername();
  }, [currentUser]);

  // const navigate = useNavigate();

  return (
    <main className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-[#1A1F37] to-[#151929] text-white mt-12">
      {/* Background Container */}
      <div className="fixed inset-0 w-full">
        {/* Top Background Image */}
        <div className="w-full h-[512px] mt-10">
          <img 
            src="/images/background/profile.png" 
            alt="Background" 
            className="w-full h-[1355px] object-cover"
          />
        </div>
        {/* Bottom Solid Color Background */}
        <div className="w-full h-full bg-[#130D2E]"></div>
      </div>

      {/* All Content Container */}
      <div className="relative z-10 h-screen flex flex-col overflow-hidden">
        <TopNavBar />
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-hidden">
          {/* Profile Content */}
          <div className="px-6 overflow-hidden">
            {/* Profile Header */}
            <div className="flex flex-col items-center mt-10 pt-8 pb-6">
              <div className="relative">
                <div className="w-36 h-36 rounded-full overflow-hidden border-2 border-cyan-400">
                  <img 
                    src="/images/avatars/robo1.webp" 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="flex items-center mt-3">
                <h1 className="text-xl font-semibold">{username}</h1>
                <div className="flex items-center ml-2">
                  <div className="bg-blue-500 rounded-full p-1">
                    <BsCheckCircleFill className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-yellow-500 rounded-full p-1 ml-1">
                    <FaCrown className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-sm">@{username.toLowerCase()}</p>

              {/* Rating and Invites */}
              <div className="flex justify-center gap-4 mt-6 w-full">
                <div className="flex-1 bg-[#1A1F37]/50 rounded-xl p-4 relative overflow-hidden border border-[#FFA026]/10">
                  <div className="absolute -left-8 -top-8 w-24 h-24 bg-[#FFA026] rounded-full opacity-20 blur-2xl"></div>
                  <div className="relative z-10 flex items-center">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-[#FFA026] opacity-20 blur-sm rounded-full"></div>
                      <img src="/images/rating_icon.png" alt="Rating" className="relative w-10 h-10" />
                    </div>
                    <div className="ml-3 flex flex-col">
                      <p className="text-gray-400 text-sm">Rating</p>
                      <span className="text-2xl font-bold text-white">#{rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 bg-[#1A1F37]/50 rounded-xl p-4 relative overflow-hidden border border-[#59F368]/10">
                  <div className="absolute -left-8 -top-8 w-24 h-24 bg-[#59F368] rounded-full opacity-20 blur-2xl"></div>
                  <div className="relative z-10 flex items-center">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-[#59F368] opacity-20 blur-sm rounded-full"></div>
                      <img src="/images/invites_icon.png" alt="Invites" className="relative w-10 h-10 drop-shadow-[0_0_2px_rgba(89,243,104,0.5)]" />
                    </div>
                    <div className="ml-3 flex flex-col">
                      <p className="text-gray-400 text-sm drop-shadow-[0_0_2px_rgba(89,243,104,0.3)]">Invites</p>
                      <span className="text-2xl font-bold text-white drop-shadow-[0_0_3px_rgba(89,243,104,0.5)]">#{invites}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rest of the content */}
          <div className="px-6 overflow-hidden">
            <div className="mb-6">
              <h2 className="text-base font-semibold mb-2 text-gray-300">Total earnings</h2>
              <div className="bg-gradient-to-b from-[#1A1F37] to-[#151929] rounded-xl p-3 flex">
                <div className="flex-1 border-r border-gray-700 pr-3">
                  <p className="text-gray-400 mb-1 text-[10px]">Money</p>
                  <p className="text-lg font-bold flex items-center text-white">
                    1 245 112 000 <img src="/images/coin_1.png" alt="Coin" className="ml-1 w-4 h-4" />
                  </p>
                </div>
                <div className="flex-1 pl-3">
                  <p className="text-gray-400 mb-1 text-[10px]">Points</p>
                  <p className="text-lg font-bold flex items-center text-white">
                    4 552 912 <img src="/images/power_1.png" alt="Energy" className="ml-1 w-4 h-4" />
                  </p>
                </div>
              </div>
            </div>
{/* 
            <h2 className="text-xl font-semibold mb-4">Certificates and Rewards</h2>
            <div className="overflow-x-scroll scrollbar-hide">
              <div className="flex space-x-4 pb-4">
                {certificates.map((cert, index) => (
                  <div key={index} className={`flex-shrink-0 w-40 bg-gradient-to-b ${
                    cert.title === 'Friends Inviter' ? 'from-yellow-700/30' :
                    cert.title === 'License' ? 'from-red-900/30' :
                    'from-blue-900/30'
                  } to-[#0D0F1A] rounded-xl p-4 flex flex-col items-center relative`}>
                    <div className="w-16 h-16 mb-3">
                      <img src={cert.icon} alt={cert.title} className="w-full h-full object-contain" />
                    </div>
                    <p className="text-sm text-center mb-1 text-gray-400">{cert.title}</p>
                    <p className="font-semibold text-base lg:text-lg xl:text-xl text-white whitespace-nowrap">{cert.value}</p>
                    <div className="absolute top-2 right-2 w-5 h-5 bg-[url('/images/info_icon.png')] bg-cover opacity-50"></div>
                  </div>
                ))}
              </div>
            </div> */}

            {/* <h2 className="text-xl font-semibold mb-4">Main</h2>
            <div className="bg-[#1A1F37] rounded-xl p-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[url('/images/Scroll.png')] bg-cover mr-3"></div>
                <div>
                  <p className="font-semibold">Certificates</p>
                  <p className="text-sm text-gray-400">More rewards for tasks!</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-gray-400">Show all</span>
                <div className="w-6 h-6 bg-[url('/images/arrow_right.png')] bg-cover"></div>
              </div>
            </div> */}
{/* 
            <div className="mt-6">
              <h2 className="text-2xl font-bold text-white mb-4">Completed Tasks</h2>
              <div className="space-y-4">
                {completedTasks.length > 0 ? (
                  tasks
                    .filter((task: Task) => completedTasks.includes(task._id))
                    .map((task: Task) => (
                      <div key={task._id} className="bg-[#1A1F37] rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <img 
                            src="/images/task_types/label.png"
                            alt={task.task_name} 
                            className="w-12 h-12 mr-4" 
                          />
                          <div>
                            <h3 className="text-white font-bold">{task.task_name}</h3>
                            <p className="text-gray-400 text-sm">{task.description}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="text-yellow-500 font-bold">+50 🪙</div>
                          <div className="bg-[url('/images/done.png')] w-[30px] h-[37px]"></div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="bg-[#1A1F37] rounded-xl p-4 text-center">
                    <div className="w-16 h-16 bg-[url('/images/no_tasks.png')] bg-cover bg-center mx-auto mb-4"></div>
                    <p className="text-gray-400">No tasks completed yet.</p>
                    <button 
                      className="mt-4 bg-gradient-to-r from-[#03cea4] to-[#8e37fe] text-white font-bold py-2 px-4 rounded-full text-sm"
                      onClick={() => navigate('/earn')}
                    >
                      Start Earning
                    </button>
                  </div>
                )}
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <BottomNavBar />
    </main>
  );
};

export default Profile;
