import React from 'react';
import { Clock, MapPin, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Class, Student } from '../../types';
import { formatTime } from '../../utils/helpers';

interface TodayClassesListProps {
  classes: Class[];
  students: Student[];
  subjectColors: Record<string, string>;
}

const TodayClassesList: React.FC<TodayClassesListProps> = ({ classes, students, subjectColors }) => {
  if (classes.length === 0) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Today's Classes</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">No classes scheduled for today</p>
      </div>
    );
  }

  // Sort classes by start time
  const sortedClasses = [...classes].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Today's Classes</h2>
      <div className="space-y-4">
        {sortedClasses.map((cls) => {
          const student = students.find((s) => s.id === cls.studentId);
          const subjectColor = subjectColors[cls.subject] || 'bg-gray-500';
          
          return (
            <Link 
              key={cls.id} 
              to={`/schedule/class/${cls.id}`}
              className="block p-4 rounded-lg border border-gray-200 hover:border-primary-300 dark:border-gray-700 dark:hover:border-primary-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className={`w-3 h-3 rounded-full ${subjectColor} mr-2`}></span>
                  <h3 className="font-medium">{cls.subject}</h3>
                </div>
                <span className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {formatTime(cls.startTime)} - {formatTime(cls.endTime)}
                </span>
              </div>
              
              <div className="flex flex-col space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <User size={16} className="mr-2" />
                  <span>{student?.name || 'Unknown Student'}</span>
                </div>
                
                <div className="flex items-center">
                  <Clock size={16} className="mr-2" />
                  <span>{formatTime(cls.startTime)} - {formatTime(cls.endTime)}</span>
                </div>
                
                {cls.location && (
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2" />
                    <span>{cls.location}</span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TodayClassesList;