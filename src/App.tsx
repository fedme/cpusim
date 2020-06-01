import React from 'react'
import { AppLayout } from './layout/AppLayout'
import { CodeEditor } from './CodeEditor'
import { Simulator } from './Simulator'
import { RunControls } from './RunControls'

const App = () => (
  <AppLayout>
    <div className="flex justify-between max-w-7xl mx-auto py-6 sm:px-4 lg:px-4">

      <div className="w-3/4 ml-2 p-4 border-4 border-dashed border-gray-200 rounded-lg h-96">
        <Simulator />
      </div>

      <div className="w-1/4 mr-2 h-96">
        <CodeEditor />
        <RunControls />
      </div>

    </div>
  </AppLayout>
)

export default App
