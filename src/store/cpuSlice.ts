import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { parseCode, getSyntaxErrors, SyntaxError } from '../parser'

// TODO: split into multiple slices
type cpuState = {
  code: string
  data: string
  syntaxErrors: SyntaxError[]
  dataSyntaxErrors: SyntaxError[]
  codeRowIndex: number
  instructions: string[]
  r0: number
  r1: number
  a: number
}

export const initialCode = 'SET R0 123'

const initialState: cpuState = {
  code: initialCode,
  data: '',
  syntaxErrors: [],
  dataSyntaxErrors: [],
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
      const matches = parseCode(state.code)
      state.syntaxErrors = getSyntaxErrors(matches)
    },

    setData(state, action: PayloadAction<string>) {
      state.data = action.payload
      const matches = parseCode(state.data)
      state.dataSyntaxErrors = getSyntaxErrors(matches)
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
  setData,
  loadInstructions,
  incrementCodeRowIndex,
  setR0,
  setR1,
  add
} = cpuSlice.actions

export default cpuSlice.reducer
