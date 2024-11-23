import { useState, useContext, useEffect, useRef } from "react";
import { MiniAppContext } from "../../routes/MiniAppContextProvider";
import TopNavBar from "../../components/TopNavBar";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../api';

interface AirdropQuest {
  task_id: string;
  title: string;
  type: string;
  game: string;
  reward: number;
  status: string;
  progress: number;
  image: string;
}

interface Game {
  title: string;
  image: string;
  reward: number;
}

const Airdrop = () => {
  const [currentTab, setCurrentTab] = useState("Top Quests");
  const [currentSlide, setCurrentSlide] = useState(0);
  const context = useContext(MiniAppContext);
  const [quests, setQuests] = useState<AirdropQuest[]>([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuests = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get('https://4f3b-12-186-22-250.ngrok-free.app/interact/task-summaries/', {
          headers: {
            'Authorization': 'Bearer cb3771e6-56ad-49bb-9f07-76146349a425',
            'ngrok-skip-browser-warning': 'true'
          }
        });
        
        const apiQuests = response.data.tasks.map((task: any) => ({
          task_id: task.task_id,
          title: task.title,
          type: task.type,
          game: task.game || "Unknown Game",
          reward: task.reward,
          status: task.status,
          progress: task.status === "COMPLETED" ? 100 : 0,
          image: task.image && !task.image.includes('undefined') 
            ? task.image 
            : `https://detask-images.s3.amazonaws.com/${task.ageRange || '21-25'}/default-placeholder.png`
        }));
        
        setQuests(apiQuests);
      } catch (error) {
        console.error('Error fetching quests:', error);
        setError('An error occurred while fetching quests. Please try again later.');
        setQuests(sampleQuests);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuests();
  }, []);

  const sampleQuests: AirdropQuest[] = [
    { task_id: "1", title: "Daily Login", type: "daily", game: "Crypto Clash", reward: 10, status: "COMPLETED", progress: 100, image: "/images/splinterlands.jpg" },
    { task_id: "2", title: "Win 3 Battles", type: "battle", game: "NFT Racer", reward: 15, status: "IN_PROGRESS", progress: 66, image: "/images/decentraland.png" },
    { task_id: "3", title: "Craft an Item", type: "crafting", game: "DeFi Dungeon", reward: 20, status: "NOT_STARTED", progress: 0, image: "/images/axie.jpg" }
  ];

  const sampleGames = [
    { title: "Data Shoot", image: "/images/datashoot.png", reward: 5 },
    { title: "Touring Test", image: "/images/screen3.png", reward: 7 },
    { title: "Guess the AI", image: "https://ph-files.imgix.net/615d71ed-d82c-4ddb-8588-d81c75e05493.png?auto=format", reward: 6 }
  ];

  const games = context?.games?.length > 0 ? context.games : sampleGames;
  const touchStartX = useRef(0);

  const featuredGames = [
    {
      title: "Data Shoot",
      image: "/images/datashoot.png",
      description: "Label data by shooting at the correct data point.",
      likes: 199
    },
    {
      title: "Probabilistic Maze",
      image: "/images/screen3.png",
      description: "Collect, breed, and battle fantasy creatures called Axies",
      likes: 185
    },
    {
      title: "Prompt2Earn",
      image: "/images/bot1.png",
      description: "Create, explore and trade in the first-ever virtual world owned by its users",
      likes: 210
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featuredGames.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        // Swipe left
        setCurrentSlide((prev) => (prev + 1) % featuredGames.length);
      } else {
        // Swipe right
        setCurrentSlide((prev) => (prev - 1 + featuredGames.length) % featuredGames.length);
      }
    }
  };

  return (
    <main className="relative pb-20 w-full min-h-full bg-[#130122] text-white">
      <TopNavBar />
      <div className="px-4 pt-20">
        {isLoading ? (
          <div className="text-center py-4">Loading quests...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : (
          <>
            {/* Slideshow section */}
            <div 
              className="relative rounded-2xl overflow-hidden mb-6"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <img 
                src={featuredGames[currentSlide].image} 
                alt={featuredGames[currentSlide].title} 
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 rounded-full px-2 py-1 text-sm">
                {featuredGames[currentSlide].likes} ❤️
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                <h2 className="text-2xl font-bold mb-1">{featuredGames[currentSlide].title}</h2>
                <p className="text-sm">{featuredGames[currentSlide].description}</p>
                <div className="flex mt-2 space-x-1">
                  {/* Game icons */}
                  <div className="w-6 h-6 bg-gray-500 rounded-full"></div>
                  <div className="w-6 h-6 bg-gray-500 rounded-full"></div>
                  <div className="w-6 h-6 bg-gray-500 rounded-full"></div>
                </div>
              </div>
              <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
                {featuredGames.map((_, index) => (
                  <div 
                    key={index} 
                    className={`w-2 h-2 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-gray-400'}`}
                    onClick={() => setCurrentSlide(index)}
                  ></div>
                ))}
              </div>
            </div>

            {/* Tab buttons */}
            <div className="flex mb-6"> {/* Increased bottom margin */}
              <button 
                className={`mr-4 pb-2 ${currentTab === "Top Quests" ? "text-[#4ade80] border-b-2 border-[#4ade80]" : "text-gray-400"}`}
                onClick={() => setCurrentTab("Top Games")}
              >
                Top Games
              </button>
              <button 
                className={`pb-2 ${currentTab === "Your Library" ? "text-[#4ade80] border-b-2 border-[#4ade80]" : "text-gray-400"}`}
                onClick={() => setCurrentTab("Your Library")}
              >
                Your Library
              </button>
            </div>

            {/* Launch Now section */}
            <div className="flex overflow-x-auto space-x-4 mb-8">
              {games.map((game: Game, index: number) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 w-36 rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/game/${game.title.replace(/\s+/g, '-').toLowerCase()}`)}
                >
                  <img src={game.image} alt={game.title} className="w-full h-40 object-cover" />
                  <div className="bg-[#1A1F37] p-2">
                    <div className="text-xs font-bold">{game.title}</div>
                    <div className="text-xs text-[#4ade80]">{game.reward} ◆/Hr</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Daily Quests section */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Daily Games</h3>
              <button className="text-sm text-gray-400">Show all</button>
            </div>

            <div className="space-y-4">
              {quests.map((quest, index) => (
                <div 
                  key={index} 
                  className="flex items-center bg-[#1A1F37] rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => navigate('/game/data-shoot')}
                >
                  <img src={quest.image} alt={quest.title} className="w-24 h-16 object-cover" />
                  <div className="flex-grow p-3">
                    <div className="text-sm font-bold">{quest.title}</div>
                    <div className="text-xs text-gray-400">{quest.game}</div>
                  </div>
                  <div className="p-3 text-right">
                    <div className="text-sm font-bold text-[#4ade80]">+{quest.reward} ◆</div>
                    <div className="text-xs text-gray-400">{quest.progress}%</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Airdrop;
