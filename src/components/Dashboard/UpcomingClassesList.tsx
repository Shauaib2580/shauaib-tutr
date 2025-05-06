import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Class, Student } from '../../types';
import { formatTime } from '../../utils/helpers';

interface UpcomingClassesListProps {
  classes: Class[];
  students: Student[];
  subjectColors: Record<string, string>;
}

const UpcomingClassesList: React.FC<UpcomingClassesListProps> = ({ classes, students, subjectColors }) => {
  if (classes.length === 0) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Upcoming Classes</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">No upcoming classes</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Upcoming Classes</h2>
      <div className="space-y-4">
        {classes.slice(0, 5).map((cls) => {
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
                  {cls.days.map(day => day.charAt(0).toUpperCase() + day.slice(1, 3)).join(', ')}
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
                
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  <span>{cls.days.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ')}</span>
                </div>
              </div>
            </Link>
          );
        })}
        
        {classes.length > 5 && (
          <Link to="/schedule" className="block text-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
            View all {classes.length} upcoming classes
          </Link>
        )}
      </div>
    </div>
  );
};

export default UpcomingClassesList;