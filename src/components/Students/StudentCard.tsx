import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, DollarSign, FileText } from 'lucide-react';
import { Student } from '../../types';
import { formatCurrency } from '../../utils/helpers';

interface StudentCardProps {
  student: Student;
  onEdit: () => void;
  onDelete: () => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onEdit, onDelete }) => {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold">{student.name}</h3>
        <span className={`badge ${student.salaryStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>
          {student.salaryStatus === 'paid' ? 'Paid' : 'Due'}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        {student.phone && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Phone size={16} className="mr-2" />
            <a href={`tel:${student.phone}`} className="hover:text-primary-600 dark:hover:text-primary-400">
              {student.phone}
            </a>
          </div>
        )}
        
        {student.address && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPin size={16} className="mr-2" />
            <a 
              href={`https://maps.google.com/?q=${encodeURIComponent(student.address)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary-600 dark:hover:text-primary-400"
            >
              {student.address}
            </a>
          </div>
        )}
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <DollarSign size={16} className="mr-2" />
          <span>{formatCurrency(student.monthlySalary)} / month</span>
        </div>
        
        {student.notes && (
          <div className="flex items-start text-sm text-gray-600 dark:text-gray-400">
            <FileText size={16} className="mr-2 mt-1 flex-shrink-0" />
            <p className="line-clamp-2">{student.notes}</p>
          </div>
        )}
      </div>
      
      <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Link 
          to={`/students/${student.id}`}
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
        >
          View Details
        </Link>
        
        <div className="space-x-2">
          <button
            onClick={onEdit}
            className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 font-medium"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-sm text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;