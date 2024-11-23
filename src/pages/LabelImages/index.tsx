import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { LabelTaskModal, RewardModal } from '../Tasks';
import { MiniAppContext } from "../../routes/MiniAppContextProvider";
import { Task } from "../../routes/types";

const LabelImages = () => {
  const { taskId = '' } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { setToggle, coins, setCoins, power, setPower, currentUser, setCurrentUser, tasks } = useContext(MiniAppContext);
  const [isFinished, setFinished] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const task = tasks.find((t: Task) => t._id === taskId);
    if (task) {
      setCurrentTask(task);
    } else {
      setError("Task not found");
    }
  }, [taskId, tasks]);

  const handleFinish = () => {
    setFinished(true);
  }

  const handleGetReward = () => {
    if (currentTask?.reward && currentTask.reward.length > 0) {
      setCoins(coins + currentTask.reward[0]);
      setCurrentUser({ ...currentUser, coins: currentUser.coins + currentTask.reward[0] });
    }
    if (currentTask?.reward && currentTask.reward.length > 1) {
      setPower(power + currentTask.reward[1]);
      setCurrentUser({ ...currentUser, power: currentUser.power + currentTask.reward[1] });
    }
    setFinished(false);
    setToggle(false);
    navigate('/earn');
  }

  if (error) {
    return <div className="text-white p-4">{error}</div>;
  }

  if (!currentTask) {
    return <div className="text-white p-4">Loading task...</div>;
  }

  return (
    <main className="relative w-full min-h-full bg-[url('/images/numbers.png')] bg-cover bg-[#5200FF64]">
      <LabelTaskModal 
        isOpen={!isFinished} 
        onClose={() => navigate('/earn')} 
        taskIndex={taskId} 
        onFinish={handleFinish}
        task={currentTask}
      />
      <RewardModal
        isOpen={isFinished}
        onClose={handleGetReward}
        onFinish={handleGetReward}
        taskIndex={taskId}
        task={currentTask}
      />
    </main>
  );
};

export default LabelImages;
