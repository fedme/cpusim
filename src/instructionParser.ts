/* eslint-disable radix */
export enum InstructionType {
  Nop = 'NOP',
  Hlt = 'HLT',
  Add = 'ADD',
  Sub = 'SUB',
  Mul = 'MUL',
  Div = 'DIV',
  Mov = 'MOV',
  Set = 'SET',
  LodSimple = 'LOD_SIMPLE',
  LodComplexIX = 'LOD_COMPLEX_IX',
  LodComplexSP = 'LOD_COMPLEX_SP',
  StoSimple = 'STO_SIMPLE',
  StoComplexIX = 'STO_COMPLEX_IX',
  StoComplexSP = 'STO_COMPLEX_SP',
  Jmp = 'JMP',
  Jmz = 'JMZ',
  Jml = 'JML',
  Jmg = 'JMG',
  Psh = 'PSH',
  Pop = 'POP',
  Cal = 'CAL',
  Ret = 'RET'
}

export interface Instruction {
  type: InstructionType
}

export interface MovInstruction extends Instruction {
  register: 'R0' | 'R1' | 'IX'
}

export interface SetInstruction extends Instruction {
  register: 'R0' | 'R1' | 'IX' | 'SP'
  data: number
}

export interface LodSimpleInstruction extends Instruction {
  address: number
  register: 'R0' | 'R1' | 'IX' | 'SP'
}

export interface LodComplexInstruction extends Instruction {
  address: number
  register: 'R0' | 'R1'
}

export interface StoInstruction extends Instruction {
  address: number
}

export interface JmpInstruction extends Instruction {
  address: number
}

export interface JmzInstruction extends Instruction {
  address: number
}

export interface JmlInstruction extends Instruction {
  address: number
}

export interface JmgInstruction extends Instruction {
  address: number
}

export interface CalInstruction extends Instruction {
  address: number
}

const parseInstruction = (tree: any) => {
  let instruction: Instruction = { type: InstructionType.Nop }

  if (tree?.type == null || tree === '') {
    return instruction
    // TODO: collect parsing error (requires the function to take whole match as argument and not just
    // tree so that we can get the line number)
  }

  switch ((tree.type as string).toUpperCase()) {
    case 'NOP': {
      instruction = { type: InstructionType.Nop }
      break
    }

    case 'HLT': {
      instruction = { type: InstructionType.Hlt }
      break
    }

    case 'ADD': {
      instruction = { type: InstructionType.Add }
      break
    }

    case 'SUB': {
      instruction = { type: InstructionType.Sub }
      break
    }

    case 'MUL': {
      instruction = { type: InstructionType.Mul }
      break
    }

    case 'DIV': {
      instruction = { type: InstructionType.Div }
      break
    }

    case 'MOV': {
      instruction = { type: InstructionType.Mov, register: tree[1][0] } as MovInstruction
      break
    }

    case 'SET': {
      const data = parseInt(tree[2][0].join('')) // TODO: collect parsing error
      instruction = { type: InstructionType.Set, register: tree[1][0], data } as SetInstruction
      break
    }

    case 'LODSIMPLE': {
      const address = parseInt(tree[1].join('')) // TODO: collect parsing error
      instruction = { type: InstructionType.LodSimple, register: tree[0][0], address } as LodSimpleInstruction
      break
    }

    case 'LODCOMPLEXIX': {
      const address = parseInt(tree[1].join('')) // TODO: collect parsing error
      instruction = { type: InstructionType.LodComplexIX, register: tree[0][0], address } as LodComplexInstruction
      break
    }

    case 'LODCOMPLEXSP': {
      const address = parseInt(tree[1].join('')) // TODO: collect parsing error
      instruction = { type: InstructionType.LodComplexSP, register: tree[0][0], address } as LodComplexInstruction
      break
    }

    case 'STOSIMPLE': {
      const address = parseInt(tree[0].join('')) // TODO: collect parsing error
      instruction = { type: InstructionType.StoSimple, address } as StoInstruction
      break
    }

    case 'STOCOMPLEXIX': {
      const address = parseInt(tree[0].join('')) // TODO: collect parsing error
      instruction = { type: InstructionType.StoComplexIX, address } as StoInstruction
      break
    }

    case 'STOCOMPLEXSP': {
      const address = parseInt(tree[0].join('')) // TODO: collect parsing error
      instruction = { type: InstructionType.StoComplexSP, address } as StoInstruction
      break
    }

    case 'JMP': {
      const address = parseInt(tree[1].join('')) // TODO: collect parsing error
      instruction = { type: InstructionType.Jmp, address } as JmpInstruction
      break
    }

    case 'JMZ': {
      const address = parseInt(tree[1].join('')) // TODO: collect parsing error
      instruction = { type: InstructionType.Jmz, address } as JmzInstruction
      break
    }

    case 'JML': {
      const address = parseInt(tree[1].join('')) // TODO: collect parsing error
      instruction = { type: InstructionType.Jml, address } as JmlInstruction
      break
    }

    case 'JMG': {
      const address = parseInt(tree[1].join('')) // TODO: collect parsing error
      instruction = { type: InstructionType.Jmg, address } as JmgInstruction
      break
    }

    case 'PSH': {
      instruction = { type: InstructionType.Psh }
      break
    }

    case 'POP': {
      instruction = { type: InstructionType.Pop }
      break
    }

    case 'CAL': {
      const address = parseInt(tree[1].join('')) // TODO: collect parsing error
      instruction = { type: InstructionType.Cal, address } as CalInstruction
      break
    }

    case 'RET': {
      instruction = { type: InstructionType.Ret }
      break
    }

    default: {
      throw new Error('Unrecognized instruction type') // TODO collect parsing error
    }
  }

  return instruction
}

export const parseInstructions = (trees: any[]) => trees.reduce((instructions: Instruction[], tree) => {
  const instruction = parseInstruction(tree)
  return instructions.concat(instruction)
}, [])

export const parseData = (trees: any[]) => trees.reduce((dataList: Array<number | null>, tree) => {
  let data = null

  if (tree?.type != null && tree !== '' && (tree.type as string).toUpperCase() === 'INTEGER') {
    data = parseInt(tree[0].join(''))
  } else {
    // TODO: collect parsing error (requires the function to take whole match as argument and not just
    // tree so that we can get the line number)
  }

  return dataList.concat(data)
}, [])
