import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
    receiveMessage: (state, action: PayloadAction<string>) => {
        console.log("coucou from receive message")
      state.messages.push(action.payload);
    },
  },
});

export const { websocketConnected, websocketDisconnected, receiveMessage } = websocketSlice.actions;

export default websocketSlice.reducer;
