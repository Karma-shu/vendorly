import React, { useState } from 'react'
import VendorLayout from '../../components/layout/VendorLayout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  ShoppingCart, 
  Users, 
  Star,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import { 
  mockVendorAnalytics,
  mockDailyStats,
  mockTopProducts
} from '../../utils/mockVendorData'

const VendorAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('week')
  const analytics = mockVendorAnalytics
  
  // Calculate growth rates (mock data)
  const growthData = {
    revenue: 12.5,
    orders: 8.3,
    customers: 15.7,
    rating: 0.2
  }

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`
  const formatPercentage = (value: number, showSign = true) => 
    `${showSign && value > 0 ? '+' : ''}${value.toFixed(1)}%`

  // Mock category-wise sales data
  const categoryData = [
    { category: 'Fruits', sales: 45, revenue: 68000, color: 'bg-green-500' },
    { category: 'Vegetables', sales: 35, revenue: 42000, color: 'bg-orange-500' },
    { category: 'Dairy', sales: 15, revenue: 18000, color: 'bg-blue-500' },
    { category: 'Others', sales: 5, revenue: 7000, color: 'bg-purple-500' }
  ]

  // Mock hourly sales pattern
  const hourlySales = [
    { hour: '6AM', orders: 2 }, { hour: '7AM', orders: 5 }, { hour: '8AM', orders: 12 },
    { hour: '9AM', orders: 18 }, { hour: '10AM', orders: 25 }, { hour: '11AM', orders: 30 },
    { hour: '12PM', orders: 35 }, { hour: '1PM', orders: 28 }, { hour: '2PM', orders: 22 },
    { hour: '3PM', orders: 20 }, { hour: '4PM', orders: 26 }, { hour: '5PM', orders: 32 },
    { hour: '6PM', orders: 40 }, { hour: '7PM', orders: 45 }, { hour: '8PM', orders: 38 },
    { hour: '9PM', orders: 28 }, { hour: '10PM', orders: 15 }, { hour: '11PM', orders: 8 }
  ]

  const maxHourlyOrders = Math.max(...hourlySales.map(h => h.orders))

  return (
    <VendorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900">Business Analytics</h1>
            <p className="text-gray-600">Track your performance and identify growth opportunities</p>
          </div>
          <div className="flex gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(analytics.totalRevenue)}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">
                    {formatPercentage(growthData.revenue)}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last {timeRange}</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalOrders}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="text-sm text-blue-600 font-medium">
                    {formatPercentage(growthData.orders)}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last {timeRange}</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.customerCount}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-purple-500 mr-1" />
                  <span className="text-sm text-purple-600 font-medium">
                    {formatPercentage(growthData.customers)}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last {timeRange}</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.rating}/5</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-sm text-yellow-600 font-medium">
                    {formatPercentage(growthData.rating)}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last {timeRange}</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Revenue Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-heading font-semibold text-gray-900">Daily Revenue Trend</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {mockDailyStats.map((stat, index) => (
                <div key={stat.date} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-12">
                    {new Date(stat.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-700"
                      style={{ 
                        width: `${(stat.revenue / Math.max(...mockDailyStats.map(s => s.revenue))) * 100}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-20 text-right">
                    ₹{(stat.revenue / 1000).toFixed(1)}k
                  </span>
                  <span className="text-xs text-gray-500 w-16 text-right">
                    {stat.orders} orders
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Category Sales Distribution */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-heading font-semibold text-gray-900">Sales by Category</h3>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {categoryData.map((category) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${category.color}`} />
                    <span className="font-medium text-gray-900">{category.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(category.revenue)}
                    </div>
                    <div className="text-sm text-gray-500">{category.sales}% of sales</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Simple pie chart representation */}
            <div className="mt-6 flex rounded-full overflow-hidden h-3">
              {categoryData.map((category) => (
                <div
                  key={category.category}
                  className={category.color}
                  style={{ width: `${category.sales}%` }}
                />
              ))}
            </div>
          </Card>
        </div>

        {/* Hourly Sales Pattern & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hourly Sales Pattern */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-heading font-semibold text-gray-900">Hourly Sales Pattern</h3>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="grid grid-cols-6 gap-2 mb-4">
              {hourlySales.map((hour) => (
                <div key={hour.hour} className="text-center">
                  <div 
                    className="bg-blue-500 rounded-sm mb-1 transition-all duration-500"
                    style={{ 
                      height: `${Math.max((hour.orders / maxHourlyOrders) * 60, 4)}px`,
                      opacity: hour.orders / maxHourlyOrders
                    }}
                  />
                  <span className="text-xs text-gray-600">{hour.hour}</span>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Peak Hours:</span>
                <span className="font-medium text-blue-700">6PM - 8PM</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-600">Average Orders/Hour:</span>
                <span className="font-medium text-blue-700">
                  {(hourlySales.reduce((sum, h) => sum + h.orders, 0) / hourlySales.length).toFixed(1)}
                </span>
              </div>
            </div>
          </Card>

          {/* Top Products */}
          <Card className="p-6">
            <h3 className="text-lg font-heading font-semibold text-gray-900 mb-6">Top Products</h3>
            
            <div className="space-y-4">
              {mockTopProducts.slice(0, 5).map((product, index) => (
                <div key={product.productId} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                    {index + 1}
                  </span>
                  <img 
                    src={product.image} 
                    alt={product.productName}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{product.productName}</p>
                    <p className="text-xs text-gray-500">{product.sales} sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 text-sm">₹{product.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Performance Insights */}
        <Card className="p-6">
          <h3 className="text-lg font-heading font-semibold text-gray-900 mb-6">Performance Insights</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Strong Growth</h4>
              <p className="text-sm text-gray-600">
                Your revenue has grown by <span className="font-medium text-green-600">12.5%</span> this week
              </p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Customer Base</h4>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-blue-600">15.7%</span> increase in new customers
              </p>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">High Rating</h4>
              <p className="text-sm text-gray-600">
                Maintaining <span className="font-medium text-yellow-600">4.8/5</span> customer satisfaction
              </p>
            </div>
          </div>
        </Card>
      </div>
    </VendorLayout>
  )
}

export default VendorAnalytics