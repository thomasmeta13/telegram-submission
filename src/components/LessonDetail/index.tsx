import React, { useState, KeyboardEvent, useEffect, useContext, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { generateGameWithClaude } from "../../api/claudeApi";
import { MiniAppContext } from "../../routes/MiniAppContextProvider";
import { motion, AnimatePresence } from 'framer-motion';

const LessonDetail = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [prompt, setPrompt] = useState("");
  const [generatedGame, setGeneratedGame] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [style, setStyle] = useState("random");
  const [isClicked, setIsClicked] = useState(false);
  const [clickAnimations, setClickAnimations] = useState<{ id: number, position: [number, number][] }>({ id: Date.now(), position: [] });
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const tutorialShownRef = useRef(false);

  const { setHideBottomBar, coins, setCoins } = useContext(MiniAppContext);

  useEffect(() => {
    setHideBottomBar(true);
    if (!tutorialShownRef.current) {
      setShowTutorial(true);
      tutorialShownRef.current = true;
    }
    return () => setHideBottomBar(false);
  }, [setHideBottomBar]);

  const advanceTutorial = useCallback(() => {
    if (tutorialStep < 6) {
      setTutorialStep(prevStep => prevStep + 1);
    } else {
      setShowTutorial(false);
    }
  }, [tutorialStep]);

  const handlePromptSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    await generateGame();
  };

  const generateGame = async (isRemix = false) => {
    setIsLoading(true);
    try {
      let fullPrompt = prompt;
      if (style !== "random") {
        fullPrompt = `Style: ${style}. ${fullPrompt}`;
      }
      if (isRemix) {
        fullPrompt += " Please create a variation of the previous game.";
      }
      const htmlCode = await generateGameWithClaude(fullPrompt, style);
      setGeneratedGame(htmlCode);
    } catch (error) {
      console.error('Error generating game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleRemix = () => {
    generateGame(true);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handlePromptSubmit();
    }
  };

  const handleRobotClick = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    if ('clientX' in e && 'clientY' in e) {
      setClickAnimations({ id: Date.now(), position: [[e.clientX - rect.left, e.clientY - rect.top]] });
      setCoins(coins + 1);
    } else if ('touches' in e && e.touches.length > 0) {
      setClickAnimations({ id: Date.now(), position: Array.from(e.touches).map(touch => [touch.clientX - rect.left, touch.clientY - rect.top]) });
      setCoins(coins + e.touches.length);
    }
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 20);
  };

  const Tutorial: React.FC = () => {
    const steps = [
      "Welcome to the AI Game Generator! I'm Proto, and I'll guide you through creating your first game.",
      "Start by typing a prompt in the text area below. Be creative!",
      "Choose a style for your game using the dropdown menu.",
      "When you're ready, click the 'Generate' button to create your game.",
      "Once your game is generated, you can play it right here in the browser!",
      "If you want to make changes, use the 'Remix' button to generate a variation.",
      "That's it! You're now ready to create amazing games with AI. Have fun!"
    ];

    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="bg-[url('/images/agents/agent_l2.png')] w-[139px] h-[160px] bg-cover bg-no-repeat mb-8"></div>
        <div className="bg-black bg-opacity-50 p-4 rounded-lg max-w-md">
          <p className="text-center text-white mb-4">{steps[tutorialStep]}</p>
          <div className="flex justify-between">
            <button
              onClick={() => tutorialStep > 0 && setTutorialStep(prevStep => prevStep - 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded"
              disabled={tutorialStep === 0}
            >
              Previous
            </button>
            <button
              onClick={advanceTutorial}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {tutorialStep === steps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Add this after the state declarations
  if (lessonId === 'lesson1') {
    return (
      <main className="w-full h-screen bg-gradient-to-b from-[#130122] to-[#0F1F3D]">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-4 left-4 z-10 bg-white bg-opacity-20 text-white rounded-full p-2 hover:bg-opacity-30 transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <iframe
          src="https://proto-fawn.vercel.app"
          title="Lesson 1 Content"
          className="w-full h-full border-0"
        />
      </main>
    );
  }

  if (lessonId === 'lesson3') {
    return (
      <main className="w-full h-screen bg-gradient-to-b from-[#130122] to-[#0F1F3D]">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-4 left-4 z-10 bg-white bg-opacity-20 text-white rounded-full p-2 hover:bg-opacity-30 transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <iframe
          src="https://data-sthoot.vercel.app"
          title="Data Shoot Game"
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
        />
      </main>
    );
  }

  // The rest of the component remains the same for other lessons
  return (
    <main className="relative w-full h-screen bg-gradient-to-b from-[#130122] to-[#0F1F3D] text-white flex flex-col">
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-4 left-4 z-10 bg-white bg-opacity-20 text-white rounded-full p-2 hover:bg-opacity-30 transition-all duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <div className="flex-grow overflow-hidden flex items-center justify-center">
        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            <div 
              className={`bg-[url('/images/bot.png')] w-[139px] h-[160px] bg-cover bg-no-repeat ${isClicked ? 'scale-95' : ''}`}
              onClick={handleRobotClick}
            ></div>
            <p className="mt-4 text-white text-lg font-bold bg-black bg-opacity-50 px-4 py-2 rounded">Generating your game...</p>
          </div>
        ) : generatedGame ? (
          <iframe
            srcDoc={generatedGame}
            title="Generated Game"
            className="w-full h-full border-0"
            sandbox="allow-scripts"
          />
        ) : showTutorial ? (
          <Tutorial />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-white text-lg">Enter a prompt to generate your game!</p>
          </div>
        )}
        <AnimatePresence>
          {clickAnimations.position.map((label, idx) => (
            <motion.div
              key={clickAnimations.id.toString() + idx.toString()}
              initial={{ opacity: 1, scale: 0.5, y: 0 }}
              animate={{ opacity: 0, scale: 1, y: -50 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute text-yellow-300 font-bold text-lg pointer-events-none"
              style={{ left: label[0], top: label[1] }}
            >
              +1
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ease-in-out ${isFormVisible ? 'h-32' : 'h-0'}`}>
        <button
          onClick={toggleForm}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-t-lg"
        >
          {isFormVisible ? 'Hide Prompt' : 'Show Prompt'}
        </button>
        <div className={`bg-[#1A1F37] p-4 h-full transition-all duration-300 ease-in-out ${isFormVisible ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <label htmlFor="style" className="mr-2 text-sm font-medium">Style:</label>
              <select
                id="style"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className={`bg-[#2A2F47] text-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${tutorialStep === 2 ? 'ring-2 ring-blue-500' : ''}`}
              >
                <option value="random">Random</option>
                <option value="3D">3D</option>
                <option value="minimalistic">Minimalistic</option>
              </select>
            </div>
            <button
              onClick={handleRemix}
              className={`bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 ${tutorialStep === 5 ? 'ring-2 ring-blue-500' : ''}`}
              disabled={isLoading || !generatedGame}
            >
              Remix
            </button>
          </div>
          <form onSubmit={handlePromptSubmit} className="flex items-center">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your game prompt here..."
              className={`flex-grow p-2 text-black rounded-l-lg resize-none h-12 text-sm ${tutorialStep === 1 ? 'ring-2 ring-blue-500' : ''}`}
            />
            <button
              type="submit"
              className={`bg-blue-500 text-white px-4 py-2 rounded-r-lg h-12 font-semibold text-sm ${tutorialStep === 3 ? 'ring-2 ring-blue-500' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default LessonDetail;
