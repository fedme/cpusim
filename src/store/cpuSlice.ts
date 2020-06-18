import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  parseCode, getSyntaxErrors, SyntaxError
} from '../parser'
import {
  Instruction, parseInstructions, parseData, InstructionType, SetInstruction, MovInstruction, JmpInstruction,
  JmzInstruction, JmlInstruction, JmgInstruction, LodSimpleInstruction, LodComplexInstruction, StoInstruction,
  CalInstruction
} from '../instructionParser'

// eslint-disable-next-line import/no-cycle
import { AppThunk } from './store'

export const MEMORY_CODE_MAX_SIZE = 100

// TODO: split into multiple slices
type cpuState = {
  isRunning: boolean
  code: string
  data: string
  syntaxErrors: SyntaxError[]
  dataSyntaxErrors: SyntaxError[]
  instructions: Instruction[]
  dataList: Array<number|null>
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
  dataList: [],
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
      state.syntaxErrors = getSyntaxErrors(matches)
      state.instructions = parseInstructions(matches.map(m => m.ast))
    },

    setData(state, action: PayloadAction<string>) {
      state.data = action.payload
      const matches = parseCode(state.data)
      state.dataSyntaxErrors = getSyntaxErrors(matches)
      state.dataList = parseData(matches.map(m => m.ast))
    },

    setIsRunning(state, action: PayloadAction<boolean>) {
      state.isRunning = action.payload
    },

    resetPc(state) {
      state.pc = initialState.pc
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

    lodSimple(state, action: PayloadAction<LodSimpleInstruction>) {
      // TODO: throw if data is not in memory
      const data = state.dataList[action.payload.address - MEMORY_CODE_MAX_SIZE]

      if (data == null) {
        throw Error('data is not in memory')
      }

      switch (action.payload.register) {
        case 'R0': {
          state.r0 = data
          break
        }
        case 'R1': {
          state.r1 = data
          break
        }
        case 'IX': {
          state.ix = data
          break
        }
        case 'SP': {
          state.sp = data
          break
        }
      }
    },

    lodComplex(state, action: PayloadAction<LodComplexInstruction>) {
      // TODO: throw if data is not in memory
      const dataAddress = action.payload.type === InstructionType.LodComplexIX
        ? state.ix + action.payload.address
        : state.sp + action.payload.address

      const data = state.dataList[dataAddress - MEMORY_CODE_MAX_SIZE]

      if (data == null) {
        throw Error('data is not in memory')
      }

      switch (action.payload.register) {
        case 'R0': {
          state.r0 = data
          break
        }
        case 'R1': {
          state.r1 = data
          break
        }
      }
    },

    sto(state, action: PayloadAction<StoInstruction>) {
      let address = action.payload.address - MEMORY_CODE_MAX_SIZE

      if (action.payload.type === InstructionType.StoComplexIX) {
        address = state.ix + action.payload.address - MEMORY_CODE_MAX_SIZE
      }

      if (action.payload.type === InstructionType.StoComplexSP) {
        address = state.sp + action.payload.address - MEMORY_CODE_MAX_SIZE
      }

      if (address > state.dataList.length) {
        for (let i = 0; i < address - state.dataList.length; i += 1) {
          state.dataList.push(null)
        }
      }

      state.dataList[address] = state.a

      state.data = state.dataList.join('\n')
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
    },

    psh(state) {
      const address = state.sp - MEMORY_CODE_MAX_SIZE

      if (address > state.dataList.length) {
        for (let i = 0; i < address - state.dataList.length; i += 1) {
          state.dataList.push(null)
        }
      }

      state.dataList[address] = state.a
      state.data = state.dataList.join('\n')

      state.sp -= 1
    },

    pop(state) {
      state.sp += 1
      const address = state.sp - MEMORY_CODE_MAX_SIZE

      state.a = state.dataList[address]! // TODO: throw if null / not present
    },

    cal(state, action: PayloadAction<CalInstruction>) {
      const address = state.sp - MEMORY_CODE_MAX_SIZE

      if (address > state.dataList.length) {
        for (let i = 0; i < address - state.dataList.length; i += 1) {
          state.dataList.push(null)
        }
      }

      state.dataList[address] = state.pc
      state.data = state.dataList.join('\n')

      state.sp -= 1
      state.pc = action.payload.address
    },

    ret(state) {
      state.sp += 1
      const address = state.sp - MEMORY_CODE_MAX_SIZE

      state.pc = state.dataList[address]! // TODO: throw if null / not present
    }
  }
})

export const {
  reset,
  setCode,
  setData,
  setIsRunning,
  incrementPc,
  resetPc,
  add,
  sub,
  mul,
  div,
  mov,
  set,
  lodSimple,
  lodComplex,
  sto,
  jmp,
  jmz,
  jml,
  jmg,
  psh,
  pop,
  cal,
  ret
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
    case InstructionType.LodSimple: {
      dispatch(lodSimple(instruction as LodSimpleInstruction))
      break
    }
    case InstructionType.LodComplexIX: {
      dispatch(lodComplex(instruction as LodComplexInstruction))
      break
    }
    case InstructionType.LodComplexSP: {
      dispatch(lodComplex(instruction as LodComplexInstruction))
      break
    }
    case InstructionType.StoSimple: {
      dispatch(sto(instruction as StoInstruction))
      break
    }
    case InstructionType.StoComplexIX: {
      dispatch(sto(instruction as StoInstruction))
      break
    }
    case InstructionType.StoComplexSP: {
      dispatch(sto(instruction as StoInstruction))
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
    case InstructionType.Psh: {
      dispatch(psh())
      break
    }
    case InstructionType.Pop: {
      dispatch(pop())
      break
    }
    case InstructionType.Cal: {
      dispatch(cal(instruction as CalInstruction))
      break
    }
    case InstructionType.Ret: {
      dispatch(ret())
      break
    }
  }

  dispatch(incrementPc())
}
