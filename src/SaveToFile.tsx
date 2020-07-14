/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { GrDocumentDownload, GrDocumentUpload } from 'react-icons/gr'
import { saveAs } from 'file-saver'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from './store/rootReducer'
import { setCode } from './store/cpuSlice'

export const SaveToFile = () => {
  const dispatch = useDispatch()

  const { code } = useSelector((state: RootState) => state.cpu)

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
        <label htmlFor="file-upload" className="mr-2 cursor-pointer">
          <GrDocumentUpload />
          <input
            type="file" id="file-upload"
            onChange={(e) => e.target.files && uploadCode(e.target.files[0])}
            style={{ display: 'none' }}
          />
        </label>
        <a href="#" onClick={downloadCode}><GrDocumentDownload /></a>
      </div>
    </div>
  )
}
