/* eslint-disable radix */
/* eslint-disable react/button-has-type */
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useInterval } from './hooks/useInterval'
import { reset, executeNextInstruction, setIsRunning } from './store/cpuSlice'
import { RootState } from './store/rootReducer'

export const RunControls = () => {
  const dispatch = useDispatch()
  const { pc, instructions, isRunning } = useSelector((state: RootState) => state.cpu)
  const [count, setCount] = useState(0)
  const [delay, setDelay] = useState<number | null>(null)

  useInterval(() => { // Your custom logic here
    setCount(count + 1)
  }, delay)

  useEffect(() => {
    if (isRunning) {
      if (pc < instructions.length) {
        dispatch(executeNextInstruction())
      } else {
        dispatch(setIsRunning(false))
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  function run() {
    dispatch(setIsRunning(true))
    setDelay(1000)
  }

  function stop() {
    dispatch(reset())
    dispatch(setIsRunning(false))
    setDelay(null)
  }

  return (
    <div className="flex items-baseline">
      {!isRunning && (
      <button
        className="px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700"
        onClick={run}
      >
        Run
      </button>
      )}

      {isRunning && (
      <button
        className="px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700"
        onClick={stop}
      >
        Stop
      </button>
      )}
    </div>
  )
}
