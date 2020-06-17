import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from './store/rootReducer'

export const Simulator = () => {
  const {
    pc, r0, r1, a, ix, sp
  } = useSelector((state: RootState) => state.cpu)

  return (
    <ul>
      <li>PC: {pc}</li>
      <li>R0: {r0}</li>
      <li>R1: {r1}</li>
      <li>A: {a}</li>
      <li>IX: {ix}</li>
      <li>SP: {sp}</li>
    </ul>
  )
}
