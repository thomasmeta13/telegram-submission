import { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MiniAppContext } from "../../routes/MiniAppContextProvider";
import LessonPath from "../../components/LessonPath";

const CourseDetails = () => {
  const { courseSlug } = useParams();
  const navigate = useNavigate();
  const { educationCourses } = useContext(MiniAppContext);

  if (!educationCourses) {
    return <div>Loading...</div>;
  }

  const course = educationCourses.find((c: { slug: string }) => c.slug === courseSlug);

  if (!course) {
    return <div>Course not found</div>;
  }

  const completedLessons = course.lessons.filter((lesson: { completed: boolean }) => lesson.completed).length;
  const totalLessons = course.lessons.length;
  const completionPercentage = Math.round((completedLessons / totalLessons) * 100);

  return (
    <main className="relative w-full min-h-screen bg-[#111827] text-white">
      <header className="bg-[#4CAF50] p-4 flex justify-between items-center rounded-lg mx-4 mt-4">
        <button onClick={() => navigate(-1)} className="text-white p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-sm font-bold">SECTION 1, UNIT 1</h2>
          <h1 className="text-xl font-bold">{course.title}</h1>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold">{completionPercentage}% Complete</p>
          <p className="text-xs">{completedLessons}/{totalLessons} Lessons</p>
        </div>
      </header>

      <LessonPath
        courseId={course.slug}
        section={1}
        unit={1}
        unitTitle={course.title}
        lessons={course.lessons.map((lesson: { id: string; title: string; completed: boolean }, index: number) => ({
          id: lesson.id,
          title: lesson.title,
          xp: 10, // You might want to add an XP field to your lesson data
          completed: index === 0 ? false : lesson.completed // First lesson is always active
        }))}
      />
    </main>
  );
};

export default CourseDetails;