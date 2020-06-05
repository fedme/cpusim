import React, {
  useRef, useEffect, useState, useCallback
} from 'react'
import Editor, { monaco } from '@monaco-editor/react'
import { useDebouncedCallback } from 'use-debounce'
import useResizeObserver from 'use-resize-observer'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from './store/rootReducer'
import { setCode, initialCode } from './store/cpuSlice'
import { configureMonacoEditor, getMonacoMarkers, MonacoEditor } from './monacoEditor'

export const CodeEditor = () => {
  // Set up Monaco
  const [monacoInstance, setMonacoInstance] = useState<MonacoEditor>()
  useEffect(() => {
    monaco
      .init()
      .then(instance => {
        setMonacoInstance(instance)
        configureMonacoEditor(instance)
      })
      // eslint-disable-next-line no-console
      .catch(error => console.error('An error occurred during initialization of Monaco: ', error))
  }, [])

  const containerRef = useRef(null)
  const editorRef = useRef<MonacoEditor>()
  const { width = 1 } = useResizeObserver({ ref: containerRef })
  const dispatch = useDispatch()
  const { syntaxErrors } = useSelector((state: RootState) => state.cpu)

  const onCodeChange = useCallback((newValue: string) => dispatch(setCode(newValue)), [dispatch])
  const [onCodeChangeDebounced] = useDebouncedCallback(onCodeChange, 500)

  const onEditorDidMount = useCallback(
    (getEditorValue: () => string, editorInstance: MonacoEditor) => {
      editorRef.current = editorInstance
      editorInstance.onDidChangeModelContent((_: any) => onCodeChangeDebounced(getEditorValue()))
    },
    [onCodeChangeDebounced]
  )

  // Add markers on syntax errors
  if (monacoInstance && editorRef.current) {
    monacoInstance.editor.setModelMarkers(editorRef.current.getModel()!, 'owner', getMonacoMarkers(syntaxErrors))
  }

  return (
    <div className="w-full h-full" ref={containerRef}>
      { monacoInstance && (
        <Editor
          width={width}
          height="80vh"
          language="cpusim"
          theme="cpusimTheme"
          value={initialCode}
          editorDidMount={onEditorDidMount}
          options={{
            minimap: { enabled: false }
          }}
        />
      )}
    </div>
  )
}
