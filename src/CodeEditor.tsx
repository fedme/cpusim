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
  const codeEditorRef = useRef<MonacoEditor>()
  const dataEditorRef = useRef<MonacoEditor>()
  const { width = 1 } = useResizeObserver({ ref: containerRef })
  const dispatch = useDispatch()
  const { syntaxErrors } = useSelector((state: RootState) => state.cpu)

  const onCodeChange = useCallback((newValue: string) => dispatch(setCode(newValue)), [dispatch])
  const [onCodeChangeDebounced] = useDebouncedCallback(onCodeChange, 500)

  const onCodeEditorDidMount = useCallback(
    (getEditorValue: () => string, editorInstance: MonacoEditor) => {
      codeEditorRef.current = editorInstance
      editorInstance.onDidChangeModelContent((_: any) => {
        // Limit code to 99 lines
        const lineCount = editorInstance.getModel().getLineCount()
        if (lineCount > 99) {
          const content = editorInstance.getModel().getValueInRange({
            startLineNumber: 1,
            endLineNumber: 99
          })
          editorInstance.getModel().setValue(content)
        } else {
          onCodeChangeDebounced(getEditorValue())
        }
      })
    },
    [onCodeChangeDebounced]
  )

  const onDataEditorDidMount = useCallback(
    (getEditorValue: () => string, editorInstance: MonacoEditor) => {
      dataEditorRef.current = editorInstance
      // editorInstance.onDidChangeModelContent((_: any) => onCodeChangeDebounced(getEditorValue()))
    },
    []
  )

  // Add markers on syntax errors
  if (monacoInstance && codeEditorRef.current) {
    monacoInstance.editor.setModelMarkers(codeEditorRef.current.getModel()!, 'owner', getMonacoMarkers(syntaxErrors))
  }

  return (
    <div className="w-full h-full" ref={containerRef}>
      { monacoInstance && (
        <>

          <h3 className="bg-blue-800 px-4 my-2 text-white font-semibold text-xl">Memory</h3>

          <h3 className="bg-blue-400 px-4 my-2 text-white font-semibold">Code section</h3>

          <Editor
            width={width}
            height="50vh"
            language="cpusim"
            theme="cpusimTheme"
            value={initialCode}
            editorDidMount={onCodeEditorDidMount}
            options={{
              minimap: { enabled: false }
            }}
          />

          <h3 className="bg-blue-400 px-4 my-2 text-white font-semibold">Data section</h3>

          <Editor
            width={width}
            height="15vh"
            language="cpusim"
            theme="cpusimTheme"
            value="2345"
            editorDidMount={onDataEditorDidMount}
            options={{
              minimap: { enabled: false },
              lineNumbers: (originalNumber: number) => originalNumber + 99
            }}
          />

        </>
      )}
    </div>
  )
}
