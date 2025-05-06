import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Student } from '../../types';
import { generateId } from '../../utils/helpers';

interface StudentFormProps {
  onSubmit: (student: Student) => void;
  onCancel: () => void;
  initialData?: Student;
  isEditing?: boolean;
}

const StudentForm: React.FC<StudentFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData, 
  isEditing = false 
}) => {
  const [formData, setFormData] = useState<Omit<Student, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    phone: '',
    address: '',
    location: {},
    monthlySalary: 0,
    salaryStatus: 'due',
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      const { id, createdAt, updatedAt, ...rest } = initialData;
      setFormData(rest);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'monthlySalary') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date().toISOString();
    
    const studentData: Student = {
      id: initialData?.id || generateId(),
      ...formData,
      createdAt: initialData?.createdAt || now,
      updatedAt: now,
    };
    
    onSubmit(studentData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Edit Student' : 'Add New Student'}
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
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address" className="form-label">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="monthlySalary" className="form-label">Monthly Salary</label>
            <input
              type="number"
              id="monthlySalary"
              name="monthlySalary"
              value={formData.monthlySalary}
              onChange={handleChange}
              className="form-input"
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="salaryStatus" className="form-label">Salary Status</label>
            <select
              id="salaryStatus"
              name="salaryStatus"
              value={formData.salaryStatus}
              onChange={handleChange}
              className="form-input"
            >
              <option value="paid">Paid</option>
              <option value="due">Due</option>
            </select>
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
              {isEditing ? 'Update Student' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;