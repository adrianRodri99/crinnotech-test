import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean; 
  timestamp: number;
}

interface NotificationState {
  notifications: Notification[];
}

const loadNotificationsFromStorage = (): Notification[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('persistent-notifications');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveNotificationsToStorage = (notifications: Notification[]) => {
  if (typeof window === 'undefined') return;
  try {
    const persistentNotifications = notifications.filter(n => n.persistent);
    localStorage.setItem('persistent-notifications', JSON.stringify(persistentNotifications));
  } catch (error) {
    console.error('Error saving notifications:', error);
  }
};

const initialState: NotificationState = {
  notifications: loadNotificationsFromStorage(),
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        persistent: action.payload.persistent ?? false,
      };
      
      state.notifications.push(notification);
      
      saveNotificationsToStorage(state.notifications);
    },
    
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
      
      saveNotificationsToStorage(state.notifications);
    },
    
    clearAllNotifications: (state) => {
      state.notifications = [];
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('persistent-notifications');
      }
    },
    
    clearTemporaryNotifications: (state) => {
      state.notifications = state.notifications.filter(n => n.persistent);
    },
  },
});

export const {
  addNotification,
  removeNotification,
  clearAllNotifications,
  clearTemporaryNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;