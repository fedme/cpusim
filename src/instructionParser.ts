/* eslint-disable radix */
enum InstructionType {
  Nop = 'NOP',
  Hlt = 'HLT',
  Add = 'ADD',
  Sub = 'SUB',
  Mul = 'MUL',
  Div = 'DIV',
  Mov = 'MOV',
  Set = 'SET',
  Lod = 'LOD'
}

interface Instruction {
  type: InstructionType
}

interface MovInstruction extends Instruction {
  register: 'R0' | 'R1' | 'IX'
}

interface SetInstruction extends Instruction {
  register: 'R0' | 'R1' | 'IX' | 'SP'
  data: number
}

const parseInstruction = (tree: any) => {
  let instruction: Instruction = { type: InstructionType.Nop }

  if (tree == null || tree === '') {
    return instruction
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
      console.log('SET', tree)
      const data = parseInt(tree[2].join())
      instruction = { type: InstructionType.Set, register: tree[1][0], data } as SetInstruction
      break
    }

    default: {
      console.error('Unrecognized instruction type')
    }
  }

  return instruction
}

export const parseInstructions = (trees: any[]) => trees.reduce((instructions: Instruction[], tree) => {
  const instruction = parseInstruction(tree)
  return instructions.concat(instruction)
}, [])
