import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { cpusimGrammar } from '../parser'

type cpuState = {
  code: string // TODO: move to a different slice
  codeRowIndex: number // TODO: move to a different slice
  instructions: string[] // TODO: move to a different slice
  r0: number
  r1: number
  a: number
}

const initialCode = `SET R0 1
SET R1 2
ADD
`

const initialState: cpuState = {
  code: initialCode,
  codeRowIndex: 0,
  instructions: initialCode.split(/\r?\n/).filter(i => i !== ''),
  r0: 0,
  r1: 0,
  a: 0
}

const cpuSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {

    reset(state) {
      state.codeRowIndex = 0
      state.r0 = initialState.r0
      state.r1 = initialState.r1
      state.a = initialState.a
    },

    setCode(state, action: PayloadAction<string>) {
      state.code = action.payload
      console.log('grammar match succeded', cpusimGrammar.match(state.code).succeeded())
      console.log('grammar match message', cpusimGrammar.match(state.code).shortMessage)
    },

    loadInstructions(state) {
      state.instructions = state.code.split(/\r?\n/).filter(i => i !== '')
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
  setCode,
  loadInstructions,
  incrementCodeRowIndex,
  setR0,
  setR1,
  add
} = cpuSlice.actions

export default cpuSlice.reducer
