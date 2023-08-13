import { createSlice } from '@reduxjs/toolkit'
import User from '../Types'

// Define a type for the slice state
interface friendsState {
    users: User[]
}

// Define the initial state using that type
const initialState: friendsState = {
   users: []
}

export const sessionSlice = createSlice({
  name: 'friends',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setFriend: (_state, action) => {
      return action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setFriend } = sessionSlice.actions

export default sessionSlice.reducer
