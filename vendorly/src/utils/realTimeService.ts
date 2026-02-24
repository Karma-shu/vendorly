// Real-time updates using WebSocket simulation
// In production, this would connect to your WebSocket server or use services like Pusher, Socket.IO

export interface OrderStatusUpdateData {
  orderId: string
  status: string
  estimatedDelivery?: string
  trackingInfo?: string
}

export interface InventoryUpdateData {
  productId: string
  vendorId: string
  newStock: number
  isLowStock: boolean
}

export interface NewMessageData {
  conversationId: string
  senderId: string
  senderName: string
  message: string
}

export interface NewOrderData {
  orderId: string
  customerId: string
  customerName: string
  total: number
  items: number
}

export interface PaymentUpdateData {
  orderId: string
  paymentId: string
  status: string
  amount: number
}

export interface RealTimeEvent {
  type: 'order_status_update' | 'inventory_update' | 'new_message' | 'new_order' | 'payment_update'
  data: OrderStatusUpdateData | InventoryUpdateData | NewMessageData | NewOrderData | PaymentUpdateData
  timestamp: string
  userId: string
  userType: 'customer' | 'vendor'
}

export interface RealTimeSubscription {
  id: string
  eventType: RealTimeEvent['type']
  callback: (event: RealTimeEvent) => void
  userId: string
  userType: 'customer' | 'vendor'
}

class RealTimeService {
  private subscriptions: Map<string, RealTimeSubscription> = new Map()
  private mockInterval: number | null = null
  private isConnected: boolean = false

  // Simulate WebSocket connection
  connect() {
    if (this.isConnected) return

    console.log('🔌 Connecting to real-time service...')
    this.isConnected = true

    // Simulate receiving real-time events
    this.startMockEvents()
    
    console.log('✅ Connected to real-time service')
  }

  disconnect() {
    if (!this.isConnected) return

    console.log('🔌 Disconnecting from real-time service...')
    
    if (this.mockInterval) {
      clearInterval(this.mockInterval)
      this.mockInterval = null
    }
    
    this.subscriptions.clear()
    this.isConnected = false
    
    console.log('❌ Disconnected from real-time service')
  }

  // Subscribe to specific event types
  subscribe(
    eventType: RealTimeEvent['type'],
    callback: (event: RealTimeEvent) => void,
    userId: string,
    userType: 'customer' | 'vendor'
  ): string {
    const subscriptionId = `${eventType}_${userId}_${Date.now()}`
    
    const subscription: RealTimeSubscription = {
      id: subscriptionId,
      eventType,
      callback,
      userId,
      userType
    }

    this.subscriptions.set(subscriptionId, subscription)
    
    console.log(`📡 Subscribed to ${eventType} for ${userType} ${userId}`)
    
    return subscriptionId
  }

  // Unsubscribe from events
  unsubscribe(subscriptionId: string) {
    if (this.subscriptions.has(subscriptionId)) {
      const subscription = this.subscriptions.get(subscriptionId)!
      this.subscriptions.delete(subscriptionId)
      console.log(`📡 Unsubscribed from ${subscription.eventType}`)
    }
  }

  // Emit event to all subscribers
  private emitEvent(event: RealTimeEvent) {
    this.subscriptions.forEach((subscription) => {
      // Check if this event is relevant to the subscriber
      if (
        subscription.eventType === event.type &&
        (subscription.userId === event.userId || event.userId === 'all') &&
        subscription.userType === event.userType
      ) {
        try {
          subscription.callback(event)
        } catch (error) {
          console.error('Error in real-time event callback:', error)
        }
      }
    })
  }

  // Simulate real-time events for demo purposes
  private startMockEvents() {
    const mockEvents: Omit<RealTimeEvent, 'timestamp'>[] = [
      {
        type: 'order_status_update',
        data: {
          orderId: 'ORD123',
          status: 'out_for_delivery',
          estimatedDelivery: '10 minutes',
          trackingInfo: 'Your order is out for delivery'
        },
        userId: 'customer1',
        userType: 'customer'
      },
      {
        type: 'inventory_update',
        data: {
          productId: 'prod1',
          vendorId: 'vendor1',
          newStock: 45,
          isLowStock: false
        },
        userId: 'vendor1',
        userType: 'vendor'
      },
      {
        type: 'new_message',
        data: {
          conversationId: 'conv1',
          senderId: 'vendor1',
          senderName: 'Fresh Mart',
          message: 'Your order is being prepared with care!'
        },
        userId: 'customer1',
        userType: 'customer'
      },
      {
        type: 'new_order',
        data: {
          orderId: 'ORD125',
          customerId: 'customer2',
          customerName: 'Priya Patel',
          total: 245.50,
          items: 3
        },
        userId: 'vendor1',
        userType: 'vendor'
      },
      {
        type: 'payment_update',
        data: {
          orderId: 'ORD124',
          paymentId: 'pay123',
          status: 'completed',
          amount: 285
        },
        userId: 'customer1',
        userType: 'customer'
      }
    ]

    let eventIndex = 0

    this.mockInterval = setInterval(() => {
      if (this.subscriptions.size > 0) {
        const baseEvent = mockEvents[eventIndex % mockEvents.length]
        const event: RealTimeEvent = {
          ...baseEvent,
          timestamp: new Date().toISOString()
        }

        this.emitEvent(event)
        eventIndex++
      }
    }, 10000) // Emit event every 10 seconds for demo
  }

