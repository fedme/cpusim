import { grammar, Grammar, MatchResult } from 'ohm-fork'
import { toAST } from 'ohm-fork/extras'

const codeGrammar: Grammar = grammar(`CpuSimCode {
    Instruction = 
        | Nop 
        | Hlt 
        | Add 
        | Sub 
        | Mul 
        | Div
        | Inc
        | Dec
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
        | end
        
    PositiveInteger = digit+

    NegativeInteger = "-"digit+
    
    Integer = NegativeInteger | PositiveInteger
    
    Address = digit+
    
    IXAddress = "@"Address
    
    SPAddress = "$"Address
  
    Nop = "NOP"
    
    Hlt = "HLT"
    
    Add = "ADD"
    
    Sub = "SUB"
    
    Mul = "MUL"
    
    Div = "DIV"

    Inc = "INC IX"

    Dec = "DEC IX"
  
    
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
        | "A"
    
    Set = "SET" SetRegister "#"Integer
    
    
    LodRegister = 
        "R0" 
        | "R1"
        
    LodSimple = LodRegister Address
    
    LodComplexIX = LodRegister IXAddress
    
    LodComplexSP = LodRegister SPAddress
    
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

const dataGrammar: Grammar = grammar(`CpuSimData {
  Instruction = 
      | Integer
      | end
      
  PositiveInteger = digit+

  NegativeInteger = "-"digit+
  
  Integer = NegativeInteger | PositiveInteger
}  
`)

// https://github.com/harc/ohm/blob/master/doc/extras.md#configuration-using-a-mapping
const astMappings = {
  MovRegister: { 0: 0 },
  Mov: { type: 0, 1: 1 },
  SetRegister: { 0: 0 },
  LodRegister: { 0: 0 },
  StoSimple: { 0: 0 },
  StoComplexIX: { 0: 0 },
  StoComplexSP: { 0: 0 },
  Jmp: { type: 0, 1: 1 },
  Jmz: { type: 0, 1: 1 },
  Jml: { type: 0, 1: 1 },
  Jmg: { type: 0, 1: 1 },
  Cal: { type: 0, 1: 1 },
  PositiveInteger: { 0: 0 },
  NegativeInteger: { 0: 0, 1: 1 }
}

interface Match {
  matched: boolean
  message?: string
  matchResult: MatchResult
  ast: any
}

const matchRows = (rows: string[], type: 'code' | 'data' = 'code') => rows.reduce((matches: Match[], row) => {
  const matchResult = type === 'code' ? codeGrammar.match(row) : dataGrammar.match(row)
  const match: Match = {
    matched: matchResult.succeeded(),
    message: matchResult.shortMessage?.split(': ')[1],
    matchResult,
    ast: matchResult.succeeded() ? toAST(matchResult, astMappings) : {}
  }
  return matches.concat(match)
}, [])

export const parseCode = (text: string, type: 'code' | 'data' = 'code') => {
  const rows = text.split(/\r?\n/)
  const matches = matchRows(rows, type)
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
