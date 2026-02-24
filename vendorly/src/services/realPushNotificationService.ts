/**
 * Real Push Notification Service
 * Implements actual browser push notifications using Web Push API
 */

interface PushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

interface NotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  image?: string
  data?: unknown
  tag?: string
  requireInteraction?: boolean
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
}

interface NotificationOptions {
  userId: string
  type: 'order_update' | 'promotion' | 'message' | 'payment' | 'general'
  priority: 'low' | 'normal' | 'high'
  scheduledTime?: Date
  targetSegment?: string[]
}

class RealPushNotificationService {
  private vapidPublicKey = 'your-vapid-public-key' // Replace with actual VAPID key
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null
  private isSupported = false
  private permission: NotificationPermission = 'default'

  constructor() {
    this.checkSupport()
    this.initializeServiceWorker()
  }

  /**
   * Check if push notifications are supported
   */
  private checkSupport(): void {
    this.isSupported = 
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
  }

  /**
   * Initialize service worker for push notifications
   */
  private async initializeServiceWorker(): Promise<void> {
    if (!this.isSupported) {
      console.warn('Push notifications are not supported in this browser')
      return
    }

    try {
      // Register service worker
      this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js')
      
      // Wait for service worker to be ready
      await navigator.serviceWorker.ready
      
      console.log('Service worker registered for push notifications')
    } catch (error) {
      console.error('Failed to register service worker:', error)
    }
  }

  /**
   * Request notification permission from user
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) {
      throw new Error('Push notifications are not supported')
    }

    if (this.permission === 'granted') {
      return this.permission
    }

    // Request permission
    this.permission = await Notification.requestPermission()
    
    if (this.permission === 'granted') {
      console.log('Notification permission granted')
    } else {
      console.warn('Notification permission denied')
    }

    return this.permission
  }

  /**
   * Subscribe user to push notifications
   */
  async subscribe(userId: string): Promise<PushSubscription | null> {
    try {
      // Request permission first
      const permission = await this.requestPermission()
      if (permission !== 'granted') {
        throw new Error('Notification permission not granted')
      }

      if (!this.serviceWorkerRegistration) {
        throw new Error('Service worker not registered')
      }

      // Subscribe to push manager
      const pushSubscription = await this.serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
      })

      // Convert to our format
      const subscription: PushSubscription = {
        endpoint: pushSubscription.endpoint,
        keys: {
          p256dh: this.arrayBufferToBase64(pushSubscription.getKey('p256dh')!),
          auth: this.arrayBufferToBase64(pushSubscription.getKey('auth')!)
        }
      }

      // Store subscription on server
      await this.storeSubscription(userId, subscription)

