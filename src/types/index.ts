export interface Student {
  id: string;
  name: string;
  phone: string;
  address: string;
  location: {
    lat?: number;
    lng?: number;
  };
  monthlySalary: number;
  salaryStatus: 'paid' | 'due';
  notes: string;
  createdAt: string;
  updatedAt: string;
  photoUrl?: string;
}

export interface Class {
  id: string;
  subject: string;
  studentId: string;
  days: string[];
  startTime: string;
  endTime: string;
  location: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalaryRecord {
  id: string;
  studentId: string;
  amount: number;
  month: string; // Format: YYYY-MM
  status: 'paid' | 'due';
  paidDate?: string;
  notes?: string;
}

export interface Reminder {
  id: string;
  classId: string;
  time: number; // minutes before class (15, 30, 60)
  enabled: boolean;
}

export interface AppState {
  students: Student[];
  classes: Class[];
  salaryRecords: SalaryRecord[];
  reminders: Reminder[];
}

export type SubjectColor = {
  [key: string]: string;
};

export type ViewMode = 'day' | 'week' | 'month';

export type FilterOptions = {
  student?: string;
  subject?: string;
};