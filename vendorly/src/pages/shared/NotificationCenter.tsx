import React, { useState, useEffect } from 'react'
import { Bell, X, Check, Filter, Search, Trash2, Settings, Eye, MessageSquare, ShoppingBag, CreditCard, Star, AlertTriangle } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { useNotifications } from '../../components/ui/Notification'
import type { NotificationData } from '../../types'

// Mock notification data
const mockNotifications: NotificationData[] = [
  {
    id: 'notif1',
    userId: 'customer1',
    userType: 'customer',
    type: 'order',
    title: 'Order Delivered Successfully',
    message: 'Your order #ORD123 has been delivered. Please rate your experience!',
    data: { orderId: 'ORD123', vendorId: 'vendor1' },
    isRead: false,
    isPush: true,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'notif2',
    userId: 'customer1',
    userType: 'customer',
    type: 'promotion',
    title: '🎉 Special Offer - 20% Off',
    message: 'Get 20% off on your next grocery order. Use code SAVE20. Valid till tomorrow!',
    data: { promoCode: 'SAVE20', discount: 20 },
    isRead: false,
    isPush: true,
    createdAt: '2024-01-15T09:15:00Z',
    expiresAt: '2024-01-16T23:59:59Z'
  },
  {
    id: 'notif3',
    userId: 'customer1',
    userType: 'customer',
    type: 'order',
    title: 'Order Out for Delivery',
    message: 'Your order #ORD124 is out for delivery. Expected delivery in 10 minutes.',
    data: { orderId: 'ORD124', deliveryPartnerId: 'del1' },
    isRead: true,
    isPush: true,
    createdAt: '2024-01-15T08:45:00Z'
  },
  {
    id: 'notif4',
    userId: 'customer1',
    userType: 'customer',
    type: 'payment',
    title: 'Payment Successful',
    message: 'Payment of ₹285 for order #ORD124 was successful. Thank you for shopping!',
    data: { orderId: 'ORD124', amount: 285 },
    isRead: true,
    isPush: true,
    createdAt: '2024-01-15T08:30:00Z'
  },
  {
    id: 'notif5',
    userId: 'customer1',
    userType: 'customer',
    type: 'message',
    title: 'New Message from Fresh Mart',
    message: 'Thank you for your order! We are preparing your groceries with care.',
    data: { vendorId: 'vendor1', conversationId: 'conv1' },
    isRead: false,
    isPush: true,
    createdAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 'notif6',
    userId: 'customer1',
    userType: 'customer',
    type: 'system',
    title: 'App Update Available',
    message: 'A new version of Vendorly is available with exciting features. Update now!',
    data: { version: '2.1.0' },
    isRead: true,
    isPush: false,
    createdAt: '2024-01-14T16:00:00Z'
  }
]

interface NotificationCenterProps {
  currentUserId?: string
  currentUserType?: 'customer' | 'vendor'
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  currentUserId = 'customer1',
  currentUserType = 'customer'
}) => {
  const [notifications, setNotifications] = useState<NotificationData[]>(mockNotifications)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | NotificationData['type']>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'read' | 'unread'>('all')
  const [showSettings, setShowSettings] = useState(false)
  const { showSuccess: showNotification } = useNotifications()

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (notification.userId !== currentUserId) return false
    if (notification.userType !== currentUserType) return false
    
    const matchesSearch = searchQuery === '' || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = typeFilter === 'all' || notification.type === typeFilter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'read' && notification.isRead) ||
      (statusFilter === 'unread' && !notification.isRead)
    
    return matchesSearch && matchesType && matchesStatus
  })

  const unreadCount = notifications.filter(n => 
    n.userId === currentUserId && n.userType === currentUserType && !n.isRead
  ).length

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.userId === currentUserId && notif.userType === currentUserType
          ? { ...notif, isRead: true }
          : notif
      )
    )
    showNotification('All notifications marked as read', 'success')
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
    showNotification('Notification deleted', 'success')
  }

  const clearAllNotifications = () => {
    const userNotifications = notifications.filter(notif => 
      notif.userId === currentUserId && notif.userType === currentUserType
    )
    
    if (userNotifications.length === 0) return
    
    if (confirm(`Delete all ${userNotifications.length} notifications? This action cannot be undone.`)) {
      setNotifications(prev => 
        prev.filter(notif => 
          !(notif.userId === currentUserId && notif.userType === currentUserType)
        )
      )
      showNotification('All notifications cleared', 'success')
    }
  }

  const getNotificationIcon = (type: NotificationData['type']) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-5 h-5 text-blue-600" />
      case 'payment':
        return <CreditCard className="w-5 h-5 text-green-600" />
      case 'message':
        return <MessageSquare className="w-5 h-5 text-purple-600" />
      case 'promotion':
        return <Star className="w-5 h-5 text-yellow-600" />
      case 'review':
        return <Star className="w-5 h-5 text-orange-600" />
      case 'system':
        return <AlertTriangle className="w-5 h-5 text-gray-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffMinutes < 1) return 'Just now'
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    
    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  const isExpired = (notification: NotificationData) => {
    if (!notification.expiresAt) return false
    return new Date(notification.expiresAt) < new Date()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6 text-gray-900" />
                <div>
                  <h1 className="text-2xl font-heading font-bold text-gray-900">
                    Notifications
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {unreadCount > 0 
                      ? `${unreadCount} unread ${unreadCount === 1 ? 'notification' : 'notifications'}`
                      : 'All caught up!'
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button variant="outline" onClick={markAllAsRead}>
                    <Check className="w-4 h-4 mr-2" />
                    Mark All Read
                  </Button>
                )}
                <Button variant="outline" onClick={() => setShowSettings(!showSettings)}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="order">Orders</option>
              <option value="payment">Payments</option>
              <option value="message">Messages</option>
              <option value="promotion">Promotions</option>
              <option value="review">Reviews</option>
              <option value="system">System</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
            
            {filteredNotifications.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearAllNotifications}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </Card>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">
                {searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'You\'re all caught up! New notifications will appear here.'
                }
              </p>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`p-4 transition-colors ${
                  notification.isRead ? 'bg-white' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium ${
                            notification.isRead ? 'text-gray-900' : 'text-gray-900 font-semibold'
                          }`}>
                            {notification.title}
                          </h4>
                          
                          <Badge variant={
                            notification.type === 'order' ? 'info' :
                            notification.type === 'payment' ? 'success' :
                            notification.type === 'promotion' ? 'warning' :
                            'default'
                          } size="sm">
                            {notification.type}
                          </Badge>
                          
                          {isExpired(notification) && (
                            <Badge variant="error" size="sm">Expired</Badge>
                          )}
                        </div>
                        
                        <p className={`text-sm ${
                          notification.isRead ? 'text-gray-600' : 'text-gray-700'
                        }`}>
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-500">
                            {formatDate(notification.createdAt)}
                          </span>
                          
                          {notification.isPush && (
                            <Badge variant="default" size="sm">
                              Push Sent
                            </Badge>
                          )}
                          
                          {notification.expiresAt && !isExpired(notification) && (
                            <span className="text-xs text-orange-600">
                              Expires {formatDate(notification.expiresAt)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-heading font-semibold text-gray-900">
                  Notification Settings
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {['order', 'payment', 'message', 'promotion', 'review', 'system'].map((type) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getNotificationIcon(type as NotificationData['type'])}
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {type} Notifications
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Push Notifications
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button onClick={() => setShowSettings(false)} className="flex-1">
                  Save Settings
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationCenter