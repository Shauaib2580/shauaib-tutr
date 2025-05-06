import React from 'react';
import { Link } from 'react-router-dom';
import { Class, Student, SubjectColor } from '../../types';
import { formatTime } from '../../utils/helpers';

interface WeeklyScheduleProps {
  classes: Class[];
  students: Student[];
  subjectColors: SubjectColor;
}

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ classes, students, subjectColors }) => {
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  // Group classes by day
  const classesByDay: Record<string, Class[]> = {};
  
  daysOfWeek.forEach((day) => {
    classesByDay[day] = classes.filter((cls) => cls.days.includes(day));
  });
  
  // Sort classes by start time
  Object.keys(classesByDay).forEach((day) => {
    classesByDay[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
  });

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max grid grid-cols-7 gap-4">
        {daysOfWeek.map((day) => (
          <div key={day} className="min-w-[150px]">
            <h3 className="text-lg font-semibold mb-3 capitalize">{day}</h3>
            
            {classesByDay[day].length === 0 ? (
              <div className="p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-500 dark:text-gray-400">
                No classes
              </div>
            ) : (
              <div className="space-y-3">
                {classesByDay[day].map((cls) => {
                  const student = students.find((s) => s.id === cls.studentId);
                  const subjectColor = subjectColors[cls.subject] || 'bg-gray-500';
                  
                  return (
                    <Link
                      key={cls.id}
                      to={`/schedule/class/${cls.id}`}
                      className="block p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
                    >
                      <div className="flex items-center mb-2">
                        <span className={`w-3 h-3 rounded-full ${subjectColor} mr-2`}></span>
                        <h4 className="font-medium truncate">{cls.subject}</h4>
                      </div>
                      
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <p className="truncate">{student?.name || 'Unknown'}</p>
                        <p>{formatTime(cls.startTime)} - {formatTime(cls.endTime)}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklySchedule;