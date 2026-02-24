import React, { useState } from 'react'
import VendorLayout from '../../components/layout/VendorLayout'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  XCircle,
  Truck,
  Phone,
  MessageCircle,
  MapPin,
  Package,
  DollarSign,
  User,
  Calendar
} from 'lucide-react'
import { mockVendorOrders } from '../../utils/mockVendorData'
import type { VendorOrder, OrderStatus } from '../../types'

const VendorOrderManagement: React.FC = () => {
  const [orders] = useState<VendorOrder[]>(mockVendorOrders)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('all')

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchQuery === '' || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    
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

  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return { variant: 'warning' as const, icon: Clock, label: 'Pending' }
      case 'accepted':
        return { variant: 'info' as const, icon: CheckCircle, label: 'Accepted' }
      case 'preparing':
        return { variant: 'info' as const, icon: Package, label: 'Preparing' }
      case 'ready':
        return { variant: 'success' as const, icon: CheckCircle, label: 'Ready' }
      case 'out_for_delivery':
        return { variant: 'info' as const, icon: Truck, label: 'Out for Delivery' }
      case 'delivered':
        return { variant: 'success' as const, icon: CheckCircle, label: 'Delivered' }
      case 'cancelled':
        return { variant: 'error' as const, icon: XCircle, label: 'Cancelled' }
      default:
        return { variant: 'default' as const, icon: Clock, label: status }
    }
  }

  const handleOrderAction = (orderId: string, action: 'accept' | 'reject' | 'ready' | 'preparing') => {
    // Mock order action - in real app, this would call an API
    console.log(`${action} order:`, orderId)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffHours < 48) return 'Yesterday'
    
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    })
  }

  const OrderCard: React.FC<{ order: VendorOrder }> = ({ order }) => {
    const statusConfig = getStatusConfig(order.status)
    const StatusIcon = statusConfig.icon

    return (
      <Card className="p-6 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">{order.id}</h3>
              <Badge variant={statusConfig.variant} className="flex items-center gap-1">
                <StatusIcon className="w-3 h-3" />
                {statusConfig.label}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">₹{order.totalAmount}</p>
            <p className="text-sm text-gray-600">{order.items.length} items</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{order.customerName}</p>
            <p className="text-sm text-gray-600">{order.customerPhone}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <MessageCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-10 h-10 rounded object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{item.product.name}</p>
                  <p className="text-xs text-gray-500">₹{item.price} × {item.quantity}</p>
                </div>
                <span className="font-medium text-gray-900">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="mb-4">
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
            <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 text-sm">{order.deliveryAddress.label}</p>
              <p className="text-sm text-gray-600">
                {order.deliveryAddress.addressLine1}, {order.deliveryAddress.city}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <div className="flex items-center justify-between mb-4 p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-900">
              Payment: {order.paymentMethod.toUpperCase()}
            </span>
          </div>
          <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>
            {order.paymentStatus}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {order.status === 'pending' && (
            <>
              <Button 
                variant="outline"
                className="flex-1 text-red-600 hover:text-red-700"
                onClick={() => handleOrderAction(order.id, 'reject')}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button 
                className="flex-1"
                onClick={() => handleOrderAction(order.id, 'accept')}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Accept Order
              </Button>
            </>
          )}
          
          {order.status === 'accepted' && (
            <Button 
              className="w-full"
              onClick={() => handleOrderAction(order.id, 'preparing')}
            >
              <Package className="w-4 h-4 mr-2" />
              Start Preparing
            </Button>
          )}
          
          {order.status === 'preparing' && (
            <Button 
              className="w-full"
              onClick={() => handleOrderAction(order.id, 'ready')}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark as Ready
            </Button>
          )}
          
          {(order.status === 'delivered' || order.status === 'out_for_delivery') && (
            <Button variant="outline" className="w-full">
              <Truck className="w-4 h-4 mr-2" />
              Track Order
            </Button>
          )}
        </div>
      </Card>
    )
  }

  return (
    <VendorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600">Manage incoming orders and track their progress</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Preparing</p>
                <p className="text-xl font-bold text-gray-900">
                  {orders.filter(o => ['accepted', 'preparing'].includes(o.status)).length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Truck className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">In Delivery</p>
                <p className="text-xl font-bold text-gray-900">
                  {orders.filter(o => ['ready', 'out_for_delivery'].includes(o.status)).length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by order ID, customer name, or product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </Card>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card className="p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'New orders will appear here when customers place them'}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </VendorLayout>
  )
}

export default VendorOrderManagement