import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getHistoricalMessages, getUsers, sendMessage } from '../../services/api';

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
  pageNumber: number;
  hasMoreMessages: boolean;
}

const initialState: ChatState = {
  users: [],
  messages: [],
  status: 'idle',
  error: null,
  pageNumber: 1,
  hasMoreMessages: true,
};

// Async thunk to fetch the list of users
export const fetchUsers = createAsyncThunk(
  'chat/fetchUsers',
  async () => {
    const response = await getUsers();
    return response.data;
  }
);

// Async thunk to fetch historical messages with pagination support
export const fetchHistoricalMessages = createAsyncThunk(
  'chat/fetchHistoricalMessages',
  async ({ userId, pageNumber }: { userId: number, pageNumber: number }, { getState }) => {
    const state = getState() as { chat: ChatState };
    const chatId = userId - 1;
    const pageSize = 50;
    const response = await getHistoricalMessages(chatId, pageSize, pageNumber);
    return {
      messages: response.data,
      pageNumber,
      pageSize,
    };
  }
);

// Async thunk to send a message
export const sendMessageAsync = createAsyncThunk(
  'chat/sendMessage',
  async (data: { userId: number; sinkId: number; destinationId: number; body: string }, { dispatch }) => {
    const chatId = data.userId - 1;
    const response = await sendMessage({ ...data, chatId });
    const messageId = response.data;

    // After sending the message, fetch the latest messages to include the new message
    await dispatch(fetchHistoricalMessages({ userId: data.userId, pageNumber: 1 }));

    return messageId;
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    resetPagination(state) {
      state.pageNumber = 1;
      state.hasMoreMessages = true;
      state.messages = [];
    }
  },
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
        const newMessages = action.payload.messages;

        // Check if more messages can be loaded
        if (newMessages.length < action.payload.pageSize) {
          state.hasMoreMessages = false;
        }

        // Prepend new messages to the existing list
        state.messages = [...newMessages, ...state.messages];
        state.pageNumber = action.payload.pageNumber;
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

export const { resetPagination } = chatSlice.actions;
export default chatSlice.reducer;
