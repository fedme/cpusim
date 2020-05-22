/* eslint-disable max-len */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import Transition from '../ui/Transition'


interface ProfileMenuProps {
  isMenuOpen: boolean
}

export const ProfileMenu = ({ isMenuOpen }: ProfileMenuProps) => (
  <Transition
    show={isMenuOpen}
    enter="transition ease-out duration-100"
    enterFrom="transform opacity-0 scale-95"
    enterTo="transform opacity-100 scale-100"
    leave="transition ease-in duration-75"
    leaveFrom="transform opacity-100 scale-100"
    leaveTo="transform opacity-0 scale-95"
  >
    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg">
      <div
        className="py-1 rounded-md bg-white shadow-xs" role="menu"
        aria-orientation="vertical" aria-labelledby="user-menu"
      >
        <a
          href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
        >Option 1
        </a>
        <a
          href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
        >Option 2
        </a>
      </div>
    </div>
  </Transition>
)
