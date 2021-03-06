/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { AiFillSave, AiFillFolderOpen } from 'react-icons/ai'
import { saveAs } from 'file-saver'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from './store/rootReducer'
import { setCode } from './store/cpuSlice'

export const SaveToFile = () => {
  const dispatch = useDispatch()

  const { codeMemoryRaw: code } = useSelector((state: RootState) => state.cpu)

  function downloadCode() {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, 'code.txt')
  }

  function uploadCode(file: File) {
    const reader = new FileReader()
    reader.readAsText(file, 'UTF-8')
    reader.onload = (e) => {
      dispatch(setCode(e.target?.result as string))
    }
  }

  return (
    <div className="flex flex-row justify-between items-center bg-gray-300 px-4 mb-2">
      <h3 className="text-xl">RAM</h3>
      <div className="flex">
        <label
          htmlFor="file-upload" className="mr-2 cursor-pointer"
          title="Apri codice da file"
        >
          <AiFillFolderOpen className="text-gray-600 hover:text-gray-800" />
          <input
            type="file" id="file-upload"
            onChange={(e) => e.target.files && uploadCode(e.target.files[0])}
            style={{ display: 'none' }}
          />
        </label>
        <a
          href="#" onClick={downloadCode}
          title="Salva codice su file"
        >
          <AiFillSave className="text-gray-600 hover:text-gray-800" />
        </a>
      </div>
    </div>
  )
}
