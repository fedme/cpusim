/* eslint-disable max-len */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useRef } from 'react'
import useOnclickOutside from 'react-cool-onclickoutside'
import { ProfileMenu } from './ProfileMenu'

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
            <button
              className="max-w-xs flex items-center text-sm rounded-full text-white focus:outline-none focus:shadow-solid" id="user-menu"
              aria-label="User menu" aria-haspopup="true"
              onClick={() => onSetMenuOpen(!isMenuOpen)}
            >
              <svg
                className="h-6 w-6" stroke="currentColor"
                fill="none" viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
          </div>

          <ProfileMenu isMenuOpen={isMenuOpen} />

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
