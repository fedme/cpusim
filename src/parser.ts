import { grammar, Grammar } from 'ohm-js'

export const cpusimGrammar: Grammar = grammar(`CpuSim {
    Exp = Instruction*
    
    Instruction = 
        Nop 
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
        
    Integer = digit*
    
    Address = digit*
    
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
