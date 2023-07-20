import { createSlice } from '@reduxjs/toolkit'

// Define a type for the slice state
interface userState {
  email: string,
  username: string,
  password: string,
  isLoggedIn: boolean,
  twoFAEnabled: boolean,
  victoriesCount: number,
  defeatCount: number,
  rank: string,
  level: number,
  friends: object
}

// Define the initial state using that type
const initialState: userState = {
  email: "",
  username: "",
  password: "",
  isLoggedIn: false,
  twoFAEnabled: false,
  victoriesCount: 0,
  defeatCount: 0,
  rank: "Noobie",
  level: 0,
  friends: {}
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