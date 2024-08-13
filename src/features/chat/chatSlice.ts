import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getChats, sendMessage, getHistoricalMessages, getUsers, receiveMessages } from '../../services/api';

interface ChatMessage {
  messageId: number;
  chatId: number;
  sinkId: number;
  destinationId: number;
  body: string;
  createdDateTime: number;
}

interface User {
  userId: number;
  name: string;
}

interface ChatState {
  users: User[];
  messages: ChatMessage[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: ChatState = {
  users: [],
  messages: [],
  status: 'idle',
  error: null,
};

// Async thunk to fetch the list of users
export const fetchUsers = createAsyncThunk(
  'chat/fetchUsers',
  async () => {
    const response = await getUsers();
    return response.data;
  }
);

// Async thunk to fetch historical messages for a selected user
export const fetchHistoricalMessages = createAsyncThunk(
  'chat/fetchHistoricalMessages',
  async (chatId: number) => {
    const response = await getHistoricalMessages(chatId, 50, 1); // Example pagination
    return response.data;
  }
);

// Async thunk to send a message
export const sendMessageAsync = createAsyncThunk(
  'chat/sendMessage',
  async (data: { chatId: number; sinkId: number; destinationId: number; body: string }, { dispatch }) => {
    const response = await sendMessage(data);
    const messageId = response.data;
    
    // After sending the message, fetch the latest messages to include the new message
    await dispatch(fetchHistoricalMessages(data.chatId));

    return messageId;
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'idle';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(fetchHistoricalMessages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchHistoricalMessages.fulfilled, (state, action) => {
        state.status = 'idle';
        state.messages = action.payload;
      })
      .addCase(fetchHistoricalMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch messages';
      })
      .addCase(sendMessageAsync.fulfilled, (state, action) => {
        // No need to manually add the message here since we're fetching the full list after sending
      });
  },
});

export default chatSlice.reducer;
