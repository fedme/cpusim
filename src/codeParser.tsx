/* eslint-disable radix */
import store from './store/store'
import {
  incrementCodeRowIndex, setR0, setR1, add
} from './store/cpuSlice'

const parseSet = (instruction: string) => {
  const instructionParts = instruction.split(' ')
  const register = instructionParts[1]
  const value = parseInt(instructionParts[2])

  switch (register) {
    case 'R0':
      return store.dispatch(setR0(value))
    case 'R1':
      return store.dispatch(setR1(value))
    default:
      return null
  }
}

const parseAdd = () => {
  store.dispatch(add())
}

const parseInstruction = (instruction: string) => {
  console.log('Executing instruction ', instruction)

  const instructionType = instruction.split(' ')[0]
  switch (instructionType) {
    case 'SET':
      return parseSet(instruction)
    case 'ADD':
      return parseAdd()
    default:
      return null
  }
}

export const executeNextInstruction = () => {
  const { instructions, codeRowIndex } = store.getState().cpu

  if (codeRowIndex >= instructions.length) {
    return true
  }

  const instruction = instructions[codeRowIndex]
  parseInstruction(instruction)

  store.dispatch(incrementCodeRowIndex())

  return false
}
