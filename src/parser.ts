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


    StoSimple = Address
    
    StoComplexIX = IXAddress
    
    StoComplexSP = SPAddress
    
    StoBody = StoComplexIX | StoComplexSP | StoSimple
        
    Sto = "STO" StoBody
    
    
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

// https://github.com/harc/ohm/blob/master/doc/extras.md#configuration-using-a-mapping
const astMappings = {
  MovRegister: { 0: 0 },
  Mov: { type: 0, 1: 1 },
  SetRegister: { 0: 0 },
  LodSimpleRegister: { 0: 0 },
  LodComplexRegister: { 0: 0 },
  StoSimple: { 0: 0 },
  StoComplexIX: { 0: 0 },
  StoComplexSP: { 0: 0 },
  Jmp: { type: 0, 1: 1 },
  Jmz: { type: 0, 1: 1 },
  Jml: { type: 0, 1: 1 },
  Jmg: { type: 0, 1: 1 },
  Cal: { type: 0, 1: 1 },
  Integer: { 0: 0 }
}

interface Match {
  matched: boolean
  message?: string
  matchResult: MatchResult
  ast: any
}

const matchRows = (rows: string[]) => rows.reduce((matches: Match[], row) => {
  const matchResult = cpusimGrammar.match(row)
  const match: Match = {
    matched: matchResult.succeeded(),
    message: matchResult.shortMessage?.split(': ')[1],
    matchResult,
    ast: matchResult.succeeded() ? toAST(matchResult, astMappings) : {}
  }
  return matches.concat(match)
}, [])

export const parseCode = (code: string) => {
  const rows = code.split(/\r?\n/)
  const matches = matchRows(rows)
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
