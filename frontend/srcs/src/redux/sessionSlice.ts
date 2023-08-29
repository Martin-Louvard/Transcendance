import { createSlice } from '@reduxjs/toolkit'
import {User, ChatChannels, Friendships, Friend} from '../Types'
import { fetchRelatedUserData } from './sessionThunks'

// Define a type for the slice state
export interface sessionState {
    user: User | undefined,
    access_token: string | undefined
    friends: Friend[] | undefined,
    friendships: Friendships[] | undefined,
    friendRequests: Friendships[] | undefined,
    JoinedChatChannels: ChatChannels[] | undefined,
    OwnedChatChannels: ChatChannels[] | undefined,
    BannedFromChatChannels: ChatChannels[] | undefined,
    OpenedChatChannels: ChatChannels[],
    loading: boolean,
    error: string | undefined,
}

// Define the initial state using that type
const initialState: sessionState = {
  user: undefined,
  access_token : undefined,
  friends: undefined,
  friendships: undefined,
  friendRequests: undefined,
  JoinedChatChannels: undefined,
  OwnedChatChannels: undefined,
  BannedFromChatChannels: undefined,
  OpenedChatChannels: [],
  loading: false,
  error: undefined,
}

// Utiliser createSlice permet d'ecrire les reducers comme si on mutait le state car il marche avec Immer qui sous le capot s'occupe de transformer le state de maniere immutable
export const sessionSlice = createSlice({
  name: 'session',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addOpenedChatChannel: (state, action) => {
      const chatChannel = action.payload;
      if (!state.OpenedChatChannels?.some(channel => channel.id === chatChannel.id)) {
          if (state.OpenedChatChannels?.length >= 3) {
            state.OpenedChatChannels?.shift();
          }
        state.OpenedChatChannels.push(chatChannel);
      }
    },
    removeOpenedChatChannel: (state, action) => {
      const chatChannelId = action.payload;
      state.OpenedChatChannels = state.OpenedChatChannels.filter(channel => channel.id !== chatChannelId);
    },
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
      state.JoinedChatChannels = action.payload
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
    updateFriendRequest: (state, action)=>{
      if (state.friendships === undefined || state.friendships.length === 0)
        state.friendships = [action.payload]
      else if (state.friendships.find(f=>f.id == action.payload.id))
        state.friendships =  state.friendships.map((f) => {
          if (f.id == action.payload.id)
            return action.payload
          return f
        });
      else
        state.friendships.push(action.payload)

      //Add to friends if friendship accepted, else filter friends and remove friends that are no longer accepted if they are in the state
      if (state.user && action.payload.status === "ACCEPTED")
      {
        if (state.friends === undefined || state.friends.length === 0)
          state.friends = [action.payload.user.id !== state.user.id ? action.payload.user :action.payload.friend]
        else
          state.friends.push(action.payload.user.id !== state.user.id ? action.payload.user :action.payload.friend)
      }
      else if (state.friends && state.user && (action.payload.status === "CANCELED" || action.payload.status === "DECLINED" || action.payload.status === "BLOCKED"))
      {
        state.friends = state.friends?.filter(f => f.id !== (action.payload.user.id !== state.user?.id ? action.payload.user.id :action.payload.friend.id))
      }
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

      if (state.friends?.length)
      state.friends =  state.friends.map((f) => {
        if (f.id === action.payload.user_id)
          f.status = action.payload.status
        return f
      });
    },
    createChat: (state, action) => {
      if (state.JoinedChatChannels)
        state.JoinedChatChannels.push(action.payload)
      else
        state.JoinedChatChannels = action.payload
    },
    updateChat: (state, action) =>{
      if (state.JoinedChatChannels === undefined || state.JoinedChatChannels.length === 0)
      {
        if (action.payload.friendship === undefined || action.payload.friendship.status === "ACCEPTED")
          state.JoinedChatChannels = [action.payload]
      }
      else{
        const updatedChannels =  state.JoinedChatChannels.map((c) => {
          if (c.id === action.payload.id)
            c = action.payload
        return c
        })
        state.JoinedChatChannels = updatedChannels.filter(c => c.friendship === undefined || c.friendship.status === "ACCEPTED")
      }
    },
    cleanSession: (state) =>{
      state.user= undefined,
      state.access_token = undefined,
      state.friends = undefined,
      state.friendships = undefined,
      state.JoinedChatChannels = undefined,
      state.OwnedChatChannels = undefined,
      state.BannedFromChatChannels = undefined
    }
  },
  extraReducers: (builder) => {
      builder.addCase(fetchRelatedUserData.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      });
      builder.addCase(fetchRelatedUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = undefined;
        state.friends = action.payload.friends,
        state.friendships = action.payload.friendships,
        state.JoinedChatChannels = action.payload.JoinedChatChannels?.filter(c => !c.friendship || c.friendship.status === "ACCEPTED");
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
  updateFriendStatus,
  createChat,
  updateChat,
  addOpenedChatChannel,
  removeOpenedChatChannel,
} = sessionSlice.actions
export { fetchRelatedUserData };
export default sessionSlice.reducer
