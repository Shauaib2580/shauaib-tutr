import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, DollarSign, FileText, Calendar, Clock, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { Student, Class } from '../../types';
import { formatCurrency, formatTime } from '../../utils/helpers';
import StudentForm from './StudentForm';
import DeleteConfirmation from '../common/DeleteConfirmation';

interface StudentDetailProps {
  student: Student;
  classes: Class[];
  onUpdate: (student: Student) => void;
  onDelete: (id: string) => void;
  subjectColors: Record<string, string>;
}

const StudentDetail: React.FC<StudentDetailProps> = ({ 
  student, 
  classes, 
  onUpdate, 
  onDelete,
  subjectColors
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const studentClasses = classes.filter((cls) => cls.studentId === student.id);
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleUpdate = (updatedStudent: Student) => {
    onUpdate(updatedStudent);
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    onDelete(student.id);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  const handleCancelDelete = () => {
    setIsDeleting(false);
  };

  return (
    <div>
      <div className="mb-6">
        <Link to="/students" className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
          <ArrowLeft size={16} className="mr-1" />
          <span>Back to Students</span>
        </Link>
      </div>
      
      <div className="card mb-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">{student.name}</h2>
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
            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
            <div className="space-y-3">
              {student.phone && (
                <div className="flex items-center">
                  <Phone size={18} className="mr-3 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <a href={`tel:${student.phone}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                      {student.phone}
                    </a>
                  </div>
                </div>
              )}
              
              {student.address && (
                <div className="flex items-start">
                  <MapPin size={18} className="mr-3 mt-1 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                    <a 
                      href={`https://maps.google.com/?q=${encodeURIComponent(student.address)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      {student.address}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <DollarSign size={18} className="mr-3 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Salary</p>
                  <p className="font-medium">{formatCurrency(student.monthlySalary)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar size={18} className="mr-3 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Payment Status</p>
                  <span className={`badge ${student.salaryStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                    {student.salaryStatus === 'paid' ? 'Paid' : 'Due'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {student.notes && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <FileText size={18} className="mr-2" />
              Notes
            </h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{student.notes}</p>
          </div>
        )}
      </div>
      
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Classes</h3>
        
        {studentClasses.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">No classes scheduled for this student</p>
        ) : (
          <div className="space-y-4">
            {studentClasses.map((cls) => {
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
                      <h4 className="font-medium">{cls.subject}</h4>
                    </div>
                    <span className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {cls.days.map(day => day.charAt(0).toUpperCase() + day.slice(1, 3)).join(', ')}
                    </span>
                  </div>
                  
                  <div className="flex flex-col space-y-2 text-sm text-gray-600 dark:text-gray-400">
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
        )}
        
        <div className="mt-6">
          <Link 
            to="/schedule/new" 
            state={{ studentId: student.id }}
            className="btn btn-primary"
          >
            Add New Class
          </Link>
        </div>
      </div>
      
      {isEditing && (
        <StudentForm
          initialData={student}
          onSubmit={handleUpdate}
          onCancel={handleCancelEdit}
          isEditing={true}
        />
      )}
      
      {isDeleting && (
        <DeleteConfirmation
          title="Delete Student"
          message={`Are you sure you want to delete ${student.name}? This will also delete all associated classes and payment records.`}
          onConfirm={handleDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default StudentDetail;