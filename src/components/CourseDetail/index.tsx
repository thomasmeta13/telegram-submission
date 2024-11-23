import { useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MiniAppContext } from '../../routes/MiniAppContextProvider';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { educationCourses } = useContext(MiniAppContext);

  if (!educationCourses) {
    return <div>Loading...</div>;
  }

  const course = educationCourses.find((c: { id: string }) => c.id === courseId);

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <main className="relative pt-14 pb-20 w-full min-h-full bg-[url('/images/background/workforce_tab_color.png')] bg-cover bg-top bg-no-repeat bg-[#5200FF64]">
      <nav className="fixed top-0 left-0 right-0 z-10">
        <div className="flex justify-between items-center bg-gradient-to-b px-6 from-[#130122] to-[#0F1F3D] rounded-b-2xl">
          <button onClick={() => navigate(-1)} className="p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="p-3 flex justify-center">
            <div className="text-lg text-white font-semibold">{course.title}</div>
          </div>
          <div className="w-6"></div>
        </div>
      </nav>

      <div className="px-4 pt-4">
        <div className={`flex items-center mt-2 border-[1px] border-[#ffffff16] p-3 rounded-3xl ${course.color || 'bg-blue-400'}`}>
          <div className="w-12 h-12 mr-3 rounded-lg bg-white flex items-center justify-center text-2xl">
            {course.icon || '📚'}
          </div>
          <div className="flex-grow">
            <div className="text-white font-semibold text-lg">{course.title}</div>
            <div className="text-sm text-[#ffffff90]">{course.description}</div>
            <div className="mt-1 bg-[#00000040] rounded-full h-2">
              <div
                className="bg-white rounded-full h-2"
                style={{ width: `${(course.progress / course.total) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-[#ffffff90] mt-1">
              {course.progress}/{course.total}
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-white mt-6 mb-4">Course Content</h2>
        <div className="space-y-4">
          {course.lessons.map((lesson: { id: string; title: string; description: string; completed: boolean }, index: number) => (
            <Link 
              key={lesson.id} 
              to={`/education/${courseId}/lesson/${lesson.id}`}
              className="block bg-[#1A1F37] rounded-lg p-4 hover:bg-[#2A2F47] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Lesson {index + 1}: {lesson.title}</h3>
                  <p className="text-sm text-[#ffffff90]">{lesson.description}</p>
                </div>
                {lesson.completed ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#ffffff90]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default CourseDetail;