import React, {
  useRef, useEffect, useState, useCallback
} from 'react'
import { monaco, ControlledEditor } from '@monaco-editor/react'
import { useDebouncedCallback } from 'use-debounce'
import useResizeObserver from 'use-resize-observer'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from './store/rootReducer'
import {
  setCode, setData, setStack, CpuStatus, setInitialCodeAndData
} from './store/cpuSlice'
import { configureMonacoEditor, getMonacoMarkers, MonacoEditor } from './monacoEditor'
import { SaveToFile } from './SaveToFile'
import { MEMORY_CODE_MAX_SIZE, MEMORY_DATA_MAX_SIZE, MEMORY_STACK_MAX_SIZE } from './store/memoryManagement'

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
  const { width = 1 } = useResizeObserver({ ref: containerRef })
  const {
    codeErrors, codeMemoryRaw, dataMemoryRaw, dataErrors, stackMemoryRaw, stackErrors, status, lightCodeRow, lightDataRow, lightStackRow
  } = useSelector((state: RootState) => state.cpu)

  // Code editor variables
  const codeEditorRef = useRef<MonacoEditor>()
  const codeEditorDecorations = useRef<string[]>([])
  const onCodeChange = useCallback((newValue: string|undefined) => dispatch(setCode(newValue)), [dispatch])
  const [onCodeChangeDebounced] = useDebouncedCallback(onCodeChange, 500)

  // Data editor variables
  const dataEditorRef = useRef<MonacoEditor>()
  const dataEditorDecorations = useRef<string[]>([])
  const onDataChange = useCallback((newValue: string|undefined) => dispatch(setData(newValue)), [dispatch])
  const [onDataChangeDebounced] = useDebouncedCallback(onDataChange, 500)

  // Stack editor variables
  const stackEditorRef = useRef<MonacoEditor>()
  const stackEditorDecorations = useRef<string[]>([])
  const onStackChange = useCallback((newValue: string|undefined) => dispatch(setStack(newValue)), [dispatch])
  const [onStackChangeDebounced] = useDebouncedCallback(onStackChange, 500)


  // Code editor callbacks

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
    monacoInstance.editor.setModelMarkers(codeEditorRef.current.getModel()!, 'owner', getMonacoMarkers(codeErrors))

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


  // Data editor callbacks

  const onDataEditorModelDidChange = useCallback(
    (editor: any) => {
      const lineCount = editor.getModel().getLineCount()
      if (lineCount > MEMORY_DATA_MAX_SIZE) {
        const content = editor.getModel().getValueInRange({
          startLineNumber: 1,
          endLineNumber: MEMORY_DATA_MAX_SIZE
        })
        editor.getModel().setValue(content)
      }
    },
    []
  )

  const onDataEditorDidMount = useCallback(
    (_getEditorValue: () => string, editor: MonacoEditor) => {
      dataEditorRef.current = editor
      editor.onDidChangeModelContent((_b: any) => onDataEditorModelDidChange(editor))
    },
    [onDataEditorModelDidChange]
  )

  if (monacoInstance && dataEditorRef.current) {
    monacoInstance.editor.setModelMarkers(dataEditorRef.current.getModel()!, 'owner', getMonacoMarkers(dataErrors))

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


  // Stack editor callbacks

  const onStackEditorModelDidChange = useCallback(
    (editor: any) => {
      const lineCount = editor.getModel().getLineCount()
      if (lineCount > MEMORY_STACK_MAX_SIZE) {
        const content = editor.getModel().getValueInRange({
          startLineNumber: 1,
          endLineNumber: MEMORY_STACK_MAX_SIZE
        })
        editor.getModel().setValue(content)
      }
    },
    []
  )

  const onStackEditorDidMount = useCallback(
    (_getEditorValue: () => string, editor: MonacoEditor) => {
      stackEditorRef.current = editor
      editor.onDidChangeModelContent((_b: any) => onStackEditorModelDidChange(editor))
    },
    [onStackEditorModelDidChange]
  )

  if (monacoInstance && stackEditorRef.current) {
    monacoInstance.editor.setModelMarkers(stackEditorRef.current.getModel()!, 'owner', getMonacoMarkers(stackErrors))

    if (status !== CpuStatus.Idle && lightStackRow != null) {
      const newDecorations = stackEditorRef.current.deltaDecorations(stackEditorDecorations.current, [{
        range: {
          startLineNumber: lightStackRow - MEMORY_CODE_MAX_SIZE + 1,
          endLineNumber: lightStackRow - MEMORY_CODE_MAX_SIZE + 1,
          startColumn: 1,
          endColumn: 100
        },
        options: {
          isWholeLine: true,
          className: 'bg-blue-200',
          glyphMarginClassName: 'sp-pointer',
          stickiness: 1
        }
      }])

      stackEditorDecorations.current = newDecorations
    }

    if (status === CpuStatus.Idle || lightStackRow == null) {
      const newDecorations = stackEditorRef.current.deltaDecorations(stackEditorDecorations.current, [])
      stackEditorDecorations.current = newDecorations
    }
  }

  return (
    <div className="w-full h-full" ref={containerRef}>
      { monacoInstance && (
        <>

          <SaveToFile />

          <h3 className="bg-gray-200 px-4 my-2">Codice</h3>

          <ControlledEditor
            width={width}
            height="40vh"
            language="cpusimCode"
            theme="cpusimTheme"
            value={codeMemoryRaw}
            onChange={(_e, value) => onCodeChangeDebounced(value)}
            editorDidMount={onCodeEditorDidMount}
            options={{
              minimap: { enabled: false },
              lineNumbers: (originalNumber: number) => (originalNumber === 1 ? '0' : originalNumber - 1),
              glyphMargin: false,
              contextmenu: false
            }}
          />

          <h3 className="bg-gray-200 px-4 my-2">Dati</h3>

          <ControlledEditor
            width={width}
            height="12vh"
            language="cpusimData"
            theme="cpusimTheme"
            value={dataMemoryRaw}
            onChange={(_e, value) => onDataChangeDebounced(value)}
            editorDidMount={onDataEditorDidMount}
            options={{
              minimap: { enabled: false },
              lineNumbers: (originalNumber: number) => originalNumber + MEMORY_CODE_MAX_SIZE - 1,
              glyphMargin: false,
              contextmenu: false
            }}
          />

          <h3 className="bg-gray-200 px-4 my-2">Stack</h3>

          <ControlledEditor
            width={width}
            height="12vh"
            language="cpusimData"
            theme="cpusimTheme"
            value={stackMemoryRaw}
            onChange={(_e, value) => onStackChangeDebounced(value)}
            editorDidMount={onStackEditorDidMount}
            options={{
              minimap: { enabled: false },
              lineNumbers: (originalNumber: number) => originalNumber + MEMORY_CODE_MAX_SIZE + MEMORY_DATA_MAX_SIZE - 1,
              glyphMargin: false,
              contextmenu: false
            }}
          />

        </>
      )}
    </div>
  )
}
