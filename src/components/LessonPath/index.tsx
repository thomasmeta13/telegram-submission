import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface Lesson {
  id: string;
  title: string;
  xp: number;
  completed: boolean;
}

interface LessonPathProps {
  courseId: string;
  section: number;
  unit: number;
  unitTitle: string;
  lessons: Lesson[];
}

const LessonPath: React.FC<LessonPathProps> = ({ courseId, lessons }) => {
  const navigate = useNavigate();
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [clickAnimations, setClickAnimations] = useState<{ id: number; position: [number, number][] }>({ id: 0, position: [] });

  const handleNodeClick = (index: number) => {
    setActiveNode(activeNode === index ? null : index);
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setActiveNode(null);
    }
  };

  const handleAgentClick = useCallback((event: React.MouseEvent<HTMLImageElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setClickAnimations(prev => ({
      id: prev.id + 1,
      position: [...prev.position, [x, y]]
    }));
  }, []);

  return (
    <main className="relative w-full min-h-screen bg-[#111827] text-white" onClick={handleOutsideClick}>
      <div className="flex flex-col items-center mt-16 relative">
        {[...lessons, { id: 'extra1', title: 'Extra Lesson 1', xp: 10, completed: false }, { id: 'extra2', title: 'Extra Lesson 2', xp: 10, completed: false }].map((lesson, index) => (
          <div 
            key={lesson.id}
            className="mb-16 relative"
            style={{
              left: `${index % 2 === 0 ? '-50px' : '50px'}`,
            }}
            onClick={() => handleNodeClick(index)}
          >
            <div 
              className={`w-20 h-20 rounded-full flex items-center justify-center relative z-10 cursor-pointer
                ${index === 0 ? 'bg-gradient-to-br from-[#4CAF50] to-[#45a049]' : 'bg-gradient-to-br from-[#606060] to-[#505050]'}
                shadow-lg transform transition-all duration-300 hover:scale-110`}
              style={{
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08), inset 0 -2px 5px rgba(0, 0, 0, 0.2)'
              }}
            >
              <div className={`w-16 h-16 rounded-full ${index === 0 ? 'bg-[#3c9f40]' : 'bg-[#505050]'} flex items-center justify-center`}>
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            {activeNode === index && (
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-4 bg-[#4CAF50] text-white p-4 rounded-lg shadow-lg z-20 w-64">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-[#4CAF50]"></div>
                <h3 className="font-bold text-lg mb-2">{lesson.title}</h3>
                <p className="mb-2">{index + 1}/{lessons.length + 2}</p>
                <button 
                  className="w-full bg-white text-[#4CAF50] font-bold py-2 px-4 rounded shadow-md hover:bg-gray-100 transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(`Navigating to: /education/${courseId}/lesson/${lesson.id}`);
                    navigate(`/education/${courseId}/lesson/${lesson.id}`);
                  }}
                >
                  START +{lesson.xp} XP
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="fixed bottom-44 left-8 relative">
        <img 
          src="/images/agents/agent_l1.png" 
          alt="Owl Mascot" 
          className="w-16 h-23 cursor-pointer" 
          onClick={handleAgentClick}
        />
        <AnimatePresence>
          {clickAnimations.position.map((pos, idx) => (
            <motion.div
              key={clickAnimations.id.toString() + idx.toString()}
              initial={{ opacity: 1, scale: 0.5, y: 0 }}
              animate={{ opacity: 0, scale: 1, y: -50 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute text-yellow-300 font-bold text-lg pointer-events-none"
              style={{ left: pos[0], top: pos[1] }}
            >
              +1
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default LessonPath;