import React, { useState, useEffect } from 'react'
import { Card, Button, Modal, Input, Badge, LoadingSpinner } from '../ui'
// import { supabaseService } from '../../services/supabaseService'
import { Search, Check, X, Eye, AlertTriangle } from 'lucide-react'

interface Vendor {
  id: string
  business_name: string
  email: string
  phone: string
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  category: string
  documents_verified: boolean
  created_at: string
  total_orders: number
  total_revenue: number
  commission_rate: number
  rating: number
  kyc_status: 'pending' | 'completed' | 'rejected'
}

interface VendorManagementProps {
  className?: string
}

export const VendorManagement: React.FC<VendorManagementProps> = ({ className = '' }) => {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | 'suspend'>('approve')
  const [approvalReason, setApprovalReason] = useState('')

  const filterVendors = React.useCallback(() => {
    let filtered = vendors

    if (searchTerm) {
      filtered = filtered.filter(vendor =>
        vendor.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(vendor => vendor.status === statusFilter)
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(vendor => vendor.category === categoryFilter)
    }

    setFilteredVendors(filtered)
  }, [vendors, searchTerm, statusFilter, categoryFilter])

  useEffect(() => {
    loadVendors()
  }, [])

  useEffect(() => {
    filterVendors()
  }, [vendors, searchTerm, statusFilter, categoryFilter, filterVendors])

  const loadVendors = async () => {
    try {
      setLoading(true)
      // Mock data for demonstration - replace with actual API call
      const mockVendors: Vendor[] = [
        {
          id: '1',
          business_name: 'Fresh Fruits Store',
          email: 'contact@freshfruits.com',
          phone: '+91 9876543210',
          status: 'pending',
          category: 'Groceries',
          documents_verified: true,
          created_at: '2024-01-15',
          total_orders: 0,
          total_revenue: 0,
          commission_rate: 5,
          rating: 0,
          kyc_status: 'completed'
        },
        {
          id: '2',
          business_name: 'Tech Solutions Hub',
          email: 'info@techsolutions.com',
          phone: '+91 9876543211',
          status: 'approved',
          category: 'Electronics',
          documents_verified: true,
          created_at: '2024-01-10',
          total_orders: 145,
          total_revenue: 125000,
          commission_rate: 3,
          rating: 4.5,
          kyc_status: 'completed'
        },
        {
          id: '3',
          business_name: 'Fashion Trends',
          email: 'hello@fashiontrends.com',
          phone: '+91 9876543212',
          status: 'approved',
          category: 'Fashion',
          documents_verified: true,
          created_at: '2024-01-08',
          total_orders: 89,
          total_revenue: 67000,
          commission_rate: 7,
          rating: 4.2,
          kyc_status: 'completed'
        },
        {
          id: '4',
          business_name: 'Home Decor Plus',
          email: 'support@homedecor.com',
          phone: '+91 9876543213',
          status: 'rejected',
          category: 'Home & Garden',
          documents_verified: false,
          created_at: '2024-01-12',
          total_orders: 0,
          total_revenue: 0,
          commission_rate: 6,
          rating: 0,
          kyc_status: 'rejected'
        }
      ]
      setVendors(mockVendors)
    } catch (error) {
      console.error('Error loading vendors:', error)
    } finally {
      setLoading(false)
    }
  }

  // Second definition of filterVendors removed to prevent duplicate declaration

  const handleApprovalAction = async () => {
    if (!selectedVendor) return

    try {
      // Update vendor status
      const updatedVendors = vendors.map(vendor =>
        vendor.id === selectedVendor.id
          ? { ...vendor, status: approvalAction === 'approve' ? 'approved' as const : approvalAction === 'reject' ? 'rejected' as const : 'suspended' as const }
          : vendor
      )
      setVendors(updatedVendors)

      // In real app, make API call to update status
      // await supabaseService.vendorService.updateStatus(selectedVendor.id, approvalAction, approvalReason)

      setShowApprovalModal(false)
      setApprovalReason('')
    } catch (error) {
      console.error('Error updating vendor status:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800', text: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', text: 'Rejected' },
      suspended: { color: 'bg-gray-100 text-gray-800', text: 'Suspended' }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={config.color}>{config.text}</Badge>
  }

  const getUniqueCategories = () => {
    return Array.from(new Set(vendors.map(vendor => vendor.category)))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
          <p className="text-gray-600">Manage vendor applications and accounts</p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-yellow-100 text-yellow-800">
            {vendors.filter(v => v.status === 'pending').length} Pending
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            {vendors.filter(v => v.status === 'approved').length} Active
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
                placeholder="Search vendors..."
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
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="suspended">Suspended</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Categories</option>
            {getUniqueCategories().map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Vendors Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {vendor.business_name}
                      </div>
                      <div className="text-sm text-gray-500">{vendor.email}</div>
                      <div className="text-sm text-gray-500">{vendor.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {getStatusBadge(vendor.status)}
                      <div className="flex items-center gap-1 text-xs">
                        {vendor.documents_verified ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            KYC Verified
                          </span>
                        ) : (
                          <span className="text-red-600 flex items-center gap-1">
                            <X className="w-3 h-3" />
                            KYC Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vendor.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>{vendor.total_orders} orders</div>
                      <div className="text-gray-500">₹{vendor.total_revenue.toLocaleString()}</div>
                      {vendor.rating > 0 && (
                        <div className="text-yellow-600">★ {vendor.rating}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vendor.commission_rate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedVendor(vendor)
                          setShowDetailsModal(true)
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {vendor.status === 'pending' && (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setSelectedVendor(vendor)
                              setApprovalAction('approve')
                              setShowApprovalModal(true)
                            }}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedVendor(vendor)
                              setApprovalAction('reject')
                              setShowApprovalModal(true)
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {vendor.status === 'approved' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedVendor(vendor)
                            setApprovalAction('suspend')
                            setShowApprovalModal(true)
                          }}
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Vendor Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Vendor Details"
        size="lg"
      >
        {selectedVendor && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-900">Business Information</h3>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p><strong>Name:</strong> {selectedVendor.business_name}</p>
                  <p><strong>Email:</strong> {selectedVendor.email}</p>
                  <p><strong>Phone:</strong> {selectedVendor.phone}</p>
                  <p><strong>Category:</strong> {selectedVendor.category}</p>
                  <p><strong>Joined:</strong> {new Date(selectedVendor.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Performance Metrics</h3>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p><strong>Total Orders:</strong> {selectedVendor.total_orders}</p>
                  <p><strong>Total Revenue:</strong> ₹{selectedVendor.total_revenue.toLocaleString()}</p>
                  <p><strong>Commission Rate:</strong> {selectedVendor.commission_rate}%</p>
                  <p><strong>Rating:</strong> {selectedVendor.rating > 0 ? `★ ${selectedVendor.rating}` : 'No ratings yet'}</p>
                  <p><strong>KYC Status:</strong> {selectedVendor.kyc_status}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Approval Action Modal */}
      <Modal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        title={`${approvalAction.charAt(0).toUpperCase() + approvalAction.slice(1)} Vendor`}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to {approvalAction} {selectedVendor?.business_name}?
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason (optional)
            </label>
            <textarea
              value={approvalReason}
              onChange={(e) => setApprovalReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={3}
              placeholder="Enter reason for this action..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowApprovalModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleApprovalAction}
            >
              Confirm {approvalAction.charAt(0).toUpperCase() + approvalAction.slice(1)}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}