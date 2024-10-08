import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createAppointment, getAllAppointments, acceptAppointment, deleteAppointment } from '../../services/api';

interface Appointment {
  appointmentId: number;
  acceptorUserId: number;
  appointmentDateTime: number;
  state: number;
  id: number;
  userId: number;
  datetime: number;
  status: 'initiated' | 'accepted';
  deleteMessage?: string;
}

interface AppointmentState {
  appointments: Appointment[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: AppointmentState = {
  appointments: [],
  status: 'idle',
  error: null,
};

// Fetch all appointments
export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async (userId: number) => {
    const response = await getAllAppointments(userId);
    return response.data;
  }
);

// Create a new appointment
export const createAppointmentAsync = createAsyncThunk(
  'appointments/createAppointment',
  async (appointmentData: { initiatorUserId: number; acceptorUserId: number; appointmentDateTime: string }) => {
    const response = await createAppointment(appointmentData);
    return response.data;
  }
);

// Accept an appointment
export const acceptAppointmentAsync = createAsyncThunk(
  'appointments/acceptAppointment',
  async (appointmentId: number) => {
    const response = await acceptAppointment(appointmentId);
    return response.data;
  }
);

// Delete an appointment
export const deleteAppointmentAsync = createAsyncThunk(
  'appointments/deleteAppointment',
  async ({ appointmentId, deleteMessage }: { appointmentId: number; deleteMessage: string }) => {
    const response = await deleteAppointment({ appointmentId, deleteMessage });
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
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch appointments';
      })
      .addCase(createAppointmentAsync.fulfilled, (state, action) => {
        state.appointments.push(action.payload);
      })
      .addCase(acceptAppointmentAsync.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(a => a.appointmentId === action.meta.arg);
        if (index !== -1) {
          state.appointments[index].state = 2; // Update the state to 'accepted'
          state.appointments[index].status = 'accepted'; // Update status if necessary
        }
      })
      .addCase(deleteAppointmentAsync.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(a => a.appointmentId === action.payload.appointmentId);
        if (index !== -1) {
          state.appointments[index].state = 3;
          state.appointments[index].deleteMessage = action.payload.deleteMessage;
        }
      });
  },
});

export default appointmentSlice.reducer;
