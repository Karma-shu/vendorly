import type { ChatConversation, ChatMessage } from '../types'

// Mock chat conversations
export const mockChatConversations: ChatConversation[] = [
  {
    id: 'conv-1',
    customerId: 'customer1',
    vendorId: '1',
    customerName: 'John Doe',
    vendorName: 'Fresh Fruits Corner',
    customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    vendorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    lastMessage: {
      id: 'msg-5',
      conversationId: 'conv-1',
      senderId: '1',
      senderType: 'vendor',
      senderName: 'Fresh Fruits Corner',
      message: 'Your order is ready for delivery! Should be there in 15 minutes.',
      messageType: 'text',
      timestamp: '2024-01-09T14:45:00Z',
      isRead: false
    },
    unreadCount: 2,
    isActive: true,
    createdAt: '2024-01-09T10:30:00Z',
    updatedAt: '2024-01-09T14:45:00Z'
  },
  {
    id: 'conv-2',
    customerId: 'customer1',
    vendorId: '2',
    customerName: 'John Doe',
    vendorName: 'Green Vegetable Mart',
    customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    vendorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    lastMessage: {
      id: 'msg-10',
      conversationId: 'conv-2',
      senderId: 'customer1',
      senderType: 'customer',
      senderName: 'John Doe',
      message: 'Thank you! The vegetables were very fresh.',
      messageType: 'text',
      timestamp: '2024-01-08T16:20:00Z',
      isRead: true
    },
    unreadCount: 0,
    isActive: false,
    createdAt: '2024-01-08T14:15:00Z',
    updatedAt: '2024-01-08T16:20:00Z'
  }
]

// Mock chat messages
export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'customer1',
    senderType: 'customer',
    senderName: 'John Doe',
    message: 'Hi! I placed an order for apples and bananas. When will it be delivered?',
    messageType: 'text',
    timestamp: '2024-01-09T10:30:00Z',
    isRead: true
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: '1',
    senderType: 'vendor',
    senderName: 'Fresh Fruits Corner',
    message: 'Hello John! We received your order. It will be delivered within 25-30 minutes.',
    messageType: 'text',
    timestamp: '2024-01-09T10:35:00Z',
    isRead: true
  },
  {
    id: 'msg-5',
    conversationId: 'conv-1',
    senderId: '1',
    senderType: 'vendor',
    senderName: 'Fresh Fruits Corner',
    message: 'Your order is ready for delivery! Should be there in 15 minutes.',
    messageType: 'text',
    timestamp: '2024-01-09T14:45:00Z',
    isRead: false
  }
]

// Helper functions
export const getMessagesByConversationId = (conversationId: string): ChatMessage[] => {
  return mockChatMessages.filter(msg => msg.conversationId === conversationId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
}

export const getConversationsForUser = (userId: string, userType: 'customer' | 'vendor'): ChatConversation[] => {
  return mockChatConversations.filter(conv => {
    if (userType === 'customer') {
      return conv.customerId === userId
    } else {
      return conv.vendorId === userId
    }
  })
}