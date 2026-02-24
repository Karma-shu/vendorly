import { useState, useEffect, useCallback } from 'react'
import { realPushNotificationService } from '../services/realPushNotificationService'

export const usePushNotifications = (userId: string) => {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkSubscriptionStatus()
  }, [])

  const checkSubscriptionStatus = async () => {
    try {
      const status = await realPushNotificationService.getSubscriptionStatus()
      setIsSubscribed(status.isSubscribed)
      setPermission(realPushNotificationService.notificationPermission)
    } catch (err) {
      setError('Failed to check notification status')
    }
  }

  const subscribe = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const subscription = await realPushNotificationService.subscribe(userId)
      if (subscription) {
        setIsSubscribed(true)
        setPermission('granted')
        return true
      }
      return false
    } catch (err) {
      setError('Failed to subscribe to notifications')
      return false
    } finally {
      setLoading(false)
    }
  }, [userId])

  const unsubscribe = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const success = await realPushNotificationService.unsubscribe(userId)
      if (success) {
        setIsSubscribed(false)
      }
      return success
    } catch (err) {
      setError('Failed to unsubscribe from notifications')
      return false
    } finally {
      setLoading(false)
    }
  }, [userId])

  const sendTestNotification = useCallback(async () => {
    try {
      await realPushNotificationService.sendLocalNotification({
        title: 'Test Notification',
        body: 'This is a test notification from Vendorly',
        icon: '/icon-192x192.png',
        tag: 'test'
      })
      return true
    } catch (err) {
      setError('Failed to send test notification')
      return false
    }
  }, [])

  return {
    isSubscribed,
    permission,
    loading,
    error,
    subscribe,
    unsubscribe,
    sendTestNotification,
    checkSubscriptionStatus
  }
}