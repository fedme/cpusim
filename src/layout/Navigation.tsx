/* eslint-disable max-len */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { RunControls } from '../RunControls'

export const Navigation = () => (
  <nav className="bg-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">

        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="text-white font-bold">Simulatore CPU</span>
          </div>

        </div>

        <div className="hidden md:block">
          <div className="ml-4 flex items-center md:ml-6">
            <div className="ml-3 relative">
              <div>
                <RunControls />
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>

  </nav>
)
