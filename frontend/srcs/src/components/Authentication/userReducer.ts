import { createSlice } from '@reduxjs/toolkit'
import { ChatChannel } from '../Chat/ChatChannelReducer';

// Define a type for the slice state
export interface userState {
  id: number,
    username: string,
    email: string,
    avatar: string,
    twoFAEnabled: boolean,
    status: string,
    victoriesCount: number,
    defeatCount: number,
    rank: string,
    level: number,
    achievements: JSON | null,
    createdAt: string,
    access_token: string,
    friends: Array<Object>,
    JoinedChatChannels: ChatChannel[],
    OwnedChatChannels: ChatChannel[],
    BannedFromChatChannels: ChatChannel[]
}

// Define the initial state using that type
const initialState: userState = {
  id: 0,
  username: "",
  email: "",
  avatar: "",
  twoFAEnabled: false,
  status: "inactive",
  victoriesCount: 0,
  defeatCount: 0,
  rank: "Noobie",
  level: 0,
  achievements: null,
  createdAt: "",
  access_token: "",
  friends: [{}],
  JoinedChatChannels: [],
  OwnedChatChannels: [],
  BannedFromChatChannels: []
}

export const sessionSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUser: (_state, action) => {
      return action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUser } = sessionSlice.actions

export default sessionSlice.reducer
