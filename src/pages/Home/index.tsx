import { useContext, useState, useEffect } from "react";
import { MiniAppContext } from "../../routes/MiniAppContextProvider";
import TopNavBar from "../../components/TopNavBar";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { updateUserCoins, getUserHome } from '../../api';
import SpinWheel from '../../components/SpinWheel';

const Home = () => {
  
  const { coins, setCoins, gpus, data, energy, passiveIncome, level, setLevel, clickCount, setClickCount, levelRate, setLevelRate } = useContext(MiniAppContext);
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);
  const [clickAnimations, setClickAnimations] = useState({ id: Date.now(), position:Array()});
  const { currentUser } = useContext(MiniAppContext);
  const [isSpinWheelOpen, setIsSpinWheelOpen] = useState(false);
  const [spins, setSpins] = useState(0);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserHome();
        if (userData && userData.spins) {
          setSpins(parseInt(userData.spins, 10));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, []);

  const handleCoins = async (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    let coinIncrement = 0;
    let positions: [number, number][] = [];

    if ('clientX' in e && 'clientY' in e) {
      console.log('Mouse Event');
      positions = [[e.clientX - rect.left, e.clientY - rect.top]];
      coinIncrement = 1;
    } else if ('touches' in e && e.touches.length > 0) {
      console.log('Touch Event');
      positions = Array.from(e.touches).map(touch => [touch.clientX - rect.left, touch.clientY - rect.top]);
      coinIncrement = e.touches.length;
    }

    setClickAnimations({ id: Date.now(), position: positions });

    const newCoins = coins + coinIncrement;
    setCoins(newCoins);
    setClickCount(clickCount + coinIncrement);
    setLevelRate(levelRate + coinIncrement);

    // Animation Part
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 20);

    // Processing Coins, Level and Spin
    if (levelRate === level * (level + 1) * 5) {
      setLevel(level + 1);
      setLevelRate(1);
    }

    // Update coins on the server
    try {
      await updateUserCoins(currentUser.userId, newCoins);
    } catch (error) {
      console.error('Error updating coins:', error);
    }
  }

  const openSpinWheel = () => {
    // if (clickCount >= 100) {
      setIsSpinWheelOpen(true);
    // }
  };

  return (
    <main className="fixed inset-0 overflow-y-auto pt-14 pb-20 w-full bg-[url('/images/background/home_background_color.png')] bg-cover bg-top bg-no-repeat bg-[#5200FF64]">
      <TopNavBar />
      
      {/* New Daily Reward rectangle */}
          
      <div className="flex justify-between px-4 mt-4">
        <div className="relative w-20 h-20" onClick={() => navigate('/earn')}>
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-[14px] p-[2px]">
            <div className="w-full h-full bg-gradient-to-br from-[#2A2F4F] to-[#1A1F37] rounded-[12px] flex flex-col items-center justify-center">
              <img src="/images/gift.png" alt="Daily Reward" className="w-10 h-10 mb-1" />
              <span className="text-white text-[9px] font-semibold leading-tight">Daily Reward</span>
              <span className="text-gray-400 text-[7px] mt-[2px] leading-tight">12:32 AM</span>
            </div>
          </div>
        </div>
        <div className="relative w-20 h-20" onClick={openSpinWheel}>
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-[14px] p-[2px]">
            <div className="w-full h-full bg-gradient-to-br from-[#2A2F4F] to-[#1A1F37] rounded-[12px] flex flex-col items-center justify-center">
              {clickCount < 100 ? (
                <div className="relative flex justify-center items-center w-10 h-10 mb-1">
                  <img src="/images/spin_.png" alt="Spin Wheel" className="w-full h-full" />
                  <CircularProgressbar 
                    value={clickCount} 
                    styles={buildStyles({ 
                      pathColor: 'rgba(219,125,5)', 
                      trailColor: 'transparent',
                      strokeLinecap: 'butt',
                    })} 
                    className="absolute inset-0"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-white text-bold text-[16px] font-sfpro">
                    {clickCount}
                  </div>
                </div>
              ) : (
                <div className="relative w-10 h-10 mb-1">
                  <img src="/images/spin.png" alt="Spin Wheel" className="w-full h-full" />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-gradient-to-bl from-[#fedc31] from-27% via-[#ea9f00] via-52% to-[#fa2cd7,#33d0e0] to-82% rounded-[4px] w-[36px] h-[18px] text-[10px] text-white font-bold font-sfpro">
                    <span>SPIN!</span>
                  </div>
                </div>
              )}
              <span className="text-white text-[9px] font-semibold leading-tight">Spin Wheel</span>
              <span className="text-gray-400 text-[7px] mt-[2px] leading-tight">
                {clickCount < 100 ? `${100 - clickCount} left` : 'Ready!'}
              </span>
            </div>
          </div>
        </div>        
        <div className="relative w-20 h-20" onClick={() => navigate('/earn')}>
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-[14px] p-[2px]">
            <div className="w-full h-full bg-gradient-to-br from-[#2A2F4F] to-[#1A1F37] rounded-[12px] flex flex-col items-center justify-center">
              <img src="/images/task.png" alt="New Tasks" className="w-10 h-10 mb-1" />
              <span className="text-white text-[9px] font-semibold leading-tight">New Tasks</span>
              <span className="text-gray-400 text-[7px] mt-[2px] leading-tight">Available: 4</span>
            </div>
          </div>
        </div>        
        <div className="relative w-20 h-20" onClick={() => navigate('/airdrop')}>
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-[14px] p-[2px]">
            <div className="w-full h-full bg-gradient-to-br from-[#2A2F4F] to-[#1A1F37] rounded-[12px] flex flex-col items-center justify-center">
              <img src="/images/game.png" alt="Daily Reward" className="w-10 h-10 mb-1" />
              <span className="text-white text-[9px] font-semibold leading-tight">Minigames</span>
              <span className="text-gray-400 text-[7px] mt-[2px] leading-tight">4 Games</span>
            </div>
          </div>
        </div>
        {/* You can add more rectangles here later */}
      </div>

      {/* <div className="fixed flex flex-row-reverse top-20 left-0 pr-1 py-1 items-center bg-[url('/images/background/task_notify_color.png')] bg-center rounded-r-full border-[1px] border-[#ffffff29] z-40">
        <div className="relative">
          <div className="ml-4 bg-[url('/images/task_button.png')] bg-cover bg-no-repeat w-12 h-12 border-[1px] border-[#81c2ef2d] rounded-full" onClick={() => { navigate('/earn'); }}></div>
          <div className="absolute top-0 right-0 bg-gradient-to-b from-[#ff5397] to-[#bf2964] rounded-full w-[18px] h-[18px] text-[10px] text-white text-center font-sfpro translate-x-1 -translate-y-1">3</div>
        </div>
      </div> */}

      {/* <div className="fixed flex flex-row-reverse top-20 right-0 pl-1 py-1 items-center bg-[url('/images/background/spin_button_color.png')] bg-center rounded-l-full boder-[1px] border-[#ffffff29] z-40">
        <div className="relative">
          {clickCount < 100 ? (
            <div className="flex justify-center items-center mr-4 bg-[url('/images/spin_.png')] bg-cover bg-no-repeat w-12 h-12 border-[1px] border-[#81c2ef2d] rounded-full">
              <CircularProgressbar value={clickCount} styles={buildStyles({ pathColor: 'rgba(219,125,5)' })} />
              <div className="absolute top-3 text-white text-bold text-[16px] text-center font-sfpro">{clickCount}</div>
            </div>
          ) : (
            <div>
              <div className="mr-4 bg-[url('/images/spin.png')] bg-cover bg-no-repeat w-12 h-12 border-[1px] border-[#81c2ef2d] rounded-full">
              </div>
              <div className="absolute top-3 right-2 flex items-center justify-center bg-gradient-to-bl from-[#fedc31] from-27% via-[#ea9f00] via-52% to-[#fa2cd7,#33d0e0] to-82% rounded-[4px] w-[42px] h-[22px] text-[12px] text-white font-bold font-sfpro"><span>SPIN!</span></div>
            </div>
          )}
        </div>
      </div> */}

      <div className="flex justify-center">
        <div className="absolute top-40 bg-[url('/images/clickpad.png')] bg-cover bg-no-repeat w-[382px] h-[434px] mx-auto z-10 -translate-x-[2px] translate-y-[1px]">
          <div className="w-[278px] h-[321px] mx-auto mt-12" onClick={handleCoins} key={clickAnimations.id}>
          <AnimatePresence>
            {clickAnimations.position.length > 0 ?(
              clickAnimations.position.map((label,idx)=>(
              
                <motion.div
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 0, y: -50 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute text-[#8d8d39] font-extrabold text-[40px]"
                  style={{ left: label[0], top: label[1] }} key={clickAnimations.id.toString() + idx.toString()}
                >
                  +1
                </motion.div>
              
            ))
            )
            :(<div></div>)}
            </AnimatePresence>
            <div className={`bg-[url('/images/bot.png')] w-[278px] h-[321px] bg-cover bg-no-repeat ${isClicked ? 'scale-95' : ''}`}  ></div>
          </div>
        </div>
      </div>
      <div className="flex flex-col fixed bottom-20 left-0 right-0 z-40">
        <div className="flex justify-center px-2 pt-2">
          <div className="bg-[url('/images/coin_box.png')] bg-cover w-[70px] h-[50px] flex flex-col items-center justify-start pt-6 text-sm mx-1">
            <div className="text-[#FFDF79] font-semibold text-[10px] leading-none">
              {coins > 1e6 ? `${(coins / 1e6).toFixed(2)}M` : coins > 1e3 ? `${(coins / 1e3).toFixed(2)}k` : coins}
            </div>
            <div className="text-[#FFFFFF99] font-semibold text-[8px] leading-none mt-[1px]">
              +{passiveIncome > 1e6 ? `${(passiveIncome / 1e6).toFixed(2)}M` : passiveIncome > 1e3 ? `${(passiveIncome / 1e3).toFixed(2)}k` : passiveIncome}/s
            </div>
          </div>
          <div className="bg-[url('/images/power_box.png')] bg-cover w-[70px] h-[50px] flex flex-col items-center justify-center pt-5 text-sm mx-1">
            <div className="text-[#FDACCC] font-semibold text-[10px] leading-4"> {energy} </div>
          </div>
          <div className="bg-[url('/images/gpu_box.png')] bg-cover w-[70px] h-[50px] flex flex-col items-center justify-center pt-5 text-sm mx-1">
            <div className="text-[#9A95FF] font-semibold text-[10px] leading-4"> {gpus} </div>
          </div>
          <div className="bg-[url('/images/data_box.png')] bg-cover w-[70px] h-[50px] flex flex-col items-center justify-center pt-5 text-sm mx-1">
            <div className="text-[#7FFAF3] font-semibold text-[10px] leading-4"> {data} </div>
          </div>
        </div>
        <div className="flex flex-col mx-4 my-4 bg-gradient-to-b from-[#000000] to-[#0F1F3D] border-[1px] border-[#FFFFFF40] rounded-3xl py-2 px-4 z-30">
          <div className="flex justify-between">
            <div className="text-[14px] text-[#FFFFFF64] font-bold">Level {level}</div>
            <div className="text-[14px] text-[#FFFFFF64] font-bold">{levelRate}/{level * (level + 1) * 5} XP</div>
          </div>
          <div className="border-[1px] border-[#FFFFFF40] rounded-full mt-2 p-[2px]">
            <div
              className={`bg-[url('/images/stripes.png')] bg-cover rounded-full flex flex-row-reverse p-[2px]`}
              style={{ width: `${levelRate * 100 / (level * (level + 1) * 5)}%` }}
            >
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
          </div>
          <div className="text-[#FFFFFF64] flex justify-center text-[14px]">
            Mine Data & Coins for boost!
          </div>
        </div>
      </div>
      
      <SpinWheel 
        isOpen={isSpinWheelOpen} 
        onClose={() => setIsSpinWheelOpen(false)} 
        onSpin={(result: string) => {
          // Handle spin result here
          console.log(`User won: ${result}`);
          // You can update the user's balance or show a notification here
          setIsSpinWheelOpen(false);
        }} 
        spins={spins}
      />
    </main>
  );
};

export default Home;
