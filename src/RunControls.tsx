/* eslint-disable radix */
/* eslint-disable react/button-has-type */
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { executeNextInstruction } from './codeParser'
import { reset } from './store/cpuSlice'

export const RunControls = () => {
  const dispatch = useDispatch()
  const [intervalId, setIntervalId] = useState<number | null>(null)

  useEffect(() => () => {
    if (intervalId != null) {
      window.clearInterval(intervalId)
    }
  }, [intervalId])

  const run = () => {
    // cleanup
    dispatch(reset())
    if (intervalId != null) {
      window.clearInterval(intervalId)
    }

    // execute code
    const instructionInterval = window.setInterval(() => {
      const terminated = executeNextInstruction()

      if (terminated && intervalId != null) {
        window.clearInterval(intervalId)
      }
    }, 1000)

    setIntervalId(instructionInterval)
  }

  return (
    <button className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={run}>
      Run
    </button>
  )
}
