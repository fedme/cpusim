import React, {
  useRef, useEffect, useState, useCallback
} from 'react'
import Editor, { monaco } from '@monaco-editor/react'
import { editor } from 'monaco-editor'
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
  const editorRef = useRef<editor.IStandaloneCodeEditor>()
  const { width = 1 } = useResizeObserver({ ref: containerRef })
  const dispatch = useDispatch()
  const { syntaxErrors } = useSelector((state: RootState) => state.cpu)

  const onCodeChange = useCallback((newValue: string) => dispatch(setCode(newValue)), [dispatch])
  const [onCodeChangeDebounced] = useDebouncedCallback(onCodeChange, 500)

  const onEditorDidMount = (getEditorValue: () => string, editorInstance: editor.IStandaloneCodeEditor) => {
    editorRef.current = editorInstance
    // TODO: this fires twice at every change for some reason
    editorInstance.onDidChangeModelContent(_ => onCodeChangeDebounced(getEditorValue()))
  }

  // TODO: this generates a Monaco warning about web workers. To investigate...
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
