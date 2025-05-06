import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Reminder } from '../../types';
import { generateId } from '../../utils/helpers';

interface ReminderFormProps {
  classId: string;
  onSubmit: (reminder: Reminder) => void;
  onCancel: () => void;
  initialData?: Reminder;
}

const ReminderForm: React.FC<ReminderFormProps> = ({ 
  classId, 
  onSubmit, 
  onCancel, 
  initialData 
}) => {
  const [time, setTime] = useState(initialData?.time || 15);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const reminderData: Reminder = {
      id: initialData?.id || generateId(),
      classId,
      time,
      enabled: initialData?.enabled ?? true,
    };
    
    onSubmit(reminderData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md animate-fade-in">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Edit Reminder' : 'Add Reminder'}
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
            <label htmlFor="time" className="form-label">Remind me before class</label>
            <select
              id="time"
              value={time}
              onChange={(e) => setTime(parseInt(e.target.value))}
              className="form-input"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </select>
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
              {initialData ? 'Update Reminder' : 'Add Reminder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReminderForm;