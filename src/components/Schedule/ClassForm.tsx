import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Class, Student } from '../../types';
import { generateId } from '../../utils/helpers';

interface ClassFormProps {
  onSubmit: (classData: Class) => void;
  onCancel: () => void;
  initialData?: Class;
  students: Student[];
  isEditing?: boolean;
  preselectedStudentId?: string;
}

const ClassForm: React.FC<ClassFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData, 
  students,
  isEditing = false,
  preselectedStudentId
}) => {
  const [formData, setFormData] = useState<Omit<Class, 'id' | 'createdAt' | 'updatedAt'>>({
    subject: '',
    studentId: preselectedStudentId || '',
    days: [],
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    notes: '',
  });

  const daysOfWeek = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
  ];

  useEffect(() => {
    if (initialData) {
      const { id, createdAt, updatedAt, ...rest } = initialData;
      setFormData(rest);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setFormData({
        ...formData,
        days: [...formData.days, value],
      });
    } else {
      setFormData({
        ...formData,
        days: formData.days.filter((day) => day !== value),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.days.length === 0) {
      alert('Please select at least one day of the week');
      return;
    }
    
    const now = new Date().toISOString();
    
    const classData: Class = {
      id: initialData?.id || generateId(),
      ...formData,
      createdAt: initialData?.createdAt || now,
      updatedAt: now,
    };
    
    onSubmit(classData);
  };

  // Use student's address as location if available
  const handleUseStudentAddress = () => {
    const selectedStudent = students.find((student) => student.id === formData.studentId);
    
    if (selectedStudent && selectedStudent.address) {
      setFormData({
        ...formData,
        location: selectedStudent.address,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Edit Class' : 'Add New Class'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="form-group">
            <label htmlFor="subject" className="form-label">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="studentId" className="form-label">Student</label>
            <select
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Select a student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Days</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {daysOfWeek.map((day) => (
                <div key={day.value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={day.value}
                    value={day.value}
                    checked={formData.days.includes(day.value)}
                    onChange={handleDayChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor={day.value} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {day.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="startTime" className="form-label">Start Time</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="endTime" className="form-label">End Time</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <div className="flex justify-between items-center">
              <label htmlFor="location" className="form-label">Location</label>
              {formData.studentId && (
                <button
                  type="button"
                  onClick={handleUseStudentAddress}
                  className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Use student's address
                </button>
              )}
            </div>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="notes" className="form-label">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-input h-24"
            ></textarea>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {isEditing ? 'Update Class' : 'Add Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassForm;