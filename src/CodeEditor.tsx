import React, { useRef } from 'react'
import AceEditor from 'react-ace'
import { useDebouncedCallback } from 'use-debounce'
import useResizeObserver from 'use-resize-observer'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from './store/rootReducer'
import { setCode } from './store/cpuSlice'

export const CodeEditor = () => {
  const ref = useRef(null)
  const { width = 1 } = useResizeObserver({ ref })
  const dispatch = useDispatch()
  const { code } = useSelector((state: RootState) => state.cpu)
  const onCodeChange = (newValue: string) => dispatch(setCode(newValue))
  const [onCodeChangeDebounced] = useDebouncedCallback(onCodeChange, 500)

  return (
    <div className="w-full h-full" ref={ref}>
      <AceEditor
        value={code}
        onChange={onCodeChangeDebounced}
        width={width.toString()}
      />
    </div>
  )
}
