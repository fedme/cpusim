/* eslint-disable max-len */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store/rootReducer'

export const DesktopMenu = () => (
  <div className="hidden md:block">
    <div className="ml-10 flex items-baseline">
      <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700">Home</a>
      <a href="#" className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700">Settings</a>
    </div>
  </div>
)

interface MobileMenuProps {
  isMenuOpen: boolean
}

export const MobileMenu = ({ isMenuOpen }: MobileMenuProps) => {
  const { username } = useSelector((state: RootState) => state.user)
  return (
    <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
      <div className="px-2 pt-2 pb-3 sm:px-3">
        <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700">Home</a>
        <a href="#" className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700">Settings</a>
      </div>
      <div className="pt-4 pb-3 border-t border-gray-700">
        <div className="mt-3 px-2">
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700">Option 1</a>
          <a href="#" className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700">Option 2</a>
        </div>
      </div>
    </div>
  )
}
