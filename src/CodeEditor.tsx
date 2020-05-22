import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from './store/rootReducer'

export const CodeEditor = () => {
  const { code } = useSelector((state: RootState) => state.cpu)
  return (
    <textarea className="w-full h-32 focus:outline-none focus:shadow-outline" value={code} />
  )
}
