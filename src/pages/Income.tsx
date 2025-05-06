import React, { useState } from 'react';
import { Plus, DollarSign } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import MonthlyIncomeChart from '../components/Income/MonthlyIncomeChart';
import PaymentsList from '../components/Income/PaymentsList';
import SalaryForm from '../components/Income/SalaryForm';
import DeleteConfirmation from '../components/common/DeleteConfirmation';
import EmptyState from '../components/common/EmptyState';
import { SalaryRecord } from '../types';
import { getCurrentMonth } from '../utils/helpers';

const Income: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [editingPayment, setEditingPayment] = useState<SalaryRecord | null>(null);
  const [deletingPaymentId, setDeletingPaymentId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  
  const { students, salaryRecords } = state;
  
  const handleAddPayment = () => {
    setIsAddingPayment(true);
  };
  
  const handleEditPayment = (payment: SalaryRecord) => {
    setEditingPayment(payment);
  };
  
  const handleDeletePayment = (id: string) => {
    setDeletingPaymentId(id);
  };
  
  const handleSubmitPayment = (payment: SalaryRecord) => {
    if (editingPayment) {
      dispatch({ type: 'UPDATE_SALARY_RECORD', payload: payment });
      setEditingPayment(null);
    } else {
      dispatch({ type: 'ADD_SALARY_RECORD', payload: payment });
      setIsAddingPayment(false);
    }
  };
  
  const handleCancelAddEdit = () => {
    setIsAddingPayment(false);
    setEditingPayment(null);
  };
  
  const confirmDeletePayment = () => {
    if (deletingPaymentId) {
      dispatch({ type: 'DELETE_SALARY_RECORD', payload: deletingPaymentId });
      setDeletingPaymentId(null);
    }
  };
  
  const cancelDeletePayment = () => {
    setDeletingPaymentId(null);
  };
  
  const handleTogglePaymentStatus = (payment: SalaryRecord) => {
    const now = new Date().toISOString();
    
    const updatedPayment: SalaryRecord = {
      ...payment,
      status: payment.status === 'paid' ? 'due' : 'paid',
      paidDate: payment.status === 'paid' ? undefined : now,
    };
    
    dispatch({ type: 'UPDATE_SALARY_RECORD', payload: updatedPayment });
  };
  
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Income Tracking</h1>
        <button
          onClick={handleAddPayment}
          className="btn btn-primary flex items-center"
        >
          <Plus size={18} className="mr-1" />
          <span>Add Payment</span>
        </button>
      </div>
      
      {salaryRecords.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center">
            <label htmlFor="month-select" className="mr-2 font-medium">
              Select Month:
            </label>
            <select
              id="month-select"
              value={selectedMonth}
              onChange={handleMonthChange}
              className="form-input w-auto"
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
        </div>
      )}
      
      {salaryRecords.length === 0 ? (
        <EmptyState
          title="No payment records yet"
          description="Add your first payment record to start tracking your income."
          icon={<DollarSign size={64} />}
          actionText="Add Your First Payment"
          onAction={handleAddPayment}
        />
      ) : (
        <>
          <div className="mb-6">
            <MonthlyIncomeChart 
              salaryRecords={salaryRecords} 
              selectedMonth={selectedMonth} 
            />
          </div>
          
          <PaymentsList 
            salaryRecords={salaryRecords} 
            students={students} 
            selectedMonth={selectedMonth}
            onToggleStatus={handleTogglePaymentStatus}
            onEdit={handleEditPayment}
            onDelete={handleDeletePayment}
          />
        </>
      )}
      
      {(isAddingPayment || editingPayment) && (
        <SalaryForm
          onSubmit={handleSubmitPayment}
          onCancel={handleCancelAddEdit}
          initialData={editingPayment || undefined}
          students={students}
          isEditing={!!editingPayment}
          currentMonth={selectedMonth}
        />
      )}
      
      {deletingPaymentId && (
        <DeleteConfirmation
          title="Delete Payment Record"
          message="Are you sure you want to delete this payment record?"
          onConfirm={confirmDeletePayment}
          onCancel={cancelDeletePayment}
        />
      )}
    </div>
  );
};

export default Income;