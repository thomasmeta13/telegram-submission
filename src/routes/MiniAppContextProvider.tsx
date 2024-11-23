import { ReactNode, useEffect, useState, createContext } from "react";
import axiosInstance from '../api';
import {Agent, User, Task, Job} from './types';
import { signIn, signUp, getUserHome } from '../api'; // Add this import
import WebApp from '@twa-dev/sdk';

// import { useInitData } from "@telegram-apps/sdk-react";

export type MiniAppContextProviderProps = {
  children?: ReactNode;
};

export const MiniAppContext = createContext<any>(null);
export const MiniAppContextProvider = ({
  children,
}: MiniAppContextProviderProps) => {

  useEffect(() => {
    const authenticateTelegramUser = async () => {
      const user = WebApp.initDataUnsafe.user;
      if (!user) {
        console.error('No user data available');
        return;
      }

      try {
        const response = await axiosInstance.post('/auth/telegram-auth', {
          telegramId: user.id.toString(),
          username: user.username,
          firstName: user.first_name,
          lastName: user.last_name
        });

        if (response.status === 200) {
          const data = response.data;
          localStorage.setItem('authToken', data.token);
          setCurrentUser(data.user);
          console.log('Authentication successful:', data);
          fetchUserData(user.id);
        } else {
          throw new Error('Authentication failed');
        }
      } catch (error) {
        console.error('Telegram authentication failed:', error);
      }
    };

    WebApp.ready();
    authenticateTelegramUser();
  }, []);

  const [flag, setFlag] = useState<boolean>(false);
  const [coins, setCoins] = useState<number>(0);
  const [passiveIncome, setPassiveIncome] = useState<number>(0);
  const [energy, setEnergy] = useState<number>(1000);
  const [power, setPower] = useState<number>(0);
  const [globalRank, setGlobalRank] = useState(0);
  const [gpus, setGpus] = useState<number>(0);
  const [data, setData] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [isToggled, setToggle] = useState(false);
  const [hideBottomBar, setHideBottomBar] = useState(false);
  const [referralCode, setReferralCode] = useState("PLAYER123");
  const [currentLanguage, setCurrentLanguage] = useState("English (US)");
  const [clickCount, setClickCount] = useState(0);
  const [levelRate, setLevelRate] = useState(0);
  const [currentUser, setCurrentUser] = useState<User>({
    userId: 0,
    userName:"",
    avatar: "",
    coins: 0,
    energy: 0,
    power: 0,
    data: 0,
    gpus: 0,
    passiveIncome: 0,
    level:1,
    levelRate: 0,
    // referrals: 5,
    referralCode: "PLAYER123",
    completedTasks: []
  });
  const [tasks,setTasks] = useState<Task[]>([]);
  const [jobs,setJobs] = useState<Job[]>([]);
  const [agents,setAgents] = useState<Agent[]>([]);
  const [educationCourses, setEducationCourses] = useState([
    { 
      id: "ai-basics", 
      slug: "ai-basics",
      title: "AI Basics",
      description: "The probabilistic forest",
      status: "IN_PROGRESS", 
      reward: 400, 
      progress: 15,
      total: 15,
      lessons: [
        { 
          id: "lesson1", 
          title: "Prompt Engineering for Game Design", 
          description: "Learn how to craft effective prompts for AI-generated games", 
          completed: false 
        },        
        { id: "lesson2", title: "Our Vision", description: "Discover our long-term vision", completed: false },
        { id: "lesson3", title: "Our Values", description: "Understand the core values that drive us", completed: false },
      ]
    },
    { 
      id: "dataset-cavern", 
      slug: "dataset-cavern",
      title: "Dataset Cavern",
      description: "Explore the depths of data",
      status: "IN_PROGRESS", 
      reward: 500, 
      progress: 9,
      total: 35,
      lessons: [
        { id: "lesson1", title: "Data Collection", description: "Learn about various data collection methods", completed: false },
        { id: "lesson2", title: "Data Cleaning", description: "Techniques for preparing and cleaning datasets", completed: false },
        { id: "lesson3", title: "Data Analysis", description: "Introduction to data analysis techniques", completed: false },
      ]
    },
    { 
      id: "supervised-learning", 
      slug: "supervised-learning",
      title: "Supervised Learning",
      description: "Master the art of guidance",
      status: "NOT_STARTED", 
      reward: 600, 
      progress: 0,
      total: 42,
      lessons: [
        { id: "lesson1", title: "Classification", description: "Understanding classification algorithms", completed: false },
        { id: "lesson2", title: "Regression", description: "Exploring regression techniques", completed: false },
        { id: "lesson3", title: "Model Evaluation", description: "Methods for evaluating supervised learning models", completed: false },
      ]
    },
  ]);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [selectedRobot, setSelectedRobot] = useState<string>('purple');

  // const initData = useInitData();

  const getInfo = () => {
    axiosInstance.get('/user')  // Adjust this endpoint to match your API
      .then(response => {
        if (response.status === 200 && response.data && response.data.user) {
          const { user, agents, tasks, jobs } = response.data;
          updateUserState(user, agents, tasks, jobs);
        } else {
          console.error('Invalid response data:', response.data);
          useFallbackData();
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        useFallbackData();
      });
  }

  const updateUserState = (user: Partial<User>, agents: Agent[], tasks: Task[], jobs: Job[]) => {
    setCurrentUser({
      userId: user.userId || 0,
      userName: user.userName || '',
      avatar: user.avatar || '',
      coins: user.coins || 0,
      energy: user.energy || 0,
      power: user.power || 0,
      data: user.data || 0,
      gpus: user.gpus || 0,
      passiveIncome: user.passiveIncome || 0,
      level: user.level || 1,
      levelRate: user.levelRate || 0,
      referralCode: user.referralCode || '',
      completedTasks: user.completedTasks || []
    });
    setCoins(user.coins || 0);
    setGpus(user.gpus || 0);
    setData(user.data || 0);
    setEnergy(user.energy || 0);
    setPower(user.power || 0);
    setPassiveIncome(user.passiveIncome || 0);
    setLevel(user.level || 1);
    setLevelRate(user.levelRate || 0);
    setTasks(tasks || []);
    setJobs(jobs || []);
    setAgents(agents || []);
    setFlag(!flag);
    setCompletedTasks(user.completedTasks || []);
  }

  const useFallbackData = () => {
    // Use some default values or data from local storage
    const fallbackUser = {
      userId: 0,
      userName: 'Guest',
      avatar: '',
      coins: 0,
      energy: 0,
      power: 0,
      data: 0,
      gpus: 0,
      passiveIncome: 0,
      level: 1,
      levelRate: 0,
      referralCode: ''
    };
    updateUserState(fallbackUser, [], [], []);
  }

  useEffect(() => {
    console.log("update user information")
    const tgWebApp = window.Telegram.WebApp;

    if (tgWebApp.initDataUnsafe.user) {
      const user = tgWebApp.initDataUnsafe.user;
      
      signIn(user.id)
        .then(response => {
          if (response && response.token) {
            console.log("SignIn Success")
            fetchUserData(user.id);
            return getUserHome();
          } else {
            throw new Error('Invalid response from signIn');
          }
        })
        .then(tasks => {
          if (Array.isArray(tasks)) {
            setTasks(tasks);
            console.log("Tasks fetched successfully:", tasks);
          } else {
            throw new Error('Invalid response from getUserHome');
          }
        })
        .catch(error => {
          console.error('Error during sign in or fetching tasks:', error);
          if (error.response && error.response.status === 401) {
            return signUp({userId: user.id, userName: user.username || `User${user.id}`});
          } else {
            throw error;
          }
        })
        .then(response => {
          if (response && response.token) {
            console.log("SignUp Success")
            return getUserHome();
          } else {
            throw new Error('Invalid response from signUp');
          }
        })
        .then(tasks => {
          if (Array.isArray(tasks)) {
            setTasks(tasks);
            console.log("Tasks fetched successfully:", tasks);
          } else {
            throw new Error('Invalid response from getUserHome');
          }
        })
        .catch(error => {
          console.error('Unexpected error:', error);
        });
    } else {
      console.error('Telegram Web App user data not available');
      // Handle the case when Telegram Web App data is not available
      // You might want to show an error message or redirect to a login page
    }
  }, []);

  useEffect(() => {
    getInfo();
  }, []);

  useEffect(() => {
    if(!flag) return
    const updateCointimer = setInterval(() => {
      console.log("update passive Income")
      setCoins((prevCoins) => prevCoins + passiveIncome);
    },1000);
    return () => clearInterval(updateCointimer);
  }, [flag]);
  
  useEffect(()=>{
    if(!flag) return
    console.log("update coins");
    axiosInstance.post('/updatecoins',{coins,levelRate,gpus,data,energy,power,passiveIncome,level, agents}).then(
      response => {
        if (response.status === 200) {
          setCurrentUser(prevUser => ({
            ...prevUser,
            coins,
            levelRate,
            gpus,
            data,
            energy,
            power,
            passiveIncome,
            level
          } as User));
        } else{
          console.log(response.data.message);
          setCoins((prevCoins) => prevCoins - 6*passiveIncome);
        }
      }
    ).catch(
      function (error) {
        console.log(error);
      }
    );
  },[Math.floor(coins / (6*passiveIncome))]);

  const fetchUserData = async (userId: number) => {
    try {
      const response = await axiosInstance.get(`/user/data/${userId}`);
      if (response.data && response.data.user) {
        const userData = response.data.user;
        setCoins(userData.coins);
        setEnergy(userData.energy);
        setCurrentUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const contextValue = {
    coins,
    setCoins,
    agents,
    setAgents,
    energy,
    setEnergy,
    power,
    setPower,
    jobs,
    setJobs,
    tasks,
    setTasks,
    globalRank,
    setGlobalRank,
    level,
    setLevel,
    currentUser,
    setCurrentUser,
    referralCode,
    setReferralCode,
    gpus,
    setGpus,
    data,
    setData,
    passiveIncome,
    setPassiveIncome,
    currentLanguage,
    setCurrentLanguage,
    clickCount,
    setClickCount,
    levelRate,
    setLevelRate,
    isToggled,
    setToggle,
    educationCourses,
    setEducationCourses,
    hideBottomBar,
    setHideBottomBar,
    completedTasks,
    setCompletedTasks,
    selectedRobot,
    setSelectedRobot,
  };

  return (
    <MiniAppContext.Provider
      value={contextValue}
    >
      {children}
    </MiniAppContext.Provider>
  );
};

