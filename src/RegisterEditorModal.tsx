/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import useOnClickOutside from 'use-onclickoutside'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from './store/rootReducer'
import { set } from './store/cpuSlice'
import { InstructionType } from './instructionParser'

export type AnyRegister = null | 'R0' | 'R1' | 'A' | 'SP' | 'PC' | 'IX'

interface RegisterEditorModalProps {
  registerUnderEdit: AnyRegister
  onClose: () => void
}

export const RegisterEditorModal = ({ registerUnderEdit, onClose }: RegisterEditorModalProps) => {
  const dispatch = useDispatch()
  const {
    pc, r0, r1, a, ix, sp
  } = useSelector((state: RootState) => state.cpu)

  const modalRef = React.useRef(null)
  useOnClickOutside(modalRef, onClose)

  let registerUnderEditValue = r0
  if (registerUnderEdit != null) {
    switch (registerUnderEdit) {
      case 'R0': {
        registerUnderEditValue = r0
        break
      }
      case 'R1': {
        registerUnderEditValue = r1
        break
      }
      case 'A': {
        registerUnderEditValue = a
        break
      }
      case 'SP': {
        registerUnderEditValue = sp
        break
      }
      case 'PC': {
        registerUnderEditValue = pc
        break
      }
      case 'IX': {
        registerUnderEditValue = ix
        break
      }
    }
  }

  return (registerUnderEdit && (
    <>
      <div className="absolute inset-x-0 bg-white w-full h-full opacity-75" />
      <div ref={modalRef} className="absolute inset-x-0 shadow-2xl bg-white w-3/4 mx-auto mt-48 p-8 rounded text-center">

        {registerUnderEdit}: &nbsp;
        <input
          className="form-input"
          type="number" value={registerUnderEditValue}
          onChange={(e) => dispatch(set({ type: InstructionType.Set, register: registerUnderEdit, data: e.target.value as unknown as number }))}
        />
      </div>
    </>
  ))
}
