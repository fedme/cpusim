
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api'
import { editor, MarkerSeverity } from 'monaco-editor'
import { SyntaxError } from './parser'

export type MonacoEditor = typeof monacoEditor

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

export const getMonacoMarkers = (syntaxErrors: SyntaxError[]) => syntaxErrors.reduce((errors: editor.IMarkerData[], error) => errors.concat(
  {
    startLineNumber: error.row,
    startColumn: error.col,
    endLineNumber: error.row,
    endColumn: error.col + 1,
    message: error.message,
    severity: MarkerSeverity.Error
  }
), [])
