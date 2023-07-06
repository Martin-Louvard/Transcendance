import { createSlice } from '@reduxjs/toolkit'

// Define a type for the slice state
interface userState {
  email: string,
  password: string,
  isLoggedIn: boolean
}

// Define the initial state using that type
const initialState: userState = {
  email: "",
  password: "",
  isLoggedIn: false
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