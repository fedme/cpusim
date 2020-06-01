/* eslint-disable radix */
/* eslint-disable react/button-has-type */
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { executeNextInstruction } from './codeParser'
import { reset, loadInstructions } from './store/cpuSlice'

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
    dispatch(loadInstructions())

    const instructionInterval = window.setInterval(() => {
      const terminated = executeNextInstruction()

      if (terminated && intervalId != null) {
        window.clearInterval(intervalId)
      }
    }, 1000)

    setIntervalId(instructionInterval)
  }

  return (
    <div className="flex items-baseline">
      <button
        className="px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700"
        onClick={run}
      >
        Run
      </button>
    </div>
  )
}
