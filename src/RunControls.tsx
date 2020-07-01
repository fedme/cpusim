/* eslint-disable radix */
/* eslint-disable react/button-has-type */
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useInterval } from './utils/useInterval'
import {
  reset, executeNextInstruction, setIsRunning, setExecutionSpeed
} from './store/cpuSlice'
import { RootState } from './store/rootReducer'

export const RunControls = () => {
  const dispatch = useDispatch()
  const {
    pc, instructions, isRunning, syntaxErrors, dataSyntaxErrors, executionSpeed
  } = useSelector((state: RootState) => state.cpu)

  const [ticks, setTicks] = useState(0)
  const [delay, setDelay] = useState<number | null>(null)

  const areErrorsPresent = syntaxErrors.length > 0 || dataSyntaxErrors.length > 0

  useInterval(() => {
    setTicks(ticks + 1)
  }, delay)

  useEffect(() => {
    if (!isRunning) {
      setDelay(null)
    }
  }, [isRunning])

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

    // Execute first instruction
    if (instructions.length > 1) {
      dispatch(executeNextInstruction())
    } else {
      dispatch(setIsRunning(false))
    }

    // Start timer that executes next instructions
    setDelay(executionSpeed)
  }

  function stop() {
    dispatch(reset())
    dispatch(setIsRunning(false))
    setTicks(0)
  }

  function onSpeedChange(e: React.ChangeEvent<HTMLInputElement>) {
    const speed = e.target.value as unknown as number
    dispatch(setExecutionSpeed(speed * -1))
  }

  return (
    <div className="flex items-baseline">

      {areErrorsPresent && (
        <span
          className="text-sm font-medium text-white text-red-400"
        >
          Please fix the errors in your code
        </span>
      )}

      {!areErrorsPresent && !isRunning && (
        <>
          <input
            className="mr-4"
            type="range" name="speed"
            value={executionSpeed * -1}
            min="-5000" max="500"
            step="500"
            onChange={onSpeedChange}
          />
          <button
            className="px-3 py-2 rounded-md text-sm font-medium text-white bg-green-500 focus:outline-none focus:text-white focus:bg-gray-700"
            onClick={run}
          >
            Run
          </button>
        </>
      )}

      {!areErrorsPresent && isRunning && (
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
