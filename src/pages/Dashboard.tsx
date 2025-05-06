import React from 'react';
import { Users, Calendar, DollarSign, Clock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import DashboardCard from '../components/Dashboard/DashboardCard';
import TodayClassesList from '../components/Dashboard/TodayClassesList';
import UpcomingClassesList from '../components/Dashboard/UpcomingClassesList';
import DuePaymentsList from '../components/Dashboard/DuePaymentsList';
import IncomeChart from '../components/Dashboard/IncomeChart';
import { 
  getTodayClasses, 
  getUpcomingClasses, 
  generateSubjectColors,
  getCurrentMonth,
  formatCurrency
} from '../utils/helpers';

const Dashboard: React.FC = () => {
  const { state } = useAppContext();
  const { students, classes, salaryRecords } = state;
  
  const todayClasses = getTodayClasses(classes);
  const upcomingClasses = getUpcomingClasses(classes);
  const subjectColors = generateSubjectColors(classes);
  const currentMonth = getCurrentMonth();
  
  // Calculate total monthly income
  const totalMonthlyIncome = students.reduce((total, student) => total + student.monthlySalary, 0);
  
  // Calculate due payments
  const duePayments = salaryRecords.filter(
    (record) => record.month === currentMonth && record.status === 'due'
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Students"
          value={students.length.toString()}
          icon={<Users size={24} className="text-primary-600 dark:text-primary-400" />}
          color="border-primary-500"
          link="/students"
        />
        
        <DashboardCard
          title="Total Classes"
          value={classes.length.toString()}
          icon={<Calendar size={24} className="text-secondary-600 dark:text-secondary-400" />}
          color="border-secondary-500"
          link="/schedule"
        />
        
        <DashboardCard
          title="Monthly Income"
          value={formatCurrency(totalMonthlyIncome)}
          icon={<DollarSign size={24} className="text-green-600 dark:text-green-400" />}
          color="border-green-500"
          link="/income"
        />
        
        <DashboardCard
          title="Due Payments"
          value={duePayments.length.toString()}
          icon={<Clock size={24} className="text-red-600 dark:text-red-400" />}
          color="border-red-500"
          link="/income"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TodayClassesList 
          classes={todayClasses} 
          students={students} 
          subjectColors={subjectColors} 
        />
        
        <UpcomingClassesList 
          classes={upcomingClasses} 
          students={students} 
          subjectColors={subjectColors} 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncomeChart 
          salaryRecords={salaryRecords} 
          currentMonth={currentMonth} 
        />
        
        <DuePaymentsList 
          students={students} 
          salaryRecords={salaryRecords} 
          currentMonth={currentMonth} 
        />
      </div>
    </div>
  );
};

export default Dashboard;