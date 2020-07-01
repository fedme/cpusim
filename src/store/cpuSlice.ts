import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  parseCode, getSyntaxErrors, SyntaxError
} from '../parser'
import {
  Instruction, parseInstructions, parseData, InstructionType, SetInstruction, MovInstruction, JmpInstruction,
  JmzInstruction, JmlInstruction, JmgInstruction, LodInstruction, StoInstruction,
  CalInstruction
} from '../instructionParser'

// eslint-disable-next-line import/no-cycle
import { AppThunk } from './store'
import { sleep } from '../utils/sleep'

export const MEMORY_CODE_MAX_SIZE = 100

// TODO: split into multiple slices
type cpuState = {
  isRunning: boolean
  executionSpeed: number
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
  lightAddressBus: boolean
  lightDataBus: boolean
  lightPc: boolean
  lightIr: boolean
  lightMar: boolean
  lightMdr: boolean
  lightDecoder: boolean
  lightCodeRow: number | null
}

export const initialCode = ''

export const initialData = ''

const initialState: cpuState = {
  isRunning: false,
  executionSpeed: 3000,
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
  sp: 100,
  lightAddressBus: false,
  lightDataBus: false,
  lightPc: false,
  lightIr: false,
  lightMar: false,
  lightMdr: false,
  lightDecoder: false,
  lightCodeRow: null
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
      state.lightAddressBus = initialState.lightAddressBus
      state.lightDataBus = initialState.lightDataBus
      state.lightPc = initialState.lightPc
      state.lightIr = initialState.lightIr
      state.lightMar = initialState.lightMar
      state.lightMdr = initialState.lightMdr
      state.lightDecoder = initialState.lightDecoder
      state.lightCodeRow = initialState.lightCodeRow
    },

    setExecutionSpeed(state, action: PayloadAction<number>) {
      state.executionSpeed = action.payload
    },

    setCode(state, action: PayloadAction<string>) {
      state.code = action.payload
      const matches = parseCode(state.code)
      state.syntaxErrors = getSyntaxErrors(matches)
      state.instructions = parseInstructions(matches.map(m => m.ast))
    },

    setData(state, action: PayloadAction<string>) {
      state.data = action.payload
      const matches = parseCode(state.data, 'data')
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

    hlt(state) {
      state.isRunning = false
    },

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
      state.a = Math.trunc(state.r0 / state.r1)
    },

    inc(state) {
      state.ix += 1
    },

    dec(state) {
      state.ix -= 1
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
        case 'A': {
          state.a = action.payload.data
          break
        }
      }
    },

    lod(state, action: PayloadAction<LodInstruction>) {
      let address = action.payload.address - MEMORY_CODE_MAX_SIZE

      if (action.payload.type === InstructionType.LodComplexIX) {
        address = state.ix + action.payload.address - MEMORY_CODE_MAX_SIZE
      }

      if (action.payload.type === InstructionType.LodComplexSP) {
        address = state.sp + action.payload.address - MEMORY_CODE_MAX_SIZE
      }

      // TODO: throw if data is not in memory
      const data = state.dataList[address]

      console.log('lod', action.payload, address, data)


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
    },

    setLightsFetchStart(state, action: PayloadAction<boolean>) {
      state.lightAddressBus = action.payload
      state.lightPc = action.payload
      state.lightMar = action.payload
    },

    setLightCodeRow(state, action: PayloadAction<number | null>) {
      state.lightCodeRow = action.payload
    },

    setLightsFetchEnd(state, action: PayloadAction<boolean>) {
      state.lightDataBus = action.payload
      state.lightIr = action.payload
      state.lightMdr = action.payload
    },

    setLightPc(state, action: PayloadAction<boolean>) {
      state.lightPc = action.payload
    },

    setLightsExecuteStart(state, action: PayloadAction<boolean>) {
      state.lightIr = action.payload
      state.lightDecoder = action.payload
    }
  }
})

export const {
  reset,
  setExecutionSpeed,
  setCode,
  setData,
  setIsRunning,
  incrementPc,
  resetPc,
  hlt,
  add,
  sub,
  mul,
  div,
  inc,
  dec,
  mov,
  set,
  lod,
  sto,
  jmp,
  jmz,
  jml,
  jmg,
  psh,
  pop,
  cal,
  ret,
  setLightsFetchStart,
  setLightCodeRow,
  setLightsFetchEnd,
  setLightPc,
  setLightsExecuteStart
} = cpuSlice.actions

export default cpuSlice.reducer

export const executeNextInstruction = (): AppThunk => async (dispatch, getState) => {
  const { cpu } = getState()
  const instruction = cpu.instructions[cpu.pc] // TODO: throw if PC is > instructions.lenght

  const animationInterval = Math.floor(cpu.executionSpeed / 7)

  dispatch(setLightsFetchStart(true))

  await sleep(animationInterval)

  dispatch(setLightsFetchStart(false))
  dispatch(setLightCodeRow(cpu.pc))

  await sleep(animationInterval)

  dispatch(setLightsFetchEnd(true))

  await sleep(animationInterval)

  dispatch(setLightsFetchEnd(false))
  dispatch(setLightPc(true))
  dispatch(incrementPc())

  await sleep(animationInterval)

  dispatch(setLightPc(false))
  dispatch(setLightsExecuteStart(true))

  await sleep(animationInterval)

  dispatch(setLightsExecuteStart(false))

  switch (instruction.type) {
    case InstructionType.Hlt: {
      dispatch(hlt())
      break
    }
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
      if (cpu.r1 === 0) {
        dispatch(hlt())
      }
      break
    }
    case InstructionType.Inc: {
      dispatch(inc())
      break
    }
    case InstructionType.Dec: {
      dispatch(dec())
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
      dispatch(lod(instruction as LodInstruction))
      break
    }
    case InstructionType.LodComplexIX: {
      dispatch(lod(instruction as LodInstruction))
      break
    }
    case InstructionType.LodComplexSP: {
      dispatch(lod(instruction as LodInstruction))
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
      dispatch(jmz(instruction as JmzInstruction))
      break
    }
    case InstructionType.Jml: {
      dispatch(jml(instruction as JmlInstruction))
      break
    }
    case InstructionType.Jmg: {
      dispatch(jmg(instruction as JmgInstruction))
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
}
