import React, {
  useRef, useEffect, useState, useCallback
} from 'react'
import { monaco, ControlledEditor } from '@monaco-editor/react'
import { useDebouncedCallback } from 'use-debounce'
import useResizeObserver from 'use-resize-observer'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from './store/rootReducer'
import {
  setCode, setData, MEMORY_CODE_MAX_SIZE, CpuStatus, setInitialCodeAndData
} from './store/cpuSlice'
import { configureMonacoEditor, getMonacoMarkers, MonacoEditor } from './monacoEditor'
import { SaveToFile } from './SaveToFile'

export const Memory = () => {
  const dispatch = useDispatch()

  // set up
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

    dispatch(setInitialCodeAndData())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const containerRef = useRef(null)
  const codeEditorRef = useRef<MonacoEditor>()
  const dataEditorRef = useRef<MonacoEditor>()
  const { width = 1 } = useResizeObserver({ ref: containerRef })
  const {
    codeErrors: syntaxErrors, codeMemoryRaw: code, dataMemoryRaw: data, dataErrors: dataSyntaxErrors, status, lightCodeRow, lightDataRow
  } = useSelector((state: RootState) => state.cpu)

  const onCodeChange = useCallback((newValue: string|undefined) => dispatch(setCode(newValue)), [dispatch])
  const [onCodeChangeDebounced] = useDebouncedCallback(onCodeChange, 500)

  const onDataChange = useCallback((newValue: string|undefined) => dispatch(setData(newValue)), [dispatch])
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
    },
    []
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

    if (status !== CpuStatus.Idle && lightCodeRow != null) {
      const newDecorations = codeEditorRef.current.deltaDecorations(codeEditorDecorations.current, [{
        range: {
          startLineNumber: lightCodeRow + 1, endLineNumber: lightCodeRow + 1, startColumn: 1, endColumn: 100
        },
        options: {
          isWholeLine: true,
          className: 'bg-blue-200',
          glyphMarginClassName: 'pc-pointer',
          stickiness: 1
        }
      }])

      codeEditorDecorations.current = newDecorations
    }

    if (status === CpuStatus.Idle || lightCodeRow == null) {
      const newDecorations = codeEditorRef.current.deltaDecorations(codeEditorDecorations.current, [])
      codeEditorDecorations.current = newDecorations
    }
  }


  // DATA Editor

  const onDataEditorDidMount = useCallback(
    (_getEditorValue: () => string, editor: MonacoEditor) => {
      dataEditorRef.current = editor
    },
    []
  )

  if (monacoInstance && dataEditorRef.current) {
    monacoInstance.editor.setModelMarkers(dataEditorRef.current.getModel()!, 'owner', getMonacoMarkers(dataSyntaxErrors))

    if (status !== CpuStatus.Idle && lightDataRow != null) {
      const newDecorations = dataEditorRef.current.deltaDecorations(dataEditorDecorations.current, [{
        range: {
          startLineNumber: lightDataRow - MEMORY_CODE_MAX_SIZE + 1, endLineNumber: lightDataRow - MEMORY_CODE_MAX_SIZE + 1, startColumn: 1, endColumn: 100
        },
        options: {
          isWholeLine: true,
          className: 'bg-blue-200',
          glyphMarginClassName: 'sp-pointer',
          stickiness: 1
        }
      }])

      dataEditorDecorations.current = newDecorations
    }

    if (status === CpuStatus.Idle || lightDataRow == null) {
      const newDecorations = dataEditorRef.current.deltaDecorations(dataEditorDecorations.current, [])
      dataEditorDecorations.current = newDecorations
    }
  }

  return (
    <div className="w-full h-full" ref={containerRef}>
      { monacoInstance && (
        <>

          <SaveToFile />

          <h3 className="bg-gray-200 px-4 my-2">Sezione codice</h3>

          <ControlledEditor
            width={width}
            height="50vh"
            language="cpusimCode"
            theme="cpusimTheme"
            value={code}
            onChange={(_e, value) => onCodeChangeDebounced(value)}
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
            onChange={(_e, value) => onDataChangeDebounced(value)}
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
