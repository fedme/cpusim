/* eslint-disable radix */
/* eslint-disable react/button-has-type */
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useInterval } from './utils/useInterval'
import {
  reset, setIsRunning, setExecutionSpeed
} from './store/cpuSlice'
import { RootState } from './store/rootReducer'
import { executeNextInstruction } from './store/executeInstruction'

const FASTER_SPEED = 500
const SLOWER_SPEED = 5000
const SPEED_STEP = 500

export const RunControls = () => {
  const dispatch = useDispatch()
  const {
    pc, instructions, isRunning, syntaxErrors, dataSyntaxErrors, executionSpeed
  } = useSelector((state: RootState) => state.cpu)

  const [ticks, setTicks] = useState(0)
  const [delay, setDelay] = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState<boolean>(false)

  const areErrorsPresent = syntaxErrors.length > 0 || dataSyntaxErrors.length > 0

  useInterval(() => {
    setTicks(ticks + 1)
  }, delay)

  // Effect running at every interval tick
  useEffect(() => {
    if (isRunning) {
      if (pc < instructions.length) {
        dispatch(executeNextInstruction())
      } else {
        setDelay(null)
        dispatch(setIsRunning(false))
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticks])

  function run() {
    if (instructions.length < 1) {
      return
    }

    dispatch(reset())
    dispatch(setIsRunning(true))

    // Execute first instruction
    dispatch(executeNextInstruction())

    // Start timer that executes next instructions
    setDelay(executionSpeed)
  }

  function stop() {
    setIsPaused(false)
    setDelay(null)
    dispatch(setIsRunning(false))
    dispatch(reset())
    setTicks(0)
  }

  function togglePause() {
    dispatch(setIsRunning(isPaused))
    setIsPaused(!isPaused)
  }

  function onSpeedChange(e: React.ChangeEvent<HTMLInputElement>) {
    const speed = e.target.value as unknown as number
    dispatch(setExecutionSpeed(FASTER_SPEED + SLOWER_SPEED - (speed * SPEED_STEP)))
  }

  return (
    <div className="flex items-baseline">

      {areErrorsPresent && (
        <span
          className="text-sm font-medium text-red-400"
        >
          Risolvi gli errori del codice per eseguire il programma
        </span>
      )}

      {!areErrorsPresent && !isRunning && !isPaused && (
        <div className="flex items-center">
          <div className="text-sm font-medium text-white pr-4">Velocit&agrave;: </div>
          <input
            className="block mr-4"
            type="range" name="speed"
            value={Math.floor((FASTER_SPEED + SLOWER_SPEED - executionSpeed) / SPEED_STEP)}
            min="1" max="10"
            step="1"
            onChange={onSpeedChange}
          />
          <div>
            <button
              className="px-3 py-2 rounded text-sm font-medium text-white bg-green-500 focus:outline-none focus:text-white focus:bg-gray-700"
              onClick={run}
            >
              Esegui programma
            </button>
          </div>
        </div>
      )}

      {!areErrorsPresent && (isRunning || isPaused) && (
        <>
          {!isPaused && (
          <button
            className="px-3 py-2 mr-2 rounded text-sm font-medium text-white bg-yellow-400 focus:outline-none focus:text-white focus:bg-gray-700"
            onClick={togglePause}
          >
            Pausa
          </button>
          )}
          {isPaused && (
          <button
            className="px-3 py-2 mr-2 rounded text-sm font-medium text-white bg-green-500 focus:outline-none focus:text-white focus:bg-gray-700"
            onClick={togglePause}
          >
            Riprendi
          </button>
          )}
          <button
            className="px-3 py-2 rounded text-sm font-medium text-white bg-red-500 focus:outline-none focus:text-white focus:bg-gray-700"
            onClick={stop}
          >
            Stop
          </button>
        </>
      )}
    </div>
  )
}
