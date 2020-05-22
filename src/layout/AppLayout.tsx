/* eslint-disable max-len */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { Navigation } from './Navigation'
// import { PageHeader } from './PageHeader'

export const AppLayout = () => (
  <div>
    <Navigation />

    {/* <PageHeader title="Dashboard" /> */}

    <main>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Replace with your content */}
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" />
        </div>
        {/* /End replace */}
      </div>
    </main>

  </div>
)