  // Send real-time event (for outgoing events)
  sendEvent(event: Omit<RealTimeEvent, 'timestamp'>) {
    const realTimeEvent: RealTimeEvent = {
      ...event,
      timestamp: new Date().toISOString()
    }

    // In production, this would send to WebSocket server
    console.log('📤 Sending real-time event:', realTimeEvent)
    
    // For demo, emit to local subscribers
    this.emitEvent(realTimeEvent)
  }
}

// Singleton instance
export const realTimeService = new RealTimeService()

// React hook for easy real-time integration
import { useEffect, useCallback, useRef } from 'react'

export const useRealTime = (
  eventType: RealTimeEvent['type'],
  callback: (event: RealTimeEvent) => void,
  userId: string,
  userType: 'customer' | 'vendor',
  enabled: boolean = true
) => {
  const subscriptionRef = useRef<string | null>(null)

  const memoizedCallback = useCallback(callback, [])

  useEffect(() => {
    if (!enabled) return

    // Connect to service if not already connected
    realTimeService.connect()

    // Subscribe to events
    subscriptionRef.current = realTimeService.subscribe(
      eventType,
      memoizedCallback,
      userId,
      userType
    )

    return () => {
      // Cleanup subscription
      if (subscriptionRef.current) {
        realTimeService.unsubscribe(subscriptionRef.current)
        subscriptionRef.current = null
      }
    }
  }, [eventType, memoizedCallback, userId, userType, enabled])

  // Return helper to send events
  const sendEvent = useCallback((data: unknown) => {
    realTimeService.sendEvent({
      type: eventType,
      data: data as OrderStatusUpdateData | InventoryUpdateData | NewMessageData | NewOrderData | PaymentUpdateData,
      userId,
      userType
    })
  }, [eventType, userId, userType])

  return { sendEvent }
}

// Hook for order status updates
export const useOrderUpdates = (
  orderId: string,
  onUpdate: (status: string, data: OrderStatusUpdateData) => void,
  userId: string,
  userType: 'customer' | 'vendor'
) => {
  return useRealTime(
    'order_status_update',
    (event) => {
      const orderData = event.data as OrderStatusUpdateData;
      if (orderData.orderId === orderId) {
        onUpdate(orderData.status, orderData)
      }
    },
    userId,
    userType
  )
}

// Hook for inventory updates (for vendors)
export const useInventoryUpdates = (
  vendorId: string,
  onUpdate: (productId: string, newStock: number) => void,
  userId: string
) => {
  return useRealTime(
    'inventory_update',
    (event) => {
      const inventoryData = event.data as InventoryUpdateData;
      if (inventoryData.vendorId === vendorId) {
        onUpdate(inventoryData.productId, inventoryData.newStock)
      }
    },
    userId,
    'vendor'
  )
}

// Hook for new messages
export const useMessageUpdates = (
  onNewMessage: (message: NewMessageData) => void,
  userId: string,
  userType: 'customer' | 'vendor'
) => {
  return useRealTime(
    'new_message',
    (event) => {
      onNewMessage(event.data as NewMessageData)
    },
    userId,
    userType
  )
}

// Hook for new orders (for vendors)
export const useNewOrders = (
  onNewOrder: (order: NewOrderData) => void,
  userId: string
) => {
  return useRealTime(
    'new_order',
    (event) => {
      onNewOrder(event.data as NewOrderData)
    },
    userId,
    'vendor'
  )
}

// Hook for payment updates
export const usePaymentUpdates = (
  onPaymentUpdate: (payment: PaymentUpdateData) => void,
  userId: string,
  userType: 'customer' | 'vendor'
) => {
  return useRealTime(
    'payment_update',
    (event) => {
      onPaymentUpdate(event.data as PaymentUpdateData)
    },
    userId,
    userType
  )
}