import React from 'react';
import { Task } from "../../routes/types";

interface TaskIntroductionProps {
  task: Task;
  onStartLabeling: () => void;
  onClose: () => void;
}

const TaskIntroduction: React.FC<TaskIntroductionProps> = ({ task, onStartLabeling, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative w-full max-w-md bg-cover bg-[url('/images/background/task_tab_color.png')] bg-no-repeat bg-top border-[1px] border-[#ffffff1a] rounded-t-[50px] pb-36 mb-4 overflow-auto">
        <div className="flex justify-center mt-3 text-center font-semibold text-2xl text-white">
          {task.task_name}
        </div>
        <div className="absolute top-4 right-6 bg-[url('/images/_close.png')] bg-cover w-8 h-8" onClick={onClose}></div>
        
        <div className="mx-4 mt-6">
          {task.instructionGif ? (
            <img 
              src={task.instructionGif} 
              alt="Task instruction" 
              className="w-full rounded-lg mb-4"
            />
          ) : (
            <div className="bg-gray-700 h-64 flex items-center justify-center rounded-lg mb-4">
              <p className="text-white">No instruction GIF available</p>
            </div>
          )}
          
          <div className="space-y-4 text-white">
            <p className="text-gray-300">{task.description}</p>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Purpose:</h3>
              <p className="text-gray-300">{task.purpose || "No purpose provided."}</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Criteria:</h3>
              <ul className="list-disc list-inside text-gray-300">
                {task.criteria ? 
                  task.criteria.map((criterion, index) => (
                    <li key={index}>{criterion}</li>
                  ))
                  : <li>No criteria provided.</li>
                }
              </ul>
            </div>
          </div>
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 flex justify-center w-full h-28 px-4 pt-4 pb-6 rounded-t-3xl bg-gradient-to-t from-[#090011] to-[#0f1f3d]">
          <button 
            className="bg-gradient-to-r from-[#03cea4] to-[#8e37fe] text-white font-bold rounded-3xl w-72 h-14 flex flex-col justify-center items-center"
            onClick={onStartLabeling}
          >
            Start Labeling
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskIntroduction;
