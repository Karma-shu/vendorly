import React, { useState } from 'react'
import { Bell, Search, ChevronDown } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { getUnreadNotifications } from '../../utils/mockVendorData'

const VendorHeader: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const unreadNotifications = getUnreadNotifications()

  const vendorProfile = {
    name: 'Raj Kumar',
    businessName: 'Fresh Fruits Corner',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders, products, customers..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-6 h-6" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {unreadNotifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No new notifications
                    </div>
                  ) : (
                    unreadNotifications.slice(0, 5).map((notification) => (
                      <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.type === 'order' ? 'bg-blue-500' :
                            notification.type === 'payment' ? 'bg-green-500' :
                            notification.type === 'review' ? 'bg-yellow-500' :
                            'bg-gray-500'
                          }`} />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">
                              {notification.title}
                            </h4>
                            <p className="text-gray-600 text-sm mt-1">
                              {notification.message}
                            </p>
                            <p className="text-gray-400 text-xs mt-2">
                              {new Date(notification.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {unreadNotifications.length > 0 && (
                  <div className="p-4 border-t border-gray-200">
                    <button className="text-primary text-sm font-medium hover:text-primary-600">
                      View all notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <img
                src={vendorProfile.avatar}
                alt={vendorProfile.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="hidden md:block text-left">
                <p className="font-medium text-gray-900 text-sm">{vendorProfile.name}</p>
                <p className="text-gray-500 text-xs">{vendorProfile.businessName}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <img
                      src={vendorProfile.avatar}
                      alt={vendorProfile.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{vendorProfile.name}</h3>
                      <p className="text-gray-600 text-sm">{vendorProfile.businessName}</p>
                      <Badge variant="success" size="sm" className="mt-1">Verified</Badge>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                    View Profile
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                    Business Settings
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                    Help & Support
                  </button>
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default VendorHeader