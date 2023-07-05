import { createSlice } from '@reduxjs/toolkit'


export const sessionSlice = createSlice({
  name: 'user',
  initialState: {isLoggedIn: false},
  reducers: {
    setUser: (state, action) => {
      return action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUser } = sessionSlice.actions
export default sessionSlice.reducer