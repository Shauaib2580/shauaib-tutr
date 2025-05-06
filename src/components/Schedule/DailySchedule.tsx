import React from 'react';
import { Link } from 'react-router-dom';
import { Class, Student, SubjectColor } from '../../types';
import { formatTime } from '../../utils/helpers';

interface DailyScheduleProps {
  classes: Class[];
  students: Student[];
  subjectColors: SubjectColor;
  selectedDay: string;
}

const DailySchedule: React.FC<DailyScheduleProps> = ({ 
  classes, 
  students, 
  subjectColors,
  selectedDay
}) => {
  // Filter classes for the selected day
  const dayClasses = classes.filter((cls) => cls.days.includes(selectedDay));
  
  // Sort classes by start time
  const sortedClasses = [...dayClasses].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  if (sortedClasses.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No classes scheduled for {selectedDay}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedClasses.map((cls) => {
        const student = students.find((s) => s.id === cls.studentId);
        const subjectColor = subjectColors[cls.subject] || 'bg-gray-500';
        
        return (
          <Link 
            key={cls.id} 
            to={`/schedule/class/${cls.id}`}
            className="block card hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <span className={`w-4 h-4 rounded-full ${subjectColor} mr-2`}></span>
                <h3 className="text-lg font-semibold">{cls.subject}</h3>
              </div>
              <span className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {formatTime(cls.startTime)} - {formatTime(cls.endTime)}
              </span>
            </div>
            
            <div className="flex flex-col md:flex-row md:justify-between">
              <div className="mb-2 md:mb-0">
                <p className="text-sm text-gray-500 dark:text-gray-400">Student</p>
                <p className="font-medium">{student?.name || 'Unknown Student'}</p>
              </div>
              
              {cls.location && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                  <p className="font-medium">{cls.location}</p>
                </div>
              )}
            </div>
            
            {cls.notes && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Notes</p>
                <p className="line-clamp-2">{cls.notes}</p>
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default DailySchedule;