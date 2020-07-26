/* eslint-disable @typescript-eslint/brace-style */
/* eslint-disable import/no-cycle */
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
import { AppThunk } from './store'
import {
  MEMORY_CODE_MAX_SIZE, MEMORY_DATA_MAX_SIZE, readDataFromMemory, writeDataToMemory, MEMORY_STACK_MAX_SIZE
} from './memoryManagement'


export enum CpuStatus {
  Idle,
  Running,
  Paused
}

export type CpuState = {
  status: CpuStatus
  executionSpeed: number
  codeMemoryRaw: string
  codeMemory: Instruction[]
  codeErrors: SyntaxError[]
  dataMemoryRaw: string
  dataMemory: Array<number|null>
  dataErrors: SyntaxError[]
  stackMemoryRaw: string
  stackMemory: Array<number|null>
  stackErrors: SyntaxError[]
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
  lightDataRow: number | null
  lightStackRow: number | null
  lightR0: boolean
  lightR1: boolean
  lightAlu: boolean
  lightA: boolean
  lightIx: boolean
  lightIxAdder: boolean
  lightSp: boolean
  lightSpAdder: boolean
}

export const initialCode = 'SET R0 #1\nSET R1 #2\nADD\nSTO 100\nHLT'

export const initialData = ''

const initialState: CpuState = {
  status: CpuStatus.Idle,
  executionSpeed: 2500,
  codeMemoryRaw: initialCode,
  codeMemory: [],
  codeErrors: [],
  dataMemoryRaw: initialData,
  dataMemory: [],
  dataErrors: [],
  stackMemoryRaw: '',
  stackMemory: [],
  stackErrors: [],
  pc: 0,
  r0: 0,
  r1: 0,
  a: 0,
  ix: 0,
  sp: MEMORY_CODE_MAX_SIZE + MEMORY_DATA_MAX_SIZE,
  lightAddressBus: false,
  lightDataBus: false,
  lightPc: false,
  lightIr: false,
  lightMar: false,
  lightMdr: false,
  lightDecoder: false,
  lightCodeRow: null,
  lightDataRow: null,
  lightStackRow: null,
  lightR0: false,
  lightR1: false,
  lightAlu: false,
  lightA: false,
  lightIx: false,
  lightIxAdder: false,
  lightSp: false,
  lightSpAdder: false
}

