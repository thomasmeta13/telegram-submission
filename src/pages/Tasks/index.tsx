import {AnnotationTaskDetail} from '../../routes/types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState, useContext} from 'react';
import { MiniAppContext } from "../../routes/MiniAppContextProvider";
import { Task } from '../../routes/types';

interface ModalProps {
  isOpen: boolean;  
  onClose: () => void;
  onFinish: (passed: boolean, completed: boolean, userLabels?: string[]) => void;
  taskIndex?: string;  
  task: Task;
}

export const LabelTaskModal: React.FC<ModalProps> = ({isOpen, onClose, onFinish, task}) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [imageError, setImageError] = useState(false);

  if (!isOpen || !task) return null;

  const handleLabelClick = (label: string) => {
    setSelectedLabel(label);
    // Add logic here to save the label for the current image
    if (imageIndex < task.images.length - 1) {
      setImageIndex(imageIndex + 1);
      setSelectedLabel('');
    } else {
      onFinish(true, true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative w-full max-w-md bg-cover bg-[url('/images/background/task_tab_color.png')] bg-no-repeat bg-top border-[1px] border-[#ffffff1a] rounded-t-[50px] pb-36 mb-4 overflow-auto">
        <div className="flex justify-center mt-3 text-center font-semibold text-2xl text-white">
          {task.task_name}
        </div>
        <div className="absolute top-4 right-6 bg-[url('/images/_close.png')] bg-cover w-8 h-8" onClick={onClose}></div>
        <div className="mx-4 mt-6 bg-gradient-to-b from-[#000000] to-[#0F1F3D] border-[1px] border-[#FFFFFF40] rounded-3xl py-2 px-4">
          <div className="flex justify-between">
            <div className="text-[14px] text-[#FFFFFFa4] font-semibold">Task Progress</div>
            <div className="text-[14px] text-[#FFFFFFa4] font-bold">{imageIndex+1} of {task.images.length} Images</div>
          </div>
          <div className="border-[1px] border-[#FFFFFF40] rounded-full mt-2 p-[2px]">
            <div
              className={`bg-[url('/images/stripes.png')] bg-cover rounded-full flex flex-row-reverse p-[2px]`}
              style={{ width: `${(imageIndex+1)*100/task.images.length}%` }}
            >
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
          </div>
        </div>
        {/* Add image display here */}
        <div className="mt-4 flex flex-wrap justify-center">
          {task.labels.map((label: string, index: number) => (
            <button
              key={index}
              className={`m-2 px-4 py-2 rounded-full ${selectedLabel === label ? 'bg-blue-500' : 'bg-gray-300'}`}
              onClick={() => handleLabelClick(label)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <img 
            src={imageError ? '/assets/images/default-placeholder.png' : task.images[imageIndex]} 
            onError={() => setImageError(true)}
            alt="Task image"
            className="max-w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export const AnnotationTaskModal: React.FC<ModalProps> = ({isOpen, onClose, taskIndex, onFinish}) => {
  if (!isOpen) return null;
  const {tasks} = useContext(MiniAppContext);
  const task = tasks.filter((task:Task)=> task._id === taskIndex)[0];
  const detail = task.detail as AnnotationTaskDetail;
  const [index,setIndex] = useState<number>(-1);
  const count = 5;
  const[star,setStar] = useState<number>(-1);
  const handleBack = ()=>{
    onClose();
  }
  const handleFinish = (completed: boolean, userLabels?: string[]) => {
    onClose();
    onFinish(true, completed, userLabels);
  }
  return(
    <div className="absolute w-full top-6">
      <div className="relative flex flex-col justify-center rounded-t-[50px] w-full bg-cover bg-[url('/images/background/task_tab_color.png')] bg-no-repeat bg-top border-[1px] border-[#ffffff1a] pb-32 overflow-auto">
        <div className="flex justify-center mt-3 text-center  font-semibold text-2xl text-white">
          {task.task_name}
        </div>
        <div className="absolute top-4 right-6 bg-[url('/images/_close.png')] bg-cover w-8 h-8" onClick={onClose}></div>
        <div className="mx-4 mt-6 bg-gradient-to-b from-[#000000] to-[#0F1F3D] border-[1px] border-[#FFFFFF40] rounded-3xl py-2 px-4">
          <div className="flex justify-between">
            <div className="text-[14px] text-[#FFFFFFa4] font-semibold">Task Progress</div>
            <div className="text-[14px] text-[#FFFFFFa4] font-bold">4 of 5 Answers</div>
          </div>
          <div className="border-[1px] border-[#FFFFFF40] rounded-full mt-2 p-[2px]">
            <div
              className={`bg-[url('/images/stripes.png')] bg-cover rounded-full flex flex-row-reverse p-[2px]`}
              style={{ width: `70%` }}
            >
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#8d8d8da4] to-[#ffffff] bg-clip-text text-transparent flex justify-center text-[14px] gap-2 mt-1">
            <div>Task Reward: </div>
            <div className="font-semibold text-white flex justify-center items-center gap-1">
              {task.reward && task.reward[0] ? (
                <div className="flex justify-center items-center gap-1">
                  <div>{task.reward[0]}</div>
                  <div className="bg-[url('/images/coin_1.png')] bg-cover w-3 h-3 rounded-full"></div>
                </div>
              ) : null}
              {task.reward && task.reward[1] ? (
                <div className="flex justify-center items-center gap-1">
                  <div>{task.reward[1]}</div>
                  <div className="bg-[url('/images/power_1.png')] bg-cover w-3 h-3 rounded-full"></div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="bg-gradient-r from-[#ffffff19] to-[#ffffff05] border-[1px] border-[#ffffff0c] bg-cover rounded-2xl mt-4 mx-4">
          <div className="flex mt-4 ml-6 font-semibold text-[#ffffff99]">PROMPT</div>
          <div className="px-4 bg-[#0000006d] py-4 rounded-lg mx-4 mt-1 text-white font-gilroy text-[12px]">How to use
            <span className="text-[#fa880a]"> math
            </span>.<span className="text-[#15c5d8]">isclose</span>()?
          </div>
          <div className="flex mt-4 ml-6 font-semibold text-[#ffffff99]">RESPONSE</div>
          <div className="px-4 bg-[#0000006d] py-4 rounded-lg mx-4 mt-1 text-white mb-4">
            <div className="font-gilroy  text-[12px]">
            {detail.response}
            </div>
            <div className="bg-[#33334599] mt-2 mx-auto rounded-md text-[11px] font-sourcecodepro overflow-hidden">
              <SyntaxHighlighter language="python" style={solarizedlight} customStyle={{backgroundColor: '#ffffff00'}}>
              {detail.code}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
        
        <div className="mt-5 mx-4 bg-gradient-to-b from-[#0000004f] to-[#0f1f3d9f] rounded-2xl py-4">
          <div className="relative flex justify-between mx-4">
            <div className=" text-white font-bold w-64 text-[16px]">{detail.questions[0][0]}<span className="text-red-600">*</span></div>
            <div className="absolute top-0 right-0 flex justify-center items-center text-[#ffffff2f] font-bold text-[12px] bg-[#ffffff0c] w-9 h-6 text-center rounded-2xl font-gilroy"><span>1/3</span></div>
          </div>
          <div className="flex justify-center gap-4 mt-4 items-center text-white font-bold">
            <div className="grid grid-cols-2 gap-x-2 mx-auto items-center">
              {
                detail.questions[0].slice(1).map((label, idx)=>(
                idx === index ?
                <div className="relative w-[111px] h-11 border-[1px] border-[#fffff211] flex flex-col justify-center items-center bg-[url('/images/background/task_button_color.png')] bg-center bg-no-repeat rounded-2xl" key={idx}>
                  <span>{label}</span>
                  <div className="absolute -bottom-2 bg-[url('/images/done_.png')] w-4 h-4 overflow-auto"></div>
                </div>
                :
                  <div className="w-[111px] h-11 rounded-2xl border-[1px] border-[#fffff211] flex flex-col justify-center items-center bg-gradient-to-b from-[#000000099] to-[#0f1f3d99]" onClick={()=>setIndex(idx)} key={idx}>{label}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 mx-4 bg] bg-gradient-to-b from-[#0000004f] to-[#0f1f3d9f] rounded-2xl py-4">
          <div className="relative flex justify-between mx-4">
            <div className=" text-white font-bold w-64 text-[16px]">{detail.questions[1][0]}</div>
            <div className="absolute top-0 right-0 flex justify-center items-center text-[#ffffff2f] font-bold text-[12px] bg-[#ffffff0c]  w-9 h-6 text-center rounded-2xl font-gilroy"><span>2/3</span></div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="grid grid-cols-2 gap-2 mt-4 items-center text-white font-semibold">
              {detail.questions[1].slice(1).map((item,idx)=>(
                <div className="w-40 h-11 rounded-2xl border-[1px] border-[#fffff211] flex flex-col justify-center items-center text-[12px]" key={idx}>{item}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 mx-4 bg-gradient-to-b from-[#0000004f] to-[#0f1f3d9f] rounded-2xl py-4">
          <div className="relative flex justify-between mx-4">
            <div className=" text-white font-bold flex items-center w-64 text-[16px]">{detail.questions[2][0]}<span className="text-red-600">*</span></div>
            <div className="absolute top-0 right-0 flex justify-center items-center text-[#ffffff2f] font-bold text-[12px] bg-[#ffffff0c]  w-9 h-6 text-center rounded-2xl font-gilroy"><span>3/3</span></div>
          </div>
          <div className="flex justify-center mt-3 gap-4">
            {Array.from({length: count}, (_, i) => i + 1).map((rate,idx)=>(
              <div className="flex flex-col justify-center" key={idx}>
                {idx > star ? (
                  <div className="bg-[url('/images/out_star.png')] w-7 h-7 bg-no-repeat drop-shadow-[#db7d05]" onClick={()=>{setStar(idx)}}></div>
                  ):(
                  <div className="bg-[url('/images/in_star.png')] w-7 h-7 bg-no-repeat drop-shadow-[#db7d05]" onClick={()=>{setStar(idx)}}></div>
                  )
                }
                <div className="text-center text-[#ffffff8f] text-bold">{rate}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 flex justify-center gap-12 w-full h-28 px-4 pt-4 pb-6 rounded-t-3xl bg-gradient-to-t from-[#090011] to-[#0f1f3d]" style={{}}>
          <div className="bg-gradient-to-r from-[#ffffff1a] to-[#46dbbc1d] text-white font-bold rounded-3xl w-44 h-14 flex flex-col justify-center items-center" onClick={handleBack}>Back</div>
          <div className="bg-gradient-to-r from-[#03cea4] to-[#8e37fe] text-white font-bold rounded-3xl w-44 h-14 flex flex-col justify-center items-center" onClick={() => handleFinish(true, [])}>Finish</div>
        </div>
      </div>
    </div>
  )
}

export const TrainingTaskModal: React.FC<ModalProps & { taskImages: string[] }> = ({
  isOpen,
  onClose,
  onFinish,
  task,
  taskImages
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  if (!isOpen || !task) return null;

  const images = task.images || [];
  const labels = task.labels || [];
  const correctLabels = task.correct_labels || [];

  console.log('Task:', task);
  console.log('Images:', images);
  console.log('Labels:', labels);
  console.log('Correct labels:', correctLabels);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowFeedback(true);

    console.log('Selected label:', labels[index]);
    console.log('Correct label:', correctLabels[currentQuestion]);
    console.log('Is correct:', labels[index] === correctLabels[currentQuestion]);

    if (labels[index] === correctLabels[currentQuestion]) {
      setCorrectAnswers(correctAnswers + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < images.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowFeedback(false);
      setSelectedAnswer(null);
    } else {
      const passed = correctAnswers / images.length >= 0.8;
      onFinish(passed, true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowFeedback(false);
      setSelectedAnswer(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative w-full max-w-md bg-cover bg-[url('/images/background/task_tab_color.png')] bg-no-repeat bg-top border-[1px] border-[#ffffff1a] rounded-t-[50px] pb-36 mb-4 overflow-auto">
        <div className="flex justify-center mt-3 text-center font-semibold text-2xl text-white">
          {task.task_name}
        </div>
        <div className="absolute top-4 right-6 bg-[url('/images/_close.png')] bg-cover w-8 h-8" onClick={onClose}></div>
        <div className="mx-4 mt-6 bg-gradient-to-b from-[#000000] to-[#0F1F3D] border-[1px] border-[#FFFFFF40] rounded-3xl py-2 px-4">
          <div className="flex justify-between">
            <div className="text-[14px] text-[#FFFFFFa4] font-semibold">Task Progress</div>
            <div className="text-[14px] text-[#FFFFFFa4] font-bold">{currentQuestion + 1} of {images.length} Images</div>
          </div>
          <div className="border-[1px] border-[#FFFFFF40] rounded-full mt-2 p-[2px]">
            <div
              className={`bg-[url('/images/stripes.png')] bg-cover rounded-full flex flex-row-reverse p-[2px]`}
              style={{ width: `${(currentQuestion + 1) * 100 / images.length}%` }}
            >
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#8d8d8da4] to-[#ffffff] bg-clip-text text-transparent flex justify-center text-[14px] gap-2 mt-1">
            <div>Task Reward: </div>
            <div className="font-semibold text-white flex justify-center items-center gap-1">
              {task.reward && (
                <div className="flex justify-center items-center gap-1">
                  <div>{task.reward}</div>
                  <div className="bg-[url('/images/coin_1.png')] bg-cover w-3 h-3 rounded-full"></div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center mx-auto items-center bg-cover mt-6">
          <img 
            src={taskImages[currentQuestion] || '/assets/images/placeholder.png'} 
            alt="Task" 
            className="w-80 h-80 rounded-2xl object-cover" 
            onError={(e) => {
              e.currentTarget.src = '/assets/images/default-placeholder.png';
            }}
          />
        </div>
        <div className="flex justify-center items-center text-white font-bold mt-6">
          <div className="grid grid-cols-2 gap-x-2 gap-y-3 items-center">
            {labels.map((label, index) => (
              <div 
                key={index}
                className={`w-[111px] h-11 rounded-2xl border-[1px] border-[#fffff211] flex flex-col justify-center items-center ${
                  selectedAnswer === index 
                    ? 'bg-[url(\'/images/background/task_button_color.png\')] bg-center bg-no-repeat' 
                    : 'bg-gradient-to-b from-[#000000099] to-[#0f1f3d99]'
                } cursor-pointer relative`}
                onClick={() => handleAnswer(index)}
              >
                <span>{label}</span>
                {showFeedback && selectedAnswer === index && (
                  <div className={`absolute -bottom-6 w-full text-center ${
                    label === correctLabels[currentQuestion] ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {label === correctLabels[currentQuestion] ? 'Correct!' : 'Try Again'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 flex justify-center gap-12 w-full h-28 px-4 pt-4 pb-6 rounded-t-3xl bg-gradient-to-t from-[#090011] to-[#0f1f3d]">
          <div className="bg-gradient-to-r from-[#ffffff1a] to-[#46dbbc1d] text-white font-bold rounded-3xl w-44 h-14 flex flex-col justify-center items-center" onClick={handleBack}>Back</div>
          <div className={`bg-gradient-to-r from-[#03cea4] to-[#8e37fe] text-white font-bold rounded-3xl w-44 h-14 flex flex-col justify-center items-center ${showFeedback && selectedAnswer !== null && labels[selectedAnswer] === correctLabels[currentQuestion] ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`} 
               onClick={showFeedback && selectedAnswer !== null && labels[selectedAnswer] === correctLabels[currentQuestion] ? handleNext : undefined}>
            {currentQuestion + 1 === images.length ? "Finish" : "Next"}
          </div>
        </div>
      </div>
    </div>
  );
};

export const RewardModal: React.FC<ModalProps> = ({isOpen, onClose, taskIndex, onFinish, task}) => {
  console.log('RewardModal rendered, isOpen:', isOpen, 'taskIndex:', taskIndex, 'task:', task);
  
  if (!isOpen || !task) {
    console.log('RewardModal not rendered. isOpen:', isOpen, 'task:', task);
    return null;
  }
  
  return (
    <div className="fixed inset-0 z-50 bg-[#010101df] flex items-center justify-center">
      <div className="relative bg-cover bg-[url('/images/get_reward.png')] w-[345px] h-[436px]">
        <div className="absolute top-4 right-4 bg-[url('/images/_close.png')] bg-cover w-8 h-8" onClick={onClose}></div>
        
        <div className="text-white font-bold flex justify-center text-[20px] gap-2 mt-36 font-gilroy">✨ Task completed! ✨</div>
        <div className="text-white flex justify-center text-[14px] gap-2 mt-2 font-roboto">Here are your prizes for your efforts!</div>
        <div className="flex justify-center items-center font-semibold text-white gap-24 mt-3 mx-auto w-72 h-24 bg-[#ffffff22] rounded-xl">
          <div className='flex flex-col items-center gap-2'>
            <div className="bg-[url('/images/coin_1.png')] bg-cover bg-no-repeat bg-center w-8 h-8 rounded-full"></div>
            <div>{task.reward[0]}</div>
          </div>
          <div className='flex flex-col items-center gap-2'>
            <div className="bg-[url('/images/power_1.png')] bg-cover bg-no-repeat bg-center w-8 h-8 rounded-full"></div>
            <div>{task.reward[1]}</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-[#03cea4] to-[#8e37fe] text-white font-bold rounded-xl w-72 h-14 flex flex-col justify-center items-center mt-4 mx-auto cursor-pointer" onClick={() => onFinish(true, true)}>Get Reward</div>
      </div>
    </div>
  );
};

