import React, { useState, useEffect } from 'react'
import { Card, Button, Badge } from '../ui'
import { Bell, BellOff, Send, BarChart3 } from 'lucide-react'
import { realPushNotificationService } from '../../services/realPushNotificationService'

export const PushNotificationManager: React.FC = () => {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    initializeNotifications()
  }, [])

  const initializeNotifications = async () => {
    try {
      const status = await realPushNotificationService.getSubscriptionStatus()
      setIsSubscribed(status.isSubscribed)
      setPermission(realPushNotificationService.notificationPermission)
    } catch (error) {
      console.error('Failed to initialize notifications:', error)
    }
  }

  const handleSubscribe = async () => {
    try {
      const userId = 'current-user-id'
      const subscription = await realPushNotificationService.subscribe(userId)
      if (subscription) {
        setIsSubscribed(true)
        setPermission('granted')
      }
    } catch (error) {
      console.error('Subscription failed:', error)
    }
  }

  const handleUnsubscribe = async () => {
    try {
      const userId = 'current-user-id'
      const success = await realPushNotificationService.unsubscribe(userId)
      if (success) {
        setIsSubscribed(false)
      }
    } catch (error) {
      console.error('Unsubscribe failed:', error)
    }
  }

  const handleSendTestNotification = async () => {
    try {
      await realPushNotificationService.sendLocalNotification({
        title: 'Test Notification',
        body: 'This is a test notification from Vendorly',
        icon: '/icon-192x192.png',
        tag: 'test'
      })
    } catch (error) {
      console.error('Failed to send test notification:', error)
    }
  }

  const getStatusBadge = () => {
    if (permission === 'granted' && isSubscribed) {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>
    } else if (permission === 'denied') {
      return <Badge className="bg-red-100 text-red-800">Blocked</Badge>
    }
    return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-primary-600" />
            <div>
              <h2 className="text-lg font-semibold">Push Notifications</h2>
              <p className="text-gray-600">Manage your notification preferences</p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Browser Notifications</span>
            {isSubscribed ? (
              <Button variant="outline" onClick={handleUnsubscribe}>
                <BellOff className="w-4 h-4 mr-2" />
                Unsubscribe
              </Button>
            ) : (
              <Button variant="primary" onClick={handleSubscribe}>
                <Bell className="w-4 h-4 mr-2" />
                Enable Notifications
              </Button>
            )}
          </div>

          {isSubscribed && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSendTestNotification}>
                <Send className="w-4 h-4 mr-2" />
                Send Test
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Analytics Summary */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold">Notification Analytics</h3>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">1,250</div>
            <div className="text-sm text-gray-600">Sent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">1,180</div>
            <div className="text-sm text-gray-600">Delivered</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">234</div>
            <div className="text-sm text-gray-600">Clicked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">19.8%</div>
            <div className="text-sm text-gray-600">Click Rate</div>
          </div>
        </div>
      </Card>
    </div>
  )
}