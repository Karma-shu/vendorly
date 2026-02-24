import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Users, 
  Store, 
  DollarSign, 
  BarChart3, 
  Settings, 
  Bell,
  Search,
  Menu,
  LogOut
} from 'lucide-react'
import { Button, Badge } from '../ui'

interface AdminLayoutProps {
  children?: React.ReactNode
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home, exact: true },
    { name: 'Vendor Management', href: '/admin/vendors', icon: Store },
    { name: 'Commission Management', href: '/admin/commission', icon: DollarSign },
    { name: 'Customer Management', href: '/admin/customers', icon: Users },
    { name: 'Analytics & Reports', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Platform Settings', href: '/admin/settings', icon: Settings }
  ]

  const isCurrentPath = (href: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === href
    }
    return location.pathname.startsWith(href)
  }

  const pendingNotifications = 3 // Mock notification count

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-center h-16 px-4 bg-primary-600">
          <h1 className="text-xl font-bold text-white">Vendorly Admin</h1>
        </div>
        
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const current = isCurrentPath(item.href, item.exact)
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    current
                      ? 'bg-primary-100 border-r-2 border-primary-500 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-l-md transition-colors`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={`${
                      current ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                    } flex-shrink-0 -ml-1 mr-3 h-5 w-5`}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">A</span>
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-700">Admin User</p>
              <p className="text-xs text-gray-500">admin@vendorly.com</p>
            </div>
            <Button variant="outline" size="sm">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:pl-0">
        {/* Top navigation */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow-sm border-b border-gray-200">
          <button
            className="px-4 border-r border-gray-200 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <Search className="h-5 w-5" />
                  </div>
                  <input
                    className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent"
                    placeholder="Search vendors, customers, orders..."
                    type="search"
                  />
                </div>
              </div>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {/* Notifications */}
              <button className="relative bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <Bell className="h-6 w-6" />
                {pendingNotifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {pendingNotifications}
                  </Badge>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children || <Outlet />}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}