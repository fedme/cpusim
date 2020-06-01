/* eslint-disable max-len */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useRef } from 'react'
import useOnclickOutside from 'react-cool-onclickoutside'
import { RunControls } from '../RunControls'

interface NavActionsProps {
  isMenuOpen: boolean
  onSetMenuOpen: (isOpen: boolean) => void
}

export const NavActions = ({ isMenuOpen, onSetMenuOpen }: NavActionsProps) => (
  <>
    <DesktopNavActions isMenuOpen={isMenuOpen} onSetMenuOpen={onSetMenuOpen} />
    <MobileNavActions isMenuOpen={isMenuOpen} onSetMenuOpen={onSetMenuOpen} />
  </>
)

const DesktopNavActions = ({ isMenuOpen, onSetMenuOpen }: NavActionsProps) => {
  const profileMenuRef = useRef(null)
  useOnclickOutside(profileMenuRef, () => onSetMenuOpen(false), { ignoreClass: 'md:hidden' })

  return (
    <div className="hidden md:block">
      <div className="ml-4 flex items-center md:ml-6">
        <div className="ml-3 relative" ref={profileMenuRef}>
          <div>
            <RunControls />
          </div>

        </div>
      </div>

    </div>
  )
}

const MobileNavActions = ({ isMenuOpen, onSetMenuOpen }: NavActionsProps) => (
  <div className="-mr-2 flex md:hidden">
    {/* Mobile menu button */}
    <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white" onClick={() => onSetMenuOpen(!isMenuOpen)}>
      {/* Menu open: "hidden", Menu closed: "block" */}
      <svg
        className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
        stroke="currentColor"
        fill="none" viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round" strokeLinejoin="round"
          strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
      {/* Menu open: "block", Menu closed: "hidden" */}
      <svg
        className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
        stroke="currentColor"
        fill="none" viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round" strokeLinejoin="round"
          strokeWidth="2" d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
)
