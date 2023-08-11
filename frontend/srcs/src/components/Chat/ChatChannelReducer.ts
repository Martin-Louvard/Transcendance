import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { userState as User } from '../Authentication/userReducer';

export interface message {
  id: number;
  channelId: number;
  reader_user_Id: number[];
  content: string;
}

export interface ChatChannel {
  id: number;
  ownerId: number;
  password?: string;
  channelType?: string;
  name?: string;
  participants: User[];
  messages: message[]; 
}

export interface ChatChannelsState {
  channels: ChatChannel[],
}

const initialState: ChatChannelsState = {
  channels: [],
};

const chatChannelsSlice =  createSlice({
  name: 'chatChannels',
  initialState,
  reducers: {
    setChatChannels: (state, action: PayloadAction<ChatChannel[]>) => {
      state.channels = action.payload;
    },
  },
});

export const { setChatChannels } = chatChannelsSlice.actions;

export default chatChannelsSlice.reducer;
