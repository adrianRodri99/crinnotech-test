import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './slices/postsSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    notifications: notificationReducer,
  },
  // Habilitar Redux DevTools en desarrollo
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
