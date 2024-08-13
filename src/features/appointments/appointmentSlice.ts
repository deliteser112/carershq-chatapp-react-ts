import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createAppointment, getAllAppointments, acceptAppointment, deleteAppointment } from '../../services/api';

interface Appointment {
  id: number;
  date: string;
  status: string;
}

interface AppointmentsState {
  appointments: Appointment[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: AppointmentsState = {
  appointments: [],
  status: 'idle',
  error: null,
};

// Async thunk for fetching appointments
export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async (userId: number) => {
    const response = await getAllAppointments(userId);
    return response.data;
  }
);

// Async thunk for creating an appointment
export const createAppointmentAsync = createAsyncThunk(
  'appointments/createAppointment',
  async (data: { chatId: number; initiatorUserId: number; acceptorUserId: number; appointmentDateTime: string }) => {
    const response = await createAppointment(data);
    return response.data;
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.status = 'idle';
        state.appointments = action.payload;  // Assuming the API returns an array of appointments
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch appointments';
      })
      .addCase(createAppointmentAsync.fulfilled, (state, action) => {
        state.appointments.push(action.payload);  // Assuming the API returns the new appointment
      });
  },
});

export default appointmentSlice.reducer;
