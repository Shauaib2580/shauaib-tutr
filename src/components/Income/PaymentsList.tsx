import React from 'react';
import { SalaryRecord, Student } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';

interface PaymentsListProps {
  salaryRecords: SalaryRecord[];
  students: Student[];
  selectedMonth: string;
  onToggleStatus: (record: SalaryRecord) => void;
  onEdit: (record: SalaryRecord) => void;
  onDelete: (id: string) => void;
}

const PaymentsList: React.FC<PaymentsListProps> = ({ 
  salaryRecords, 
  students, 
  selectedMonth,
  onToggleStatus,
  onEdit,
  onDelete
}) => {
  // Filter records for the selected month
  const monthRecords = salaryRecords.filter((record) => record.month === selectedMonth);
  
  if (monthRecords.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No payment records for this month</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <h2 className="text-xl font-semibold mb-4">Payment Records</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Student
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Paid Date
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {monthRecords.map((record) => {
              const student = students.find((s) => s.id === record.studentId);
              
              return (
                <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {student?.name || 'Unknown Student'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900 dark:text-white">
                      {formatCurrency(record.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onToggleStatus(record)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        record.status === 'paid'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}
                    >
                      {record.status === 'paid' ? 'Paid' : 'Due'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {record.paidDate ? formatDate(record.paidDate, 'PP') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(record)}
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(record.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsList;