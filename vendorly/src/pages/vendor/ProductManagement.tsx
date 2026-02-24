import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import VendorLayout from '../../components/layout/VendorLayout'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Edit, 
  Trash2, 
  Eye,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  Package
} from 'lucide-react'
import { mockVendorProducts } from '../../utils/mockVendorData'
import type { Product } from '../../types'

const ProductManagement: React.FC = () => {
  const navigate = useNavigate()
  const [products] = useState<Product[]>(mockVendorProducts)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'low_stock'>('all')

  // Filter products based on search and status
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && product.isActive) ||
      (filterStatus === 'inactive' && !product.isActive) ||
      (filterStatus === 'low_stock' && product.stock <= 10)
    
    return matchesSearch && matchesStatus
  })

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', variant: 'error' as const }
    if (stock <= 5) return { label: 'Critical', variant: 'error' as const }
    if (stock <= 10) return { label: 'Low Stock', variant: 'warning' as const }
    return { label: 'In Stock', variant: 'success' as const }
  }

  const handleToggleStatus = (productId: string) => {
    // Mock toggle - in real app, this would call an API
    console.log('Toggle product status:', productId)
  }

  const handleDeleteProduct = (productId: string) => {
    // Mock delete - in real app, this would call an API
    if (confirm('Are you sure you want to delete this product?')) {
      console.log('Delete product:', productId)
    }
  }

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const stockStatus = getStockStatus(product.stock)
    
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 right-3">
            <Badge variant={stockStatus.variant} size="sm">
              {stockStatus.label}
            </Badge>
          </div>
          {!product.isActive && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Badge variant="error">Inactive</Badge>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
            <button
              onClick={() => handleToggleStatus(product.id)}
              className="ml-2 flex-shrink-0"
            >
              {product.isActive ? (
                <ToggleRight className="w-5 h-5 text-green-600" />
              ) : (
                <ToggleLeft className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
              <span className="text-sm text-gray-500">/{product.unit}</span>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-600">Stock:</span>
              <span className={`ml-1 font-medium ${
                product.stock <= 5 ? 'text-red-600' : 
                product.stock <= 10 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {product.stock}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-600 hover:text-red-700"
              onClick={() => handleDeleteProduct(product.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  const ProductListItem: React.FC<{ product: Product }> = ({ product }) => {
    const stockStatus = getStockStatus(product.stock)
    
    return (
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
              <Badge variant={stockStatus.variant} size="sm">
                {stockStatus.label}
              </Badge>
              {!product.isActive && <Badge variant="error" size="sm">Inactive</Badge>}
            </div>
            <p className="text-sm text-gray-600 line-clamp-1 mb-2">{product.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Price: <span className="font-medium text-gray-900">₹{product.price}/{product.unit}</span></span>
              <span>Stock: <span className={`font-medium ${
                product.stock <= 5 ? 'text-red-600' : 
                product.stock <= 10 ? 'text-yellow-600' : 'text-green-600'
              }`}>{product.stock}</span></span>
              <span>Updated: {new Date(product.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => handleToggleStatus(product.id)}
              className="p-1"
            >
              {product.isActive ? (
                <ToggleRight className="w-5 h-5 text-green-600" />
              ) : (
                <ToggleLeft className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-600 hover:text-red-700"
              onClick={() => handleDeleteProduct(product.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
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
            <h1 className="text-2xl font-heading font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600">Manage your product catalog and inventory</p>
          </div>
          <Button onClick={() => navigate('/vendor/products/add')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-xl font-bold text-gray-900">{products.length}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ToggleRight className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Products</p>
                <p className="text-xl font-bold text-gray-900">
                  {products.filter(p => p.isActive).length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-xl font-bold text-gray-900">
                  {products.filter(p => p.stock <= 10 && p.stock > 0).length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-xl font-bold text-gray-900">
                  {products.filter(p => p.stock === 0).length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Products</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
              <option value="low_stock">Low Stock</option>
            </select>
            
            {/* View Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Card>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <Card className="p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Start by adding your first product'}
            </p>
            {!searchQuery && filterStatus === 'all' && (
              <Button onClick={() => navigate('/vendor/products/add')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Product
              </Button>
            )}
          </Card>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {filteredProducts.map(product => 
              viewMode === 'grid' ? (
                <ProductCard key={product.id} product={product} />
              ) : (
                <ProductListItem key={product.id} product={product} />
              )
            )}
          </div>
        )}
      </div>
    </VendorLayout>
  )
}

export default ProductManagement