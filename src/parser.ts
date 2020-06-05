import { grammar, Grammar, MatchResult } from 'ohm-fork'
import { toAST } from 'ohm-fork/extras'

// TODO: digit+ should not allow space between digits
const cpusimGrammar: Grammar = grammar(`CpuSim {
    Instruction = 
        | Nop 
        | Hlt 
        | Add 
        | Sub 
        | Mul 
        | Div 
        | Mov
        | Set
        | Lod
        | Sto
        | Jmp
        | Jmz
        | Jml
        | Jmg
        | Psh
        | Pop
        | Cal
        | Ret
        | Integer
        | end
        
    Integer = digit+
    
    Address = digit+
    
    IXAddress = "@"Address
    
    SPAddress = "$"Address
  
    Nop = "NOP"
    
    Hlt = "HLT"
    
    Add = "ADD"
    
    Sub = "SUB"
    
    Mul = "MUL"
    
    Div = "DIV"
    
    
    MovRegister = 
        "R0" 
        | "R1" 
        | "IX"
    
    Mov = "MOV" MovRegister
    
    
    SetRegister = 
        "R0" 
        | "R1" 
        | "IX"
        | "SP"
    
    Set = "SET" SetRegister Integer
    
    
    LodSimpleRegister = 
        "R0" 
        | "R1" 
        | "IX"
        | "SP"
    
    LodComplexRegister = 
        "R0" 
        | "R1"
        
    LodSimple = LodSimpleRegister Address
    
    LodComplexIX = LodComplexRegister IXAddress
    
    LodComplexSP = LodComplexRegister SPAddress
    
    LodBody = LodComplexIX | LodComplexSP | LodSimple
        
    Lod = "LOD" LodBody
    
    
    StoAddress = IXAddress | SPAddress | Address
    
    Sto = "STO" StoAddress
    
    
    Jmp = "JMP" Address
    
    Jmz = "JMZ" Address
    
    Jml = "JML" Address
    
    Jmg = "JMG" Address
    
    Psh = "PSH"
    
    Pop = "POP"
    
    Cal = "CAL" Address
    
    Ret = "RET"
  
  }  
`)

interface Match {
  matched: boolean
  message?: string
  matchResult: MatchResult
  ast: {}
}

const matchRows = (rows: string[]) => rows.reduce((matches: Match[], row) => {
  const matchResult = cpusimGrammar.match(row)
  const match: Match = {
    matched: matchResult.succeeded(),
    message: matchResult.shortMessage?.split(': ')[1],
    matchResult,
    ast: matchResult.succeeded() ? toAST(matchResult) : {}
  }
  return matches.concat(match)
}, [])

export const parseCode = (code: string) => {
  const rows = code.split(/\r?\n/)
  const matches = matchRows(rows)

  // eslint-disable-next-line no-console
  console.log('matches', matches)

  return matches
}

export interface SyntaxError {
  row: number
  col: number
  message: string
}

export const getSyntaxErrors = (matches: Match[]) => matches.reduce((errors: SyntaxError[], match, row) => {
  if (match.matched) return errors

  const error: SyntaxError = {
    row: row + 1,
    col: (match.matchResult as any).getRightmostFailurePosition() + 1,
    message: match.message ?? ''
  }
  return errors.concat(error)
}, [])
