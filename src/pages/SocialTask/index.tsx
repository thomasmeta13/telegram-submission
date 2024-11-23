import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { LabelTaskModal, AnnotationTaskModal, RewardModal } from '../Tasks';
import { MiniAppContext } from "../../routes/MiniAppContextProvider";
import { Task, Project } from "../../routes/types";
import axiosInstance from '../../api';
import { updateUserCoins } from '../../api';
import TopNavBar from "../../components/TopNavBar";
import { User } from '../../routes/types';

const Earn: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState<string>(category || "DeTask");
  const { isToggled, setToggle, coins, setCoins, power, setPower, currentUser, setCurrentUser, tasks, setTasks } = useContext(MiniAppContext);
  const [isFinished, setFinished] = useState<boolean>(true);
  const [index, setIndex] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>([]);

  const task = tasks.find((task: Task) => task._id === index);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosInstance.get(`/user/tasks${currentTab === 'Social' ? '?category=Social Task' : ''}`);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get('/user/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    if (tasks.length === 0) {
      fetchTasks();
    }

    fetchProjects();
  }, [currentTab, tasks.length, setTasks]);

  useEffect(() => {
    if (location.pathname === '/earn/projects') {
      setCurrentTab('Projects');
    }
  }, [location]);

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

  return (
    <main className="relative pt-14 pb-20 w-full min-h-full bg-[url('/images/background/workforce_tab_color.png')] bg-cover bg-top bg-no-repeat bg-[#5200FF64] mx-auto">
      <TopNavBar />
      <div className="flex flex-col px-4 mt-6">
        <h1 className="text-2xl font-bold text-white mb-4">Earn</h1>
        <div className="flex mb-6">
          {["DeTask", "Projects", "Social", "Quests"].map((tab) => (
            <button
              key={tab}
              className={`mr-4 pb-2 ${currentTab === tab ? "text-[#4ade80] border-b-2 border-[#4ade80]" : "text-gray-400"}`}
              onClick={() => {
                setCurrentTab(tab);
                navigate(tab === "Projects" ? '/earn/projects' : tab === "Social" ? '/earn/social' : '/earn');
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        {currentTab === "Projects" ? (
          <div className="space-y-4">
            {projects.map((project: Project) => (
              <div key={project._id} className="bg-[#1A1F37] rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <img src={`/images/${project.logo}`} alt={project.project_name} className="w-12 h-12 mr-4" />
                  <div>
                    <h2 className="text-white font-bold">{project.project_name}</h2>
                    <p className="text-gray-400 text-sm">{project.description}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-yellow-500 font-bold">{project.rewards} 🪙</div>
                  <button 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm mt-2"
                    onClick={() => navigate(`/earn/Projects/${project._id}`)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task: Task) => (
              <div key={task._id} className="bg-[#1A1F37] rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <img 
                    src={`/images/task_types/${task.type === "data_labeling" ? 'label.png' : 
                                               task.type === "gpt" ? 'ai.png' : 
                                               task.type === "prompt" ? 'finetune.png' : 
                                               task.type === "software" ? 'crowdd.png' : 
                                               'earn.png'}`} 
                    alt={task.task_name} 
                    className="w-12 h-12 mr-4" 
                  />
                  <div>
                    <h2 className="text-white font-bold">{task.task_name}</h2>
                    <p className="text-gray-400 text-sm">{task.description}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-yellow-500 font-bold">{task.reward.toLocaleString()} 🪙</div>
                  {task.completed ? (
                    <div className="bg-[url('/images/done.png')] w-[30px] h-[37px]"></div>
                  ) : (
                    <button 
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm mt-2"
                      onClick={() => {
                        if (task.type === "social") {
                          handleTwitterAuth();
                        } else {
                          setIndex(task._id);
                          setFinished(false);
                          setToggle(true);
                        }
                      }}
                    >
                      Start
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {renderTaskModal()}
      <RewardModal isOpen={isToggled && isFinished} onClose={() => setToggle(false)} taskIndex={index} onFinish={handleGetReward} task={task} />
    </main>
  );
}

export default Earn;