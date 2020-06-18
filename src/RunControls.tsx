/* eslint-disable radix */
/* eslint-disable react/button-has-type */
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useInterval } from './hooks/useInterval'
import {
  reset, executeNextInstruction, setIsRunning
} from './store/cpuSlice'
import { RootState } from './store/rootReducer'

export const RunControls = () => {
  const dispatch = useDispatch()
  const { pc, instructions, isRunning } = useSelector((state: RootState) => state.cpu)
  const [ticks, setTicks] = useState(0)
  const [delay, setDelay] = useState<number | null>(null)

  useInterval(() => {
    setTicks(ticks + 1)
  }, delay)

  // Effect running at every interval tick
  useEffect(() => {
    if (isRunning) {
      if (pc < instructions.length) {
        dispatch(executeNextInstruction())
      } else {
        dispatch(setIsRunning(false))
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticks])

  function run() {
    dispatch(reset())
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
        className="px-3 py-2 rounded-md text-sm font-medium text-white bg-green-500 focus:outline-none focus:text-white focus:bg-gray-700"
        onClick={run}
      >
        Run
      </button>
      )}

      {isRunning && (
      <button
        className="px-3 py-2 rounded-md text-sm font-medium text-white bg-red-500 focus:outline-none focus:text-white focus:bg-gray-700"
        onClick={stop}
      >
        Stop
      </button>
      )}
    </div>
  )
}
