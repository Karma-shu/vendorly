import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SlidersHorizontal, Grid, List, Navigation, MapPin, BarChart3 } from 'lucide-react'
import { Header } from '../../components/layout/Header'
import { BottomNav } from '../../components/layout/BottomNav'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Rating } from '../../components/ui/Rating'
import { Modal } from '../../components/ui/Modal'
import { mockCategories, mockProducts, mockVendors } from '../../utils/mockData'
import { 
  calculateDistance, 
  sortVendorsByDistance, 
  formatDistance,
  groupProductsForComparison
} from '../../utils/locationUtils'
import type { ProductWithVendorInfo, ProductComparison } from '../../types'

type ViewMode = 'grid' | 'list'
type SortOption = 'popularity' | 'price_low' | 'price_high' | 'rating' | 'distance'

export const CategoryPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('popularity')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [showOnlyInStock, setShowOnlyInStock] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [showCompareView, setShowCompareView] = useState(false)

  const category = mockCategories.find(cat => cat.id === id)
  const categoryProducts = mockProducts.filter(product => product.categoryId === id)
  const categoryVendors = mockVendors.filter(vendor => 
    categoryProducts.some(product => product.vendorId === vendor.id)
  )

  // Simulate user location
  useEffect(() => {
    // In real app, this would come from location context or browser geolocation
    setUserLocation({ lat: 19.0760, lng: 72.8777 }) // Mumbai coordinates
  }, [])

  // Enhanced product filtering with location awareness
  const getFilteredProducts = (): (ProductWithVendorInfo | any)[] => {
    let products = categoryProducts.filter(product => {
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      const matchesStock = !showOnlyInStock || product.stock > 0
      return matchesPrice && matchesStock
    })

    // Add vendor info and distance if location is available
    if (userLocation) {
      products = products.map(product => {
        const vendor = mockVendors.find(v => v.id === product.vendorId)
        if (vendor && vendor.address.latitude && vendor.address.longitude) {
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            vendor.address.latitude,
            vendor.address.longitude
          )
          return {
            ...product,
            vendorInfo: {
              ...vendor,
              distance,
              estimatedDeliveryTime: Math.ceil(distance * 5 + 15)
            }
          } as ProductWithVendorInfo
        }
        return product
      })

      // Sort by distance if selected
      if (sortBy === 'distance') {
        products = (products as ProductWithVendorInfo[]).sort((a, b) => 
          (a.vendorInfo?.distance || 0) - (b.vendorInfo?.distance || 0)
        )
      }
    }

    // Apply other sorting
    if (sortBy === 'price_low') {
      products = products.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price_high') {
      products = products.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'rating') {
      products = products.sort((a, b) => {
        const vendorA = mockVendors.find(v => v.id === a.vendorId)
        const vendorB = mockVendors.find(v => v.id === b.vendorId)
        return (vendorB?.rating || 0) - (vendorA?.rating || 0)
      })
    }

    return products
  }

  // Get products grouped for comparison
  const getComparisonProducts = (): ProductComparison[] => {
    if (!showCompareView) return []
    
    const products = getFilteredProducts()
    const grouped = groupProductsForComparison(products)
    
    return grouped.map(group => {
      const prices = group.vendors.map((v: any) => v.price)
      return {
        productName: group.productName,
        vendors: group.vendors,
        lowestPrice: Math.min(...prices),
        highestPrice: Math.max(...prices),
        averagePrice: prices.reduce((a: number, b: number) => a + b, 0) / prices.length,
        priceRange: Math.max(...prices) - Math.min(...prices),
        vendorCount: group.vendors.length
      }
    })
  }

  const filteredProducts = getFilteredProducts()
  const comparisonProducts = getComparisonProducts()

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Category not found</h1>
          <Button onClick={() => navigate('/home')}>Go Home</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <Header
        showBackButton
        onBackClick={() => navigate(-1)}
        title={category.name}
        showCart
        cartCount={3}
        onCartClick={() => navigate('/cart')}
      />

      <div className="max-w-md mx-auto">
        {/* Category Info */}
        <div className="bg-white px-4 py-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-50 rounded-lg flex items-center justify-center text-3xl">
              {category.icon}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 font-heading">{category.name}</h1>
              <p className="text-gray-600">{filteredProducts.length} products available</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                icon={SlidersHorizontal}
                onClick={() => setShowFilters(true)}
              >
                Filters
              </Button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="popularity">Popular</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="distance">Distance</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowCompareView(!showCompareView)}
                className={`p-2 rounded-lg flex items-center space-x-1 ${
                  showCompareView 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm">Compare</span>
              </button>
              
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {showCompareView && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center text-blue-800">
                <BarChart3 className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">
                  Showing {comparisonProducts.length} products with price comparisons from {categoryVendors.length} vendors
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Vendors in Category */}
        {categoryVendors.length > 0 && (
          <div className="bg-white px-4 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Top vendors in {category.name}</h3>
            <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
              {categoryVendors.map(vendor => (
                <Card
                  key={vendor.id}
                  onClick={() => navigate(`/vendor/${vendor.id}`)}
                  className="min-w-[120px] cursor-pointer hover:shadow-lg transition-shadow"
                  padding="sm"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mx-auto mb-2 text-xl">
                      {vendor.businessType === 'Fruit Shop' ? '🍎' :
                       vendor.businessType === 'Vegetable Shop' ? '🥬' :
                       vendor.businessType === 'Pharmacy' ? '💊' : '🏪'}
                    </div>
                    <h4 className="font-medium text-xs text-gray-900 truncate">{vendor.businessName}</h4>
                    <div className="flex items-center justify-center mt-1">
                      <Rating rating={vendor.rating} showValue={false} size="sm" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        <div className="p-4">
          {showCompareView ? (
            // Comparison View
            <div className="space-y-4">
              {comparisonProducts.length > 0 ? (
                comparisonProducts.map((comparison) => (
                  <Card key={comparison.productName} padding="md" className="hover:shadow-lg transition-shadow">
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">{comparison.productName}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>{comparison.vendorCount} vendors</span>
                        <span>₹{comparison.lowestPrice} - ₹{comparison.highestPrice}</span>
                        <span className="text-green-600 font-medium">
                          Save ₹{comparison.priceRange}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {comparison.vendors.slice(0, 3).map((product) => (
                        <div 
                          key={product.id}
                          className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-primary transition-colors"
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          <div className="flex items-start space-x-3">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 text-sm truncate">
                                {product.vendorInfo?.businessName || 'Vendor'}
                              </h4>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-primary font-semibold">₹{product.price}</span>
                                {product.vendorInfo?.distance && (
                                  <span className="text-xs text-gray-500 flex items-center">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {formatDistance(product.vendorInfo.distance)}
                                  </span>
                                )}
                              </div>
                              {product.vendorInfo?.rating && (
                                <div className="flex items-center mt-1">
                                  <Rating rating={product.vendorInfo.rating} showValue={false} size="sm" />
                                  <span className="text-xs text-gray-500 ml-1">
                                    ({product.vendorInfo.totalRatings})
                                  </span>
                                </div>
                              )}
                              {comparison.lowestPrice === product.price && (
                                <Badge variant="success" size="sm" className="mt-2">
                                  Best Price
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {comparison.vendors.length > 3 && (
                      <button 
                        className="w-full mt-3 py-2 text-primary font-medium hover:bg-primary-50 rounded-lg transition-colors"
                        onClick={() => navigate(`/search?q=${encodeURIComponent(comparison.productName)}`)}
                      >
                        View all {comparison.vendors.length} vendors
                      </button>
                    )}
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No comparable products found</h3>
                  <p className="text-gray-600">Try adjusting your filters or check back later</p>
                </div>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredProducts.map(product => (
                <Card
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  padding="none"
                >
                  <div className="relative">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-t-lg flex items-center justify-center">
                        <Badge variant="error">Out of Stock</Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">{product.unit}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-semibold">₹{product.price}</span>
                      {product.discountPrice && (
                        <span className="text-xs text-gray-400 line-through">₹{product.discountPrice}</span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProducts.map(product => (
                <Card
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  padding="md"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-primary font-semibold">₹{product.price}/{product.unit}</span>
                        {product.stock > 0 ? (
                          <Badge variant="success" size="sm">In Stock</Badge>
                        ) : (
                          <Badge variant="error" size="sm">Out of Stock</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">{category.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your filters or check back later</p>
            </div>
          )}
        </div>
      </div>

      {/* Filter Modal */}
      <Modal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter Products"
        size="md"
      >
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Min"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Max"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showOnlyInStock}
                onChange={(e) => setShowOnlyInStock(e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">Show only in stock items</span>
            </label>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                setPriceRange([0, 1000])
                setShowOnlyInStock(false)
                setShowFilters(false)
              }}
            >
              Reset
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={() => setShowFilters(false)}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Modal>

      <BottomNav userType="customer" />
    </div>
  )
}