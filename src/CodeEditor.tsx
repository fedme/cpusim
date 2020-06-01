import React from 'react'
import AceEditor from 'react-ace'
import { useDebouncedCallback } from 'use-debounce'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from './store/rootReducer'
import { setCode } from './store/cpuSlice'

export const CodeEditor = () => {
  const dispatch = useDispatch()
  const { code } = useSelector((state: RootState) => state.cpu)
  const onCodeChange = (newValue: string) => dispatch(setCode(newValue))
  const [onCodeChangeDebounced] = useDebouncedCallback(onCodeChange, 500)

  return (
    <AceEditor
      value={code}
      onChange={onCodeChangeDebounced}
    />
  )
}
