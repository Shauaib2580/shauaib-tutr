import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ClassDetailComponent from '../components/Schedule/ClassDetail';
import { Reminder } from '../types';
import { generateId } from '../utils/helpers';

const ClassDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const { classes, students, reminders } = state;
  
  const classData = classes.find((c) => c.id === id);
  const student = classData ? students.find((s) => s.id === classData.studentId) : undefined;
  const classReminders = reminders.filter((r) => r.classId === id);
  
  const handleUpdateClass = (updatedClass: typeof classData) => {
    if (updatedClass) {
      dispatch({ type: 'UPDATE_CLASS', payload: updatedClass });
    }
  };
  
  const handleDeleteClass = (classId: string) => {
    dispatch({ type: 'DELETE_CLASS', payload: classId });
    navigate('/schedule');
  };
  
  const handleAddReminder = (reminder: Reminder) => {
    dispatch({ type: 'ADD_REMINDER', payload: reminder });
  };
  
  const handleUpdateReminder = (reminder: Reminder) => {
    dispatch({ type: 'UPDATE_REMINDER', payload: reminder });
  };
  
  const handleDeleteReminder = (reminderId: string) => {
    dispatch({ type: 'DELETE_REMINDER', payload: reminderId });
  };
  
  if (!classData) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">Class not found</p>
      </div>
    );
  }

  return (
    <ClassDetailComponent
      classData={classData}
      student={student}
      reminders={classReminders}
      onUpdate={handleUpdateClass}
      onDelete={handleDeleteClass}
      onAddReminder={handleAddReminder}
      onUpdateReminder={handleUpdateReminder}
      onDeleteReminder={handleDeleteReminder}
      students={students}
    />
  );
};

export default ClassDetail;