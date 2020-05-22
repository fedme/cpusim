/* eslint-disable max-len */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FunctionComponent } from 'react'
import { Navigation } from './Navigation'
// import { PageHeader } from './PageHeader'

export const AppLayout: FunctionComponent = ({ children }) => (
  <div>
    <Navigation />

    {/* <PageHeader title="Dashboard" /> */}

    <main>
      {children}
    </main>

  </div>
)
