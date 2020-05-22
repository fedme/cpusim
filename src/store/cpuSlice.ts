import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type cpuState = {
  code: string;
  codeRowIndex: number;
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
  codeRowIndex: 0,
  r0: 0,
  r1: 0,
  a: 0
}

const cpuSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {

    reset(state) {
      state.code = initialState.code
      state.codeRowIndex = initialState.codeRowIndex
      state.r0 = initialState.r0
      state.r1 = initialState.r1
      state.a = initialState.a
    },

    incrementCodeRowIndex(state) {
      state.codeRowIndex += 1
    },

    setR0(state, action: PayloadAction<number>) {
      state.r0 = action.payload
    },

    setR1(state, action: PayloadAction<number>) {
      state.r1 = action.payload
    },

    add(state) {
      state.a = state.r0 + state.r1
    }

  }
})

export const {
  reset,
  incrementCodeRowIndex,
  setR0,
  setR1,
  add
} = cpuSlice.actions

export default cpuSlice.reducer
