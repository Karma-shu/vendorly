// Complete Razorpay Payment Integration Service
import { useCachedFetch } from '../utils/caching'

// Razorpay types
declare global {
  interface Window {
    Razorpay: unknown;
  }
}

export interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayResponse) => void
  prefill: {
    name: string
    email: string
    contact: string
  }
  notes: Record<string, string>
  theme: {
    color: string
  }
  modal?: {
    ondismiss: () => void
    escape?: boolean
    backdropclose?: boolean
  }
  method?: {
    netbanking?: boolean
    card?: boolean
    upi?: boolean
    wallet?: boolean
    emi?: boolean
    paylater?: boolean
  }
}

export interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

export interface PaymentOrder {
  id: string
  entity: string
  amount: number
  amount_paid: number
  amount_due: number
  currency: string
  receipt: string
  offer_id?: string
  status: 'created' | 'attempted' | 'paid'
  attempts: number
  notes: Record<string, string>
  created_at: number
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'upi' | 'netbanking' | 'wallet' | 'emi' | 'paylater'
  name: string
  description: string
  icon: string
  isEnabled: boolean
  fee?: number
  feePercentage?: number
  minAmount?: number
  maxAmount?: number
  supportedBanks?: string[]
  processingTime?: string
}

export interface UPIApp {
  id: string
  name: string
  packageName: string
  icon: string
  isInstalled?: boolean
}

export interface EMIOption {
  duration: number
  interestRate: number
  monthlyAmount: number
  totalAmount: number
  processingFee: number
  bank: string
  cardType: 'credit' | 'debit'
}

// Payment configuration
const RAZORPAY_CONFIG = {
  keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  keySecret: import.meta.env.VITE_RAZORPAY_KEY_SECRET || 'placeholder_secret',
  webhookSecret: import.meta.env.VITE_RAZORPAY_WEBHOOK_SECRET || 'placeholder_webhook',
  currency: 'INR',
  theme: {
    color: '#6366f1'
  }
}

// Available payment methods
export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'upi',
    type: 'upi',
    name: 'UPI',
    description: 'Pay using UPI apps like PhonePe, Google Pay, Paytm',
    icon: '📱',
    isEnabled: true,
    fee: 0,
    processingTime: 'Instant'
  },
  {
    id: 'card',
    type: 'card',
    name: 'Cards',
    description: 'Credit/Debit Cards, Visa, Mastercard, RuPay',
    icon: '💳',
    isEnabled: true,
    fee: 0,
    feePercentage: 2.36,
    processingTime: 'Instant'
  },
  {
    id: 'netbanking',
    type: 'netbanking',
    name: 'Net Banking',
    description: 'All major banks supported',
    icon: '🏦',
    isEnabled: true,
    fee: 0,
    processingTime: 'Instant'
  },
  {
    id: 'wallet',
    type: 'wallet',
    name: 'Wallets',
    description: 'Paytm, PhonePe, Amazon Pay, Mobikwik',
    icon: '👛',
    isEnabled: true,
    fee: 0,
    processingTime: 'Instant'
  },
  {
    id: 'emi',
    type: 'emi',
    name: 'EMI',
    description: 'No cost EMI available',
    icon: '📊',
    isEnabled: true,
    minAmount: 1000,
    processingTime: '1-2 business days'
  },
  {
    id: 'paylater',
    type: 'paylater',
    name: 'Pay Later',
    description: 'Simpl, LazyPay, ePayLater',
    icon: '⏰',
    isEnabled: true,
    minAmount: 100,
    maxAmount: 10000,
    processingTime: 'Instant'
  }
]

// Popular UPI apps
export const UPI_APPS: UPIApp[] = [
  { id: 'phonepe', name: 'PhonePe', packageName: 'com.phonepe.app', icon: '💜' },
  { id: 'googlepay', name: 'Google Pay', packageName: 'com.google.android.apps.nbu.paisa.user', icon: '🔵' },
  { id: 'paytm', name: 'Paytm', packageName: 'net.one97.paytm', icon: '🔷' },
  { id: 'bhim', name: 'BHIM', packageName: 'in.org.npci.upiapp', icon: '🇮🇳' },
  { id: 'amazonpay', name: 'Amazon Pay', packageName: 'in.amazon.mshop.android.shopping', icon: '🧡' },
  { id: 'mobikwik', name: 'MobiKwik', packageName: 'com.mobikwik_new', icon: '🔴' }
]

class PaymentService {
  private razorpayLoaded: boolean = false

  // Load Razorpay script
  async loadRazorpay(): Promise<boolean> {
    if (this.razorpayLoaded && window.Razorpay) {
      return true
    }

    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        this.razorpayLoaded = true
        resolve(true)
      }
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  // Create Razorpay order
  async createOrder(orderData: {
    amount: number
    currency?: string
    receipt: string
    notes?: Record<string, string>
  }): Promise<PaymentOrder> {
    try {
      // In production, this would call your backend API
      // For now, we'll simulate the order creation
      const order: PaymentOrder = {
        id: `order_${Date.now()}`,
        entity: 'order',
        amount: orderData.amount * 100, // Convert to paise
        amount_paid: 0,
        amount_due: orderData.amount * 100,
        currency: orderData.currency || 'INR',
        receipt: orderData.receipt,
        status: 'created',
        attempts: 0,
        notes: orderData.notes || {},
        created_at: Math.floor(Date.now() / 1000)
      }

      // TODO: Replace with actual API call
      // const response = await fetch('/api/payment/create-order', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(orderData)
      // })
      // return await response.json()

      return order
    } catch (error) {
      console.error('Error creating payment order:', error)
      throw new Error('Failed to create payment order')
    }
  }

  // Initiate payment
  async initiatePayment(options: {
    orderId: string
    amount: number
    userDetails: {
      name: string
      email: string
      phone: string
    }
    description: string
    onSuccess: (response: RazorpayResponse) => void
    onFailure?: (error: unknown) => void
    onDismiss?: () => void
    preferredMethods?: string[]
  }): Promise<void> {
    const { orderId, amount, userDetails, description, onSuccess, onFailure, onDismiss, preferredMethods } = options

    // Load Razorpay if not already loaded
    const isLoaded = await this.loadRazorpay()
    if (!isLoaded) {
      throw new Error('Failed to load Razorpay')
    }

    // Create Razorpay order
    const order = await this.createOrder({
      amount,
      receipt: orderId,
      notes: {
        order_id: orderId,
        user_email: userDetails.email
      }
    })

    // Configure payment methods
    const methods: Record<string, boolean> = {}
    if (preferredMethods) {
      methods.netbanking = preferredMethods.includes('netbanking')
      methods.card = preferredMethods.includes('card')
      methods.upi = preferredMethods.includes('upi')
      methods.wallet = preferredMethods.includes('wallet')
      methods.emi = preferredMethods.includes('emi')
      methods.paylater = preferredMethods.includes('paylater')
    }

    const razorpayOptions: RazorpayOptions = {
      key: RAZORPAY_CONFIG.keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'Vendorly',
      description,
      order_id: order.id,
      handler: onSuccess,
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: userDetails.phone
      },
      notes: order.notes,
      theme: RAZORPAY_CONFIG.theme,
      modal: {
        ondismiss: onDismiss || (() => {}),
        escape: true,
        backdropclose: false
      }
    }

    if (Object.keys(methods).length > 0) {
      razorpayOptions.method = methods
    }

