import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, CheckCircle, XCircle, Truck, Search, Filter, Calendar } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import type { Order, OrderStatus } from '../../types'

// Mock order data
const mockOrders: Order[] = [
  {
    id: 'ORD1704876543',
    customerId: 'customer1',
    vendorId: '1',
    items: [
      {
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
      },
      {
        id: '2',
        productId: '2',
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
          createdAt: '2024-01-09T10:30:00Z',
          updatedAt: '2024-01-09T10:30:00Z',
        }
      }
    ],
    status: 'delivered',
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
    actualDeliveryTime: '28 mins',
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    createdAt: '2024-01-09T10:30:00Z',
    updatedAt: '2024-01-09T11:00:00Z'
  },
  {
    id: 'ORD1704790143',
    customerId: 'customer1',
    vendorId: '2',
    items: [
      {
        id: '3',
        productId: '3',
        quantity: 2,
        price: 40,
        product: {
          id: '3',
          vendorId: '2',
          name: 'Tomatoes',
          description: 'Fresh farm tomatoes',
          price: 40,
          categoryId: '2',
          images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400'],
          stock: 75,
          unit: 'kg',
          weight: 1,
          isActive: true,
          createdAt: '2024-01-08T15:20:00Z',
          updatedAt: '2024-01-08T15:20:00Z',
        }
      }
    ],
    status: 'out_for_delivery',
    totalAmount: 99,
    deliveryFee: 15,
    tax: 4,
    deliveryAddress: {
      id: '2',
      label: 'Office',
      addressLine1: '456 Business Park',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400002',
      country: 'India'
    },
    estimatedDeliveryTime: '15-20 mins',
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    createdAt: '2024-01-08T15:20:00Z',
    updatedAt: '2024-01-08T15:45:00Z'
  },
  {
    id: 'ORD1704703743',
    customerId: 'customer1',
    vendorId: '3',
    items: [
      {
        id: '5',
        productId: '5',
        quantity: 2,
        price: 25,
        product: {
          id: '5',
          vendorId: '3',
          name: 'Paracetamol 500mg',
          description: 'Pain relief and fever reducer',
          price: 25,
          categoryId: '4',
          images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'],
          stock: 200,
          unit: 'pack',
          isActive: true,
          createdAt: '2024-01-07T12:10:00Z',
          updatedAt: '2024-01-07T12:10:00Z',
        }
      }
    ],
    status: 'cancelled',
    totalAmount: 82,
    deliveryFee: 30,
    tax: 2,
    deliveryAddress: {
      id: '1',
      label: 'Home',
      addressLine1: '123 Residential Complex',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India'
    },
    paymentMethod: 'upi',
    paymentStatus: 'refunded',
    notes: 'Cancelled due to stock unavailability',
    createdAt: '2024-01-07T12:10:00Z',
    updatedAt: '2024-01-07T12:15:00Z'
  }
]

const statusConfig: Record<OrderStatus, { 
  label: string; 
  color: 'default' | 'success' | 'warning' | 'error' | 'info';
  icon: React.ComponentType<{ className?: string }>;
}> = {
  pending: { label: 'Pending', color: 'warning', icon: Clock },
  accepted: { label: 'Accepted', color: 'info', icon: CheckCircle },
  preparing: { label: 'Preparing', color: 'info', icon: Clock },
  ready: { label: 'Ready', color: 'success', icon: CheckCircle },
  out_for_delivery: { label: 'Out for Delivery', color: 'info', icon: Truck },
  delivered: { label: 'Delivered', color: 'success', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'error', icon: XCircle },
  refunded: { label: 'Refunded', color: 'default', icon: XCircle }
}

const OrdersPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all')
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all')

  // Filter orders based on search and filters
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = searchQuery === '' || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => 
        item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus
    
    const matchesDate = (() => {
      if (dateFilter === 'all') return true
      
      const orderDate = new Date(order.createdAt)
      const now = new Date()
      
      switch (dateFilter) {
        case 'today':
          return orderDate.toDateString() === now.toDateString()
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return orderDate >= weekAgo
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          return orderDate >= monthAgo
        default:
          return true
      }
    })()
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 24) {
      return `${diffHours}h ago`
    } else if (diffHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    }
  }

  const getVendorName = (vendorId: string) => {
    const vendorNames: Record<string, string> = {
      '1': 'Fresh Fruits Corner',
      '2': 'Green Vegetable Mart',
      '3': 'City Pharmacy'
    }
    return vendorNames[vendorId] || 'Unknown Vendor'
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
              My Orders
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders or products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as OrderStatus | 'all')}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="delivered">Delivered</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="preparing">Preparing</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as 'all' | 'today' | 'week' | 'month')}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-gray-400 mb-2">📋</div>
              <h3 className="font-medium text-gray-900 mb-1">No orders found</h3>
              <p className="text-sm text-gray-500">
                {searchQuery || selectedStatus !== 'all' || dateFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Start shopping to see your orders here'}
              </p>
            </Card>
          ) : (
            filteredOrders.map((order) => {
              const config = statusConfig[order.status]
              const StatusIcon = config.icon
              
              return (
                <Card
                  key={order.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">{order.id}</h3>
                        <Badge variant={config.color} className="flex items-center gap-1">
                          <StatusIcon className="w-3 h-3" />
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {getVendorName(order.vendorId)} • {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">₹{order.totalAmount}</div>
                      <div className="text-xs text-gray-500">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item) => (
                        <img
                          key={item.id}
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-8 h-8 rounded-full border-2 border-white object-cover"
                        />
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                          <span className="text-xs text-gray-600">+{order.items.length - 3}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">
                        {order.items[0].product.name}
                        {order.items.length > 1 && ` and ${order.items.length - 1} more`}
                      </p>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <span>{order.deliveryAddress.label}: {order.deliveryAddress.addressLine1}</span>
                    {order.status === 'out_for_delivery' && order.estimatedDeliveryTime && (
                      <span className="text-blue-600 font-medium">
                        ETA: {order.estimatedDeliveryTime}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {order.status === 'delivered' && (
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="flex-1">
                        Reorder
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Rate & Review
                      </Button>
                    </div>
                  )}
                  
                  {order.status === 'out_for_delivery' && (
                    <div className="mt-3">
                      <Button variant="outline" size="sm" className="w-full">
                        Track Order
                      </Button>
                    </div>
                  )}
                </Card>
              )
            })
          )}
        </div>
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

export default OrdersPage