import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from './store/rootReducer'
import { setCode } from './store/cpuSlice'

export const CodeEditor = () => {
  const dispatch = useDispatch()
  const { code } = useSelector((state: RootState) => state.cpu)

  return (
    <textarea
      className="w-full h-32 font-mono focus:outline-none focus:shadow-outline" value={code}
      onChange={(e) => dispatch(setCode(e.target.value))}
    />
  )
}
