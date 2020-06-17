import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { parseCode, getSyntaxErrors, SyntaxError } from '../parser'
import {
  Instruction, parseInstructions, InstructionType, SetInstruction, MovInstruction, JmpInstruction, JmzInstruction, JmlInstruction, JmgInstruction
} from '../instructionParser'

// eslint-disable-next-line import/no-cycle
import { AppThunk } from './store'

// TODO: split into multiple slices
type cpuState = {
  isRunning: boolean
  code: string
  data: string
  syntaxErrors: SyntaxError[]
  dataSyntaxErrors: SyntaxError[]
  instructions: Instruction[]
  pc: number
  r0: number
  r1: number
  a: number
  ix: number
  sp: number
}

export const initialCode = ''

export const initialData = ''

const initialState: cpuState = {
  isRunning: false,
  code: initialCode,
  data: initialData,
  syntaxErrors: [],
  dataSyntaxErrors: [],
  instructions: [],
  pc: 0,
  r0: 0,
  r1: 0,
  a: 0,
  ix: 0,
  sp: 0
}

const cpuSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {

    reset(state) {
      state.pc = initialState.pc
      state.r0 = initialState.r0
      state.r1 = initialState.r1
      state.a = initialState.a
      state.ix = initialState.ix
      state.sp = initialState.sp
    },

    setCode(state, action: PayloadAction<string>) {
      state.code = action.payload
      const matches = parseCode(state.code)
      const instructions = parseInstructions(matches.map(m => m.ast))

      state.syntaxErrors = getSyntaxErrors(matches)
      state.instructions = instructions
    },

    setData(state, action: PayloadAction<string>) {
      state.data = action.payload
      const matches = parseCode(state.data)
      state.dataSyntaxErrors = getSyntaxErrors(matches)
    },

    setIsRunning(state, action: PayloadAction<boolean>) {
      state.isRunning = action.payload
    },

    incrementPc(state) {
      state.pc += 1
    },


    // Instructions

    add(state) {
      state.a = state.r0 + state.r1
    },

    sub(state) {
      state.a = state.r0 - state.r1
    },

    mul(state) {
      state.a = state.r0 * state.r1
    },

    div(state) {
      state.a = state.r0 / state.r1
    },

    mov(state, action: PayloadAction<MovInstruction>) {
      switch (action.payload.register) {
        case 'R0': {
          state.r0 = state.a
          break
        }
        case 'R1': {
          state.r1 = state.a
          break
        }
        case 'IX': {
          state.ix = state.a
          break
        }
      }
    },

    set(state, action: PayloadAction<SetInstruction>) {
      switch (action.payload.register) {
        case 'R0': {
          state.r0 = action.payload.data
          break
        }
        case 'R1': {
          state.r1 = action.payload.data
          break
        }
        case 'IX': {
          state.ix = action.payload.data
          break
        }
        case 'SP': {
          state.sp = action.payload.data
          break
        }
      }
    },

    jmp(state, action: PayloadAction<JmpInstruction>) {
      state.pc = action.payload.address
    },

    jmz(state, action: PayloadAction<JmzInstruction>) {
      if (state.a === 0) {
        state.pc = action.payload.address
      }
    },

    jml(state, action: PayloadAction<JmlInstruction>) {
      if (state.a < 0) {
        state.pc = action.payload.address
      }
    },

    jmg(state, action: PayloadAction<JmgInstruction>) {
      if (state.a > 0) {
        state.pc = action.payload.address
      }
    }
  }
})

export const {
  reset,
  setCode,
  setData,
  setIsRunning,
  incrementPc,
  add,
  sub,
  mul,
  div,
  mov,
  set,
  jmp,
  jmz,
  jml,
  jmg
} = cpuSlice.actions

export default cpuSlice.reducer

export const executeNextInstruction = (): AppThunk => (dispatch, getState) => {
  const { cpu } = getState()
  const instruction = cpu.instructions[cpu.pc] // TODO: throw if PC is > instructions.lenght

  switch (instruction.type) {
    case InstructionType.Add: {
      dispatch(add())
      break
    }
    case InstructionType.Sub: {
      dispatch(sub())
      break
    }
    case InstructionType.Mul: {
      dispatch(mul())
      break
    }
    case InstructionType.Div: {
      dispatch(div())
      break
    }
    case InstructionType.Mov: {
      dispatch(mov(instruction as MovInstruction))
      break
    }
    case InstructionType.Set: {
      dispatch(set(instruction as SetInstruction))
      break
    }
    case InstructionType.Jmp: {
      dispatch(jmp(instruction as JmpInstruction))
      break
    }
    case InstructionType.Jmz: {
      dispatch(jmp(instruction as JmzInstruction))
      break
    }
    case InstructionType.Jml: {
      dispatch(jmp(instruction as JmlInstruction))
      break
    }
    case InstructionType.Jmg: {
      dispatch(jmp(instruction as JmgInstruction))
      break
    }
  }

  dispatch(incrementPc())
}
