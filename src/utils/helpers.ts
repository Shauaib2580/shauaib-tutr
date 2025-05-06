import { format, parseISO, isToday, isThisWeek, addMinutes } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { Class, Student, SalaryRecord, SubjectColor } from '../types';

// Generate unique ID
export const generateId = (): string => uuidv4();

// Format date
export const formatDate = (date: string, formatStr: string = 'PPP'): string => {
  try {
    return format(parseISO(date), formatStr);
  } catch (error) {
    console.error('Invalid date format:', error);
    return 'Invalid date';
  }
};

// Format time
export const formatTime = (time: string): string => {
  try {
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  } catch (error) {
    console.error('Invalid time format:', error);
    return time;
  }
};

// Get current month in YYYY-MM format
export const getCurrentMonth = (): string => {
  return format(new Date(), 'yyyy-MM');
};

// Filter classes by day
export const filterClassesByDay = (classes: Class[], date: Date): Class[] => {
  const dayOfWeek = format(date, 'EEEE').toLowerCase();
  return classes.filter((cls) => cls.days.includes(dayOfWeek));
};

// Filter today's classes
export const getTodayClasses = (classes: Class[]): Class[] => {
  const today = format(new Date(), 'EEEE').toLowerCase();
  return classes.filter((cls) => cls.days.includes(today));
};

// Get upcoming classes (next 7 days)
export const getUpcomingClasses = (classes: Class[]): Class[] => {
  // Get all classes for the next 7 days
  const result: Class[] = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    const dayClasses = filterClassesByDay(classes, date);
    result.push(...dayClasses);
  }
  
  // Remove duplicates (same class on different days)
  const uniqueClasses = result.filter((cls, index, self) => 
    index === self.findIndex((c) => c.id === cls.id)
  );
  
  return uniqueClasses;
};

// Calculate total monthly income
export const calculateMonthlyIncome = (students: Student[]): number => {
  return students.reduce((total, student) => total + student.monthlySalary, 0);
};

// Calculate paid income
export const calculatePaidIncome = (salaryRecords: SalaryRecord[], month: string): number => {
  return salaryRecords
    .filter((record) => record.month === month && record.status === 'paid')
    .reduce((total, record) => total + record.amount, 0);
};

// Calculate due income
export const calculateDueIncome = (salaryRecords: SalaryRecord[], month: string): number => {
  return salaryRecords
    .filter((record) => record.month === month && record.status === 'due')
    .reduce((total, record) => total + record.amount, 0);
};

// Get student by ID
export const getStudentById = (students: Student[], id: string): Student | undefined => {
  return students.find((student) => student.id === id);
};

// Get class by ID
export const getClassById = (classes: Class[], id: string): Class | undefined => {
  return classes.find((cls) => cls.id === id);
};

// Generate subject colors
export const generateSubjectColors = (classes: Class[]): SubjectColor => {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-cyan-500',
  ];
  
  const subjects = [...new Set(classes.map((cls) => cls.subject))];
  const subjectColors: SubjectColor = {};
  
  subjects.forEach((subject, index) => {
    subjectColors[subject] = colors[index % colors.length];
  });
  
  return subjectColors;
};

// Calculate class duration in minutes
export const calculateClassDuration = (startTime: string, endTime: string): number => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  
  return endMinutes - startMinutes;
};

// Calculate reminder time
export const calculateReminderTime = (
  classDate: Date,
  startTime: string,
  minutesBefore: number
): Date => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const classDateTime = new Date(classDate);
  classDateTime.setHours(hours, minutes, 0, 0);
  
  return addMinutes(classDateTime, -minutesBefore);
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Get days between two dates
export const getDaysBetweenDates = (startDate: Date, endDate: Date): string[] => {
  const days: string[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    days.push(format(currentDate, 'EEEE').toLowerCase());
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return [...new Set(days)]; // Remove duplicates
};

// Convert 24-hour time to Date object
export const timeToDate = (time: string): Date => {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

// Check if notification permission is granted
export const checkNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};

// Send notification
export const sendNotification = async (
  title: string,
  options: NotificationOptions
): Promise<void> => {
  const hasPermission = await checkNotificationPermission();
  
  if (hasPermission) {
    new Notification(title, options);
  }
};