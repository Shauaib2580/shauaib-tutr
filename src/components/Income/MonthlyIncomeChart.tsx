import React from 'react';
import { SalaryRecord } from '../../types';
import { formatCurrency } from '../../utils/helpers';

interface MonthlyIncomeChartProps {
  salaryRecords: SalaryRecord[];
  selectedMonth: string;
}

const MonthlyIncomeChart: React.FC<MonthlyIncomeChartProps> = ({ 
  salaryRecords, 
  selectedMonth 
}) => {
  // Filter records for the selected month
  const monthRecords = salaryRecords.filter((record) => record.month === selectedMonth);
  
  // Calculate total, paid, and due amounts
  const totalAmount = monthRecords.reduce((sum, record) => sum + record.amount, 0);
  const paidAmount = monthRecords
    .filter((record) => record.status === 'paid')
    .reduce((sum, record) => sum + record.amount, 0);
  const dueAmount = totalAmount - paidAmount;
  
  // Calculate percentages
  const paidPercentage = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;
  const duePercentage = totalAmount > 0 ? (dueAmount / totalAmount) * 100 : 0;
  
  // Format month for display
  const [year, month] = selectedMonth.split('-');
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const displayMonth = `${monthNames[parseInt(month) - 1]} ${year}`;

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-6">Income Summary - {displayMonth}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Income</p>
          <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
        </div>
        
        <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
          <p className="text-sm text-green-600 dark:text-green-300">Paid</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-300">
            {formatCurrency(paidAmount)}
          </p>
          <p className="text-sm text-green-500 dark:text-green-400">
            {paidPercentage.toFixed(0)}% of total
          </p>
        </div>
        
        <div className="p-4 bg-red-50 dark:bg-red-900 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-300">Due</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-300">
            {formatCurrency(dueAmount)}
          </p>
          <p className="text-sm text-red-500 dark:text-red-400">
            {duePercentage.toFixed(0)}% of total
          </p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Income</span>
          <span className="text-sm font-medium">{formatCurrency(totalAmount)}</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Paid</span>
          <span className="text-sm font-medium text-green-600 dark:text-green-400">
            {formatCurrency(paidAmount)} ({paidPercentage.toFixed(0)}%)
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${paidPercentage}%` }}></div>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Due</span>
          <span className="text-sm font-medium text-red-600 dark:text-red-400">
            {formatCurrency(dueAmount)} ({duePercentage.toFixed(0)}%)
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${duePercentage}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyIncomeChart;