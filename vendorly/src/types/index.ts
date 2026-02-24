export interface User {
  id: string
  email: string
  phone?: string
  name: string
  userType: 'customer' | 'vendor'
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface Customer {
  id: string
  userId: string
  preferences?: {
    dietaryRestrictions?: string[]
    preferredLanguage?: string
    notifications?: boolean
  }
  addresses: Address[]
}

export interface Vendor {
  id: string
  userId: string
  businessName: string
  businessType: string
  verified: boolean
  rating: number
  totalRatings: number
  address: Address
  businessHours: BusinessHours
  deliveryRadius: number
  deliveryFee: number
  minimumOrder?: number
  documents?: VendorDocument[]
}

export interface Address {
  id: string
  label: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  latitude?: number
  longitude?: number
  isDefault?: boolean
}

export interface BusinessHours {
  monday: { open: string; close: string; isClosed: boolean }
  tuesday: { open: string; close: string; isClosed: boolean }
  wednesday: { open: string; close: string; isClosed: boolean }
  thursday: { open: string; close: string; isClosed: boolean }
  friday: { open: string; close: string; isClosed: boolean }
  saturday: { open: string; close: string; isClosed: boolean }
  sunday: { open: string; close: string; isClosed: boolean }
}

export interface VendorDocument {
  id: string
  type: 'license' | 'permit' | 'tax' | 'identity'
  fileName: string
  fileUrl: string
  verified: boolean
  uploadedAt: string
}

export interface Product {
  id: string
  vendorId: string
  name: string
  description: string
  price: number
  discountPrice?: number
  categoryId: string
  images: string[]
  stock: number
  unit: string
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  tags?: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  icon?: string
  parentId?: string
  children?: Category[]
}

export interface CartItem {
  id: string
  productId: string
  vendorId: string
  quantity: number
  price: number
  product: Product
}

export interface Order {
  id: string
  customerId: string
  vendorId: string
  items: OrderItem[]
  status: OrderStatus
  totalAmount: number
  deliveryFee: number
  tax: number
  deliveryAddress: Address
  estimatedDeliveryTime?: string
  actualDeliveryTime?: string
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  product: Product
}

export type OrderStatus = 
  | 'pending'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type PaymentMethod = 'upi' | 'card' | 'wallet' | 'cod'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface SavedAddress extends Address {
  type: 'home' | 'work' | 'other'
  instructions?: string
}

export interface PaymentMethodInfo {
  id: string
  type: PaymentMethod
  title: string
  subtitle?: string
  icon: string
  isDefault?: boolean
}

export interface OrderSummary {
  subtotal: number
  deliveryFee: number
  tax: number
  discount?: number
  total: number
  items: CartItem[]
  vendorId: string
  estimatedDeliveryTime: string
}

export interface CheckoutData {
  address: SavedAddress
  paymentMethod: PaymentMethodInfo
  orderSummary: OrderSummary
  specialInstructions?: string
}

// Vendor-specific interfaces for Phase 3
export interface VendorAnalytics {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  customerCount: number
  rating: number
  completionRate: number
}

export interface DailyStats {
  date: string
  revenue: number
  orders: number
  customers: number
}

export interface TopProduct {
  productId: string
  productName: string
  sales: number
  revenue: number
  image: string
}

export interface VendorNotification {
  id: string
  type: 'order' | 'payment' | 'review' | 'system'
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

export interface VendorOrder extends Order {
  customerName: string
  customerPhone: string
  acceptedAt?: string
  preparationTime?: number
  deliveryPartnerId?: string
}

// Phase 4: Shared Features Types
export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  senderType: 'customer' | 'vendor'
  senderName: string
  senderAvatar?: string
  message: string
  messageType: 'text' | 'image' | 'file' | 'system'
  timestamp: string
  isRead: boolean
  attachments?: ChatAttachment[]
}

export interface ChatAttachment {
  id: string
  type: 'image' | 'file'
  name: string
  url: string
  size: number
}

export interface ChatConversation {
  id: string
  customerId: string
  vendorId: string
  customerName: string
  vendorName: string
  customerAvatar?: string
  vendorAvatar?: string
  lastMessage: ChatMessage
  unreadCount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface NotificationData {
  id: string
  userId: string
  userType: 'customer' | 'vendor'
  type: 'order' | 'payment' | 'message' | 'promotion' | 'system' | 'review'
  title: string
  message: string
  data?: Record<string, unknown>
  isRead: boolean
  isPush: boolean
  createdAt: string
  expiresAt?: string
}

export interface Review {
  id: string
  orderId?: string
  customerId: string
  vendorId?: string
  productId?: string
  customerName: string
  customerAvatar?: string
  rating: number
  comment: string
  images?: string[]
  isVerified: boolean
  helpfulCount: number
  createdAt: string
  updatedAt: string
  vendorReply?: {
    message: string
    createdAt: string
  }
}

export interface SupportTicket {
  id: string
  userId: string
  userType: 'customer' | 'vendor'
  subject: string
  description: string
  category: 'order' | 'payment' | 'technical' | 'general' | 'account'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  attachments?: ChatAttachment[]
  messages: SupportMessage[]
  assignedTo?: string
  createdAt: string
  updatedAt: string
}

export interface SupportMessage {
  id: string
  ticketId: string
  senderId: string
  senderType: 'customer' | 'vendor' | 'support'
  senderName: string
  message: string
  attachments?: ChatAttachment[]
  isInternal: boolean
  createdAt: string
}

export interface FAQ {
  id: string
  category: string
  question: string
  answer: string
  tags: string[]
  isPopular: boolean
  helpfulCount: number
  createdAt: string
  updatedAt: string
}

// Multi-Vendor Comparison Types
export interface ProductComparison {
  productName: string
  vendors: ProductWithVendorInfo[]
  lowestPrice: number
  highestPrice: number
  averagePrice: number
  priceRange: number
  vendorCount: number
}

export interface ProductWithVendorInfo extends Product {
  vendorInfo: {
    id: string
    businessName: string
    businessType: string
    verified: boolean
    rating: number
    totalRatings: number
    deliveryRadius: number
    deliveryFee: number
    minimumOrder: number
    distance: number
    estimatedDeliveryTime: number
  }
}

export interface NearbyVendor extends Vendor {
  distance: number
  estimatedDeliveryTime: number
  deliveryAvailable: boolean
}

export interface LocationFilter {
  radius: number // in kilometers
  sortBy: 'distance' | 'rating' | 'price' | 'delivery_fee'
  deliveryOnly: boolean
  minRating: number
  maxDeliveryFee: number
  categories: string[]
}

export interface VendorComparisonData {
  vendor: Vendor
  products: Product[]
  distance: number
  priceRange: { min: number; max: number; average: number }
  rating: number
  deliveryFee: number
  minimumOrder: number
  estimatedDeliveryTime: number
}

export interface PriceComparisonItem {
  product: Product
  vendor: Vendor
  distance: number
  price: number
  deliveryFee: number
  estimatedDeliveryTime: number
  totalPrice: number
  isBestPrice: boolean
}

export interface SimilarProduct extends Product {
  similarityScore: number
  vendorDistance: number
}