import { Reminder, Class } from '../types';
import { calculateReminderTime, sendNotification } from '../utils/helpers';

class ReminderService {
  private reminders: Map<string, NodeJS.Timeout> = new Map();
  
  // Schedule all reminders
  public scheduleAllReminders(reminders: Reminder[], classes: Class[]): void {
    // Clear existing reminders
    this.clearAllReminders();
    
    // Schedule new reminders
    reminders.forEach((reminder) => {
      if (reminder.enabled) {
        this.scheduleReminder(reminder, classes);
      }
    });
  }
  
  // Schedule a single reminder
  private scheduleReminder(reminder: Reminder, classes: Class[]): void {
    const classData = classes.find((cls) => cls.id === reminder.classId);
    
    if (!classData) return;
    
    // Schedule reminders for each day the class occurs
    classData.days.forEach((day) => {
      this.scheduleDayReminder(reminder, classData, day);
    });
  }
  
  // Schedule reminder for a specific day
  private scheduleDayReminder(reminder: Reminder, classData: Class, day: string): void {
    const now = new Date();
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const targetDay = daysOfWeek.indexOf(day.toLowerCase());
    
    // Calculate days until next occurrence
    let daysUntil = targetDay - today;
    if (daysUntil <= 0) daysUntil += 7; // If today or in the past, schedule for next week
    
    // Create date for next occurrence
    const nextOccurrence = new Date();
    nextOccurrence.setDate(now.getDate() + daysUntil);
    
    // Set time from class start time
    const [hours, minutes] = classData.startTime.split(':').map(Number);
    nextOccurrence.setHours(hours, minutes, 0, 0);
    
    // Subtract reminder time
    const reminderTime = calculateReminderTime(nextOccurrence, classData.startTime, reminder.time);
    
    // If reminder time is in the past, schedule for next week
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 7);
    }
    
    // Calculate milliseconds until reminder
    const msUntilReminder = reminderTime.getTime() - now.getTime();
    
    // Schedule reminder
    const timerId = setTimeout(() => {
      this.triggerReminder(reminder, classData);
      // Reschedule for next week
      this.scheduleDayReminder(reminder, classData, day);
    }, msUntilReminder);
    
    // Store timer ID
    const key = `${reminder.id}-${day}`;
    this.reminders.set(key, timerId);
  }
  
  // Trigger notification for a reminder
  private triggerReminder(reminder: Reminder, classData: Class): void {
    const title = `Class Reminder: ${classData.subject}`;
    const options: NotificationOptions = {
      body: `Your class starts in ${reminder.time} minutes.`,
      icon: '/favicon.svg',
    };
    
    sendNotification(title, options);
  }
  
  // Clear all scheduled reminders
  public clearAllReminders(): void {
    this.reminders.forEach((timerId) => {
      clearTimeout(timerId);
    });
    
    this.reminders.clear();
  }
  
  // Update a specific reminder
  public updateReminder(reminder: Reminder, classes: Class[]): void {
    // Clear existing timers for this reminder
    this.clearReminderTimers(reminder.id);
    
    // Schedule if enabled
    if (reminder.enabled) {
      this.scheduleReminder(reminder, classes);
    }
  }
  
  // Clear timers for a specific reminder
  private clearReminderTimers(reminderId: string): void {
    this.reminders.forEach((timerId, key) => {
      if (key.startsWith(`${reminderId}-`)) {
        clearTimeout(timerId);
        this.reminders.delete(key);
      }
    });
  }
  
  // Delete a reminder
  public deleteReminder(reminderId: string): void {
    this.clearReminderTimers(reminderId);
  }
}

export default new ReminderService();