const cpuSlice = createSlice({
  name: 'cpu',
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
      state.lightDataRow = initialState.lightDataRow
      state.lightR0 = initialState.lightR0
      state.lightR1 = initialState.lightR1
      state.lightAlu = initialState.lightAlu
      state.lightA = initialState.lightA
      state.lightIx = initialState.lightIx
      state.lightIxAdder = initialState.lightIxAdder
      state.lightSp = initialState.lightSp
      state.lightSpAdder = initialState.lightSpAdder
    },

    setExecutionSpeed(state, action: PayloadAction<number>) {
      state.executionSpeed = action.payload
    },

    setCode(state, action: PayloadAction<string|undefined>) {
      state.codeMemoryRaw = action.payload ?? ''
      if (action.payload && action.payload !== '') {
        localStorage.setItem('cpusim-code', action.payload)
      } else {
        localStorage.removeItem('cpusim-code')
      }
      const matches = parseCode(state.codeMemoryRaw)
      state.codeErrors = getSyntaxErrors(matches)
      state.codeMemory = parseInstructions(matches.map(m => m.ast))
    },

    setData(state, action: PayloadAction<string|undefined>) {
      state.dataMemoryRaw = action.payload ?? ''
      if (action.payload && action.payload !== '') {
        localStorage.setItem('cpusim-data', action.payload)
      } else {
        localStorage.removeItem('cpusim-data')
      }
      const matches = parseCode(state.dataMemoryRaw, 'data')
      state.dataErrors = getSyntaxErrors(matches)
      state.dataMemory = parseData(matches.map(m => m.ast))
    },

    setStack(state, action: PayloadAction<string|undefined>) {
      state.stackMemoryRaw = action.payload ?? ''
      if (action.payload && action.payload !== '') {
        localStorage.setItem('cpusim-stack', action.payload)
      } else {
        localStorage.removeItem('cpusim-stack')
      }
      const matches = parseCode(state.stackMemoryRaw, 'stack')
      state.stackErrors = getSyntaxErrors(matches)
      state.stackMemory = parseData(matches.map(m => m.ast))
    },

    setStatus(state, action: PayloadAction<CpuStatus>) {
      state.status = action.payload
    },

    resetPc(state) {
      state.pc = initialState.pc
    },

    incrementPc(state) {
      state.pc += 1
    },

    // Instructions

    hlt(state) {
      state.status = CpuStatus.Idle
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
        case 'PC': {
          state.pc = action.payload.data
          break
        }
      }
    },

    lod(state, action: PayloadAction<LodInstruction>) {
      let { address } = action.payload

      if (action.payload.type === InstructionType.LodComplexIX) {
        address = state.ix + action.payload.address
      }

      if (action.payload.type === InstructionType.LodComplexSP) {
        address = state.sp - action.payload.address
      }

      const data = readDataFromMemory(state, address)

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
      let { address } = action.payload

      if (action.payload.type === InstructionType.StoComplexIX) {
        address = state.ix + action.payload.address
      }

      if (action.payload.type === InstructionType.StoComplexSP) {
        address = state.sp - action.payload.address
      }

      writeDataToMemory(state, address, state.a)
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
      const address = state.sp
      writeDataToMemory(state, address, state.a)
      state.sp += 1
    },

    pop(state) {
      state.sp -= 1
      const address = state.sp
      state.a = readDataFromMemory(state, address)
    },

    cal(state, action: PayloadAction<CalInstruction>) {
      const address = state.sp
      writeDataToMemory(state, address, state.pc)

      state.sp += 1
      state.pc = action.payload.address
    },

    ret(state) {
      state.sp -= 1
      const address = state.sp

      state.pc = readDataFromMemory(state, address)
    },

    setLightsFetchStart(state, action: PayloadAction<boolean>) {
      state.lightAddressBus = action.payload
      state.lightPc = action.payload
      state.lightMar = action.payload
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

    setLightIxAdder(state, action: PayloadAction<boolean>) {
      state.lightIxAdder = action.payload
    },

    setLightSp(state, action: PayloadAction<boolean>) {
      state.lightSp = action.payload
    },

    setLightSpAdder(state, action: PayloadAction<boolean>) {
      state.lightSpAdder = action.payload
    },

    setLightAddressBus(state, action: PayloadAction<boolean>) {
      state.lightAddressBus = action.payload
    },

    setLightDataBus(state, action: PayloadAction<boolean>) {
      state.lightDataBus = action.payload
    },

    setLightDecoder(state, action: PayloadAction<boolean>) {
      state.lightDecoder = action.payload
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
    },

    setLightMar(state, action: PayloadAction<boolean>) {
      state.lightMar = action.payload
    },

    setLightMdr(state, action: PayloadAction<boolean>) {
      state.lightMdr = action.payload
    },

    lightRamAddress(state, action: PayloadAction<AddressLight>) {
      const { address, light } = action.payload
      if (address < 0 || address >= MEMORY_CODE_MAX_SIZE + MEMORY_DATA_MAX_SIZE + MEMORY_STACK_MAX_SIZE) {
        // do nothing
      }
      else if (address < MEMORY_CODE_MAX_SIZE) {
        state.lightCodeRow = light ? address : null
      }
      else if (address < MEMORY_CODE_MAX_SIZE + MEMORY_DATA_MAX_SIZE) {
        state.lightDataRow = light ? address - MEMORY_CODE_MAX_SIZE : null
      }
      else if (address < MEMORY_CODE_MAX_SIZE + MEMORY_DATA_MAX_SIZE + MEMORY_STACK_MAX_SIZE) {
        state.lightStackRow = light ? address - (MEMORY_CODE_MAX_SIZE + MEMORY_DATA_MAX_SIZE) - MEMORY_CODE_MAX_SIZE : null
      }
    }

  }
})

interface RegisterLight {
  register: 'R0' | 'R1' | 'A' | 'SP' | 'IX' | 'PC'
  light: boolean
}

interface AddressLight {
  address: number
  light: boolean
}

export const {
  reset,
  setExecutionSpeed,
  setCode,
  setData,
  setStack,
  setStatus,
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
  setLightsFetchEnd,
  setLightPc,
  setLightsExecuteStart,
  setLightR0,
  setLightR1,
  setLightAlu,
  setLightA,
  setLightIx,
  setLightIxAdder,
  setLightSp,
  setLightSpAdder,
  setLightAddressBus,
  setLightDataBus,
  setLightDecoder,
  setLightRegister,
  setLightMar,
  setLightMdr,
  lightRamAddress
} = cpuSlice.actions

export default cpuSlice.reducer

export const setInitialCodeAndData = (): AppThunk => async (dispatch, _getState) => {
  const savedCode = localStorage.getItem('cpusim-code')
  if (savedCode != null && savedCode !== '') {
    dispatch(setCode(savedCode))
  } else {
    dispatch(setCode(initialState.codeMemoryRaw))
  }

  const savedData = localStorage.getItem('cpusim-data')
  if (savedData != null && savedData !== '') {
    dispatch(setData(savedData))
  }

  const savedStack = localStorage.getItem('cpusim-stack')
  if (savedStack != null && savedStack !== '') {
    dispatch(setStack(savedStack))
  }
}
