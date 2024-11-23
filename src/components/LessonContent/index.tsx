import React from 'react';
import { useParams } from 'react-router-dom';

const LessonContent: React.FC = () => {
  const { courseId, lessonId } = useParams();

  return (
    <div>
      <h1>Lesson Content</h1>
      <p>Course ID: {courseId}</p>
      <p>Lesson ID: {lessonId}</p>
      {/* Add your lesson content here */}
    </div>
  );
};

export default LessonContent;