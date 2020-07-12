import React from 'react'
import { AppLayout } from './layout/AppLayout'
import { Memory } from './Memory'
import { Simulator } from './Simulator'

const App = () => (
  <AppLayout>
    <div className="flex justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div className="w-3/5 pt-4">
        <Simulator />
      </div>

      <div className="w-2/5 h-full border-4 mt-6">
        <Memory />
      </div>

    </div>
  </AppLayout>
)

export default App
