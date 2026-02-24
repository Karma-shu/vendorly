import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { ArrowLeft, Phone, MessageCircle, MapPin, Clock, CheckCircle, Package, Truck, Star } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import type { Order, OrderStatus } from '../../types'

// Mock order data
const mockOrder: Order = {
  id: 'ORD1704876543',
  customerId: 'customer1',
  vendorId: '1',
  items: [{
    id: '1',
    productId: '1',
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
      createdAt: '2024-01-09T10:30:00Z',
      updatedAt: '2024-01-09T10:30:00Z',
    }
  }],
  status: 'out_for_delivery',
  totalAmount: 429,
  deliveryFee: 0,
  tax: 21,
  deliveryAddress: {
    id: '1',
    label: 'Home',
    addressLine1: '123 Residential Complex',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
    country: 'India'
  },
  estimatedDeliveryTime: '25-30 mins',
  paymentMethod: 'upi',
  paymentStatus: 'paid',
  createdAt: '2024-01-09T10:30:00Z',
  updatedAt: '2024-01-09T11:00:00Z'
}

const trackingSteps = [
  { status: 'pending', label: 'Order Placed', time: '10:30 AM', icon: CheckCircle },
  { status: 'accepted', label: 'Order Accepted', time: '10:32 AM', icon: CheckCircle },
  { status: 'preparing', label: 'Preparing', time: '10:35 AM', icon: Package },
  { status: 'ready', label: 'Ready for Pickup', time: '10:50 AM', icon: CheckCircle },
  { status: 'out_for_delivery', label: 'Out for Delivery', time: '11:00 AM', icon: Truck },
  { status: 'delivered', label: 'Delivered', icon: CheckCircle }
]

const OrderTrackingPage: React.FC = () => {
  const navigate = useNavigate()
  const { orderId } = useParams<{ orderId: string }>()
  const location = useLocation()
  const [order] = useState<Order>(mockOrder)
  const [estimatedTime, setEstimatedTime] = useState(18)
  
  const orderJustPlaced = location.state?.orderPlaced

  useEffect(() => {
    const timer = setInterval(() => {
      setEstimatedTime(prev => Math.max(0, prev - 1))
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const currentStepIndex = trackingSteps.findIndex(step => step.status === order.status)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-heading font-semibold">Track Order</h1>
              <p className="text-sm text-gray-500">{order.id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Success Message */}
        {orderJustPlaced && (
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">Order Placed!</h3>
                <p className="text-sm text-green-700">We'll notify you when vendor accepts</p>
              </div>
            </div>
          </Card>
        )}

        {/* Delivery Status */}
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-semibold">On the way</h2>
              <p className="text-sm text-gray-500">ETA: {estimatedTime} mins</p>
            </div>
            <Badge variant="info">In Transit</Badge>
          </div>
          
          {/* Delivery Partner */}
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Truck className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-medium">Rajesh Kumar</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">4.8 • Bike</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline"><Phone className="w-4 h-4" /></Button>
                <Button size="sm" variant="outline"><MessageCircle className="w-4 h-4" /></Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Timeline */}
        <Card className="p-4">
          <h2 className="font-semibold mb-4">Order Timeline</h2>
          <div className="space-y-4">
            {trackingSteps.map((step, index) => {
              const StepIcon = step.icon
              const isCompleted = index <= currentStepIndex
              const isCurrent = index === currentStepIndex
              
              return (
                <div key={step.status} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted ? (isCurrent ? 'bg-primary text-white' : 'bg-green-100 text-green-600') : 'bg-gray-100 text-gray-400'
                    }`}>
                      <StepIcon className="w-4 h-4" />
                    </div>
                    {index < trackingSteps.length - 1 && (
                      <div className={`w-0.5 h-8 mt-1 ${isCompleted ? 'bg-green-200' : 'bg-gray-200'}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                        {step.label}
                      </h3>
                      {step.time && isCompleted && (
                        <span className="text-xs text-gray-500">{step.time}</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Order Details */}
        <Card className="p-4">
          <h2 className="font-semibold mb-4">Order Details</h2>
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-3 mb-3">
              <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1">
                <h3 className="font-medium text-sm">{item.product.name}</h3>
                <p className="text-xs text-gray-500">₹{item.price} × {item.quantity}</p>
              </div>
              <span className="font-medium">₹{item.price * item.quantity}</span>
            </div>
          ))}
          
          <div className="border-t pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Paid</span>
              <span className="font-semibold">₹{order.totalAmount}</span>
            </div>
          </div>
        </Card>

        {/* Delivery Address */}
        <Card className="p-4">
          <h2 className="font-semibold mb-3">Delivery Address</h2>
          <div className="flex gap-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            <div>
              <p className="font-medium">{order.deliveryAddress.label}</p>
              <p className="text-sm text-gray-600">
                {order.deliveryAddress.addressLine1}<br />
                {order.deliveryAddress.city}, {order.deliveryAddress.state}
              </p>
            </div>
          </div>
        </Card>

        {/* Help Section */}
        <Card className="p-4">
          <h2 className="font-semibold mb-3">Need Help?</h2>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Phone className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageCircle className="w-4 h-4 mr-2" />
              Report Issue
            </Button>
          </div>
        </Card>
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => navigate('/chat')}
        className="fixed bottom-20 right-4 bg-primary hover:bg-primary-600 text-white p-4 rounded-full shadow-lg z-50 transition-transform duration-300 ease-in-out transform hover:scale-105"
        aria-label="Open chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle">
          <path d="M7.9 20A9 9 0 1 0 4 16.1a2 2 0 0 1 2.1-2.1L12 12l3.9-3.9a2 2 0 0 1 2.1-2.1A9 9 0 1 0 7.9 20z" />
        </svg>
      </button>
    </div>
  )
}

export default OrderTrackingPage