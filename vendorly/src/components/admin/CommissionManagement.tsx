import React, { useState, useEffect } from 'react'
import { Card, Button, Modal, Input, Badge } from '../ui'
import { TrendingUp, TrendingDown, Edit, Plus, Percent, DollarSign, Calendar } from 'lucide-react'

interface CommissionRate {
  id: string
  category: string
  base_rate: number
  tier_rates: {
    bronze: number // 0-50 orders
    silver: number // 51-200 orders
    gold: number   // 201-500 orders
    platinum: number // 500+ orders
  }
  effective_from: string
  status: 'active' | 'scheduled' | 'expired'
}

interface VendorCommission {
  vendor_id: string
  vendor_name: string
  category: string
  current_tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  current_rate: number
  total_orders: number
  monthly_revenue: number
  commission_earned: number
  last_payout: string
  next_payout: string
}

interface CommissionManagementProps {
  className?: string
}

export const CommissionManagement: React.FC<CommissionManagementProps> = ({ className = '' }) => {
  const [commissionRates, setCommissionRates] = useState<CommissionRate[]>([])
  const [vendorCommissions, setVendorCommissions] = useState<VendorCommission[]>([])
  const [activeTab, setActiveTab] = useState<'rates' | 'payouts'>('rates')
  const [showRateModal, setShowRateModal] = useState(false)
  const [editingRate, setEditingRate] = useState<CommissionRate | null>(null)
  const [newRate, setNewRate] = useState({
    category: '',
    base_rate: 5,
    tier_rates: { bronze: 5, silver: 4, gold: 3, platinum: 2 },
    effective_from: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    loadCommissionData()
  }, [])

  const loadCommissionData = () => {
    // Mock commission rates data
    const mockRates: CommissionRate[] = [
      {
        id: '1',
        category: 'Electronics',
        base_rate: 3,
        tier_rates: { bronze: 3, silver: 2.5, gold: 2, platinum: 1.5 },
        effective_from: '2024-01-01',
        status: 'active'
      },
      {
        id: '2',
        category: 'Fashion',
        base_rate: 7,
        tier_rates: { bronze: 7, silver: 6, gold: 5, platinum: 4 },
        effective_from: '2024-01-01',
        status: 'active'
      },
      {
        id: '3',
        category: 'Groceries',
        base_rate: 5,
        tier_rates: { bronze: 5, silver: 4, gold: 3, platinum: 2 },
        effective_from: '2024-01-01',
        status: 'active'
      },
      {
        id: '4',
        category: 'Home & Garden',
        base_rate: 6,
        tier_rates: { bronze: 6, silver: 5, gold: 4, platinum: 3 },
        effective_from: '2024-02-01',
        status: 'scheduled'
      }
    ]

    // Mock vendor commission data
    const mockVendorCommissions: VendorCommission[] = [
      {
        vendor_id: '1',
        vendor_name: 'Tech Solutions Hub',
        category: 'Electronics',
        current_tier: 'gold',
        current_rate: 2,
        total_orders: 345,
        monthly_revenue: 125000,
        commission_earned: 2500,
        last_payout: '2024-01-01',
        next_payout: '2024-02-01'
      },
      {
        vendor_id: '2',
        vendor_name: 'Fashion Trends',
        category: 'Fashion',
        current_tier: 'silver',
        current_rate: 6,
        total_orders: 189,
        monthly_revenue: 67000,
        commission_earned: 4020,
        last_payout: '2024-01-01',
        next_payout: '2024-02-01'
      },
      {
        vendor_id: '3',
        vendor_name: 'Fresh Fruits Store',
        category: 'Groceries',
        current_tier: 'bronze',
        current_rate: 5,
        total_orders: 45,
        monthly_revenue: 25000,
        commission_earned: 1250,
        last_payout: '2024-01-01',
        next_payout: '2024-02-01'
      }
    ]

    setCommissionRates(mockRates)
    setVendorCommissions(mockVendorCommissions)
  }

  const handleSaveRate = () => {
    if (editingRate) {
      // Update existing rate
      setCommissionRates(rates =>
        rates.map(rate =>
          rate.id === editingRate.id
            ? { ...rate, ...newRate, status: 'scheduled' as const }
            : rate
        )
      )
    } else {
      // Add new rate
      const rate: CommissionRate = {
        id: Date.now().toString(),
        ...newRate,
        status: 'scheduled'
      }
      setCommissionRates(rates => [...rates, rate])
    }

    setShowRateModal(false)
    setEditingRate(null)
    setNewRate({
      category: '',
      base_rate: 5,
      tier_rates: { bronze: 5, silver: 4, gold: 3, platinum: 2 },
      effective_from: new Date().toISOString().split('T')[0]
    })
  }

  const getTierBadge = (tier: string) => {
    const tierConfig = {
      bronze: { color: 'bg-orange-100 text-orange-800', text: 'Bronze' },
      silver: { color: 'bg-gray-100 text-gray-800', text: 'Silver' },
      gold: { color: 'bg-yellow-100 text-yellow-800', text: 'Gold' },
      platinum: { color: 'bg-purple-100 text-purple-800', text: 'Platinum' }
    }
    const config = tierConfig[tier as keyof typeof tierConfig]
    return <Badge className={config.color}>{config.text}</Badge>
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', text: 'Active' },
      scheduled: { color: 'bg-blue-100 text-blue-800', text: 'Scheduled' },
      expired: { color: 'bg-gray-100 text-gray-800', text: 'Expired' }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={config.color}>{config.text}</Badge>
  }

  const totalCommissionEarned = vendorCommissions.reduce((sum, vendor) => sum + vendor.commission_earned, 0)
  const totalMonthlyRevenue = vendorCommissions.reduce((sum, vendor) => sum + vendor.monthly_revenue, 0)
  const averageCommissionRate = totalMonthlyRevenue > 0 ? (totalCommissionEarned / totalMonthlyRevenue) * 100 : 0

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commission Management</h1>
          <p className="text-gray-600">Manage commission rates and vendor payouts</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowRateModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Commission Rate
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Commission</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalCommissionEarned.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+12.5%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Commission Rate</p>
              <p className="text-2xl font-bold text-gray-900">{averageCommissionRate.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Percent className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-red-600">-0.3%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Vendors</p>
              <p className="text-2xl font-bold text-gray-900">{vendorCommissions.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+5</span>
            <span className="text-gray-500 ml-1">this month</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Next Payout</p>
              <p className="text-2xl font-bold text-gray-900">Feb 1</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-gray-500">₹{totalCommissionEarned.toLocaleString()} pending</span>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('rates')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'rates'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Commission Rates
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'payouts'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Vendor Payouts
          </button>
        </nav>
      </div>

      {/* Commission Rates Tab */}
      {activeTab === 'rates' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bronze (0-50)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Silver (51-200)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gold (201-500)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platinum (500+)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {commissionRates.map((rate) => (
                  <tr key={rate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {rate.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rate.tier_rates.bronze}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rate.tier_rates.silver}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rate.tier_rates.gold}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rate.tier_rates.platinum}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(rate.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingRate(rate)
                          setNewRate({
                            category: rate.category,
                            base_rate: rate.base_rate,
                            tier_rates: rate.tier_rates,
                            effective_from: rate.effective_from
                          })
                          setShowRateModal(true)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Vendor Payouts Tab */}
      {activeTab === 'payouts' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monthly Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission Earned
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Payout
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vendorCommissions.map((vendor) => (
                  <tr key={vendor.vendor_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {vendor.vendor_name}
                        </div>
                        <div className="text-sm text-gray-500">{vendor.category}</div>
                        <div className="text-sm text-gray-500">{vendor.total_orders} orders</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTierBadge(vendor.current_tier)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vendor.current_rate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{vendor.monthly_revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{vendor.commission_earned.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(vendor.next_payout).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Commission Rate Modal */}
      <Modal
        isOpen={showRateModal}
        onClose={() => {
          setShowRateModal(false)
          setEditingRate(null)
        }}
        title={editingRate ? 'Edit Commission Rate' : 'Add Commission Rate'}
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={newRate.category}
              onChange={(e) => setNewRate({ ...newRate, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              disabled={!!editingRate}
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Groceries">Groceries</option>
              <option value="Home & Garden">Home & Garden</option>
              <option value="Sports">Sports</option>
              <option value="Books">Books</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bronze Tier (0-50 orders)
              </label>
              <Input
                type="number"
                value={newRate.tier_rates.bronze}
                onChange={(e) => setNewRate({
                  ...newRate,
                  tier_rates: { ...newRate.tier_rates, bronze: parseFloat(e.target.value) || 0 }
                })}
                placeholder="5"
                step="0.1"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Silver Tier (51-200 orders)
              </label>
              <Input
                type="number"
                value={newRate.tier_rates.silver}
                onChange={(e) => setNewRate({
                  ...newRate,
                  tier_rates: { ...newRate.tier_rates, silver: parseFloat(e.target.value) || 0 }
                })}
                placeholder="4"
                step="0.1"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gold Tier (201-500 orders)
              </label>
              <Input
                type="number"
                value={newRate.tier_rates.gold}
                onChange={(e) => setNewRate({
                  ...newRate,
                  tier_rates: { ...newRate.tier_rates, gold: parseFloat(e.target.value) || 0 }
                })}
                placeholder="3"
                step="0.1"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Platinum Tier (500+ orders)
              </label>
              <Input
                type="number"
                value={newRate.tier_rates.platinum}
                onChange={(e) => setNewRate({
                  ...newRate,
                  tier_rates: { ...newRate.tier_rates, platinum: parseFloat(e.target.value) || 0 }
                })}
                placeholder="2"
                step="0.1"
                min="0"
                max="100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Effective From
            </label>
            <Input
              type="date"
              value={newRate.effective_from}
              onChange={(e) => setNewRate({ ...newRate, effective_from: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowRateModal(false)
                setEditingRate(null)
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveRate}
              disabled={!newRate.category}
            >
              {editingRate ? 'Update' : 'Create'} Rate
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}