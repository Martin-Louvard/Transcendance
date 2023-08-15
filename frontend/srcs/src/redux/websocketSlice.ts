import { createSlice } from '@reduxjs/toolkit';

interface WebSocketState {
  isConnected: boolean;
  messages: string[];
}

const initialState: WebSocketState = {
  isConnected: false,
  messages: [],
};

const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    websocketConnected: (state) => {
      state.isConnected = true;
    },
    websocketDisconnected: (state) => {
      state.isConnected = false;
    },
  },
});

export const { websocketConnected, websocketDisconnected } = websocketSlice.actions;

export default websocketSlice.reducer;
