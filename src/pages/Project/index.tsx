import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api';

interface ProjectType {
  _id: string;
  project_name: string;
  tasks: { _id: string; completed?: boolean }[];  // Update this line
  type: string;
  description: string;
  rewards: number;
  logo: string;
  created_at: string;
  updated_at: string;
}

const Project: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        setError('No project ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axiosInstance.get(`/user/projects/${projectId}`);
        const project = response.data;
        if (project) {
          // Fetch completion status for each task
          const tasksWithCompletion = await Promise.all(
            project.tasks.map(async (task: { _id: string }) => {
              const completionResponse = await axiosInstance.get(
                `/user/tasks/${task._id}/completion/${localStorage.getItem('userId')}`
              );
              return { ...task, completed: completionResponse.data.completed };
            })
          );
          setProject({ ...project, tasks: tasksWithCompletion });
          setError(null);
        } else {
          setError('Project not found');
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('Failed to load project. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    } else {
      setError('No project ID provided');
      setLoading(false);
    }
  }, [projectId]);

  if (loading) {
    return <div className="text-white p-4 text-center">Loading project data...</div>;
  }

  if (error) {
    return <div className="text-white p-4 text-center">{error}</div>;
  }

  if (!project) {
    return <div className="text-white p-4 text-center">Project not found</div>;
  }

  return (
    <main className="relative pt-14 pb-20 w-full min-h-full bg-[url('/images/background/workforce_tab_color.png')] bg-cover bg-top bg-no-repeat bg-[#5200FF64] mx-auto">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-[#1A1F37] rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex items-center mb-4">
            <img src={`/images/${project.logo}`} alt={project.project_name} className="w-16 h-16 mr-4 rounded-lg" />
            <div>
              <h1 className="text-2xl text-white font-semibold">{project.project_name}</h1>
              <p className="text-sm text-[#ffffffc0]">{project.type}</p>
            </div>
          </div>
          <p className="text-sm text-[#ffffffc0] mb-4">{project.description}</p>
          <div className="flex justify-between items-center text-sm text-[#ffffffc0] mb-4">
            <span>Reward: <span className="text-yellow-500 font-bold">{project.rewards} coins</span></span>
            <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        
        <h2 className="text-xl text-white font-semibold mb-4">Tasks</h2>
        <div className="space-y-4">
          {project.tasks.map((task, index) => (
            <div
              key={task._id}
              className="flex items-center bg-[#1A1F37] border border-[#ffffff16] p-4 rounded-xl cursor-pointer hover:bg-[#2A2F4F] transition-colors duration-200"
              onClick={() => navigate(`/training-task/${project._id}/${task._id}`)}
            >
              <div className="w-12 h-12 mr-4 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">{index + 1}</span>
              </div>
              <div className="flex-grow">
                <div className="text-white font-semibold">Task {index + 1}</div>
                <div className="text-xs text-[#ffffffc0]">{project.type}</div>
              </div>
              {task.completed ? (
                <img src="/images/done.png" alt="Completed" className="w-6 h-6" />
              ) : (
                <div className="text-[#ffffffc0]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Project;