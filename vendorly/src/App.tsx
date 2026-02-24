import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

function App() {
  return (
    <div className="font-body">
      <RouterProvider router={router} />
    </div>
  )
}

export default App