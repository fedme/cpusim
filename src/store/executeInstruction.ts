import { AppThunk } from './store'
import {
  setLightsFetchStart, setLightsFetchEnd, lightPc, incrementPc, setLightsExecuteStart,
  hlt, lightR0, lightR1, lightAlu, lightA, add, sub, mul, div, lightIx, inc, dec, lightDataBus,
  lightRegister, mov, lightDecoder, set, lightAddressBus, lightMar, lightMdr, lod,
  sto, jmp, jmz, jml, jmg, psh, pop, cal, ret, lightIxAdder, lightSp, lightSpAdder, setStatus, CpuStatus, lightRamAddress
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

  if (cpu.pc > cpu.codeMemory.length - 1) {
    dispatch(setStatus(CpuStatus.Idle))
    return
  }

  const instruction = cpu.codeMemory[cpu.pc]

  const animationInterval = computeAnimationInterval(cpu.executionSpeed)

  dispatch(setLightsFetchStart(true))

  await sleep(animationInterval)

  dispatch(setLightsFetchStart(false))
  dispatch(lightRamAddress({ address: cpu.pc, light: true }))

  await sleep(animationInterval)

  dispatch(setLightsFetchEnd(true))

  await sleep(animationInterval)

  dispatch(setLightsFetchEnd(false))
  dispatch(lightPc(true))
  dispatch(incrementPc())

  await sleep(animationInterval)

  dispatch(lightPc(false))
  dispatch(setLightsExecuteStart(true))

  await sleep(animationInterval)

  dispatch(setLightsExecuteStart(false))

  switch (instruction.type) {
    case InstructionType.Hlt: {
      dispatch(hlt())
      break
    }

    case InstructionType.Add: {
      dispatch(lightR0(true))
      dispatch(lightR1(true))

      await sleep(animationInterval)

      dispatch(lightR0(false))
      dispatch(lightR1(false))
      dispatch(lightAlu(true))

      await sleep(animationInterval)

      dispatch(lightAlu(false))
      dispatch(lightA(true))
      dispatch(add())

      await sleep(animationInterval)

      dispatch(lightA(false))

      break
    }

    case InstructionType.Sub: {
      dispatch(lightR0(true))
      dispatch(lightR1(true))

      await sleep(animationInterval)

      dispatch(lightR0(false))
      dispatch(lightR1(false))
      dispatch(lightAlu(true))

      await sleep(animationInterval)

      dispatch(lightAlu(false))
      dispatch(lightA(true))
      dispatch(sub())

      await sleep(animationInterval)

      dispatch(lightA(false))

      break
    }

    case InstructionType.Mul: {
      dispatch(lightR0(true))
      dispatch(lightR1(true))

      await sleep(animationInterval)

      dispatch(lightR0(false))
      dispatch(lightR1(false))
      dispatch(lightAlu(true))

      await sleep(animationInterval)

      dispatch(lightAlu(false))
      dispatch(lightA(true))
      dispatch(mul())

      await sleep(animationInterval)

      dispatch(lightA(false))

      break
    }

    case InstructionType.Div: {
      dispatch(lightR0(true))
      dispatch(lightR1(true))

      await sleep(animationInterval)

      dispatch(lightR0(false))
      dispatch(lightR1(false))
      dispatch(lightAlu(true))

      await sleep(animationInterval)

      dispatch(lightAlu(false))
      dispatch(lightA(true))
      dispatch(div())
      if (cpu.r1 === 0) {
        dispatch(hlt())
      }

      await sleep(animationInterval)

      dispatch(lightA(false))

      break
    }

    case InstructionType.Inc: {
      dispatch(lightIx(true))
      dispatch(inc())

      await sleep(animationInterval)

      dispatch(lightIx(false))

      break
    }


    case InstructionType.Dec: {
      dispatch(lightIx(true))
      dispatch(dec())

      await sleep(animationInterval)

      dispatch(lightIx(false))

      break
    }

    case InstructionType.Mov: {
      const movInstruction = instruction as MovInstruction

      dispatch(lightA(true))
      dispatch(lightDataBus(true))

      await sleep(animationInterval)

      dispatch(lightA(false))
      dispatch(lightRegister({ register: movInstruction.register, light: true }))
      dispatch(mov(movInstruction))

      await sleep(animationInterval)

      dispatch(lightRegister({ register: movInstruction.register, light: false }))
      dispatch(lightDataBus(false))

      break
    }

    case InstructionType.Set: {
      const setInstruction = instruction as SetInstruction

      dispatch(lightDecoder(true))
      dispatch(lightDataBus(true))

      await sleep(animationInterval)

      dispatch(lightDecoder(false))
      dispatch(lightRegister({ register: setInstruction.register, light: true }))
      dispatch(set(setInstruction))

      await sleep(animationInterval)

      dispatch(lightDataBus(false))
      dispatch(lightRegister({ register: setInstruction.register, light: false }))

      break
    }

    case InstructionType.LodSimple: {
      const lodInstruction = instruction as LodInstruction

      dispatch(lightDecoder(true))
      dispatch(lightAddressBus(true))
      dispatch(lightMar(true))

      await sleep(animationInterval)

      dispatch(lightDecoder(false))
      dispatch(lightAddressBus(false))
      dispatch(lightMar(false))
      dispatch(lightRamAddress({ address: lodInstruction.address, light: true }))

      await sleep(animationInterval)

      dispatch(lightRamAddress({ address: lodInstruction.address, light: false }))
      dispatch(lightMdr(true))
      dispatch(lightDataBus(true))
      dispatch(lightRegister({ register: lodInstruction.register, light: true }))
      dispatch(lod(lodInstruction))

      await sleep(animationInterval)

      dispatch(lightMdr(false))
      dispatch(lightDataBus(false))
      dispatch(lightRegister({ register: lodInstruction.register, light: false }))

      break
    }

    case InstructionType.LodComplexIX: {
      const lodInstruction = instruction as LodInstruction

      dispatch(lightDecoder(true))
      dispatch(lightAddressBus(true))
      dispatch(lightIx(true))
      dispatch(lightIxAdder(true))

      await sleep(animationInterval)

      dispatch(lightDecoder(false))
      dispatch(lightIx(false))
      dispatch(lightIxAdder(false))
      dispatch(lightMar(true))

      await sleep(animationInterval)

      dispatch(lightAddressBus(false))
      dispatch(lightMar(false))
      dispatch(lightRamAddress({ address: cpu.ix + lodInstruction.address, light: true }))

      await sleep(animationInterval)

      dispatch(lightRamAddress({ address: cpu.ix + lodInstruction.address, light: false }))
      dispatch(lightMdr(true))
      dispatch(lightDataBus(true))
      dispatch(lightRegister({ register: lodInstruction.register, light: true }))
      dispatch(lod(lodInstruction))

      await sleep(animationInterval)

      dispatch(lightMdr(false))
      dispatch(lightDataBus(false))
      dispatch(lightRegister({ register: lodInstruction.register, light: false }))

      break
    }

    case InstructionType.LodComplexSP: {
      const lodInstruction = instruction as LodInstruction

      dispatch(lightDecoder(true))
      dispatch(lightAddressBus(true))
      dispatch(lightSp(true))
      dispatch(lightSpAdder(true))

      await sleep(animationInterval)

      dispatch(lightDecoder(false))
      dispatch(lightSp(false))
      dispatch(lightSpAdder(false))
      dispatch(lightMar(true))

      await sleep(animationInterval)

      dispatch(lightAddressBus(false))
      dispatch(lightMar(false))
      dispatch(lightRamAddress({ address: cpu.sp - lodInstruction.address, light: true }))

      await sleep(animationInterval)

      dispatch(lightRamAddress({ address: cpu.sp - lodInstruction.address, light: false }))
      dispatch(lightMdr(true))
      dispatch(lightDataBus(true))
      dispatch(lightRegister({ register: lodInstruction.register, light: true }))
      dispatch(lod(lodInstruction))

      await sleep(animationInterval)

      dispatch(lightMdr(false))
      dispatch(lightDataBus(false))
      dispatch(lightRegister({ register: lodInstruction.register, light: false }))

      break
    }

    case InstructionType.StoSimple: {
      const stoInstruction = instruction as StoInstruction

      dispatch(lightDecoder(true))
      dispatch(lightAddressBus(true))
      dispatch(lightMar(true))
      dispatch(lightA(true))
      dispatch(lightDataBus(true))
      dispatch(lightMdr(true))

      await sleep(animationInterval)

      dispatch(lightDecoder(false))
      dispatch(lightAddressBus(false))
      dispatch(lightMar(false))
      dispatch(lightA(false))
      dispatch(lightDataBus(false))
      dispatch(lightMdr(false))

      dispatch(sto(stoInstruction))
      dispatch(lightRamAddress({ address: stoInstruction.address, light: true }))

      await sleep(animationInterval)

      dispatch(lightRamAddress({ address: stoInstruction.address, light: false }))

      break
    }

    case InstructionType.StoComplexIX: {
      const stoInstruction = instruction as StoInstruction

      dispatch(lightDecoder(true))
      dispatch(lightAddressBus(true))
      dispatch(lightIx(true))
      dispatch(lightIxAdder(true))

      await sleep(animationInterval)

      dispatch(lightDecoder(false))
      dispatch(lightIx(false))
      dispatch(lightIxAdder(false))
      dispatch(lightMar(true))
      dispatch(lightA(true))
      dispatch(lightDataBus(true))
      dispatch(lightMdr(true))

      await sleep(animationInterval)

      dispatch(lightAddressBus(false))
      dispatch(lightMar(false))
      dispatch(lightA(false))
      dispatch(lightDataBus(false))
      dispatch(lightMdr(false))

      dispatch(sto(stoInstruction))
      dispatch(lightRamAddress({ address: cpu.ix + stoInstruction.address, light: true }))

      await sleep(animationInterval)

      dispatch(lightRamAddress({ address: cpu.ix + stoInstruction.address, light: false }))

      break
    }

    case InstructionType.StoComplexSP: {
      const stoInstruction = instruction as StoInstruction

      dispatch(lightDecoder(true))
      dispatch(lightAddressBus(true))
      dispatch(lightSp(true))
      dispatch(lightSpAdder(true))

      await sleep(animationInterval)

      dispatch(lightDecoder(false))
      dispatch(lightSp(false))
      dispatch(lightSpAdder(false))
      dispatch(lightMar(true))
      dispatch(lightA(true))
      dispatch(lightDataBus(true))
      dispatch(lightMdr(true))

      await sleep(animationInterval)

      dispatch(lightAddressBus(false))
      dispatch(lightMar(false))
      dispatch(lightA(false))
      dispatch(lightDataBus(false))
      dispatch(lightMdr(false))

      dispatch(sto(stoInstruction))
      dispatch(lightRamAddress({ address: cpu.sp - stoInstruction.address, light: true }))

      await sleep(animationInterval)

      dispatch(lightRamAddress({ address: cpu.sp - stoInstruction.address, light: false }))

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
