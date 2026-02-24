import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Target,
  Award,
  Clock,
  MapPin
} from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { 
  LineChart, 
  BarChart, 
  DonutChart, 
  MetricCard, 
  Heatmap 
} from '../../components/ui/Chart'

// Advanced Analytics Data Types
interface BusinessMetrics {
  revenue: {
    current: number
    previous: number
    growth: number
    target: number
  }
  orders: {
    current: number
    previous: number
    growth: number
    avgOrderValue: number
  }
  customers: {
    total: number
    new: number
    returning: number
    retention: number
  }
  vendors: {
    active: number
    new: number
    topPerforming: number
  }
}

interface SalesForecasting {
  predictions: {
    period: string
    predicted: number
    confidence: number
  }[]
  trends: {
    seasonal: string[]
    growth: number
    factors: string[]
  }
}

interface CustomerInsights {
  demographics: {
    ageGroups: { range: string; percentage: number; color: string }[]
    locations: { area: string; customers: number; revenue: number }[]
    behavior: {
      peakHours: number[]
      popularCategories: string[]
      avgSessionTime: number
    }
  }
  segmentation: {
    segment: string
    size: number
    value: number
    characteristics: string[]
    color: string
  }[]
}

// Mock Advanced Analytics Data
const mockBusinessMetrics: BusinessMetrics = {
  revenue: {
    current: 2847650,
    previous: 2234100,
    growth: 27.5,
    target: 3000000
  },
  orders: {
    current: 18543,
    previous: 15234,
    growth: 21.7,
    avgOrderValue: 285.40
  },
  customers: {
    total: 12456,
    new: 2347,
    returning: 10109,
    retention: 81.2
  },
  vendors: {
    active: 234,
    new: 45,
    topPerforming: 89
  }
}

const mockSalesData = [
  { label: 'Jan', value: 1200000 },
  { label: 'Feb', value: 1450000 },
  { label: 'Mar', value: 1680000 },
  { label: 'Apr', value: 1534000 },
  { label: 'May', value: 1890000 },
  { label: 'Jun', value: 2100000 },
  { label: 'Jul', value: 2350000 },
  { label: 'Aug', value: 2234000 },
  { label: 'Sep', value: 2456000 },
  { label: 'Oct', value: 2678000 },
  { label: 'Nov', value: 2845000 },
  { label: 'Dec', value: 2847650 }
]

const mockCategoryData = [
  { label: 'Groceries', value: 8543, color: '#10B981' },
  { label: 'Restaurants', value: 5234, color: '#F59E0B' },
  { label: 'Pharmacy', value: 2456, color: '#EF4444' },
  { label: 'Electronics', value: 1834, color: '#8B5CF6' },
  { label: 'Books', value: 476, color: '#06B6D4' }
]

const mockCustomerSegments = [
  { label: 'Premium', value: 2345, color: '#8B5CF6' },
  { label: 'Regular', value: 6789, color: '#10B981' },
  { label: 'Occasional', value: 2890, color: '#F59E0B' },
  { label: 'New', value: 432, color: '#EF4444' }
]

const mockHeatmapData = [
  // Sample data for order patterns
  { day: 'Mon', hour: 8, value: 45 },
  { day: 'Mon', hour: 12, value: 89 },
  { day: 'Mon', hour: 18, value: 156 },
  { day: 'Mon', hour: 20, value: 134 },
  { day: 'Tue', hour: 8, value: 52 },
  { day: 'Tue', hour: 12, value: 98 },
  { day: 'Tue', hour: 18, value: 167 },
  { day: 'Tue', hour: 20, value: 145 },
  // ... more data points
]

