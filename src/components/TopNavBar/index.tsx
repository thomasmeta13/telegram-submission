import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MiniAppContext } from "../../routes/MiniAppContextProvider";
import { getUserHome } from '../../api';

const TopNavBar: React.FC = () => {
  const { coins, energy, currentUser, setCoins, setEnergy, setCurrentUser } = useContext(MiniAppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && currentUser.userId) {
      const intervalId = setInterval(async () => {
        try {
          const userData = await getUserHome();
          if (userData) {
            if (userData.coins !== coins) setCoins(userData.coins);
            if (userData.energy !== energy) setEnergy(userData.energy);
            setCurrentUser((prevUser: typeof currentUser) => ({
              ...prevUser,
              ...userData
            }));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }, 30000);

      return () => clearInterval(intervalId);
    }
  }, [currentUser, coins, energy, setCoins, setEnergy, setCurrentUser]);

  const handleSettingClick = () => {
    navigate('/settings');
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40">
      <div className="flex justify-between items-center p-3 rounded-b-2xl bg-[url('/images/background/topnav_color.png')] bg-cover bg-center bg-no-repeat h-[70px]">
        <div className="bg-[url('/images/setting.png')] bg-cover w-7 h-7" onClick={handleSettingClick}></div>
        <div className="bg-[url('/images/coin.png')] bg-center bg-no-repeat w-24 h-9 pr-3 flex flex-row-reverse items-center text-white text-sm font-semibold">
          {typeof coins === 'number' && !isNaN(coins) 
            ? (coins > 1e6 ? `${(coins/1e6).toFixed(2)}M` : coins > 1e3 ? `${(coins/1e3).toFixed(2)}k` : coins)
            : 'Loading...'}
        </div>
        <div className="bg-[url('/images/logo.png')] bg-cover bg-no-repeat w-9 h-10"></div>
        <div className="bg-[url('/images/power.png')] bg-center bg-no-repeat w-24 h-9 pl-4 flex items-center text-white  text-sm font-semibold">
          {typeof energy === 'number' && !isNaN(energy) ? energy : 'Loading...'}
        </div>
        <div className="bg-[url('/images/user_icon.png')] bg-cover w-8 h-8 cursor-pointer" onClick={() => navigate('/profile')}></div>
      </div>
    </nav>
  );
}

export default TopNavBar;
