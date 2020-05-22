import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from './store/rootReducer'

export const Simulator = () => {
  const { r0, r1, a } = useSelector((state: RootState) => state.cpu)
  return (
    <ul>
      <li>R0: {r0}</li>
      <li>R1: {r1}</li>
      <li>A: {a}</li>
    </ul>
  )
}