interface AdvancedAnalyticsProps {
  userType?: 'admin' | 'vendor'
  vendorId?: string
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({
  userType = 'admin'
  // vendorId - for future vendor-specific analytics
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [isLoading, setIsLoading] = useState(false)
  const [metrics] = useState<BusinessMetrics>(mockBusinessMetrics)

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const handleExport = () => {
    // Simulate export functionality
    console.log('Exporting analytics data...')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-heading font-bold text-gray-900">
                  Advanced Analytics
                </h1>
                <p className="text-gray-600 mt-1">
                  Business intelligence and predictive insights
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                
                <Button onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(metrics.revenue.current)}
            change={{ value: metrics.revenue.growth, percentage: true }}
            trend="up"
            icon={<DollarSign className="w-6 h-6" />}
            color="#10B981"
          />
          
          <MetricCard
            title="Total Orders"
            value={formatNumber(metrics.orders.current)}
            change={{ value: metrics.orders.growth, percentage: true }}
            trend="up"
            icon={<ShoppingBag className="w-6 h-6" />}
            color="#3B82F6"
          />
          
          <MetricCard
            title="Active Customers"
            value={formatNumber(metrics.customers.total)}
            change={{ value: metrics.customers.retention, percentage: true }}
            trend="up"
            icon={<Users className="w-6 h-6" />}
            color="#8B5CF6"
          />
          
          <MetricCard
            title="Average Order Value"
            value={formatCurrency(metrics.orders.avgOrderValue)}
            change={{ value: 8.3, percentage: true }}
            trend="up"
            icon={<TrendingUp className="w-6 h-6" />}
            color="#F59E0B"
          />
        </div>

        {/* Revenue Trends & Forecasting */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-heading font-semibold text-gray-900">
                Revenue Trends & Forecasting
              </h3>
              <Badge variant="info">AI Powered</Badge>
            </div>
            <LineChart 
              data={mockSalesData} 
              height={300}
              color="#10B981"
              showTrend={true}
            />
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Forecast Insights</span>
              </div>
              <p className="text-sm text-blue-700">
                Based on current trends, projected revenue for next month: 
                <span className="font-semibold"> ₹31.2L</span> (+9.7% growth)
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-heading font-semibold text-gray-900 mb-6">
              Revenue Progress
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Current</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(metrics.revenue.current)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(metrics.revenue.current / metrics.revenue.target) * 100}%` 
                    }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">0</span>
                  <span className="text-xs text-gray-500">
                    Target: {formatCurrency(metrics.revenue.target)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Growth Rate</span>
                  <Badge variant="success">+{metrics.revenue.growth}%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">vs Previous Period</span>
                  <span className="text-sm font-medium text-green-600">
                    +{formatCurrency(metrics.revenue.current - metrics.revenue.previous)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Category Performance & Customer Segments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-heading font-semibold text-gray-900 mb-6">
              Category Performance
            </h3>
            <BarChart 
              data={mockCategoryData}
              height={250}
              showValues={true}
            />
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-heading font-semibold text-gray-900 mb-6">
              Customer Segments
            </h3>
            <DonutChart 
              data={mockCustomerSegments}
              size={200}
              centerContent={
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatNumber(metrics.customers.total)}
                  </div>
                  <div className="text-sm text-gray-600">Total Customers</div>
                </div>
              }
            />
          </Card>
        </div>

        {/* Advanced Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-heading font-semibold text-gray-900">
                Top Performers
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Best Vendors</h4>
                <div className="space-y-2">
                  {['Fresh Mart Express', 'Spice Kitchen', 'MedPlus Pharmacy'].map((vendor, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{vendor}</span>
                      <Badge variant="success" size="sm">
                        #{idx + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Popular Products</h4>
                <div className="space-y-2">
                  {['Tomatoes (1kg)', 'Chicken Biryani', 'Paracetamol'].map((product, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{product}</span>
                      <span className="text-xs text-gray-500">{856 - idx * 100} orders</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-heading font-semibold text-gray-900">
                Peak Hours
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Morning Rush</span>
                  <span className="text-sm font-medium">8-10 AM</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-3/4" />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Lunch Time</span>
                  <span className="text-sm font-medium">12-2 PM</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full w-full" />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Evening Rush</span>
                  <span className="text-sm font-medium">6-8 PM</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full w-5/6" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-heading font-semibold text-gray-900">
                Geographic Insights
              </h3>
            </div>
            <div className="space-y-3">
              {[
                { area: 'Koramangala', orders: 2456, revenue: 689000 },
                { area: 'Indiranagar', orders: 1876, revenue: 523000 },
                { area: 'Whitefield', orders: 1543, revenue: 432000 },
                { area: 'HSR Layout', orders: 1234, revenue: 345000 }
              ].map((location, idx) => (
                <div key={idx} className="border-l-4 border-purple-500 pl-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {location.area}
                    </span>
                    <Badge variant="default" size="sm">
                      #{idx + 1}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatNumber(location.orders)} orders • {formatCurrency(location.revenue)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Order Pattern Heatmap */}
        <Card className="p-6">
          <h3 className="text-lg font-heading font-semibold text-gray-900 mb-6">
            Order Pattern Analysis
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Hourly order volume throughout the week
          </p>
          <Heatmap data={mockHeatmapData} maxValue={200} />
        </Card>
      </div>
    </div>
  )
}

export default AdvancedAnalytics