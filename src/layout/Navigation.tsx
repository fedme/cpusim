/* eslint-disable max-len */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { NavActions } from './NavActions'
import { DesktopMenu, MobileMenu } from './Menu'

export const Navigation = () => {
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false)

  return (
    <nav className="bg-gray-800">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white font-bold">CPU Simulator</span>
            </div>

            <DesktopMenu />

          </div>

          <NavActions isMenuOpen={isMenuOpen} onSetMenuOpen={(isOpen) => setMenuOpen(isOpen)} />

        </div>
      </div>

      <MobileMenu isMenuOpen={isMenuOpen} />

    </nav>
  )
}
