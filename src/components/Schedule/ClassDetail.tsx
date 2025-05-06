import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, MapPin, User, FileText, Edit, Trash2, ArrowLeft, Bell } from 'lucide-react';
import { Class, Student, Reminder } from '../../types';
import { formatTime } from '../../utils/helpers';
import ClassForm from './ClassForm';
import DeleteConfirmation from '../common/DeleteConfirmation';
import ReminderForm from './ReminderForm';

interface ClassDetailProps {
  classData: Class;
  student: Student | undefined;
  reminders: Reminder[];
  onUpdate: (classData: Class) => void;
  onDelete: (id: string) => void;
  onAddReminder: (reminder: Reminder) => void;
  onUpdateReminder: (reminder: Reminder) => void;
  onDeleteReminder: (id: string) => void;
  students: Student[];
}

const ClassDetail: React.FC<ClassDetailProps> = ({ 
  classData, 
  student, 
  reminders,
  onUpdate, 
  onDelete,
  onAddReminder,
  onUpdateReminder,
  onDeleteReminder,
  students
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  
  const classReminders = reminders.filter((reminder) => reminder.classId === classData.id);
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleUpdate = (updatedClass: Class) => {
    onUpdate(updatedClass);
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    onDelete(classData.id);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  const handleCancelDelete = () => {
    setIsDeleting(false);
  };
  
  const handleAddReminder = () => {
    setIsAddingReminder(true);
  };
  
  const handleSubmitReminder = (reminder: Reminder) => {
    onAddReminder(reminder);
    setIsAddingReminder(false);
  };
  
  const handleCancelAddReminder = () => {
    setIsAddingReminder(false);
  };
  
  const handleToggleReminder = (reminder: Reminder) => {
    onUpdateReminder({
      ...reminder,
      enabled: !reminder.enabled,
    });
  };
  
  const handleDeleteReminder = (id: string) => {
    onDeleteReminder(id);
  };

  return (
    <div>
      <div className="mb-6">
        <Link to="/schedule" className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
          <ArrowLeft size={16} className="mr-1" />
          <span>Back to Schedule</span>
        </Link>
      </div>
      
      <div className="card mb-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">{classData.subject}</h2>
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              className="btn btn-outline flex items-center"
            >
              <Edit size={16} className="mr-1" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => setIsDeleting(true)}
              className="btn btn-danger flex items-center"
            >
              <Trash2 size={16} className="mr-1" />
              <span>Delete</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Class Details</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <User size={18} className="mr-3 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Student</p>
                  {student ? (
                    <Link to={`/students/${student.id}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                      {student.name}
                    </Link>
                  ) : (
                    <p className="text-red-500">Unknown Student</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar size={18} className="mr-3 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Days</p>
                  <p>{classData.days.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ')}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock size={18} className="mr-3 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                  <p>{formatTime(classData.startTime)} - {formatTime(classData.endTime)}</p>
                </div>
              </div>
              
              {classData.location && (
                <div className="flex items-start">
                  <MapPin size={18} className="mr-3 mt-1 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                    <a 
                      href={`https://maps.google.com/?q=${encodeURIComponent(classData.location)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      {classData.location}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Bell size={18} className="mr-2" />
              Reminders
            </h3>
            
            {classReminders.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 mb-4">No reminders set for this class</p>
            ) : (
              <div className="space-y-3 mb-4">
                {classReminders.map((reminder) => (
                  <div 
                    key={reminder.id} 
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={reminder.enabled}
                        onChange={() => handleToggleReminder(reminder)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2">
                        {reminder.time} minutes before class
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteReminder(reminder.id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <button
              onClick={handleAddReminder}
              className="btn btn-outline flex items-center"
            >
              <Bell size={16} className="mr-1" />
              <span>Add Reminder</span>
            </button>
          </div>
        </div>
        
        {classData.notes && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <FileText size={18} className="mr-2" />
              Notes
            </h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{classData.notes}</p>
          </div>
        )}
      </div>
      
      {isEditing && (
        <ClassForm
          initialData={classData}
          onSubmit={handleUpdate}
          onCancel={handleCancelEdit}
          students={students}
          isEditing={true}
        />
      )}
      
      {isDeleting && (
        <DeleteConfirmation
          title="Delete Class"
          message={`Are you sure you want to delete this ${classData.subject} class?`}
          onConfirm={handleDelete}
          onCancel={handleCancelDelete}
        />
      )}
      
      {isAddingReminder && (
        <ReminderForm
          classId={classData.id}
          onSubmit={handleSubmitReminder}
          onCancel={handleCancelAddReminder}
        />
      )}
    </div>
  );
};

export default ClassDetail;