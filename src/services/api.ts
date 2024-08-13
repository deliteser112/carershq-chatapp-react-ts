import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const createAppointment = (data: any) => api.post('/api/appointment/create', data);
export const acceptAppointment = (appointmentId: number) => api.put(`/api/appointment/accept?appointmentId=${appointmentId}`);
export const deleteAppointment = (data: any) => api.delete('/api/appointment/delete', { data });
export const getAllAppointments = (userId: number) => api.get(`/api/appointment/get-all?userId=${userId}`);

export const getChats = (userId: number) => api.get(`/api/chat/get-chats?userId=${userId}`);
export const sendMessage = (data: any) => api.post('/api/chat/send-message', data);
export const receiveMessages = (chatId: number, sinceId: number) => api.get(`/api/chat/receive-messages?chatId=${chatId}&sinceId=${sinceId}`);
export const getHistoricalMessages = (chatId: number, pageSize: number, pageNumber: number) => api.get(`/api/chat/historical-messages?chatId=${chatId}&pageSize=${pageSize}&pageNumber=${pageNumber}`);

export const getUsers = () => api.get(`/api/users/get-all`);

export default api;
