import React, { useRef } from 'react'
import Editor, { monaco } from '@monaco-editor/react'
import { editor } from 'monaco-editor'
import { useDebouncedCallback } from 'use-debounce'
import useResizeObserver from 'use-resize-observer'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from './store/rootReducer'
import { setCode } from './store/cpuSlice'
import { configureMonacoEditor } from './monacoEditorSettings'

monaco
  .init()
  .then(configureMonacoEditor)
  // eslint-disable-next-line no-console
  .catch(error => console.error('An error occurred during initialization of Monaco: ', error))

export const CodeEditor = () => {
  const containerRef = useRef(null)
  const editorRef = useRef<editor.IStandaloneCodeEditor>()
  const { width = 1 } = useResizeObserver({ ref: containerRef })
  const dispatch = useDispatch()

  const { code } = useSelector((state: RootState) => state.cpu)
  const onCodeChange = (newValue: string) => dispatch(setCode(newValue))
  const [onCodeChangeDebounced] = useDebouncedCallback(onCodeChange, 500)

  const onEditorDidMount = (getEditorValue: () => string, editorInstance: editor.IStandaloneCodeEditor) => {
    editorRef.current = editorInstance
    editorInstance.onDidChangeModelContent(_ => onCodeChangeDebounced(getEditorValue()))
  }

  return (
    <div className="w-full h-full" ref={containerRef}>
      <Editor
        width={width}
        height="80vh"
        language="cpusim"
        theme="cpusimTheme"
        value={code}
        editorDidMount={onEditorDidMount}
        options={{
          minimap: { enabled: false }
        }}
      />
    </div>
  )
}
