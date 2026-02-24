import React from 'react'
import VendorHeader from './VendorHeader'
import VendorSidebar from './VendorSidebar'

interface VendorLayoutProps {
  children: React.ReactNode
}

const VendorLayout: React.FC<VendorLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <VendorSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <VendorHeader />
        
        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default VendorLayout