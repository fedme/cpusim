/* eslint-disable radix */
/* eslint-disable react/button-has-type */
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  GrPlayFill, GrPlay, GrPauseFill, GrStopFill
} from 'react-icons/gr'
import { AiOutlineClear } from 'react-icons/ai'
import {
  reset, setStatus, setExecutionSpeed, CpuStatus
} from './store/cpuSlice'
import { RootState } from './store/rootReducer'
import { executeNextInstruction } from './store/executeInstruction'

const FASTER_SPEED = 500
const SLOWER_SPEED = 5000
const SPEED_STEP = 500

export const RunControls = () => {
  const dispatch = useDispatch()
  const {
    codeMemory: instructions, status, codeErrors: syntaxErrors, dataErrors: dataSyntaxErrors, executionSpeed
  } = useSelector((state: RootState) => state.cpu)

  const areErrorsPresent = syntaxErrors.length > 0 || dataSyntaxErrors.length > 0

  function run() {
    if (instructions.length < 1) {
      return
    }

    dispatch(setStatus(CpuStatus.Running))
    dispatch(executeNextInstruction())
  }

  function runSingleInstruction() {
    if (instructions.length < 1) {
      return
    }

    dispatch(setStatus(CpuStatus.Running))
    dispatch(executeNextInstruction(false))
  }

  function stop() {
    dispatch(setStatus(CpuStatus.Idle))
    // dispatch(reset())
  }

  function pause() {
    dispatch(setStatus(CpuStatus.Paused))
  }

  function resume() {
    dispatch(setStatus(CpuStatus.Running))
    dispatch(executeNextInstruction())
  }

  function onSpeedChange(e: React.ChangeEvent<HTMLInputElement>) {
    const speed = e.target.value as unknown as number
    dispatch(setExecutionSpeed(FASTER_SPEED + SLOWER_SPEED - (speed * SPEED_STEP)))
  }

  return (
    <div className="flex items-baseline justify-center">

      {areErrorsPresent && (
        <span
          className="text-sm font-medium text-red-400"
        >
          Risolvi gli errori del codice per eseguire il programma
        </span>
      )}

      {!areErrorsPresent && status === CpuStatus.Idle && (
        <div className="flex items-center">
          <div className="hidden md:block text-sm font-medium text-white pr-4">Velocit&agrave;: </div>
          <input
            className="hidden md:block form-range mr-4"
            type="range" name="speed"
            value={Math.floor((FASTER_SPEED + SLOWER_SPEED - executionSpeed) / SPEED_STEP)}
            min="1" max="10"
            step="1"
            onChange={onSpeedChange}
          />
          <div>
            <button
              className="px-3 py-2 rounded text-sm font-medium bg-gray-400 hover:bg-gray-500 mr-2 focus:outline-none focus:text-white"
              onClick={() => dispatch(reset())}
              title="resetta registri"
            >
              <AiOutlineClear />
            </button>
            <button
              className="px-3 py-2 rounded text-sm font-medium bg-green-400 hover:bg-green-500 mr-2 focus:outline-none focus:text-white"
              onClick={runSingleInstruction}
              title="esegui prossima istruzione"
            >
              <GrPlay />
            </button>
            <button
              className="px-3 py-2 rounded text-sm font-medium bg-green-300 hover:bg-green-400 mr-2 focus:outline-none focus:text-white"
              onClick={run}
              title="esegui codice"
            >
              <GrPlayFill />
            </button>
          </div>
        </div>
      )}

      {!areErrorsPresent && status !== CpuStatus.Idle && (
        <>
          {status === CpuStatus.Running && (
          <button
            className="px-3 py-2 mr-2 rounded text-sm font-medium text-white bg-yellow-400 focus:outline-none focus:text-white"
            onClick={pause}
            title="pausa"
          >
            <GrPauseFill />
          </button>
          )}
          {status === CpuStatus.Paused && (
          <button
            className="px-3 py-2 mr-2 rounded text-sm font-medium text-white bg-green-500 focus:outline-none focus:text-white"
            onClick={resume}
            title="riprendi"
          >
            <GrPlayFill />
          </button>
          )}
          <button
            className="px-3 py-2 rounded text-sm font-medium text-white bg-red-500 focus:outline-none focus:text-white"
            onClick={stop}
            title="stop"
          >
            <GrStopFill />
          </button>
        </>
      )}
    </div>
  )
}
