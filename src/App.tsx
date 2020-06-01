import React from 'react'
import { AppLayout } from './layout/AppLayout'
import { CodeEditor } from './CodeEditor'
import { Simulator } from './Simulator'

const App = () => (
  <AppLayout>
    <div className="flex justify-between max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">

      <div className="w-2/3 mr-2 pt-4 h-96">
        <Simulator />
      </div>

      <div className="w-1/3 ml-2 h-96">
        <CodeEditor />
      </div>

    </div>
  </AppLayout>
)

export default App
