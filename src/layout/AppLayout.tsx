/* eslint-disable max-len */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FunctionComponent } from 'react'
import { Navigation } from './Navigation'
import { RunControls } from '../RunControls'
// import { PageHeader } from './PageHeader'

export const AppLayout: FunctionComponent = ({ children }) => (
  <div>
    <Navigation />

    <div className="sm:block md:hidden p-2">
      <RunControls />
    </div>

    <main>
      {children}
    </main>

  </div>
)
