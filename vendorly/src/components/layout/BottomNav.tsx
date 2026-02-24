import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Home, Search, ShoppingBag, MessageCircle, User } from 'lucide-react'

interface NavItem {
  label: string
  path: string
  icon: React.ElementType
  badge?: number
}

const customerNavItems: NavItem[] = [
  { label: 'Home', path: '/home', icon: Home },
  { label: 'Search', path: '/search', icon: Search },
  { label: 'Orders', path: '/orders', icon: ShoppingBag },
  { label: 'Chat', path: '/chat', icon: MessageCircle },
  { label: 'Profile', path: '/profile', icon: User },
]

const vendorNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/vendor-dashboard', icon: Home },
  { label: 'Inventory', path: '/vendor-inventory', icon: ShoppingBag },
  { label: 'Orders', path: '/vendor-orders', icon: Search },
  { label: 'Chat', path: '/chat', icon: MessageCircle },
  { label: 'Profile', path: '/profile', icon: User },
]

interface BottomNavProps {
  userType?: 'customer' | 'vendor'
}

export const BottomNav: React.FC<BottomNavProps> = ({ userType = 'customer' }) => {
  const location = useLocation()
  const navItems = userType === 'vendor' ? vendorNavItems : customerNavItems
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="max-w-md mx-auto px-2 py-2">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path || 
                           (item.path !== '/home' && location.pathname.startsWith(item.path))
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  relative flex flex-col items-center justify-center px-3 py-2 min-w-0 flex-1
                  transition-colors duration-200 rounded-lg
                  ${isActive 
                    ? 'text-primary bg-primary-50' 
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                  }
                `}
              >
                <div className="relative">
                  <Icon className="w-6 h-6" />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs mt-1 font-medium truncate w-full text-center">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}