    const RazorpayConstructor = window.Razorpay as new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, callback: (response: unknown) => void) => void;
    };
    const razorpay = new RazorpayConstructor(razorpayOptions)

    razorpay.on('payment.failed', (response: unknown) => {
      if (onFailure) {
        const error = response as { error?: unknown };
        onFailure(error.error)
      }
    })

    razorpay.open()
  }

  // Verify payment signature
  async verifyPayment(paymentData: RazorpayResponse): Promise<boolean> {
    try {
      // TODO: Implement server-side signature verification
      // const response = await fetch('/api/payment/verify', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(paymentData)
      // })
      // const result = await response.json()
      // return result.isValid

      // For now, simulate verification
      console.log('Payment verification:', paymentData)
      return true
    } catch (error) {
      console.error('Error verifying payment:', error)
      return false
    }
  }

  // Get EMI options for amount
  async getEMIOptions(amount: number, cardType: 'credit' | 'debit' = 'credit'): Promise<EMIOption[]> {
    const emiOptions: EMIOption[] = []

    if (amount >= 1000) {
      const options = [
        { duration: 3, rate: 0 },
        { duration: 6, rate: 12 },
        { duration: 9, rate: 13 },
        { duration: 12, rate: 15 },
        { duration: 18, rate: 16 },
        { duration: 24, rate: 17 }
      ]

      options.forEach(option => {
        const monthlyAmount = amount / option.duration
        const interestAmount = (amount * option.rate * option.duration) / (12 * 100)
        const totalAmount = amount + interestAmount
        const processingFee = option.duration > 6 ? 199 : 99

        emiOptions.push({
          duration: option.duration,
          interestRate: option.rate,
          monthlyAmount: Math.round(monthlyAmount),
          totalAmount: Math.round(totalAmount),
          processingFee,
          bank: cardType === 'credit' ? 'HDFC Bank' : 'SBI',
          cardType
        })
      })
    }

    return emiOptions
  }

  // Check UPI app availability
  checkUPIAppAvailability(): UPIApp[] {
    // This would typically check if UPI apps are installed on mobile
    // For web, we'll return all apps as available
    return UPI_APPS.map(app => ({ ...app, isInstalled: true }))
  }

  // Generate UPI payment link
  generateUPILink(options: {
    upiId: string
    amount: number
    name: string
    description: string
    transactionId: string
  }): string {
    const { upiId, amount, name, description, transactionId } = options
    
    const params = new URLSearchParams({
      pa: upiId, // Payee Address
      pn: name, // Payee Name
      tn: description, // Transaction Note
      am: amount.toString(), // Amount
      cu: 'INR', // Currency
      tr: transactionId // Transaction Reference
    })

    return `upi://pay?${params.toString()}`
  }

  // Process refund
  async processRefund(paymentId: string, amount?: number, reason?: string): Promise<boolean> {
    try {
      // TODO: Implement actual refund API call
      // const response = await fetch('/api/payment/refund', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ paymentId, amount, reason })
      // })
      // return response.ok

      console.log('Processing refund:', { paymentId, amount, reason })
      return true
    } catch (error) {
      console.error('Error processing refund:', error)
      return false
    }
  }

  // Get payment status
  async getPaymentStatus(paymentId: string): Promise<{
    status: 'created' | 'authorized' | 'captured' | 'refunded' | 'failed'
    amount: number
    currency: string
    method: string
    createdAt: string
  }> {
    try {
      // TODO: Implement actual status check API
      // const response = await fetch(`/api/payment/status/${paymentId}`)
      // return await response.json()

      // Log the payment ID for debugging purposes
      console.log('Getting payment status for ID:', paymentId)
      
      // Mock payment status
      return {
        status: 'captured',
        amount: 50000, // in paise
        currency: 'INR',
        method: 'upi',
        createdAt: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error getting payment status:', error)
      throw new Error('Failed to get payment status')
    }
  }

  // Save payment method for future use
  async savePaymentMethod(method: {
    type: 'card' | 'upi'
    details: Record<string, string>
    isDefault?: boolean
  }): Promise<boolean> {
    try {
      // TODO: Implement secure payment method storage
      // const response = await fetch('/api/payment/save-method', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(method)
      // })
      // return response.ok

      console.log('Saving payment method:', method)
      return true
    } catch (error) {
      console.error('Error saving payment method:', error)
      return false
    }
  }

  // Get saved payment methods
  async getSavedPaymentMethods(userId: string): Promise<Record<string, unknown>[]> {
    try {
      // TODO: Implement actual API call
      // const response = await fetch(`/api/payment/methods/${userId}`)
      // return await response.json()

      // Log the user ID for debugging purposes
      console.log('Getting saved payment methods for user:', userId)
      
      // Mock saved methods
      return [
        {
          id: 'pm_1',
          type: 'card',
          last4: '4242',
          brand: 'visa',
          expiryMonth: 12,
          expiryYear: 2025,
          isDefault: true
        },
        {
          id: 'pm_2',
          type: 'upi',
          vpa: 'user@paytm',
          isDefault: false
        }
      ]
    } catch (error) {
      console.error('Error getting saved payment methods:', error)
      return []
    }
  }
}

// Create singleton instance
export const paymentService = new PaymentService()

// React hook for payment methods
export const usePaymentMethods = () => {
  return useCachedFetch(
    'payment-methods',
    () => Promise.resolve(PAYMENT_METHODS),
    { ttl: 30 * 60 * 1000 } // 30 minutes
  )
}

// React hook for EMI options
export const useEMIOptions = (amount: number) => {
  return useCachedFetch(
    `emi-options-${amount}`,
    () => paymentService.getEMIOptions(amount),
    { ttl: 10 * 60 * 1000 } // 10 minutes
  )
}

// React hook for UPI apps
export const useUPIApps = () => {
  return useCachedFetch(
    'upi-apps',
    () => Promise.resolve(paymentService.checkUPIAppAvailability()),
    { ttl: 60 * 60 * 1000 } // 1 hour
  )
}