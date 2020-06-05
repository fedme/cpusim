
import { SyntaxError } from './parser'

export type MonacoEditor = any

export function configureMonacoEditor(monacoInstance: MonacoEditor) {
  // Register a new language
  monacoInstance.languages.register({ id: 'cpusim' })
  // Register a tokens provider for the language
  monacoInstance.languages.setMonarchTokensProvider('cpusim', {
    tokenizer: {
      root: [
        [/^(NOP|HLT|ADD|SUB|MUL|DIV|MOV|SET|LOD|STO|JMP|JMZ|JML|JMG|PSH|POP|CAL|RET)/, 'instruction'],
        [/R0|R1|IX|SP/, 'register'],
        [/[0-9]\d*/, 'address'],
        [/@[0-9]\d*/, 'ixAddress'],
        [/\$[0-9]\d*/, 'spAddress']
      ]
    }
  })
  // Define a new theme that contains only rules that match this language
  monacoInstance.editor.defineTheme('cpusimTheme', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'instruction', foreground: '62C8E6', fontStyle: 'bold' },
      { token: 'register', foreground: '68AF00' },
      { token: 'address', foreground: '000000' },
      { token: 'ixAddress', foreground: 'FF9600' },
      { token: 'spAddress', foreground: 'F92672' }
    ],
    colors: {
    }
  })
}

export enum MarkerSeverity {
  Hint = 1,
  Info = 2,
  Warning = 4,
  Error = 8
}

export interface IMarkerData {
  severity: MarkerSeverity;
  message: string;
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
}

export const getMonacoMarkers = (syntaxErrors: SyntaxError[]) => syntaxErrors.reduce((errors: IMarkerData[], error) => errors.concat(
  {
    startLineNumber: error.row,
    startColumn: error.col,
    endLineNumber: error.row,
    endColumn: error.col + 1,
    message: error.message,
    severity: 8
  }
), [])
