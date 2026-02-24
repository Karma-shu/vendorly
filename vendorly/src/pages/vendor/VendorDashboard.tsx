import React from 'react'
import { useNavigate } from 'react-router-dom'
import VendorLayout from '../../components/layout/VendorLayout'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { 
  TrendingUp, 
  TrendingDown,
  ShoppingCart, 
  Users, 
  Star, 
  DollarSign,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit
} from 'lucide-react'
import { 
  mockVendorAnalytics,
  mockDailyStats,
  mockTopProducts,
  getTodayStats,
  getPendingOrdersCount,
  getActiveOrdersCount,
  mockVendorOrders
} from '../../utils/mockVendorData'

const VendorDashboard: React.FC = () => {
  const navigate = useNavigate()
  const analytics = mockVendorAnalytics
  const todayStats = getTodayStats()
  const pendingOrders = getPendingOrdersCount()
  const activeOrders = getActiveOrdersCount()
  const recentOrders = mockVendorOrders.slice(0, 5)

  // Calculate performance indicators
  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`
  const formatPercentage = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`

  return (
    <VendorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your business today.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/vendor/products')}>
              <Package className="w-4 h-4 mr-2" />
              Manage Products
            </Button>
            <Button onClick={() => navigate('/vendor/orders')}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              View Orders
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Today's Revenue */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Today's Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(todayStats.todayRevenue)}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">
                    {formatPercentage(todayStats.growthRate)}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs yesterday</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          {/* Today's Orders */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Today's Orders</p>
                <p className="text-2xl font-bold text-gray-900">{todayStats.todayOrders}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-blue-600 font-medium">
                    {pendingOrders} pending
                  </span>
                  <span className="text-sm text-gray-500 ml-1">• {activeOrders} active</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          {/* Total Customers */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.customerCount}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-green-600 font-medium">
                    {todayStats.todayCustomers} today
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          {/* Rating */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Store Rating</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.rating}/5</p>
                <div className="flex items-center mt-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                  <span className="text-sm text-gray-600">
                    {analytics.completionRate}% completion rate
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-heading font-semibold text-gray-900">Weekly Revenue</h3>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
            
            {/* Simple Bar Chart */}
            <div className="space-y-3">
              {mockDailyStats.map((stat, index) => (
                <div key={stat.date} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-12">
                    {new Date(stat.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                    <div 
                      className="bg-primary h-3 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(stat.revenue / Math.max(...mockDailyStats.map(s => s.revenue))) * 100}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-16 text-right">
                    ₹{(stat.revenue / 1000).toFixed(0)}k
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Orders */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-heading font-semibold text-gray-900">Recent Orders</h3>
              <Button variant="outline" size="sm" onClick={() => navigate('/vendor/orders')}>
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      order.status === 'pending' ? 'bg-yellow-500' :
                      order.status === 'preparing' ? 'bg-blue-500' :
                      order.status === 'delivered' ? 'bg-green-500' :
                      order.status === 'out_for_delivery' ? 'bg-purple-500' :
                      'bg-gray-500'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.id} • {order.items.length} items
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 text-sm">
                      ₹{order.totalAmount}
                    </p>
                    <Badge 
                      variant={
                        order.status === 'delivered' ? 'success' :
                        order.status === 'pending' ? 'warning' :
                        order.status === 'preparing' ? 'info' :
                        'default'
                      }
                      size="sm"
                    >
                      {order.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Top Products & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Products */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-heading font-semibold text-gray-900">Top Selling Products</h3>
              <Button variant="outline" size="sm" onClick={() => navigate('/vendor/analytics')}>
                View Analytics
              </Button>
            </div>
            
            <div className="space-y-4">
              {mockTopProducts.slice(0, 5).map((product, index) => (
                <div key={product.productId} className="flex items-center gap-4">
                  <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                    {index + 1}
                  </span>
                  <img 
                    src={product.image} 
                    alt={product.productName}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{product.productName}</p>
                    <p className="text-sm text-gray-500">{product.sales} units sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{product.revenue.toLocaleString()}</p>
                    <div className="flex gap-1 mt-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-heading font-semibold text-gray-900 mb-6">Quick Actions</h3>
            
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/vendor/products/add')}
              >
                <Package className="w-4 h-4 mr-2" />
                Add New Product
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/vendor/orders')}
              >
                <Clock className="w-4 h-4 mr-2" />
                Process Orders
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/vendor/analytics')}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/vendor/settings')}
              >
                <Star className="w-4 h-4 mr-2" />
                Business Settings
              </Button>
            </div>

            {/* Alerts */}
            <div className="mt-6 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Inventory Alert</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Fresh Apples stock is running low (5 kg remaining)
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </VendorLayout>
  )
}

export default VendorDashboard