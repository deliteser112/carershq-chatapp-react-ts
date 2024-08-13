import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '../features/chat/chatSlice';
import appointmentReducer from '../features/appointments/appointmentSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    appointments: appointmentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
