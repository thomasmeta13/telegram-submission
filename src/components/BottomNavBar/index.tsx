import React from "react";
import {useContext} from 'react';
import AirdropIcon from "../icons/airdrop";
import HomeIcon from "../icons/home";
import EarnIcon from "../icons/earn";
import WorkspaceIcon from "../icons/workspace";
import EducationIcon from "../icons/education";
import { Link, useLocation } from "react-router-dom";
import { MiniAppContext } from "../../routes/MiniAppContextProvider";

const BottomNavBar: React.FC = () => {
  const location = useLocation();
  const {isToggled} = useContext(MiniAppContext);
  const hideBottomBar = false; // Add this line
  const navItems = [
    { icon: HomeIcon, label: "Home", path: "/" },
    { icon: EarnIcon, label: "Earn", path: "/earn" },
    { icon: WorkspaceIcon, label: "Leaderboard", path: "/leaderboard" },
    { icon: AirdropIcon, label: "Airdrop", path: "/referral" },
    { icon: EducationIcon, label: "Referral", path: "/badges" },
    { icon: EducationIcon, label: "Education", path: "/education" },
    // { icon: AirdropIcon, label: "Airdrop", path: "/airdrop" },
  ];

  const shouldHideBottomBar = location.pathname.includes('course/who-we-are/lesson/lesson1') || location.pathname === '/data-shoot';

  if (shouldHideBottomBar || isToggled) {
    return null;
  }

  return (
    <nav className={`fixed bottom-4 left-4 right-4 bg-gradient-to-b from-[#000000] to-[#0F1F3D] border-[1px] border-[#FFFFFF40] rounded-3xl z-40 ${isToggled || hideBottomBar ? "hidden": "block"} `}>
      <div className="flex justify-around items-center p-3">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              className="relative flex items-center justify-center"
              key={idx}
            >
              <div
                className={`absolute -top-4 bg-[url('/images/light_effect_1.png')] bg-cover w-10 h-10 ${
                  location.pathname === item.path ? "block" : "hidden"
                }`}
              ></div>
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-2 px-3`}
              >
                <Icon
                  selected={location.pathname === item.path ? true : false}
                />
                {/* <span className="text-xs mt-1">{item.label}</span> */}
              </Link>
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavBar;
