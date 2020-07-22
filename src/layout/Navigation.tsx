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

          <div>
            <svg
              viewBox="0 0 219.21333 40.266666" width="160px"
              className="mr-4"
            >
              <g transform="matrix(1.3333333,0,0,-1.3333333,0,40.266667)">
                <g transform="scale(0.1)">
                  <path
                    fill="#ed1c24" stroke="none"
                    d="M 0,302.02 H 1644.09 V 0 H 0 v 302.02 0"
                  />
                  <path
                    fill="#ffffff" stroke="none"
                    d="M 69.0938,208.457 H 122.988 L 61.2813,96.4336 V 61.5508 H 169.066 v 31.6133 h -63.207 l 61.7,111.5119 v 35.39 H 69.0938 V 208.457 Z M 497.59,150.059 c 0,11.804 0.008,22.41 0.965,33.269 0.965,10.918 2.91,21.192 6.855,30.02 8.035,18 24.168,29.531 55.313,29.531 39.211,0 55.078,-22.219 53.562,-61.258 l -0.066,-2.062 h -40.442 v 2.14 c 0,24.028 -4.324,30.34 -13.054,30.34 -18.235,0 -21.387,-15.301 -21.387,-61.98 0,-46.672 3.152,-61.9731 21.387,-61.9731 7.215,0 10.754,4.4532 12.644,11.2579 0.949,3.4492 1.43,7.3552 1.692,11.3472 0.273,4.024 0.312,8.02 0.429,11.497 l 0.078,2.07 h 40.696 v -2.141 c 0,-48.5037 -19.68,-64.8631 -55.539,-64.8631 -31.153,0 -47.285,11.6524 -55.325,29.707 -3.933,8.8672 -5.878,19.1521 -6.843,30.0391 -0.957,10.852 -0.965,21.379 -0.965,33.059 z M 392.117,124.258 354.848,240.066 H 312.289 V 61.5508 h 36.262 V 177.871 L 385.57,61.5508 h 43.317 V 240.066 h -36.77 V 124.258 Z M 175.945,61.5508 h 42.063 l 6.293,40.7032 h 32.988 l 6.051,-40.7032 h 42.051 L 269.379,240.066 H 211.957 L 175.945,61.5508 Z m 77.063,70.7932 h -23.914 l 12.09,79.402 11.824,-79.402 z M 442.699,240.066 V 61.5508 H 485.77 V 240.066 H 442.699 Z M 629.59,61.5508 h 43.055 v 74.6012 h 29.972 V 61.5508 h 43.067 V 240.066 h -43.067 v -72.058 h -29.972 v 72.058 H 629.59 V 61.5508 Z M 760.43,240.066 V 61.5508 h 91.925 v 31.6133 h -48.871 v 42.9879 h 46.094 v 31.856 h -46.094 v 40.449 h 48.871 v 31.609 H 760.43 Z M 863.965,61.5508 h 87.637 V 93.1641 H 907.285 V 240.066 h -43.32 V 61.5508 Z m 100.383,0 h 87.632 v 31.6133 h -44.31 V 240.066 H 964.348 V 61.5508 Z M 1061.76,240.066 V 61.5508 h 43.05 V 240.066 h -43.05 v 0"
                  />
                </g>
              </g>
            </svg>
          </div>

          <div className="flex-shrink-0 md:hidden lg:block">
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
