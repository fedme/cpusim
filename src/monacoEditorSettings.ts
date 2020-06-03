
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api'

export function configureMonacoEditor(monacoInstance: typeof monacoEditor) {
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
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'instruction', foreground: 'FF6188', fontStyle: 'bold' },
      { token: 'register', foreground: 'FC9867' },
      { token: 'address', foreground: 'A9DC76' },
      { token: 'ixAddress', foreground: '78DCE8' },
      { token: 'spAddress', foreground: 'AB9DF2' }
    ],
    colors: {
      'editor.background': '#2C292D'
    }
  })
}
