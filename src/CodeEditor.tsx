import React, {
  useRef, useEffect, useState, useCallback
} from 'react'
import Editor, { monaco, ControlledEditor } from '@monaco-editor/react'
import { useDebouncedCallback } from 'use-debounce'
import useResizeObserver from 'use-resize-observer'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from './store/rootReducer'
import {
  setCode, setData, initialCode, MEMORY_CODE_MAX_SIZE
} from './store/cpuSlice'
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
  const {
    syntaxErrors, data, dataSyntaxErrors, isRunning, lightCodeRow, lightDataRow
  } = useSelector((state: RootState) => state.cpu)

  const onCodeChange = useCallback((newValue: string) => dispatch(setCode(newValue)), [dispatch])
  const [onCodeChangeDebounced] = useDebouncedCallback(onCodeChange, 500)

  const onDataChange = useCallback((newValue: string) => dispatch(setData(newValue)), [dispatch])
  const [onDataChangeDebounced] = useDebouncedCallback(onDataChange, 500)

  const codeEditorDecorations = useRef<string[]>([])
  const dataEditorDecorations = useRef<string[]>([])


  // CODE Editor

  const onCodeEditorModelDidChange = useCallback(
    (editor: any) => {
      const lineCount = editor.getModel().getLineCount()
      // Limit code to CODE_EDITOR_MAX_LINES lines
      if (lineCount > MEMORY_CODE_MAX_SIZE) {
        const content = editor.getModel().getValueInRange({
          startLineNumber: 1,
          endLineNumber: MEMORY_CODE_MAX_SIZE
        })
        editor.getModel().setValue(content)
      }
      onCodeChangeDebounced(editor.getModel().getValue())
    },
    [onCodeChangeDebounced]
  )

  const onCodeEditorDidMount = useCallback(
    (_, editor: MonacoEditor) => {
      codeEditorRef.current = editor
      editor.onDidChangeModelContent((_b: any) => onCodeEditorModelDidChange(editor))
    },
    [onCodeEditorModelDidChange]
  )

  if (monacoInstance && codeEditorRef.current) {
    monacoInstance.editor.setModelMarkers(codeEditorRef.current.getModel()!, 'owner', getMonacoMarkers(syntaxErrors))

    if (isRunning && lightCodeRow != null) {
      const newDecorations = codeEditorRef.current.deltaDecorations(codeEditorDecorations.current, [{
        range: {
          startLineNumber: lightCodeRow + 1, endLineNumber: lightCodeRow + 1, startColumn: 1, endColumn: 100
        },
        options: {
          isWholeLine: true,
          className: 'bg-blue-100',
          glyphMarginClassName: 'pc-pointer',
          stickiness: 1
        }
      }])

      codeEditorDecorations.current = newDecorations
    }

    if (!isRunning) {
      const newDecorations = codeEditorRef.current.deltaDecorations(codeEditorDecorations.current, [])
      codeEditorDecorations.current = newDecorations
    }
  }


  // DATA Editor

  const onDataEditorModelDidChange = useCallback(

    // TODO: use onChange on the controlled editor instead. This is invoked twice.

    (editor: any) => {
      onDataChangeDebounced(editor.getModel().getValue())
    },
    [onDataChangeDebounced]
  )

  const onDataEditorDidMount = useCallback(
    (getEditorValue: () => string, editor: MonacoEditor) => {
      dataEditorRef.current = editor
      editor.onDidChangeModelContent((_b: any) => onDataEditorModelDidChange(editor))
    },
    [onDataEditorModelDidChange]
  )

  if (monacoInstance && dataEditorRef.current) {
    monacoInstance.editor.setModelMarkers(dataEditorRef.current.getModel()!, 'owner', getMonacoMarkers(dataSyntaxErrors))

    if (isRunning && lightDataRow != null) {
      const newDecorations = dataEditorRef.current.deltaDecorations(dataEditorDecorations.current, [{
        range: {
          startLineNumber: lightDataRow - MEMORY_CODE_MAX_SIZE + 1, endLineNumber: lightDataRow - MEMORY_CODE_MAX_SIZE + 1, startColumn: 1, endColumn: 100
        },
        options: {
          isWholeLine: true,
          className: 'bg-blue-100',
          glyphMarginClassName: 'sp-pointer',
          stickiness: 1
        }
      }])

      dataEditorDecorations.current = newDecorations
    }

    if (!isRunning) {
      const newDecorations = dataEditorRef.current.deltaDecorations(dataEditorDecorations.current, [])
      dataEditorDecorations.current = newDecorations
    }
  }

  return (
    <div className="w-full h-full" ref={containerRef}>
      { monacoInstance && (
        <>

          <h3 className="bg-gray-300 px-4 mb-2 text-xl">Memoria</h3>

          <h3 className="bg-gray-200 px-4 my-2">Sezione codice</h3>

          <Editor
            width={width}
            height="50vh"
            language="cpusimCode"
            theme="cpusimTheme"
            value={initialCode}
            editorDidMount={onCodeEditorDidMount}
            options={{
              minimap: { enabled: false },
              lineNumbers: (originalNumber: number) => (originalNumber === 1 ? '0' : originalNumber - 1),
              glyphMargin: false,
              contextmenu: false
            }}
          />

          <h3 className="bg-gray-200 px-4 my-2">Sezione dati</h3>

          <ControlledEditor
            width={width}
            height="15vh"
            language="cpusimData"
            theme="cpusimTheme"
            value={data}
            editorDidMount={onDataEditorDidMount}
            options={{
              minimap: { enabled: false },
              lineNumbers: (originalNumber: number) => originalNumber + MEMORY_CODE_MAX_SIZE - 1,
              glyphMargin: false,
              contextmenu: false
            }}
          />

        </>
      )}
    </div>
  )
}
