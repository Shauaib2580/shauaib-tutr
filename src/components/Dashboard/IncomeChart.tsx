import React from 'react';
import { SalaryRecord } from '../../types';
import { formatCurrency } from '../../utils/helpers';

interface IncomeChartProps {
  salaryRecords: SalaryRecord[];
  currentMonth: string;
}

const IncomeChart: React.FC<IncomeChartProps> = ({ salaryRecords, currentMonth }) => {
  // Calculate total, paid, and due amounts
  const totalAmount = salaryRecords
    .filter((record) => record.month === currentMonth)
    .reduce((sum, record) => sum + record.amount, 0);
  
  const paidAmount = salaryRecords
    .filter((record) => record.month === currentMonth && record.status === 'paid')
    .reduce((sum, record) => sum + record.amount, 0);
  
  const dueAmount = totalAmount - paidAmount;
  
  // Calculate percentages
  const paidPercentage = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;
  const duePercentage = totalAmount > 0 ? (dueAmount / totalAmount) * 100 : 0;
  
  // Format month for display
  const [year, month] = currentMonth.split('-');
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const displayMonth = `${monthNames[parseInt(month) - 1]} ${year}`;

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Income Summary - {displayMonth}</h2>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Income</span>
          <span className="text-lg font-bold">{formatCurrency(totalAmount)}</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Paid</span>
          <span className="text-green-600 dark:text-green-400 font-medium">{formatCurrency(paidAmount)} ({paidPercentage.toFixed(0)}%)</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${paidPercentage}%` }}></div>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Due</span>
          <span className="text-red-600 dark:text-red-400 font-medium">{formatCurrency(dueAmount)} ({duePercentage.toFixed(0)}%)</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${duePercentage}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default IncomeChart;