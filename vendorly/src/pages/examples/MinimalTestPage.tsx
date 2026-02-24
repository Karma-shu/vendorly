import React from 'react'

const MinimalTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Minimal Test Page</h1>
        <p className="text-lg text-gray-600">This is a minimal test to verify the app works.</p>
      </div>
    </div>
  )
}

export default MinimalTestPage