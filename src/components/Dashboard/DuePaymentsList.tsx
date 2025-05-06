import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, DollarSign, User } from 'lucide-react';
import { Student, SalaryRecord } from '../../types';
import { formatCurrency } from '../../utils/helpers';

interface DuePaymentsListProps {
  students: Student[];
  salaryRecords: SalaryRecord[];
  currentMonth: string;
}

const DuePaymentsList: React.FC<DuePaymentsListProps> = ({ students, salaryRecords, currentMonth }) => {
  // Get due payments for current month
  const duePayments = salaryRecords.filter(
    (record) => record.month === currentMonth && record.status === 'due'
  );
  
  if (duePayments.length === 0) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Due Payments</h2>
        <div className="flex items-center justify-center py-4 text-green-600 dark:text-green-400">
          <AlertCircle size={20} className="mr-2" />
          <p>No due payments for this month</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Due Payments</h2>
      <div className="space-y-4">
        {duePayments.map((payment) => {
          const student = students.find((s) => s.id === payment.studentId);
          
          if (!student) return null;
          
          return (
            <Link 
              key={payment.id} 
              to={`/income/payment/${payment.id}`}
              className="block p-4 rounded-lg border border-red-200 hover:border-red-300 dark:border-red-900 dark:hover:border-red-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <User size={18} className="mr-2 text-red-500 dark:text-red-400" />
                  <h3 className="font-medium">{student.name}</h3>
                </div>
                <span className="text-sm bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded">
                  Due
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <DollarSign size={16} className="mr-1" />
                  <span>{formatCurrency(payment.amount)}</span>
                </div>
                <span className="text-red-600 dark:text-red-400 font-medium">
                  Payment Due
                </span>
              </div>
            </Link>
          );
        })}
        
        {duePayments.length > 5 && (
          <Link to="/income" className="block text-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
            View all {duePayments.length} due payments
          </Link>
        )}
      </div>
    </div>
  );
};

export default DuePaymentsList;