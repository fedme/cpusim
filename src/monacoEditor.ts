
import { SyntaxError } from './parser'

export type MonacoEditor = any

enum CompletionItemKind {
  Method = 0,
  Function = 1,
  Constructor = 2,
  Field = 3,
  Variable = 4,
  Class = 5,
  Struct = 6,
  Interface = 7,
  Module = 8,
  Property = 9,
  Event = 10,
  Operator = 11,
  Unit = 12,
  Value = 13,
  Constant = 14,
  Enum = 15,
  EnumMember = 16,
  Keyword = 17,
  Text = 18,
  Color = 19,
  File = 20,
  Reference = 21,
  Customcolor = 22,
  Folder = 23,
  TypeParameter = 24,
  Snippet = 25
}

enum CompletionItemInsertTextRule {
  KeepWhitespace = 1,
  InsertAsSnippet = 4
}


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

  // Register a completion item provider for the new language
  monacoInstance.languages.registerCompletionItemProvider('cpusim', {
    provideCompletionItems: () => {
      const suggestions = [
        {
          label: 'R0',
          kind: CompletionItemKind.Keyword,
          insertText: 'R0'
        },
        {
          label: 'R1',
          kind: CompletionItemKind.Keyword,
          insertText: 'R1'
        },
        {
          label: 'IX',
          kind: CompletionItemKind.Keyword,
          insertText: 'IX'
        },
        {
          label: 'SP',
          kind: CompletionItemKind.Keyword,
          insertText: 'SP'
        },
        {
          label: 'NOP',
          kind: CompletionItemKind.Keyword,
          insertText: 'NOP'
        },
        {
          label: 'HLT',
          kind: CompletionItemKind.Keyword,
          insertText: 'HLT'
        },
        {
          label: 'ADD',
          kind: CompletionItemKind.Keyword,
          insertText: 'ADD'
        },
        {
          label: 'SUB',
          kind: CompletionItemKind.Keyword,
          insertText: 'SUB'
        },
        {
          label: 'MUL',
          kind: CompletionItemKind.Keyword,
          insertText: 'MUL'
        },
        {
          label: 'DIV',
          kind: CompletionItemKind.Keyword,
          insertText: 'DIV'
        },
        {
          label: 'MOV',
          kind: CompletionItemKind.Snippet,
          // eslint-disable-next-line no-template-curly-in-string
          insertText: 'MOV ${1:register}',
          insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet
        },
        {
          label: 'SET',
          kind: CompletionItemKind.Snippet,
          // eslint-disable-next-line no-template-curly-in-string
          insertText: 'SET ${1:register} ${2:data}',
          insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet
        },
        {
          label: 'LOD',
          kind: CompletionItemKind.Snippet,
          // eslint-disable-next-line no-template-curly-in-string
          insertText: 'LOD ${1:register} ${2:address}',
          insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet
        },
        {
          label: 'STO',
          kind: CompletionItemKind.Snippet,
          // eslint-disable-next-line no-template-curly-in-string
          insertText: 'STO ${1:address}',
          insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet
        },
        {
          label: 'JMP',
          kind: CompletionItemKind.Snippet,
          // eslint-disable-next-line no-template-curly-in-string
          insertText: 'JMP ${1:address}',
          insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet
        },
        {
          label: 'JMZ',
          kind: CompletionItemKind.Snippet,
          // eslint-disable-next-line no-template-curly-in-string
          insertText: 'JMZ ${1:address}',
          insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet
        },
        {
          label: 'JML',
          kind: CompletionItemKind.Snippet,
          // eslint-disable-next-line no-template-curly-in-string
          insertText: 'JML ${1:address}',
          insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet
        },
        {
          label: 'JMG',
          kind: CompletionItemKind.Snippet,
          // eslint-disable-next-line no-template-curly-in-string
          insertText: 'JMG ${1:address}',
          insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet
        },
        {
          label: 'PSH',
          kind: CompletionItemKind.Keyword,
          insertText: 'PSH'
        },
        {
          label: 'POP',
          kind: CompletionItemKind.Keyword,
          insertText: 'POP'
        },
        {
          label: 'CAL',
          kind: CompletionItemKind.Snippet,
          // eslint-disable-next-line no-template-curly-in-string
          insertText: 'CAL ${1:address}',
          insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet
        },
        {
          label: 'RET',
          kind: CompletionItemKind.Keyword,
          insertText: 'RET'
        }
      ]
      return { suggestions }
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
