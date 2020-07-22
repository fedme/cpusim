// eslint-disable-next-line import/no-cycle
import { CpuState } from './cpuSlice'

export const MEMORY_CODE_MAX_SIZE = 100
export const MEMORY_DATA_MAX_SIZE = 400
export const MEMORY_STACK_MAX_SIZE = 500

// TODO: light up correct memory row
export function readDataFromMemory(state: CpuState, address: number): number {
  let data: number | null = 0

  if (address < MEMORY_CODE_MAX_SIZE || address >= MEMORY_CODE_MAX_SIZE + MEMORY_DATA_MAX_SIZE + MEMORY_STACK_MAX_SIZE) {
    // eslint-disable-next-line no-alert
    alert(`Impossibile leggere dall'indirizzo ${address}. L'indirizzo non esiste nelle sezioni dati e stack della memoria.`)
    return data
  }

  try {
    if (address < MEMORY_CODE_MAX_SIZE + MEMORY_DATA_MAX_SIZE) {
      data = state.dataMemory[address - MEMORY_CODE_MAX_SIZE]
      return data ?? 0
    }

    data = state.stackMemory[address - (MEMORY_CODE_MAX_SIZE + MEMORY_DATA_MAX_SIZE)]
    return data ?? 0
  } catch {
    return 0
  }
}

// TODO: light up correct memory row
export function writeDataToMemory(state: CpuState, address: number, value: number): void {
  if (address < MEMORY_CODE_MAX_SIZE || address >= MEMORY_CODE_MAX_SIZE + MEMORY_DATA_MAX_SIZE + MEMORY_STACK_MAX_SIZE) {
    // eslint-disable-next-line no-alert
    alert(`Impossibile scrivere all'indirizzo ${address}. L'indirizzo non esiste nelle sezioni dati e stack della memoria.`)
  }

  // write to data
  if (address < MEMORY_CODE_MAX_SIZE + MEMORY_DATA_MAX_SIZE) {
    address -= MEMORY_CODE_MAX_SIZE

    if (address > state.dataMemory.length) {
      for (let i = 0; i < address - state.dataMemory.length; i += 1) {
        state.dataMemory.push(null)
      }
    }

    state.dataMemory[address] = value
    state.dataMemoryRaw = state.dataMemory.join('\n')
  // eslint-disable-next-line @typescript-eslint/brace-style
  }

  // write to stack
  else {
    address -= (MEMORY_CODE_MAX_SIZE + MEMORY_DATA_MAX_SIZE)
    if (address > state.stackMemory.length) {
      for (let i = 0; i < address - state.stackMemory.length; i += 1) {
        state.stackMemory.push(null)
      }
    }
    state.stackMemory[address] = value
    state.stackMemoryRaw = state.stackMemory.join('\n')
  }
}
