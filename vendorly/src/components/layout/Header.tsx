import React from 'react'
import type { ReactNode } from 'react'
import { ArrowLeft, Bell, ShoppingCart, MapPin } from 'lucide-react'
import { Button } from '../ui/Button'

interface HeaderProps {
  title?: string
  subtitle?: string
  showBackButton?: boolean
  onBackClick?: () => void
  showLocation?: boolean
  location?: string
  onLocationClick?: () => void
  showNotifications?: boolean
  notificationCount?: number
  onNotificationClick?: () => void
  showCart?: boolean
  cartCount?: number
  onCartClick?: () => void
  rightContent?: ReactNode
  className?: string
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackClick,
  showLocation = false,
  location = 'Select Location',
  onLocationClick,
  showNotifications = false,
  notificationCount = 0,
  onNotificationClick,
  showCart = false,
  cartCount = 0,
  onCartClick,
  rightContent,
  className = ''
}) => {
  return (
    <header className={`bg-white border-b border-gray-200 sticky top-0 z-30 ${className}`}>
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Side */}
          <div className="flex items-center flex-1">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                icon={ArrowLeft}
                onClick={onBackClick}
                className="!p-2 mr-2"
              />
            )}
            
            <div className="flex-1">
              {showLocation ? (
                <button
                  onClick={onLocationClick}
                  className="flex items-center text-left hover:bg-gray-50 rounded-lg p-2 -ml-2 transition-colors"
                >
                  <MapPin className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Deliver to</p>
                    <p className="font-medium text-gray-900 truncate">{location}</p>
                  </div>
                </button>
              ) : (
                <div>
                  {title && (
                    <h1 className="text-lg font-semibold text-gray-900 font-heading truncate">
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="text-sm text-gray-600 truncate">{subtitle}</p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Right Side */}
          <div className="flex items-center space-x-2">
            {rightContent}
            
            {showNotifications && (
              <Button
                variant="ghost"
                size="sm"
                icon={Bell}
                onClick={onNotificationClick}
                className="!p-2 relative"
              >
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </span>
                )}
              </Button>
            )}
            
            {showCart && (
              <Button
                variant="ghost"
                size="sm"
                icon={ShoppingCart}
                onClick={onCartClick}
                className="!p-2 relative"
              >
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}