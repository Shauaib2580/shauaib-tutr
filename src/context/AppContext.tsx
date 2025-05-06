import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { AppState, Student, Class, SalaryRecord, Reminder } from '../types';

// Initial state
const initialState: AppState = {
  students: [],
  classes: [],
  salaryRecords: [],
  reminders: [],
};

// Action types
type Action =
  | { type: 'ADD_STUDENT'; payload: Student }
  | { type: 'UPDATE_STUDENT'; payload: Student }
  | { type: 'DELETE_STUDENT'; payload: string }
  | { type: 'ADD_CLASS'; payload: Class }
  | { type: 'UPDATE_CLASS'; payload: Class }
  | { type: 'DELETE_CLASS'; payload: string }
  | { type: 'ADD_SALARY_RECORD'; payload: SalaryRecord }
  | { type: 'UPDATE_SALARY_RECORD'; payload: SalaryRecord }
  | { type: 'DELETE_SALARY_RECORD'; payload: string }
  | { type: 'ADD_REMINDER'; payload: Reminder }
  | { type: 'UPDATE_REMINDER'; payload: Reminder }
  | { type: 'DELETE_REMINDER'; payload: string }
  | { type: 'LOAD_STATE'; payload: AppState };

// Reducer function
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'ADD_STUDENT':
      return {
        ...state,
        students: [...state.students, action.payload],
      };
    case 'UPDATE_STUDENT':
      return {
        ...state,
        students: state.students.map((student) =>
          student.id === action.payload.id ? action.payload : student
        ),
      };
    case 'DELETE_STUDENT':
      return {
        ...state,
        students: state.students.filter((student) => student.id !== action.payload),
        // Also remove related classes and salary records
        classes: state.classes.filter((cls) => cls.studentId !== action.payload),
        salaryRecords: state.salaryRecords.filter((record) => record.studentId !== action.payload),
      };
    case 'ADD_CLASS':
      return {
        ...state,
        classes: [...state.classes, action.payload],
      };
    case 'UPDATE_CLASS':
      return {
        ...state,
        classes: state.classes.map((cls) =>
          cls.id === action.payload.id ? action.payload : cls
        ),
      };
    case 'DELETE_CLASS':
      return {
        ...state,
        classes: state.classes.filter((cls) => cls.id !== action.payload),
        // Also remove related reminders
        reminders: state.reminders.filter((reminder) => reminder.classId !== action.payload),
      };
    case 'ADD_SALARY_RECORD':
      return {
        ...state,
        salaryRecords: [...state.salaryRecords, action.payload],
      };
    case 'UPDATE_SALARY_RECORD':
      return {
        ...state,
        salaryRecords: state.salaryRecords.map((record) =>
          record.id === action.payload.id ? action.payload : record
        ),
      };
    case 'DELETE_SALARY_RECORD':
      return {
        ...state,
        salaryRecords: state.salaryRecords.filter((record) => record.id !== action.payload),
      };
    case 'ADD_REMINDER':
      return {
        ...state,
        reminders: [...state.reminders, action.payload],
      };
    case 'UPDATE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.map((reminder) =>
          reminder.id === action.payload.id ? action.payload : reminder
        ),
      };
    case 'DELETE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.filter((reminder) => reminder.id !== action.payload),
      };
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
};

// Create context
type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  exportData: () => void;
  importData: (jsonData: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on initial render
  useEffect(() => {
    const savedState = localStorage.getItem('tutrAppState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Failed to parse saved state:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tutrAppState', JSON.stringify(state));
  }, [state]);

  // Export data as JSON
  const exportData = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `tutr-backup-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Import data from JSON
  const importData = (jsonData: string) => {
    try {
      const parsedData = JSON.parse(jsonData) as AppState;
      dispatch({ type: 'LOAD_STATE', payload: parsedData });
    } catch (error) {
      console.error('Failed to import data:', error);
      alert('Failed to import data. Please check the file format.');
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch, exportData, importData }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};