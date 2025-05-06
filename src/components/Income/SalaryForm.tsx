import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { SalaryRecord, Student } from '../../types';
import { generateId, formatCurrency } from '../../utils/helpers';

interface SalaryFormProps {
  onSubmit: (salaryRecord: SalaryRecord) => void;
  onCancel: () => void;
  initialData?: SalaryRecord;
  students: Student[];
  isEditing?: boolean;
  currentMonth: string;
}

const SalaryForm: React.FC<SalaryFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData, 
  students,
  isEditing = false,
  currentMonth
}) => {
  const [formData, setFormData] = useState<Omit<SalaryRecord, 'id'>>({
    studentId: '',
    amount: 0,
    month: currentMonth,
    status: 'due',
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      const { id, ...rest } = initialData;
      setFormData(rest);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
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

  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const studentId = e.target.value;
    const student = students.find((s) => s.id === studentId);
    
    setFormData({
      ...formData,
      studentId,
      amount: student ? student.monthlySalary : 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date().toISOString();
    
    const salaryData: SalaryRecord = {
      id: initialData?.id || generateId(),
      ...formData,
      paidDate: formData.status === 'paid' ? now : undefined,
    };
    
    onSubmit(salaryData);
  };

  // Format month for display
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Edit Payment Record' : 'Add Payment Record'}
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
            <label htmlFor="month" className="form-label">Month</label>
            <select
              id="month"
              name="month"
              value={formData.month}
              onChange={handleChange}
              className="form-input"
              required
            >
              {/* Generate options for the last 12 months */}
              {Array.from({ length: 12 }, (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                return (
                  <option key={monthStr} value={monthStr}>
                    {formatMonth(monthStr)}
                  </option>
                );
              })}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="studentId" className="form-label">Student</label>
            <select
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleStudentChange}
              className="form-input"
              required
              disabled={isEditing}
            >
              <option value="">Select a student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} ({formatCurrency(student.monthlySalary)})
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="amount" className="form-label">Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="form-input"
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="status" className="form-label">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
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
              {isEditing ? 'Update Payment' : 'Add Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalaryForm;