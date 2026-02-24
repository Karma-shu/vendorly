import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Plus, CreditCard, Wallet, Smartphone, DollarSign, Clock, ShoppingBag, Edit3 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import type { SavedAddress, PaymentMethodInfo, OrderSummary, CartItem } from '../../types'

// Mock cart items for checkout demo
const mockCartItems: CartItem[] = [
  {
    id: '1',
    productId: '1',
    vendorId: '1',
    quantity: 2,
    price: 180,
    product: {
      id: '1',
      vendorId: '1',
      name: 'Fresh Apples',
      description: 'Premium quality Kashmir apples',
      price: 180,
      categoryId: '3',
      images: ['https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400'],
      stock: 50,
      unit: 'kg',
      weight: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },
  {
    id: '2',
    productId: '2',
    vendorId: '1',
    quantity: 1,
    price: 60,
    product: {
      id: '2',
      vendorId: '1',
      name: 'Bananas',
      description: 'Fresh yellow bananas',
      price: 60,
      categoryId: '3',
      images: ['https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400'],
      stock: 100,
      unit: 'dozen',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }
]

// Mock saved addresses
const mockAddresses: SavedAddress[] = [
  {
    id: '1',
    label: 'Home',
    type: 'home',
    addressLine1: '123 Residential Complex',
    addressLine2: 'Near City Mall',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
    country: 'India',
    isDefault: true,
    instructions: 'Ring bell twice, call if not answered'
  },
  {
    id: '2',
    label: 'Office',
    type: 'work',
    addressLine1: '456 Business Park',
    addressLine2: '5th Floor, Tower B',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400002',
    country: 'India',
    isDefault: false,
    instructions: 'Reception will collect the order'
  }
]

// Mock payment methods
const mockPaymentMethods: PaymentMethodInfo[] = [
  {
    id: '1',
    type: 'upi',
    title: 'UPI',
    subtitle: 'Pay using any UPI app',
    icon: '📱',
    isDefault: true
  },
  {
    id: '2',
    type: 'card',
    title: 'Credit/Debit Card',
    subtitle: 'Visa, Mastercard, RuPay',
    icon: '💳'
  },
  {
    id: '3',
    type: 'wallet',
    title: 'Digital Wallet',
    subtitle: 'Paytm, PhonePe, Google Pay',
    icon: '👛'
  },
  {
    id: '4',
    type: 'cod',
    title: 'Cash on Delivery',
    subtitle: 'Pay when your order arrives',
    icon: '💵'
  }
]

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate()
  const [selectedAddress, setSelectedAddress] = useState<SavedAddress>(mockAddresses[0])
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodInfo>(mockPaymentMethods[0])
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  // Calculate order summary
  const orderSummary: OrderSummary = useMemo(() => {
    const subtotal = mockCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const deliveryFee = subtotal >= 100 ? 0 : 20 // Free delivery above ₹100
    const tax = subtotal * 0.05 // 5% tax
    const total = subtotal + deliveryFee + tax

    return {
      subtotal,
      deliveryFee,
      tax,
      total,
      items: mockCartItems,
      vendorId: '1',
      estimatedDeliveryTime: '25-30 mins'
    }
  }, [])

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true)
    
    try {
      // Simulate order placement
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Navigate to order tracking with order ID
      const orderId = 'ORD' + Date.now()
      navigate(`/orders/${orderId}`, { 
        state: { 
          orderPlaced: true,
          orderSummary,
          address: selectedAddress,
          paymentMethod: selectedPayment
        } 
      })
    } catch (error) {
      console.error('Order placement failed:', error)
    } finally {
      setIsPlacingOrder(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-heading font-semibold text-gray-900">
              Checkout
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Delivery Address */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="font-heading font-semibold text-gray-900">
                Delivery Address
              </h2>
            </div>
            <button className="text-primary text-sm font-medium">
              Change
            </button>
          </div>
          
          <div className="p-3 bg-primary-50 rounded-lg border border-primary-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">{selectedAddress.label}</span>
                  <span className="px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                    {selectedAddress.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {selectedAddress.addressLine1}
                  {selectedAddress.addressLine2 && `, ${selectedAddress.addressLine2}`}
                  <br />
                  {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}
                </p>
                {selectedAddress.instructions && (
                  <p className="text-xs text-gray-500 italic">
                    Note: {selectedAddress.instructions}
                  </p>
                )}
              </div>
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button className="flex items-center gap-2 mt-3 text-primary text-sm font-medium">
            <Plus className="w-4 h-4" />
            Add New Address
          </button>
        </Card>

        {/* Order Summary */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="font-heading font-semibold text-gray-900">
              Order Summary
            </h2>
          </div>

          <div className="space-y-3 mb-4">
            {orderSummary.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-sm">
                    {item.product.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>
                <span className="font-medium text-gray-900">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">₹{orderSummary.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="text-gray-900">
                {orderSummary.deliveryFee === 0 ? 'FREE' : `₹${orderSummary.deliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="text-gray-900">₹{Math.round(orderSummary.tax)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold border-t border-gray-200 pt-2">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">₹{Math.round(orderSummary.total)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 p-2 bg-blue-50 rounded-lg">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-600">
              Estimated delivery: {orderSummary.estimatedDeliveryTime}
            </span>
          </div>
        </Card>

        {/* Payment Method */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-primary" />
            <h2 className="font-heading font-semibold text-gray-900">
              Payment Method
            </h2>
          </div>

          <div className="space-y-3">
            {mockPaymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedPayment(method)}
                className={`w-full p-3 rounded-lg border-2 transition-colors text-left ${
                  selectedPayment.id === method.id
                    ? 'border-primary bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{method.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{method.title}</h3>
                    <p className="text-sm text-gray-500">{method.subtitle}</p>
                  </div>
                  {selectedPayment.id === method.id && (
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Special Instructions */}
        <Card className="p-4">
          <h2 className="font-heading font-semibold text-gray-900 mb-3">
            Special Instructions (Optional)
          </h2>
          <textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Add any special instructions for delivery..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={3}
          />
        </Card>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-md mx-auto">
          <Button
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            className="w-full bg-primary text-white py-4 text-lg font-semibold"
          >
            {isPlacingOrder ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Placing Order...
              </div>
            ) : (
              `Place Order • ₹${Math.round(orderSummary.total)}`
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage