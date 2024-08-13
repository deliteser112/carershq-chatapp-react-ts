import { combineReducers } from '@reduxjs/toolkit';
import chatReducer from '../features/chat/chatSlice';
import appointmentReducer from '../features/appointments/appointmentSlice';

const rootReducer = combineReducers({
  chat: chatReducer,
  appointments: appointmentReducer,
});

export default rootReducer;
