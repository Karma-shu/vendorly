import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  Store,
  LogOut
} from 'lucide-react'
import { getUnreadNotifications } from '../../utils/mockVendorData'

const VendorSidebar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const unreadCount = getUnreadNotifications().length

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/vendor-dashboard',
      active: location.pathname === '/vendor-dashboard'
    },
    { 
      icon: ShoppingCart, 
      label: 'Orders', 
      path: '/vendor/orders',
      active: location.pathname.startsWith('/vendor/orders')
    },
    { 
      icon: Package, 
      label: 'Products', 
      path: '/vendor/products',
      active: location.pathname.startsWith('/vendor/products')
    },
    { 
      icon: BarChart3, 
      label: 'Analytics', 
      path: '/vendor/analytics',
      active: location.pathname === '/vendor/analytics'
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      path: '/vendor/settings',
      active: location.pathname === '/vendor/settings'
    }
  ]

  const handleLogout = () => {
    localStorage.removeItem('demoUser')
    navigate('/welcome')
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Store className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-gray-900">Vendorly</h1>
            <p className="text-sm text-gray-500">Vendor Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    item.active
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.label === 'Orders' && unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}

export default VendorSidebar