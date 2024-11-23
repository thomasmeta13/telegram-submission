import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PageLoading from "../components/page-loading/PageLoading";
import { LayoutPage } from "../components/page";
import Page404 from "../pages/errors/Page404";
import BottomNavBar from "../components/BottomNavBar";
import Home from "../pages/Home";
import AgentPage from "../pages/Agent";
import Airdrop from "../pages/Airdrop";
import Earn from "../pages/Earn";
import Tmp3 from "../pages/Tmp3";
import Tmp4 from "../pages/Tmp4";
import Workforce from "../pages/Workforce";
import CourseDetail from "../components/CourseDetail";
import LessonDetail from "../components/LessonDetail";
import LabelImages from "../pages/LabelImages";
import DataShoot from '../pages/DataShoot';
import Project from '../pages/Project';
import TrainingTask from '../pages/TrainingTask';
import Education from '../pages/Education';
import CourseDetails from '../pages/CourseDetails';
import Profile from '../pages/Profile';
import GamePage from '../components/GamePage';
import SocialTask from '../pages/SocialTask';
import Leaderboard from '../pages/Leaderboard';
import Badges from '../pages/Badges';
import ReferralPage from '../pages/ReferralPage';
import RobotSelection from '../pages/RoboSelection';

// In your routes configuration
<Route path="/game/:gameTitle" element={<GamePage />} />
const getRouteElementPublic = (Component: React.ElementType): React.ReactNode => {
  return (
    <Suspense fallback={<PageLoading />}>
      <LayoutPage>
        <Component />
        <BottomNavBar />
      </LayoutPage>
    </Suspense>
  );
};

const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="*" element={getRouteElementPublic(Page404)} />
      <Route path="/" element={getRouteElementPublic(Home)} />
      <Route path="/agents" element={getRouteElementPublic(AgentPage)} />
      <Route path="/earn" element={getRouteElementPublic(Earn)} />
      <Route path="/earn/:category" element={getRouteElementPublic(Earn)} />
      <Route path="/earn/return" element={<Earn />} />
      <Route path="/airdrop" element={getRouteElementPublic(Airdrop)} />
      <Route path="/settings" element={getRouteElementPublic(Tmp3)} />
      <Route path="/settings/languages" element={getRouteElementPublic(Tmp4)} />
      <Route path="/workforce" element={getRouteElementPublic(Workforce)} />
      <Route path="/badges" element={getRouteElementPublic(Badges)} />
      <Route path="/course/:courseId" element={getRouteElementPublic(CourseDetail)} />
      <Route path="/course/:courseId/lesson/:lessonId" element={getRouteElementPublic(LessonDetail)} />
      <Route path="/label-images/:taskId" element={getRouteElementPublic(LabelImages)} />
      <Route path="/data-shoot" element={getRouteElementPublic(DataShoot)} />
      <Route path="/earn/Projects/:projectId" element={getRouteElementPublic(Project)} />
      <Route path="/earn/Projects/:projectId/:taskId" element={getRouteElementPublic(TrainingTask)} />    
      <Route path="/education" element={<Education />} />
      <Route path="/education/:courseSlug" element={<CourseDetails />} />
      <Route path="/education/:courseId/lesson/:lessonId" element={<LessonDetail />} />    
      <Route path="/training-task/:projectId/:taskId" element={getRouteElementPublic(TrainingTask)} />
      <Route path="/training-task/:taskId" element={getRouteElementPublic(TrainingTask)} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/game/:gameTitle" element={<GamePage />} />
      <Route path="/social-task/:taskId" element={<SocialTask />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/referral" element={<ReferralPage />} />
      <Route path="/robot-selection" element={<RobotSelection />} />
    </Routes>
    
);
};

export default Router;
