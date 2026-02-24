import React, { useState } from 'react'
import { Card, Button, Input, Badge, Modal } from '../ui'
import { Search, Ban, MessageCircle, Eye, UserX } from 'lucide-react'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  status: 'active' | 'blocked' | 'inactive'
  joined_date: string
  total_orders: number
  total_spent: number
  last_order: string
  location: string
  loyalty_tier: 'bronze' | 'silver' | 'gold' | 'platinum'
}

interface CustomerManagementProps {
  className?: string
}

export const CustomerManagement: React.FC<CustomerManagementProps> = ({ className = '' }) => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [tierFilter, setTierFilter] = useState<string>('all')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showActionModal, setShowActionModal] = useState(false)
  const [actionType, setActionType] = useState<'block' | 'unblock' | 'message'>('block')

  React.useEffect(() => {
    loadCustomers()
  }, [])

  React.useEffect(() => {
    filterCustomers()
  }, [customers, searchTerm, statusFilter, tierFilter])

  const filterCustomers = React.useCallback(() => {
    let filtered = customers

    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(customer => customer.status === statusFilter)
    }

    if (tierFilter !== 'all') {
      filtered = filtered.filter(customer => customer.loyalty_tier === tierFilter)
    }

    setFilteredCustomers(filtered)
  }, [customers, searchTerm, statusFilter, tierFilter])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      // Mock customer data
      const mockCustomers: Customer[] = [
        {
          id: '1',
          name: 'Rahul Sharma',
          email: 'rahul.sharma@email.com',
          phone: '+91 9876543210',
          status: 'active',
          joined_date: '2024-01-15',
          total_orders: 23,
          total_spent: 15670,
          last_order: '2024-01-20',
          location: 'Mumbai, Maharashtra',
          loyalty_tier: 'gold'
        },
        {
          id: '2',
          name: 'Priya Patel',
          email: 'priya.patel@email.com',
          phone: '+91 9876543211',
          status: 'active',
          joined_date: '2024-01-10',
          total_orders: 45,
          total_spent: 28900,
          last_order: '2024-01-22',
          location: 'Ahmedabad, Gujarat',
          loyalty_tier: 'platinum'
        },
        {
          id: '3',
          name: 'Amit Kumar',
          email: 'amit.kumar@email.com',
          phone: '+91 9876543212',
          status: 'blocked',
          joined_date: '2024-01-05',
          total_orders: 3,
          total_spent: 890,
          last_order: '2024-01-18',
          location: 'Delhi, Delhi',
          loyalty_tier: 'bronze'
        },
        {
          id: '4',
          name: 'Sneha Reddy',
          email: 'sneha.reddy@email.com',
          phone: '+91 9876543213',
          status: 'active',
          joined_date: '2024-01-12',
          total_orders: 12,
          total_spent: 7890,
          last_order: '2024-01-21',
          location: 'Hyderabad, Telangana',
          loyalty_tier: 'silver'
        }
      ]
      setCustomers(mockCustomers)
    } catch (error) {
      console.error('Error loading customers:', error)
    } finally {
      setLoading(false)
    }
  }

  // Second definition of filterCustomers removed to prevent duplicate declaration

  const handleCustomerAction = async () => {
    if (!selectedCustomer) return

    try {
      if (actionType === 'block' || actionType === 'unblock') {
        const newStatus = actionType === 'block' ? 'blocked' : 'active'
        const updatedCustomers = customers.map(customer =>
          customer.id === selectedCustomer.id
            ? { ...customer, status: newStatus as 'active' | 'blocked' | 'inactive' }
            : customer
        )
        setCustomers(updatedCustomers)
      }
      
      setShowActionModal(false)
    } catch (error) {
      console.error('Error updating customer:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', text: 'Active' },
      blocked: { color: 'bg-red-100 text-red-800', text: 'Blocked' },
      inactive: { color: 'bg-gray-100 text-gray-800', text: 'Inactive' }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={config.color}>{config.text}</Badge>
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">Manage customer accounts and activity</p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-green-100 text-green-800">
            {customers.filter(c => c.status === 'active').length} Active
          </Badge>
          <Badge className="bg-red-100 text-red-800">
            {customers.filter(c => c.status === 'blocked').length} Blocked
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Tiers</option>
            <option value="bronze">Bronze</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
          </select>
        </div>
      </Card>

      {/* Customer Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loyalty Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {customer.name}
                      </div>
                      <div className="text-sm text-gray-500">{customer.email}</div>
                      <div className="text-sm text-gray-500">{customer.phone}</div>
                      <div className="text-sm text-gray-500">{customer.location}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(customer.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTierBadge(customer.loyalty_tier)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>{customer.total_orders} orders</div>
                      <div className="text-gray-500">
                        Last: {new Date(customer.last_order).toLocaleDateString()}
                      </div>
                      <div className="text-gray-500">
                        Joined: {new Date(customer.joined_date).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{customer.total_spent.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCustomer(customer)
                          setShowDetailsModal(true)
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCustomer(customer)
                          setActionType('message')
                          setShowActionModal(true)
                        }}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCustomer(customer)
                          setActionType(customer.status === 'blocked' ? 'unblock' : 'block')
                          setShowActionModal(true)
                        }}
                      >
                        {customer.status === 'blocked' ? (
                          <UserX className="w-4 h-4" />
                        ) : (
                          <Ban className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Customer Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Customer Details"
        size="lg"
      >
        {selectedCustomer && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-900">Personal Information</h3>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p><strong>Name:</strong> {selectedCustomer.name}</p>
                  <p><strong>Email:</strong> {selectedCustomer.email}</p>
                  <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
                  <p><strong>Location:</strong> {selectedCustomer.location}</p>
                  <p><strong>Joined:</strong> {new Date(selectedCustomer.joined_date).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Account Activity</h3>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p><strong>Status:</strong> {selectedCustomer.status}</p>
                  <p><strong>Loyalty Tier:</strong> {selectedCustomer.loyalty_tier}</p>
                  <p><strong>Total Orders:</strong> {selectedCustomer.total_orders}</p>
                  <p><strong>Total Spent:</strong> ₹{selectedCustomer.total_spent.toLocaleString()}</p>
                  <p><strong>Last Order:</strong> {new Date(selectedCustomer.last_order).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Action Modal */}
      <Modal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        title={
          actionType === 'block' ? 'Block Customer' :
          actionType === 'unblock' ? 'Unblock Customer' :
          'Send Message'
        }
      >
        <div className="space-y-4">
          {actionType === 'message' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows={4}
                placeholder="Enter your message..."
              />
            </div>
          ) : (
            <div>
              <p className="text-gray-600">
                Are you sure you want to {actionType} {selectedCustomer?.name}?
              </p>
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason (optional)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  rows={3}
                  placeholder="Enter reason for this action..."
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowActionModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCustomerAction}
            >
              {actionType === 'message' ? 'Send Message' : `Confirm ${actionType.charAt(0).toUpperCase() + actionType.slice(1)}`}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}