import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import StudentDetailComponent from '../components/Students/StudentDetail';
import { generateSubjectColors } from '../utils/helpers';

const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const { students, classes } = state;
  
  const student = students.find((s) => s.id === id);
  const subjectColors = generateSubjectColors(classes);
  
  const handleUpdateStudent = (updatedStudent: typeof student) => {
    if (updatedStudent) {
      dispatch({ type: 'UPDATE_STUDENT', payload: updatedStudent });
    }
  };
  
  const handleDeleteStudent = (studentId: string) => {
    dispatch({ type: 'DELETE_STUDENT', payload: studentId });
    navigate('/students');
  };
  
  if (!student) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">Student not found</p>
      </div>
    );
  }

  return (
    <StudentDetailComponent
      student={student}
      classes={classes}
      onUpdate={handleUpdateStudent}
      onDelete={handleDeleteStudent}
      subjectColors={subjectColors}
    />
  );
};

export default StudentDetail;