import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Modal } from '../ui'
import type { InventoryItem, InventoryAlert, PurchaseOrder, StockMovement } from '../../types/inventory'
import { 
  mockInventoryAlerts, 
  mockPurchaseOrders, 
  mockStockMovements,
  getInventoryByVendor,
  getLowStockItems,
  getOutOfStockItems,
  calculateInventoryValue,
  generateReorderSuggestions
} from '../../data/inventoryData'
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Plus, 
  Search, 
  RefreshCw,
  Edit,
  Eye,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Clock,
  Truck
} from 'lucide-react'

interface InventoryManagementProps {
  vendorId: string
}

export const InventoryManagement: React.FC<InventoryManagementProps> = ({ vendorId }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [alerts, setAlerts] = useState<InventoryAlert[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([])
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'alerts' | 'orders' | 'movements'>('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [showReorderModal, setShowReorderModal] = useState<InventoryItem | null>(null)
  const [reorderQuantity, setReorderQuantity] = useState('')

  useEffect(() => {
    // Load inventory data
    setInventory(getInventoryByVendor(vendorId))
    setAlerts(mockInventoryAlerts.filter(alert => !alert.isResolved))
    setPurchaseOrders(mockPurchaseOrders.filter(po => po.vendorId === vendorId))
    setStockMovements(mockStockMovements)
  }, [vendorId])

  const lowStockItems = getLowStockItems(vendorId)
  const outOfStockItems = getOutOfStockItems(vendorId)
  const totalValue = calculateInventoryValue(vendorId)
  const reorderSuggestions = generateReorderSuggestions(vendorId)

  const categories = ['all', ...Array.from(new Set(inventory.map(item => item.category)))]
  
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleReorder = (item: InventoryItem) => {
    setShowReorderModal(item)
    setReorderQuantity(item.reorderQuantity.toString())
  }

  const confirmReorder = () => {
    if (!showReorderModal || !reorderQuantity) return

    const quantity = parseInt(reorderQuantity)
    if (quantity <= 0) {
      alert('Please enter a valid quantity')
      return
    }

    // Create purchase order (mock)
    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      vendorId,
      supplierId: showReorderModal.supplier.id,
      orderNumber: `PO-${new Date().getFullYear()}-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
      status: 'draft',
      items: [{
        productId: showReorderModal.productId,
        sku: showReorderModal.sku,
        name: showReorderModal.name,
        quantity,
        unitPrice: showReorderModal.costPrice,
        totalPrice: quantity * showReorderModal.costPrice
      }],
      totalAmount: quantity * showReorderModal.costPrice,
      taxAmount: quantity * showReorderModal.costPrice * 0.18,
      grandTotal: quantity * showReorderModal.costPrice * 1.18,
      orderDate: new Date().toISOString(),
      expectedDeliveryDate: new Date(Date.now() + showReorderModal.supplier.deliveryTime * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: vendorId
    }

    setPurchaseOrders(prev => [newPO, ...prev])
    setShowReorderModal(null)
    setReorderQuantity('')
    alert(`Purchase order ${newPO.orderNumber} created successfully!`)
  }

  const getStockStatus = (item: InventoryItem) => {
    if (item.availableStock === 0) return { status: 'Out of Stock', color: 'bg-red-500', textColor: 'text-red-500' }
    if (item.availableStock <= item.minStockLevel) return { status: 'Low Stock', color: 'bg-orange-500', textColor: 'text-orange-500' }
    if (item.availableStock >= item.maxStockLevel * 0.8) return { status: 'High Stock', color: 'bg-blue-500', textColor: 'text-blue-500' }
    return { status: 'Normal', color: 'bg-green-500', textColor: 'text-green-500' }
  }

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Smart inventory control with AI-powered predictions</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Dashboard Overview */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Items</p>
                    <p className="text-2xl font-bold">{inventory.length}</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Low Stock</p>
                    <p className="text-2xl font-bold text-orange-600">{lowStockItems.length}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Out of Stock</p>
                    <p className="text-2xl font-bold text-red-600">{outOfStockItems.length}</p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Value</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(totalValue)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts & Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  Critical Alerts ({alerts.filter(a => a.severity === 'critical').length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.filter(a => a.severity === 'critical' || a.severity === 'high').slice(0, 5).map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                        alert.severity === 'critical' ? 'text-red-500' : 'text-orange-500'
                      }`} />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{alert.actionRequired}</p>
                      </div>
                    </div>
                  ))}
                  {alerts.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No active alerts</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-blue-500" />
                  Reorder Suggestions ({reorderSuggestions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reorderSuggestions.slice(0, 5).map((suggestion) => (
                    <div key={suggestion.item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{suggestion.item.name}</p>
                        <p className="text-xs text-gray-500">
                          Current: {suggestion.item.availableStock} {suggestion.item.unit}
                        </p>
                      </div>
                      <div className="text-right">
                        <Button 
                          size="sm" 
                          onClick={() => handleReorder(suggestion.item)}
                          className="mb-1"
                        >
                          Reorder
                        </Button>
                        <p className="text-xs text-gray-500">
                          Suggested: {suggestion.suggestedQuantity}
                        </p>
                      </div>
                    </div>
                  ))}
                  {reorderSuggestions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No reorder suggestions</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Recent Stock Movements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stockMovements.slice(0, 8).map((movement) => {
                  const item = inventory.find(inv => inv.id === movement.inventoryItemId)
                  return (
                    <div key={movement.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          movement.type === 'in' ? 'bg-green-500' :
                          movement.type === 'out' ? 'bg-red-500' :
                          movement.type === 'reserved' ? 'bg-orange-500' :
                          'bg-blue-500'
                        }`} />
                        <div>
                          <p className="font-medium text-sm">{movement.reason}</p>
                          <p className="text-xs text-gray-500">
                            {item?.name || 'Unknown Item'} • {new Date(movement.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-sm ${
                          movement.quantity > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                        </p>
                        <p className="text-xs text-gray-500">{item?.unit}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b">
        {(['dashboard', 'inventory', 'alerts', 'orders', 'movements'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 border-b-2 font-medium capitalize ${
              activeTab === tab 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'dashboard' && <BarChart3 className="w-4 h-4 inline mr-2" />}
            {tab === 'inventory' && <Package className="w-4 h-4 inline mr-2" />}
            {tab === 'alerts' && <AlertTriangle className="w-4 h-4 inline mr-2" />}
            {tab === 'orders' && <Truck className="w-4 h-4 inline mr-2" />}
            {tab === 'movements' && <Clock className="w-4 h-4 inline mr-2" />}
            {tab}
          </button>
        ))}
      </div>

      {/* Inventory List */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search inventory by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Inventory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInventory.map((item) => {
              const stockStatus = getStockStatus(item)
              return (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-lg">{item.name}</h4>
                        <p className="text-sm text-gray-500">{item.sku} • {item.category}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full ${stockStatus.color} text-white`}>
                          {stockStatus.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Available Stock:</span>
                        <span className="font-medium">{item.availableStock} {item.unit}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Reserved:</span>
                        <span>{item.reservedStock} {item.unit}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Reorder Point:</span>
                        <span>{item.reorderPoint} {item.unit}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Cost Price:</span>
                        <span>{formatCurrency(item.costPrice)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Selling Price:</span>
                        <span className="font-medium">{formatCurrency(item.sellingPrice)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      {item.availableStock <= item.reorderPoint && (
                        <Button 
                          size="sm" 
                          onClick={() => handleReorder(item)}
                          className="flex-1"
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Reorder
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Reorder Modal */}
      {showReorderModal && (
        <Modal isOpen={!!showReorderModal} onClose={() => setShowReorderModal(null)}>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">Create Purchase Order</h3>
            
            <div className="space-y-4">
              <div>
                <p className="font-medium">{showReorderModal.name}</p>
                <p className="text-sm text-gray-500">SKU: {showReorderModal.sku}</p>
                <p className="text-sm text-gray-500">Supplier: {showReorderModal.supplier.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Current Stock</label>
                  <p className="text-lg font-bold">{showReorderModal.availableStock} {showReorderModal.unit}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Suggested Quantity</label>
                  <p className="text-lg">{showReorderModal.reorderQuantity} {showReorderModal.unit}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Order Quantity</label>
                <Input
                  type="number"
                  value={reorderQuantity}
                  onChange={(e) => setReorderQuantity(e.target.value)}
                  placeholder="Enter quantity"
                />
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Unit Price:</span>
                  <span>{formatCurrency(showReorderModal.costPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Amount:</span>
                  <span className="font-bold">
                    {formatCurrency(parseFloat(reorderQuantity || '0') * showReorderModal.costPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Expected Delivery:</span>
                  <span>
                    {new Date(Date.now() + showReorderModal.supplier.deliveryTime * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowReorderModal(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmReorder}
                disabled={!reorderQuantity || parseFloat(reorderQuantity) <= 0}
                className="flex-1"
              >
                Create Order
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}