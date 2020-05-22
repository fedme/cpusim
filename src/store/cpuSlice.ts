import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CurrentUser {
  username: string | null;
}

type UserState = {
  loggedIn: boolean;
} & CurrentUser

const initialState: UserState = {
  loggedIn: false,
  username: null
}

const cpuSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<string | null>) {
      state.loggedIn = action.payload != null
      state.username = action.payload
    }
  }
})

export const {
  setCurrentUser
} = cpuSlice.actions

export default cpuSlice.reducer
