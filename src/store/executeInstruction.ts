import { AppThunk } from './store'
import {
  setLightsFetchStart, setLightCodeRow, setLightsFetchEnd, setLightPc, incrementPc, setLightsExecuteStart,
  hlt, setLightR0, setLightR1, setLightAlu, setLightA, add, sub, mul, div, setLightIx, inc, dec, setLightDataBus,
  setLightRegister, mov, setLightDecoder, set, setLightAddressBus, setLightMar, setLightDataRow, setLightMdr, lod,
  sto, jmp, jmz, jml, jmg, psh, pop, cal, ret, setLightIxAdder, setLightSp, setLightSpAdder, setStatus, CpuStatus
} from './cpuSlice'
import { sleep } from '../utils/sleep'
import {
  InstructionType, MovInstruction, SetInstruction, LodInstruction, StoInstruction, JmpInstruction, JmzInstruction,
  JmlInstruction, JmgInstruction, CalInstruction
} from '../instructionParser'

export const executeNextInstruction = (): AppThunk => async (dispatch, getState) => {
  const { cpu } = getState()

  if (cpu.status !== CpuStatus.Running) {
    return
  }

  if (cpu.pc > cpu.instructions.length - 1) {
    dispatch(setStatus(CpuStatus.Idle))
    return
  }

  const instruction = cpu.instructions[cpu.pc]

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
      const setInstruction = instruction as SetInstruction

      dispatch(setLightDecoder(true))
      dispatch(setLightDataBus(true))

      await sleep(animationInterval)

      dispatch(setLightDecoder(false))
      dispatch(setLightRegister({ register: setInstruction.register, light: true }))
      dispatch(set(setInstruction))

      await sleep(animationInterval)

      dispatch(setLightDataBus(false))
      dispatch(setLightRegister({ register: setInstruction.register, light: false }))

      break
    }

    case InstructionType.LodSimple: {
      const lodInstruction = instruction as LodInstruction

      dispatch(setLightDecoder(true))
      dispatch(setLightAddressBus(true))
      dispatch(setLightMar(true))

      await sleep(animationInterval)

      dispatch(setLightDecoder(false))
      dispatch(setLightAddressBus(false))
      dispatch(setLightMar(false))
      dispatch(setLightDataRow(lodInstruction.address))

      await sleep(animationInterval)

      dispatch(setLightDataRow(null))
      dispatch(setLightMdr(true))
      dispatch(setLightDataBus(true))
      dispatch(setLightRegister({ register: lodInstruction.register, light: true }))
      dispatch(lod(lodInstruction))

      await sleep(animationInterval)

      dispatch(setLightMdr(false))
      dispatch(setLightDataBus(false))
      dispatch(setLightRegister({ register: lodInstruction.register, light: false }))

      break
    }

    case InstructionType.LodComplexIX: {
      const lodInstruction = instruction as LodInstruction

      dispatch(setLightDecoder(true))
      dispatch(setLightAddressBus(true))
      dispatch(setLightIx(true))
      dispatch(setLightIxAdder(true))

      await sleep(animationInterval)

      dispatch(setLightDecoder(false))
      dispatch(setLightIx(false))
      dispatch(setLightIxAdder(false))
      dispatch(setLightMar(true))

      await sleep(animationInterval)

      dispatch(setLightAddressBus(false))
      dispatch(setLightMar(false))
      dispatch(setLightDataRow(cpu.ix + lodInstruction.address))

      await sleep(animationInterval)

      dispatch(setLightDataRow(null))
      dispatch(setLightMdr(true))
      dispatch(setLightDataBus(true))
      dispatch(setLightRegister({ register: lodInstruction.register, light: true }))
      dispatch(lod(lodInstruction))

      await sleep(animationInterval)

      dispatch(setLightMdr(false))
      dispatch(setLightDataBus(false))
      dispatch(setLightRegister({ register: lodInstruction.register, light: false }))

      break
    }

    case InstructionType.LodComplexSP: {
      const lodInstruction = instruction as LodInstruction

      dispatch(setLightDecoder(true))
      dispatch(setLightAddressBus(true))
      dispatch(setLightSp(true))
      dispatch(setLightSpAdder(true))

      await sleep(animationInterval)

      dispatch(setLightDecoder(false))
      dispatch(setLightSp(false))
      dispatch(setLightSpAdder(false))
      dispatch(setLightMar(true))

      await sleep(animationInterval)

      dispatch(setLightAddressBus(false))
      dispatch(setLightMar(false))
      dispatch(setLightDataRow(cpu.sp - lodInstruction.address))

      await sleep(animationInterval)

      dispatch(setLightDataRow(null))
      dispatch(setLightMdr(true))
      dispatch(setLightDataBus(true))
      dispatch(setLightRegister({ register: lodInstruction.register, light: true }))
      dispatch(lod(lodInstruction))

      await sleep(animationInterval)

      dispatch(setLightMdr(false))
      dispatch(setLightDataBus(false))
      dispatch(setLightRegister({ register: lodInstruction.register, light: false }))

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

  dispatch(executeNextInstruction())
}

function computeAnimationInterval(executionSpeed: number) {
  return Math.floor(executionSpeed / 10) - 150
}
