import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Calendar, View as ViewDay, View as ViewWeek } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import ClassForm from '../components/Schedule/ClassForm';
import WeeklySchedule from '../components/Schedule/WeeklySchedule';
import DailySchedule from '../components/Schedule/DailySchedule';
import EmptyState from '../components/common/EmptyState';
import { Class, ViewMode } from '../types';
import { generateSubjectColors } from '../utils/helpers';

const Schedule: React.FC = () => {
  const location = useLocation();
  const { state, dispatch } = useAppContext();
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [selectedDay, setSelectedDay] = useState<string>(
    new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  );
  
  const { students, classes } = state;
  const subjectColors = generateSubjectColors(classes);
  
  // Check if we have a preselected student from navigation
  const preselectedStudentId = location.state?.studentId;
  
  const daysOfWeek = [
    { value: 'monday', label: 'Mon' },
    { value: 'tuesday', label: 'Tue' },
    { value: 'wednesday', label: 'Wed' },
    { value: 'thursday', label: 'Thu' },
    { value: 'friday', label: 'Fri' },
    { value: 'saturday', label: 'Sat' },
    { value: 'sunday', label: 'Sun' },
  ];
  
  const handleAddClass = () => {
    setIsAddingClass(true);
  };
  
  const handleSubmitClass = (classData: Class) => {
    dispatch({ type: 'ADD_CLASS', payload: classData });
    setIsAddingClass(false);
  };
  
  const handleCancelAddClass = () => {
    setIsAddingClass(false);
  };
  
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };
  
  const handleDayChange = (day: string) => {
    setSelectedDay(day);
    if (viewMode !== 'day') {
      setViewMode('day');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Class Schedule</h1>
        <button
          onClick={handleAddClass}
          className="btn btn-primary flex items-center"
        >
          <Plus size={18} className="mr-1" />
          <span>Add Class</span>
        </button>
      </div>
      
      {classes.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex space-x-2">
              <button
                onClick={() => handleViewModeChange('week')}
                className={`btn ${
                  viewMode === 'week' ? 'btn-primary' : 'btn-outline'
                } flex items-center`}
              >
                <ViewWeek size={18} className="mr-1" />
                <span>Week</span>
              </button>
              <button
                onClick={() => handleViewModeChange('day')}
                className={`btn ${
                  viewMode === 'day' ? 'btn-primary' : 'btn-outline'
                } flex items-center`}
              >
                <ViewDay size={18} className="mr-1" />
                <span>Day</span>
              </button>
            </div>
            
            {viewMode === 'day' && (
              <div className="flex space-x-1 overflow-x-auto">
                {daysOfWeek.map((day) => (
                  <button
                    key={day.value}
                    onClick={() => handleDayChange(day.value)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      selectedDay === day.value
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {classes.length === 0 ? (
        <EmptyState
          title="No classes scheduled"
          description="Add your first class to start managing your tutoring schedule."
          icon={<Calendar size={64} />}
          actionText="Add Your First Class"
          onAction={handleAddClass}
        />
      ) : viewMode === 'week' ? (
        <WeeklySchedule 
          classes={classes} 
          students={students} 
          subjectColors={subjectColors} 
        />
      ) : (
        <DailySchedule 
          classes={classes} 
          students={students} 
          subjectColors={subjectColors} 
          selectedDay={selectedDay}
        />
      )}
      
      {isAddingClass && (
        <ClassForm
          onSubmit={handleSubmitClass}
          onCancel={handleCancelAddClass}
          students={students}
          preselectedStudentId={preselectedStudentId}
        />
      )}
    </div>
  );
};

export default Schedule;