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

export const MEMORY_CODE_MAX_SIZE = 100

export enum CpuStatus {
  Idle,
  Running,
  Paused
}

type cpuState = {
  status: CpuStatus
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
  lightDataRow: number | null
  lightR0: boolean
  lightR1: boolean
  lightAlu: boolean
  lightA: boolean
  lightIx: boolean
  lightIxAdder: boolean
  lightSp: boolean
  lightSpAdder: boolean
}

export const initialCode = 'SET R0 #2\nSET R1 #2\nADD'

export const initialData = ''

const initialState: cpuState = {
  status: CpuStatus.Idle,
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
  lightDataRow: null,
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
      state.code = action.payload ?? ''
      if (action.payload && action.payload !== '') {
        localStorage.setItem('cpusim-code', action.payload)
      } else {
        localStorage.removeItem('cpusim-code')
      }
      const matches = parseCode(state.code)
      state.syntaxErrors = getSyntaxErrors(matches)
      state.instructions = parseInstructions(matches.map(m => m.ast))
    },

    setData(state, action: PayloadAction<string|undefined>) {
      state.data = action.payload ?? ''
      if (action.payload && action.payload !== '') {
        localStorage.setItem('cpusim-data', action.payload)
      } else {
        localStorage.removeItem('cpusim-data')
      }
      const matches = parseCode(state.data, 'data')
      state.dataSyntaxErrors = getSyntaxErrors(matches)
      state.dataList = parseData(matches.map(m => m.ast))
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
      let address = action.payload.address - MEMORY_CODE_MAX_SIZE

      if (action.payload.type === InstructionType.LodComplexIX) {
        address = state.ix + action.payload.address - MEMORY_CODE_MAX_SIZE
      }

      if (action.payload.type === InstructionType.LodComplexSP) {
        address = state.sp - action.payload.address - MEMORY_CODE_MAX_SIZE
      }

      // TODO: return 0 if data is not in memory
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
        address = state.sp - action.payload.address - MEMORY_CODE_MAX_SIZE
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

      state.sp += 1
    },

    pop(state) {
      state.sp -= 1
      const address = state.sp - MEMORY_CODE_MAX_SIZE

      state.a = state.dataList[address]! // TODO: Return 0 if null / not present
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

      state.sp += 1
      state.pc = action.payload.address
    },

    ret(state) {
      state.sp -= 1
      const address = state.sp - MEMORY_CODE_MAX_SIZE

      state.pc = state.dataList[address]! // TODO: Return 0 if null / not present
    },

    setLightsFetchStart(state, action: PayloadAction<boolean>) {
      state.lightAddressBus = action.payload
      state.lightPc = action.payload
      state.lightMar = action.payload
    },

    setLightCodeRow(state, action: PayloadAction<number | null>) {
      state.lightCodeRow = action.payload
    },

    setLightDataRow(state, action: PayloadAction<number | null>) {
      state.lightDataRow = action.payload
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
    }

  }
})

interface RegisterLight {
  register: 'R0' | 'R1' | 'A' | 'SP' | 'IX' | 'PC'
  light: boolean
}

export const {
  reset,
  setExecutionSpeed,
  setCode,
  setData,
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
  setLightCodeRow,
  setLightDataRow,
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
  setLightMdr
} = cpuSlice.actions

export default cpuSlice.reducer

export const setInitialCodeAndData = (): AppThunk => async (dispatch, _getState) => {
  const savedCode = localStorage.getItem('cpusim-code')
  if (savedCode != null && savedCode !== '') {
    dispatch(setCode(savedCode))
  } else {
    dispatch(setCode(initialState.code))
  }

  const savedData = localStorage.getItem('cpusim-data')
  if (savedData != null && savedData !== '') {
    dispatch(setData(savedData))
  }
}
