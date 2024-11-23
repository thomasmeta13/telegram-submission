import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LabelTaskModal, AnnotationTaskModal, RewardModal } from '../Tasks';
import { MiniAppContext } from "../../routes/MiniAppContextProvider";
import { Task, User } from "../../routes/types";
import axiosInstance from '../../api';
import { updateUserCoins } from '../../api';
import TopNavBar from "../../components/TopNavBar";
import BottomNavBar from "../../components/BottomNavBar";

type SectionType = 'Onboard' | 'DeTask';

const Earn: React.FC = () => {
  // const { category } = useParams<{ category: string }>();
  // const location = useLocation();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState<string>("All Tasks");
  const [expandedSections, setExpandedSections] = useState<Record<SectionType, boolean>>({
    Onboard: false,
    DeTask: false
  });
  const { isToggled, setToggle, coins, setCoins, power, setPower, currentUser, setCurrentUser, tasks, setTasks } = useContext(MiniAppContext);
  const [isFinished, setFinished] = useState<boolean>(true);
  const [index, setIndex] = useState<string>("");
  // const [projects, setProjects] = useState<Project[]>([]);

  const task = tasks.find((task: Task) => task._id === index);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        let url = '/user/tasks';
        if (currentTab === 'Social') {
          url += '?category=Social Task';
        } else if (currentTab === 'DeTask') {
          url += '?category=DeTask';
        }
        const response = await axiosInstance.get(url);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    // const fetchProjects = async () => {
    //   try {
    //     const response = await axiosInstance.get('/user/projects');
    //     setProjects(response.data);
    //   } catch (error) {
    //     console.error('Error fetching projects:', error);
    //   }
    // };

    fetchTasks();
    // fetchProjects();
  }, [currentTab]);

  // useEffect(() => {
  //   if (location.pathname === '/earn/projects') {
  //     setCurrentTab('Projects');
  //   }
  // }, [location]);

  useEffect(() => {
    // Reset toggle state when component mounts or route changes
    setToggle(false);
    return () => {
      // Cleanup when component unmounts
      setToggle(false);
    };
  }, [setToggle]);

  const handleFinish = async (completed: boolean, userLabels?: string[] | boolean) => {
    setToggle(true);
    setFinished(true);
    if (task && completed && Array.isArray(userLabels)) {
      await handleTaskCompletion(task._id, userLabels);
    }
  }

  const handleGetReward = async () => {
    if (task?.reward && task.reward > 0) {
      const newCoins = coins + task.reward;
      setCoins(newCoins);
      setPower(power + task.reward);
      setCurrentUser((prevUser: User) => ({
        ...prevUser,
        coins: newCoins,
        power: prevUser.power + task.reward
      }));
      
      try {
        await updateUserCoins(newCoins, currentUser.userId);
      } catch (error) {
        console.error('Error updating coins:', error);
      }
    }
    setToggle(false);
  }

  const handleTaskCompletion = async (taskId: string, userLabels: string[]) => {
    try {
      const response = await axiosInstance.post('/user/tasks/complete', {
        taskId,
        results: { labels: userLabels },
        userId: currentUser.userId
      });
      if (response.data.message === "Task completed successfully") {
        setTasks((prevTasks: Task[]) => prevTasks.map(task => 
          task._id === taskId ? { ...task, completed: true } : task
        ));
        setCoins(response.data.userCoins);
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleTwitterAuth = async () => {
    try {
      const response = await axiosInstance.get('/auth/twitter/url', {
        withCredentials: true
      });
      if (response.data && response.data.url) {
        // Store the state and codeVerifier in localStorage as backup
        localStorage.setItem('twitter_state', response.data.state);
        localStorage.setItem('twitter_code_verifier', response.data.codeVerifier);
        window.location.href = response.data.url;
      } else {
        throw new Error('Twitter authentication URL not received');
      }
    } catch (error) {
      console.error('Error initiating Twitter authentication:', error);
      if (error instanceof Error) {
        alert(`An error occurred while connecting to Twitter: ${error.message}`);
      } else {
        alert('An unknown error occurred while connecting to Twitter');
      }
    }
  };

  const renderTaskModal = () => {
    if (!index || !task) return null;
    const props = {
      isOpen: isToggled && !isFinished,
      onClose: () => setToggle(false),
      taskIndex: index,
      onFinish: handleFinish,
      task: task
    };
    switch (task.type) {
      case "data_labeling":
        return <LabelTaskModal {...props} />;
      case "Annotation":
        return <AnnotationTaskModal {...props} />;
      default:
        return null;
    }
  };

  const getTasksBySection = (section: SectionType) => {
    const sectionTasks = section === "Onboard" 
      ? tasks.filter((task: Task) => task.category === "Social Task")
      : tasks.filter((task: Task) => task.category !== "Social Task");
    
    const totalTasks = sectionTasks.length;
    console.log(`${section} section has ${totalTasks} tasks`);
    console.log('Tasks:', sectionTasks);
    
    if (totalTasks <= 3 || expandedSections[section]) {
      return sectionTasks;
    }
    return sectionTasks.slice(0, 3);
  };

  const getSectionCompletion = (section: SectionType) => {
    const sectionTasks = section === "Onboard" 
      ? tasks.filter((task: Task) => task.category === "Social Task")
      : tasks.filter((task: Task) => task.category !== "Social Task");
    
    const completed = sectionTasks.filter((task: Task) => task.completed).length;
    return `${completed}/${sectionTasks.length}`;
  };

  return (
    <main className="fixed inset-0 overflow-y-auto pt-14 pb-20 w-full bg-[url('/images/background/workforce_tab_color.png')] bg-cover bg-top bg-no-repeat bg-[#5200FF64]">
      <TopNavBar />
      <div className="flex flex-col px-3 mt-6">
        <h1 className="text-2xl font-bold text-white mb-4 text-center">Your Tasks</h1>
        <div className="flex gap-2 mb-6">
          <button
            className={`px-6 py-2 rounded-2xl text-base font-medium transition-all duration-200 ${
              currentTab === "All Tasks"
                ? "bg-[#1A1F37] text-white shadow-lg"  
                : "bg-[#0A0F29] text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setCurrentTab("All Tasks")}
          >
            All Tasks
          </button>
          <button
            className={`px-6 py-2 rounded-2xl text-base font-medium transition-all duration-200 ${
              currentTab === "Onboard"
                ? "bg-[#1A1F37] text-white shadow-lg" 
                : "bg-[#0A0F29] text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setCurrentTab("Onboard")}
          >
            Onboard
          </button>
           <button
            className={`px-6 py-2 rounded-2xl text-base font-medium transition-all duration-200 ${
              currentTab === "DeTask"
                ? "bg-[#1A1F37] text-white shadow-lg" 
                : "bg-[#0A0F29] text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setCurrentTab("DeTask")}
          >
            DeTask
          </button>
        </div>

        {(currentTab === "All Tasks" || currentTab === "Onboard") && (
          <div className="bg-gradient-to-b from-[#0F1F3D]/100 to-black/30 backdrop-blur-[90px] rounded-3xl p-6 mb-6 border-2 border-white/10">
            <div className="flex justify-between items-center mb-0 -mt-2">
              <h2 className="font-roboto text-[18px] tracking-[0px] font-medium text-white/70 -ml-2">Onboard</h2>
              <span className="font-roboto text-[18px] tracking-[0px] font-medium text-white/70">{getSectionCompletion('Onboard')}</span>
            </div>
            <div>
              {getTasksBySection('Onboard').map((task: Task, index: number) => (
                <>
                  <div 
                    key={task._id} 
                    className="flex items-center justify-between py-2 cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => {
                      if (task.type === "social" && task.platform === "twitter") {
                        handleTwitterAuth();
                      } else {
                        setIndex(task._id);
                        setFinished(false);
                        setToggle(true);
                        navigate(`/training-task/${task._id}`);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2 -ml-3">
                      <img 
                        src={`/images/task_types/${
                          task.type === "social" && task.platform 
                            ? `${task.platform}.png` 
                            : task.type === "data_labeling" 
                            ? 'label.png' 
                            : task.type === "gpt" 
                            ? 'ai.png' 
                            : task.type === "prompt" 
                            ? 'finetune.png' 
                            : task.type === "software" 
                            ? 'crowdd.png' 
                            : 'earn.png'
                        }`} 
                        alt={task.task_name} 
                        className="w-14 h-14 mr-2" 
                      />
                      <div>
                        <h2 className="text-white text-m font-bold">{task.task_name}</h2>
                        <p className="text-gray-400 text-base w-[80%] text-sm">{task.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {task.completed ? (
                        <div className="bg-green-500 rounded-full p-2">
                          <img src="/images/check.png" alt="completed" className="w-6 h-6" />
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className="text-yellow-500 text-xl font-bold mr-2">{task.reward}</span>
                          <img src="/images/coin_icon.png" alt="coin" className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                  </div>
                  {index < getTasksBySection('Onboard').length - 1 && (
                    <hr className="border-gray-700/50" />
                  )}
                </>
              ))}
            </div>
            {getTasksBySection('Onboard').length > 3 && (
              <div className="flex items-center justify-center mt-4">
                <button 
                  className="flex items-center gap-2 text-white/50 text-sm"
                  onClick={() => setExpandedSections(prev => ({ ...prev, Onboard: !prev.Onboard }))}
                >
                  <span>Expand</span>
                  <svg 
                    className="w-4 h-4" 
                    viewBox="0 0 24 24" 
                    fill="none"
                    style={{ transform: expandedSections.Onboard ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    <path 
                      d="M7 10l5 5 5-5" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        {(currentTab === "All Tasks" || currentTab === "DeTask") && (
          <div className="bg-gradient-to-b from-[#0F1F3D]/100 to-black/30 backdrop-blur-[90px] rounded-3xl p-6 mb-6 border-2 border-white/10">
            <div className="flex justify-between items-center mb-0 -mt-2">
              <h2 className="font-roboto text-[18px] tracking-[0px] font-medium text-white/70 -ml-2">DeTask</h2>
              <span className="font-roboto text-[18px] tracking-[0px] font-medium text-white/70">{getSectionCompletion('DeTask')}</span>
            </div>
            <div>
              {getTasksBySection('DeTask').map((task: Task, index: number) => (
                <>
                  <div 
                    key={task._id} 
                    className="flex items-center justify-between py-2 cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => {
                      if (task.type === "social" && task.platform === "twitter") {
                        handleTwitterAuth();
                      } else {
                        setIndex(task._id);
                        setFinished(false);
                        setToggle(true);
                        navigate(`/training-task/${task._id}`);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2 -ml-3">
                      <img 
                        src={`/images/task_types/${
                          task.type === "social" && task.platform 
                            ? `${task.platform}.png` 
                            : task.type === "data_labeling" 
                            ? 'label.png' 
                            : task.type === "gpt" 
                            ? 'ai.png' 
                            : task.type === "prompt" 
                            ? 'finetune.png' 
                            : task.type === "software" 
                            ? 'crowdd.png' 
                            : 'earn.png'
                        }`} 
                        alt={task.task_name} 
                        className="w-14 h-14 mr-2" 
                      />
                      <div>
                        <h2 className="text-white text-m font-bold">{task.task_name}</h2>
                        <p className="text-gray-400 text-base  w-[80%] text-sm">{task.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {task.completed ? (
                        <div className="bg-green-500 rounded-full p-2">
                          <img src="/images/check.png" alt="completed" className="w-6 h-6" />
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className="text-yellow-500 text-xl font-bold mr-2">{task.reward}</span>
                          <img src="/images/coin_icon.png" alt="coin" className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                  </div>
                  {index < getTasksBySection('DeTask').length - 1 && (
                    <hr className="border-gray-700/50" />
                  )}
                </>
              ))}
            </div>
            {getTasksBySection('DeTask').length < tasks.filter((task: Task) => task.category !== "Social Task").length && (
              <>
                <hr className="border-gray-700/50 mt-2" />
                <div className="flex items-center justify-center mt-4">
                  <button 
                    className="flex items-center gap-2 text-white/50 text-sm"
                    onClick={() => setExpandedSections(prev => ({ ...prev, DeTask: !prev.DeTask }))}
                  >
                    <span>Expand</span>
                    <svg 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none"
                    >
                      <path 
                        d="M19 9l-7 7-7-7" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {renderTaskModal()}
      <RewardModal 
        isOpen={isToggled && isFinished} 
        onClose={() => setToggle(false)} 
        taskIndex={index} 
        onFinish={handleGetReward} 
        task={task} 
      />
      <BottomNavBar />
    </main>
  );
}

export default Earn;
