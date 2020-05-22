import { createSlice, PayloadAction, Action } from '@reduxjs/toolkit'

type cpuState = {
  code: string;
  r0: number;
  r1: number;
  a: number;
}

const initialCode = `SET R0 1
SET R1 2
ADD
`

const initialState: cpuState = {
  code: initialCode,
  r0: 0,
  r1: 0,
  a: 0
}

const cpuSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setR0(state, action: PayloadAction<number>) {
      state.r0 = action.payload
    },
    setR1(state, action: PayloadAction<number>) {
      state.r1 = action.payload
    },
    add(state, action: Action) {
      state.a = state.r0 + state.r1
    }
  }
})

export const {
  setR0,
  setR1,
  add
} = cpuSlice.actions

export default cpuSlice.reducer
