import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TrainingTaskModal, RewardModal } from '../Tasks';
import { Task } from "../../routes/types";
import axiosInstance from '../../api';
import { MiniAppContext } from '../../routes/MiniAppContextProvider';
import BottomNavBar from '../../components/BottomNavBar';
import TaskIntroduction from '../../components/TaskIntroduction';

// const placeholderTask: Task = {
//   _id: 'task1',
//   task_name: 'Placeholder Training Task',
//   description: 'This is a placeholder task for demonstration purposes.',
//   detail: {
//     images: ['/images/placeholder_image.png'],
//     labels: ['Label 1', 'Label 2'],
//     correct_labels: ['Label 1'],
//   },
//   reward: [100, 50],
//   type: 'training',
//   category: 'Training',
//   logo: '/images/placeholder_task.png',
//   taskID: 'task1',
//   provider: 'Placeholder Provider',
//   images: ['/images/placeholder_image.png'],
//   correct_labels: ['Label 1'],
//   created_at: new Date().toISOString(),
//   updated_at: new Date().toISOString(),
//   labels: ['Label 1', 'Label 2']
// };

const TrainingTask: React.FC = () => {
  const { projectId, taskId } = useParams<{ projectId?: string; taskId: string }>();
  const navigate = useNavigate();
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const { setCoins } = useContext(MiniAppContext);
  const [taskImages, setTaskImages] = useState<string[]>([]);
  const [showIntroduction, setShowIntroduction] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) {
        setError('No task ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axiosInstance.get(`/user/tasks/${taskId}?userId=${localStorage.getItem('userId')}`);
        setCurrentTask(response.data.task);
        
        // Fetch task images
        const imagesResponse = await axiosInstance.get(`/api/tasks/${taskId}/images`);
        setTaskImages(imagesResponse.data.images);

        setError(null);
      } catch (error: unknown) {
        console.error('Error fetching task:', error);
        if (error instanceof Error) {
          setError(`Failed to load task. Error: ${error.message}`);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  if (loading) {
    return <div className="text-white p-4">Loading task data...</div>;
  }
  if (error) {
    return <div className="text-white p-4">{error}</div>;
  }

  if (!currentTask) {
    return <div className="text-white p-4">Task not found</div>;
  }

  const handleGetReward = () => {
    console.log('Reward claimed');
    setShowReward(false);
    navigate('/earn', { replace: true });
  };

  const handleFinish = async (passed: boolean, completed: boolean) => {
    console.log('Task finished. Passed:', passed, 'Completed:', completed);
    if (completed && currentTask) {
      try {
        const response = await axiosInstance.post('/user/tasks/complete', {
          taskId: currentTask._id,
          results: {
            userLabels: currentTask.correct_labels,
            completionTime: 120
          },
          userId: localStorage.getItem('userId')
        });
        console.log('Task completion response:', response.data);
        
        if (response.data.message === "Task completed successfully") {
          // Update the current task with the completed status
          setCurrentTask(prevTask => ({
            ...prevTask!,
            ...response.data.task
          }));
          
          // Update user coins if needed
          setCoins(response.data.userCoins);
        }
      } catch (error) {
        console.error('Error completing task:', error);
        // Optionally, show an error message to the user
      }
    }
    setIsFinished(true);
    setShowReward(true);
  };

  const handleStartLabeling = () => {
    setShowIntroduction(false);
  };

  return (
    <main className="relative w-full min-h-full bg-[url('/images/background/workforce_tab_color.png')] bg-cover bg-top bg-no-repeat bg-[#5200FF64]">
      {showIntroduction ? (
        <TaskIntroduction 
          task={currentTask} 
          onStartLabeling={handleStartLabeling} 
          onClose={() => navigate(projectId ? `/earn/Projects/${projectId}` : '/earn', { replace: true })}
        />
      ) : (
        !isFinished && currentTask && (
          <TrainingTaskModal 
            isOpen={!isFinished} 
            onClose={() => navigate(projectId ? `/earn/Projects/${projectId}` : '/earn', { replace: true })} 
            onFinish={handleFinish}
            task={currentTask}
            taskImages={taskImages}
          />
        )
      )}
      {showReward && currentTask && (
        <RewardModal 
          isOpen={showReward}
          onClose={() => {
            setShowReward(false);
            navigate('/earn', { replace: true });
          }}
          taskIndex={taskId}
          onFinish={handleGetReward}
          task={currentTask}
        />
      )}
      <BottomNavBar />
    </main>
  );
};

export default TrainingTask;