      console.log('Push notification subscription successful')
      return subscription

    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
      return null
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(userId: string): Promise<boolean> {
    try {
      if (!this.serviceWorkerRegistration) {
        return false
      }

      const subscription = await this.serviceWorkerRegistration.pushManager.getSubscription()
      if (subscription) {
        await subscription.unsubscribe()
        // Remove from server
        await this.removeSubscription(userId)
        console.log('Push notification unsubscribed')
        return true
      }

      return false
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error)
      return false
    }
  }

  /**
   * Send local notification (for testing)
   */
  async sendLocalNotification(payload: NotificationPayload): Promise<void> {
    if (!this.isSupported || this.permission !== 'granted') {
      console.warn('Cannot send notification: permission not granted')
      return
    }

    try {
      const registration = await navigator.serviceWorker.ready
      await registration.showNotification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/icon-192x192.png',
        badge: payload.badge || '/badge-72x72.png',
        data: payload.data,
        tag: payload.tag,
        requireInteraction: payload.requireInteraction
      })
    } catch (error) {
      console.error('Failed to show notification:', error)
    }
  }

  /**
   * Send push notification via server
   */
  async sendPushNotification(
    payload: NotificationPayload,
    options: NotificationOptions
  ): Promise<boolean> {
    try {
      // Send to server to trigger push notification
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload,
          options
        })
      })

      return response.ok
    } catch (error) {
      console.error('Failed to send push notification:', error)
      return false
    }
  }

  /**
   * Send bulk notifications
   */
  async sendBulkNotifications(
    payload: NotificationPayload,
    userIds: string[],
    options: Partial<NotificationOptions> = {}
  ): Promise<{ success: number; failed: number }> {
    try {
      const response = await fetch('/api/notifications/send-bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload,
          userIds,
          options
        })
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Failed to send bulk notifications:', error)
      return { success: 0, failed: userIds.length }
    }
  }

  /**
   * Schedule notification
   */
  async scheduleNotification(
    payload: NotificationPayload,
    options: NotificationOptions & { scheduledTime: Date }
  ): Promise<boolean> {
    try {
      const response = await fetch('/api/notifications/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload,
          options
        })
      })

      return response.ok
    } catch (error) {
      console.error('Failed to schedule notification:', error)
      return false
    }
  }

  /**
   * Get notification templates
   */
  async getNotificationTemplates(): Promise<Record<string, unknown>[]> {
    try {
      const response = await fetch('/api/notifications/templates')
      return await response.json()
    } catch (error) {
      console.error('Failed to get notification templates:', error)
      return []
    }
  }

  /**
   * Create notification template
   */
  async createNotificationTemplate(template: {
    name: string
    title: string
    body: string
    type: string
    icon?: string
    actions?: unknown[]
  }): Promise<boolean> {
    try {
      const response = await fetch('/api/notifications/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(template)
      })

      return response.ok
    } catch (error) {
      console.error('Failed to create notification template:', error)
      return false
    }
  }

  /**
   * Get notification analytics
   */
  async getNotificationAnalytics(dateRange: {
    from: Date
    to: Date
  }): Promise<{
    sent: number
    delivered: number
    clicked: number
    clickRate: number
  }> {
    try {
      const response = await fetch('/api/notifications/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dateRange)
      })

      return await response.json()
    } catch (error) {
      console.error('Failed to get notification analytics:', error)
      return { sent: 0, delivered: 0, clicked: 0, clickRate: 0 }
    }
  }

  /**
   * Check current subscription status
   */
  async getSubscriptionStatus(): Promise<{
    isSubscribed: boolean
    subscription: PushSubscription | null
  }> {
    try {
      if (!this.serviceWorkerRegistration) {
        return { isSubscribed: false, subscription: null }
      }

      const pushSubscription = await this.serviceWorkerRegistration.pushManager.getSubscription()
      
      if (pushSubscription) {
        const subscription: PushSubscription = {
          endpoint: pushSubscription.endpoint,
          keys: {
            p256dh: this.arrayBufferToBase64(pushSubscription.getKey('p256dh')!),
            auth: this.arrayBufferToBase64(pushSubscription.getKey('auth')!)
          }
        }
        return { isSubscribed: true, subscription }
      }

      return { isSubscribed: false, subscription: null }
    } catch (error) {
      console.error('Failed to get subscription status:', error)
      return { isSubscribed: false, subscription: null }
    }
  }

  // Utility methods
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return window.btoa(binary)
  }

  private async storeSubscription(userId: string, subscription: PushSubscription): Promise<void> {
    // Store subscription in database
    try {
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          subscription
        })
      })
    } catch (error) {
      console.error('Failed to store subscription:', error)
    }
  }

  private async removeSubscription(userId: string): Promise<void> {
    // Remove subscription from database
    try {
      await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      })
    } catch (error) {
      console.error('Failed to remove subscription:', error)
    }
  }

  // Predefined notification types
  static createOrderUpdateNotification(orderId: string, status: string): NotificationPayload {
    return {
      title: 'Order Update',
      body: `Your order #${orderId} is now ${status}`,
      icon: '/icons/order.png',
      tag: `order-${orderId}`,
      data: { type: 'order_update', orderId, status },
      actions: [
        {
          action: 'view',
          title: 'View Order',
          icon: '/icons/view.png'
        }
      ]
    }
  }

  static createPromotionNotification(title: string, description: string): NotificationPayload {
    return {
      title,
      body: description,
      icon: '/icons/promotion.png',
      tag: 'promotion',
      requireInteraction: true,
      data: { type: 'promotion' },
      actions: [
        {
          action: 'view',
          title: 'View Deals',
          icon: '/icons/view.png'
        },
        {
          action: 'dismiss',
          title: 'Not Now',
          icon: '/icons/dismiss.png'
        }
      ]
    }
  }

  static createMessageNotification(senderName: string, message: string): NotificationPayload {
    return {
      title: `New message from ${senderName}`,
      body: message,
      icon: '/icons/message.png',
      tag: 'message',
      data: { type: 'message', senderName },
      actions: [
        {
          action: 'reply',
          title: 'Reply',
          icon: '/icons/reply.png'
        }
      ]
    }
  }

  // Getters
  get isNotificationSupported(): boolean {
    return this.isSupported
  }

  get notificationPermission(): NotificationPermission {
    return this.permission
  }
}

export const realPushNotificationService = new RealPushNotificationService()
export type { NotificationPayload, NotificationOptions, PushSubscription }