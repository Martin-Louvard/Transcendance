import { createSlice } from '@reduxjs/toolkit'
import {User, ChatChannels, Friendships, Friend} from '../Types'
import { fetchRelatedUserData } from './sessionThunks'

// Define a type for the slice state
export interface sessionState {
    user: User | null,
    access_token: string | null
    friends: Friend[] | null,
    friendships: Friendships[] | null,
    friendRequests: Friendships[] | null,
    JoinedChatChannels: ChatChannels[] | null,
    OwnedChatChannels: ChatChannels[] | null,
    BannedFromChatChannels: ChatChannels[] | null,
    loading: boolean,
    error: string | null,
}

// Define the initial state using that type
const initialState: sessionState = {
  user: null,
  access_token : null,
  friends: null,
  friendships: null,
  friendRequests: null,
  JoinedChatChannels: null,
  OwnedChatChannels: null,
  BannedFromChatChannels: null,
  loading: false,
  error: null,
}

export const sessionSlice = createSlice({
  name: 'session',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setSessionUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.access_token = action.payload;
    },
    setFriends: (state, action) => {
      state.friends = action.payload;
    }, 
    setFriendships: (state, action) => {
      state.friendships = action.payload;
    }, 
    setJoinedChatChannels: (state, action) => {
      state.JoinedChatChannels = action.payload;
    }, 
    setOwnedChatChannels: (state, action) => {
      state.OwnedChatChannels = action.payload;
    }, 
    setBannedFromChatChannels: (state, action) => {
      state.BannedFromChatChannels = action.payload;
    },
    receiveMessage: (state, action) => {
      state.JoinedChatChannels?.find((c) =>c.id == action.payload.channelId)?.messages.push(action.payload);
    },
    addFriendRequest: (state, action)=>{
      state.friendships?.push(action.payload)
    },
    updateFriendRequest: (state, action)=>{
      if (!state.friendships)
        state.friendships = [action.payload]
      else if (state.friendships.find(f=>f.id == action.payload.id))
        state.friendships =  state.friendships.map((f) => {
          if (f.id == action.payload.id)
            return action.payload
          return f
        });
      else
        state.friendships.push(action.payload)
    },
    updateFriendStatus: (state, action)=>{
      if (state.friendships)
        state.friendships =  state.friendships.map((f) => {
          if (f.friend.id === action.payload.user_id)
            f.friend.status = action.payload.status
          else if (f.user.id === action.payload.user_id)
            f.user.status = action.payload.status
          return f
        });
        if (state.friends)
        state.friends =  state.friends.map((f) => {
          if (f.id === action.payload.user_id)
            f.status = action.payload.status
          return f
        });
    },
    cleanSession: (state) =>{
      state.user= null,
      state.access_token = null,
      state.friends = null,
      state.friendships = null,
      state.JoinedChatChannels = null,
      state.OwnedChatChannels = null,
      state.BannedFromChatChannels = null
    }
  },
  extraReducers: (builder) => {
      builder.addCase(fetchRelatedUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(fetchRelatedUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.friends = action.payload.friends,
        state.friendships = action.payload.friendships,
        state.JoinedChatChannels = action.payload.JoinedChatChannels,
        state.OwnedChatChannels = action.payload.OwnedChatChannels,
        state.BannedFromChatChannels = action.payload.BannedFromChatChannels
      });
      builder.addCase(fetchRelatedUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      });
  },
})

export const { 
  setSessionUser, 
  setToken, 
  setFriends, 
  setFriendships, 
  setJoinedChatChannels, 
  setOwnedChatChannels, 
  setBannedFromChatChannels, 
  cleanSession, 
  receiveMessage, 
  updateFriendRequest, 
  addFriendRequest, 
  updateFriendStatus,
} = sessionSlice.actions
export { fetchRelatedUserData };
export default sessionSlice.reducer
