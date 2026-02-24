import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { Header } from '../../components/layout/Header'
import { BottomNav } from '../../components/layout/BottomNav'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { mockProducts, mockVendors } from '../../utils/mockData'
import type { CartItem } from '../../types'

// Mock cart data
const mockCartItems: CartItem[] = [
  {
    id: '1',
    productId: '1',
    vendorId: '1',
    quantity: 2,
    price: 180,
    product: mockProducts[0]
  },
  {
    id: '2',
    productId: '3',
    vendorId: '2',
    quantity: 1,
    price: 40,
    product: mockProducts[2]
  },
  {
    id: '3',
    productId: '5',
    vendorId: '3',
    quantity: 3,
    price: 25,
    product: mockProducts[4]
  }
]

export const CartPage: React.FC = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems)

  // Group items by vendor
  const itemsByVendor = cartItems.reduce((acc, item) => {
    const vendorId = item.vendorId
    if (!acc[vendorId]) {
      acc[vendorId] = []
    }
    acc[vendorId].push(item)
    return acc
  }, {} as Record<string, CartItem[]>)

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(itemId)
      return
    }
    
    setCartItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const removeItem = (itemId: string) => {
    setCartItems(items => items.filter(item => item.id !== itemId))
  }

  const getVendorTotal = (vendorItems: CartItem[]) => {
    return vendorItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getVendor = (vendorId: string) => {
    return mockVendors.find(v => v.id === vendorId)
  }

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const deliveryFee = Object.keys(itemsByVendor).reduce((total, vendorId) => {
    const vendor = getVendor(vendorId)
    const vendorItems = itemsByVendor[vendorId]
    const vendorTotal = getVendorTotal(vendorItems)
    
    // Free delivery if above minimum order
    if (vendor && vendor.minimumOrder && vendorTotal >= vendor.minimumOrder) {
      return total
    }
    return total + (vendor?.deliveryFee || 0)
  }, 0)
  
  const total = subtotal + deliveryFee

  const handleCheckout = () => {
    if (cartItems.length === 0) return
    navigate('/checkout')
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header
          showBackButton
          onBackClick={() => navigate(-1)}
          title="Shopping Cart"
        />
        
        <div className="max-w-md mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 font-heading mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add some products from your favorite vendors to get started
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/home')}
            >
              Start Shopping
            </Button>
          </div>
        </div>
        
        <BottomNav userType="customer" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header
        showBackButton
        onBackClick={() => navigate(-1)}
        title={`Cart (${cartItems.length})`}
      />

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Cart Items by Vendor */}
        {Object.entries(itemsByVendor).map(([vendorId, vendorItems]) => {
          const vendor = getVendor(vendorId)
          const vendorTotal = getVendorTotal(vendorItems)
          const hasMinimumOrder = vendor && vendor.minimumOrder && vendorTotal >= vendor.minimumOrder
          
          return (
            <Card key={vendorId} padding="none">
              {/* Vendor Header */}
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-lg">
                      {vendor?.businessType === 'Fruit Shop' ? '🍎' :
                       vendor?.businessType === 'Vegetable Shop' ? '🥬' :
                       vendor?.businessType === 'Pharmacy' ? '💊' : '🏪'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{vendor?.businessName}</h3>
                      <p className="text-sm text-gray-600">₹{vendorTotal} • {vendorItems.length} items</p>
                    </div>
                  </div>
                  {vendor?.verified && <Badge variant="success" size="sm">Verified</Badge>}
                </div>
                
                {/* Minimum Order Warning */}
                {vendor && !hasMinimumOrder && (
                  <div className="mt-3 p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-800">
                      Add ₹{(vendor.minimumOrder || 0) - vendorTotal} more for free delivery
                    </p>
                  </div>
                )}
              </div>

              {/* Vendor Items */}
              <div className="divide-y divide-gray-200">
                {vendorItems.map((item) => (
                  <div key={item.id} className="p-4 flex items-center space-x-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{item.product.name}</h4>
                      <p className="text-sm text-gray-600">₹{item.price} per {item.product.unit}</p>
                      <p className="text-sm font-semibold text-primary">₹{item.price * item.quantity}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Minus}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="!p-1"
                      />
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Plus}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="!p-1"
                      />
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={() => removeItem(item.id)}
                      className="!p-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                    />
                  </div>
                ))}
              </div>
            </Card>
          )
        })}

        {/* Order Summary */}
        <Card padding="lg">
          <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">₹{subtotal}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-semibold">
                {deliveryFee > 0 ? `₹${deliveryFee}` : 'Free'}
              </span>
            </div>
            
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-lg font-bold text-primary">₹{total}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Checkout Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout • ₹{total}
          </Button>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => navigate('/chat')}
        className="fixed bottom-36 right-4 bg-primary hover:bg-primary-600 text-white p-4 rounded-full shadow-lg z-50 transition-transform duration-300 ease-in-out transform hover:scale-105"
        aria-label="Open chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle">
          <path d="M7.9 20A9 9 0 1 0 4 16.1a2 2 0 0 1 2.1-2.1L12 12l3.9-3.9a2 2 0 0 1 2.1-2.1A9 9 0 1 0 7.9 20z" />
        </svg>
      </button>

      <BottomNav userType="customer" />
    </div>
  )
}