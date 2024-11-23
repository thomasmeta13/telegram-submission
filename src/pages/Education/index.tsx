import { useNavigate } from 'react-router-dom';
import BottomNavBar from "../../components/BottomNavBar";
import TopNavBar from '../../components/TopNavBar';

const courses = [
  {
    id: 'ai-basics',
    title: 'AI Basics',
    description: 'The probabilistic forest',
    progress: 15,
    total: 15,
    color: 'bg-yellow-400',
    icon: '🤖'
  },
  {
    id: 'dataset-cavern',
    title: 'Dataset Cavern',
    description: 'Explore the depths of data',
    progress: 9,
    total: 35,
    color: 'bg-blue-400',
    icon: '📊'
  },
  {
    id: 'supervised-learning',
    title: 'Supervised Learning',
    description: 'Master the art of guidance',
    progress: 19,
    total: 42,
    color: 'bg-green-400',
    icon: '👨‍🏫'
  }
];

const Education = () => {
  const navigate = useNavigate();

  return (
    <main className="relative pt-16 pb-20 w-full min-h-screen bg-gradient-to-b from-[#130122] to-[#0F1F3D] text-white">
      <TopNavBar />
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4 mt-5">Your Learning Journey</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-[#1A1F37] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={() => navigate(`/education/${course.id}`)}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-full ${course.color} flex items-center justify-center text-2xl mr-4`}>
                    {course.icon}
                  </div>
                  <h2 className="text-xl font-semibold">{course.title}</h2>
                </div>
                <p className="text-[#ffffff90] mb-4">{course.description}</p>
                <div className="flex items-center justify-between">
                  <div className="w-3/4">
                    <div className="bg-[#2A2F47] rounded-full h-4 mb-2">
                      <div
                        className="bg-gradient-to-r from-[#4CAF50] to-[#45a049] rounded-full h-4 flex items-center justify-end pr-2 text-xs font-bold transition-all duration-500 ease-out"
                        style={{ width: `${(course.progress / course.total) * 100}%` }}
                      >
                        {Math.round((course.progress / course.total) * 100)}%
                      </div>
                    </div>
                    <div className="text-sm text-[#ffffff90]">
                      {course.progress}/{course.total} lessons completed
                    </div>
                  </div>
                  <div className="bg-[#4CAF50] rounded-full p-2 animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNavBar />
    </main>
  );
};

export default Education;
