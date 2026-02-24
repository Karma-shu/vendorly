import React, { useState, useEffect } from 'react'
import { Card, Badge } from '../ui'
import { 
  Users, 
  Store, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Activity
} from 'lucide-react'

interface DashboardStats {
  totalVendors: number
  activeVendors: number
  pendingVendors: number
  totalCustomers: number
  totalOrders: number
  totalRevenue: number
  monthlyGrowth: number
  revenueGrowth: number
  avgOrderValue: number
  topCategories: { name: string; orders: number; revenue: number }[]
  recentActivity: { id: string; type: string; message: string; timestamp: string; status: 'success' | 'warning' | 'error' }[]
}

interface AdminDashboardProps {
  className?: string
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ className = '' }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      setLoading(true)
      // Mock dashboard data - replace with actual API calls
      const mockStats: DashboardStats = {
        totalVendors: 1247,
        activeVendors: 892,
        pendingVendors: 23,
        totalCustomers: 15673,
        totalOrders: 8934,
        totalRevenue: 2847390,
        monthlyGrowth: 12.5,
        revenueGrowth: 18.3,
        avgOrderValue: 318.7,
        topCategories: [
          { name: 'Electronics', orders: 2341, revenue: 987450 },
          { name: 'Fashion', orders: 1892, revenue: 567890 },
          { name: 'Groceries', orders: 2134, revenue: 445670 },
          { name: 'Home & Garden', orders: 987, revenue: 298760 },
          { name: 'Sports', orders: 567, revenue: 178230 }
        ],
        recentActivity: [
          {
            id: '1',
            type: 'vendor_approval',
            message: 'New vendor "Fresh Fruits Store" approved',
            timestamp: '2 minutes ago',
            status: 'success'
          },
          {
            id: '2',
            type: 'payment_issue',
            message: 'Payment gateway experiencing delays',
            timestamp: '15 minutes ago',
            status: 'warning'
          },
          {
            id: '3',
            type: 'order_spike',
            message: 'Order volume increased by 25% in the last hour',
            timestamp: '1 hour ago',
            status: 'success'
          },
          {
            id: '4',
            type: 'vendor_rejection',
            message: 'Vendor "Fake Electronics" rejected due to policy violation',
            timestamp: '2 hours ago',
            status: 'error'
          },
          {
            id: '5',
            type: 'commission_payout',
            message: 'Monthly commission payout completed for 234 vendors',
            timestamp: '3 hours ago',
            status: 'success'
          }
        ]
      }
      setStats(mockStats)
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'vendor_approval':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'vendor_rejection':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'payment_issue':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'order_spike':
        return <TrendingUp className="w-4 h-4 text-blue-500" />
      case 'commission_payout':
        return <DollarSign className="w-4 h-4 text-green-500" />
      default:
        return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Platform overview and key metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Vendors</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalVendors.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <Badge className="bg-green-100 text-green-800 mr-2">
              {stats.activeVendors} Active
            </Badge>
            <Badge className="bg-yellow-100 text-yellow-800">
              {stats.pendingVendors} Pending
            </Badge>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+{stats.monthlyGrowth}%</span>
            <span className="text-gray-500 ml-1">this month</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalOrders.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">Avg. Order Value</p>
            <p className="text-lg font-semibold text-gray-900">₹{stats.avgOrderValue.toFixed(0)}</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">₹{(stats.totalRevenue / 1000000).toFixed(1)}M</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+{stats.revenueGrowth}%</span>
            <span className="text-gray-500 ml-1">vs last month</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Categories</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {stats.topCategories.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-primary-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-500">{category.orders} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">₹{(category.revenue / 1000).toFixed(0)}K</p>
                  <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{ width: `${(category.revenue / stats.topCategories[0].revenue) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <div className="flex items-center mt-1">
                    <Badge className={`text-xs ${getActivityStatusColor(activity.status)} mr-2`}>
                      {activity.status}
                    </Badge>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {activity.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Review Pending Vendors</p>
                <p className="text-sm text-gray-500">{stats.pendingVendors} applications waiting</p>
              </div>
            </div>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Process Payouts</p>
                <p className="text-sm text-gray-500">Monthly commission ready</p>
              </div>
            </div>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">View Analytics</p>
                <p className="text-sm text-gray-500">Detailed platform insights</p>
              </div>
            </div>
          </button>
        </div>
      </Card>
    </div>
  )
}