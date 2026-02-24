import React from 'react'

const DiagnosticsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Diagnostics Page</h1>
        <p className="text-lg text-gray-600 mb-6">React is working correctly!</p>
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md">
          If you can see this, the React app is rendering properly.
        </div>
      </div>
    </div>
  )
}

export default DiagnosticsPage