import React from 'react'
import { AppLayout } from './layout/AppLayout'
import { Memory } from './Memory'
import { Simulator } from './Simulator'

const App = () => (
  <AppLayout>
    <div className="md:flex md:justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div className="sm:w-full md:w-3/5 pt-4">
        <Simulator />
        <div className="text-xs text-gray-300 text-right md:text-left md:ml-12 md:mt-4">&copy; Zanichelli Editore S.p.A., 2022</div>
      </div>

      <div className="sm:w-full md:w-2/5 h-full border-4 mt-6">
        <Memory />
      </div>

    </div>
  </AppLayout>
)

export default App
