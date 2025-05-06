import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentDetail from './pages/StudentDetail';
import Schedule from './pages/Schedule';
import ClassDetail from './pages/ClassDetail';
import Income from './pages/Income';
import ReminderService from './services/ReminderService';
import { checkNotificationPermission } from './utils/helpers';

// Component to initialize reminders
const ReminderInitializer: React.FC = () => {
  const { state } = useAppContext();
  const { reminders, classes } = state;
  
  useEffect(() => {
    // Request notification permission
    checkNotificationPermission();
    
    // Schedule reminders
    ReminderService.scheduleAllReminders(reminders, classes);
    
    // Cleanup on unmount
    return () => {
      ReminderService.clearAllReminders();
    };
  }, [reminders, classes]);
  
  return null;
};

function App() {
  return (
    <AppProvider>
      <Router>
        <ReminderInitializer />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="students/:id" element={<StudentDetail />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="schedule/class/:id" element={<ClassDetail />} />
            <Route path="schedule/new" element={<Schedule />} />
            <Route path="income" element={<Income />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;