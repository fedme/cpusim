import {
  createSlice, PayloadAction
} from '@reduxjs/toolkit'
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
  lightR0: boolean
  lightR1: boolean
  lightAlu: boolean
  lightA: boolean
  lightIx: boolean
  lightSp: boolean
}

export const initialCode = ''

export const initialData = ''

const initialState: cpuState = {
  isRunning: false,
  executionSpeed: 2500,
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
  lightCodeRow: null,
  lightR0: false,
  lightR1: false,
  lightAlu: false,
  lightA: false,
  lightIx: false,
  lightSp: false
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
      state.lightR0 = initialState.lightR0
      state.lightR1 = initialState.lightR1
      state.lightAlu = initialState.lightAlu
      state.lightA = initialState.lightA
      state.lightIx = initialState.lightIx
      state.lightSp = initialState.lightSp
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
    },

    setLightR0(state, action: PayloadAction<boolean>) {
      state.lightR0 = action.payload
    },

    setLightR1(state, action: PayloadAction<boolean>) {
      state.lightR1 = action.payload
    },

    setLightAlu(state, action: PayloadAction<boolean>) {
      state.lightAlu = action.payload
    },

    setLightA(state, action: PayloadAction<boolean>) {
      state.lightA = action.payload
    },

    setLightIx(state, action: PayloadAction<boolean>) {
      state.lightIx = action.payload
    },

    setLightSp(state, action: PayloadAction<boolean>) {
      state.lightSp = action.payload
    },

    setLightDataBus(state, action: PayloadAction<boolean>) {
      state.lightDataBus = action.payload
    },

    setLightRegister(state, action: PayloadAction<RegisterLight>) {
      switch (action.payload.register) {
        case 'R0': {
          state.lightR0 = action.payload.light
          break
        }
        case 'R1': {
          state.lightR1 = action.payload.light
          break
        }
        case 'A': {
          state.lightA = action.payload.light
          break
        }
        case 'IX': {
          state.lightIx = action.payload.light
          break
        }
        case 'SP': {
          state.lightSp = action.payload.light
          break
        }
      }
    }
  }
})

interface RegisterLight {
  register: 'R0' | 'R1' | 'A' | 'SP' | 'IX'
  light: boolean
}

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
  setLightsExecuteStart,
  setLightR0,
  setLightR1,
  setLightAlu,
  setLightA,
  setLightIx,
  setLightSp,
  setLightDataBus,
  setLightRegister
} = cpuSlice.actions

export default cpuSlice.reducer

export const executeNextInstruction = (): AppThunk => async (dispatch, getState) => {
  const { cpu } = getState()
  const instruction = cpu.instructions[cpu.pc] // TODO: throw if PC is > instructions.lenght

  const animationInterval = computeAnimationInterval(cpu.executionSpeed)

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
      dispatch(setLightR0(true))
      dispatch(setLightR1(true))

      await sleep(animationInterval)

      dispatch(setLightR0(false))
      dispatch(setLightR1(false))
      dispatch(setLightAlu(true))

      await sleep(animationInterval)

      dispatch(setLightAlu(false))
      dispatch(setLightA(true))
      dispatch(add())

      await sleep(animationInterval)

      dispatch(setLightA(false))

      break
    }

    case InstructionType.Sub: {
      dispatch(setLightR0(true))
      dispatch(setLightR1(true))

      await sleep(animationInterval)

      dispatch(setLightR0(false))
      dispatch(setLightR1(false))
      dispatch(setLightAlu(true))

      await sleep(animationInterval)

      dispatch(setLightAlu(false))
      dispatch(setLightA(true))
      dispatch(sub())

      await sleep(animationInterval)

      dispatch(setLightA(false))

      break
    }

    case InstructionType.Mul: {
      dispatch(setLightR0(true))
      dispatch(setLightR1(true))

      await sleep(animationInterval)

      dispatch(setLightR0(false))
      dispatch(setLightR1(false))
      dispatch(setLightAlu(true))

      await sleep(animationInterval)

      dispatch(setLightAlu(false))
      dispatch(setLightA(true))
      dispatch(mul())

      await sleep(animationInterval)

      dispatch(setLightA(false))

      break
    }

    case InstructionType.Div: {
      dispatch(setLightR0(true))
      dispatch(setLightR1(true))

      await sleep(animationInterval)

      dispatch(setLightR0(false))
      dispatch(setLightR1(false))
      dispatch(setLightAlu(true))

      await sleep(animationInterval)

      dispatch(setLightAlu(false))
      dispatch(setLightA(true))
      dispatch(div())
      if (cpu.r1 === 0) {
        dispatch(hlt())
      }

      await sleep(animationInterval)

      dispatch(setLightA(false))

      break
    }

    case InstructionType.Inc: {
      dispatch(setLightIx(true))
      dispatch(inc())

      await sleep(animationInterval)

      dispatch(setLightIx(false))

      break
    }


    case InstructionType.Dec: {
      dispatch(setLightIx(true))
      dispatch(dec())

      await sleep(animationInterval)

      dispatch(setLightIx(false))

      break
    }

    case InstructionType.Mov: {
      const movInstruction = instruction as MovInstruction

      dispatch(setLightA(true))
      dispatch(setLightDataBus(true))

      await sleep(animationInterval)

      dispatch(setLightA(false))
      dispatch(setLightRegister({ register: movInstruction.register, light: true }))
      dispatch(mov(movInstruction))

      await sleep(animationInterval)

      dispatch(setLightRegister({ register: movInstruction.register, light: false }))
      dispatch(setLightDataBus(false))

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

function computeAnimationInterval(executionSpeed: number) {
  return Math.floor(executionSpeed / 10) - 150
}
