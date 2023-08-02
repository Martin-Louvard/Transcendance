import { createSlice } from '@reduxjs/toolkit'
import { User } from '../../Types' 

// Define the initial state using that type
const initialState: User = {
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
  isLoggedIn: false,
  JoinedChatChannels: [],
  OwnedChatChannels: [],
  BannedFromChatChannels: [],
  AdminOnChatChannels: [],
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
