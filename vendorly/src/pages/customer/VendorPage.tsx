import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MessageCircle, Clock, MapPin, Phone, Star, Grid, List, BarChart3 } from 'lucide-react'
import { Header } from '../../components/layout/Header'
import { BottomNav } from '../../components/layout/BottomNav'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Rating } from '../../components/ui/Rating'
import { mockVendors, mockProducts, mockCategories } from '../../utils/mockData'
import { 
  calculateDistance, 
  findNearbyVendors, 
  formatDistance,
  groupProductsForComparison
} from '../../utils/locationUtils'
import type { ProductWithVendorInfo, ProductComparison } from '../../types'

type ViewMode = 'grid' | 'list'

export const VendorPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [similarProducts, setSimilarProducts] = useState<ProductComparison[]>([])
  const [showCompetitorComparison, setShowCompetitorComparison] = useState(false)

  const vendor = mockVendors.find(v => v.id === id)
  const vendorProducts = mockProducts.filter(p => p.vendorId === id)
  
  const productCategories = mockCategories.filter(cat =>
    vendorProducts.some(product => product.categoryId === cat.id)
  )

  const filteredProducts = selectedCategory === 'all' 
    ? vendorProducts 
    : vendorProducts.filter(p => p.categoryId === selectedCategory)

  // Find similar products from other vendors
  useEffect(() => {
    if (vendor && vendor.address.latitude && vendor.address.longitude) {
      // Find nearby vendors to compare with
      const userCoords = { lat: vendor.address.latitude, lng: vendor.address.longitude }
      const nearbyVendors = findNearbyVendors(userCoords, mockVendors, 10)
      
      // Find products that are similar to the current vendor's products
      const allSimilarProducts = vendorProducts.flatMap(vp => {
        return mockProducts.filter(p => 
          p.name.toLowerCase() === vp.name.toLowerCase() && 
          p.vendorId !== vendor.id // Different vendor
        ).map(p => {
          const vendorOfProduct = mockVendors.find(v => v.id === p.vendorId)
          return {
            ...p,
            vendorInfo: vendorOfProduct
          }
        })
      })
      
      // Group for comparison
      const grouped = groupProductsForComparison([
        ...vendorProducts.map(vp => ({
          ...vp,
          vendorInfo: vendor
        })),
        ...allSimilarProducts
      ])
      
      const comparisons = grouped.map((group: any) => {
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
      
      setSimilarProducts(comparisons)
    }
  }, [id, vendor])

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Vendor not found</h1>
          <Button onClick={() => navigate('/home')}>Go Home</Button>
        </div>
      </div>
    )
  }

  const isOpen = () => {
    const now = new Date()
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const currentDay = dayNames[now.getDay()] as keyof typeof vendor.businessHours
    const hours = vendor.businessHours[currentDay]
    return !hours.isClosed
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <Header
        showBackButton
        onBackClick={() => navigate(-1)}
        title={vendor.businessName}
        showCart
        cartCount={3}
        onCartClick={() => navigate('/cart')}
      />

      <div className="max-w-md mx-auto">
        {/* Vendor Info */}
        <div className="bg-white">
          {/* Hero Section */}
          <div className="relative h-32 bg-gradient-to-r from-primary to-primary-600">
            <div className="absolute inset-0 bg-black bg-opacity-20" />
            <div className="absolute bottom-4 left-4">
              <div className="flex items-center space-x-2">
                {vendor.verified && <Badge variant="success">Verified</Badge>}
                {isOpen() ? (
                  <Badge variant="success">Open</Badge>
                ) : (
                  <Badge variant="error">Closed</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Vendor Details */}
          <div className="px-4 py-6 -mt-8 relative">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 bg-white rounded-lg shadow-lg flex items-center justify-center text-3xl border-4 border-white">
                {vendor.businessType === 'Fruit Shop' ? '🍎' :
                 vendor.businessType === 'Vegetable Shop' ? '🥬' :
                 vendor.businessType === 'Pharmacy' ? '💊' : '🏪'}
              </div>
              
              <div className="flex-1 mt-2">
                <h1 className="text-xl font-bold text-gray-900 font-heading">
                  {vendor.businessName}
                </h1>
                <p className="text-gray-600 mb-2">{vendor.businessType}</p>
                <Rating
                  rating={vendor.rating}
                  totalRatings={vendor.totalRatings}
                  size="md"
                />
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="flex items-center justify-center text-primary mb-1">
                  <MapPin className="w-4 h-4" />
                </div>
                <p className="text-xs text-gray-600">Distance</p>
                <p className="font-semibold text-sm">{vendor.deliveryRadius} km</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center text-secondary mb-1">
                  <Clock className="w-4 h-4" />
                </div>
                <p className="text-xs text-gray-600">Delivery Fee</p>
                <p className="font-semibold text-sm">₹{vendor.deliveryFee}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center text-accent mb-1">
                  <Star className="w-4 h-4" />
                </div>
                <p className="text-xs text-gray-600">Min Order</p>
                <p className="font-semibold text-sm">₹{vendor.minimumOrder}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-6">
              <Button
                variant="primary"
                fullWidth
                icon={MessageCircle}
                onClick={() => navigate(`/chat/${vendor.id}`)}
              >
                Chat with Vendor
              </Button>
              <Button
                variant="outline"
                size="md"
                icon={Phone}
                onClick={() => console.log('Call vendor')}
                className="!p-3"
              />
            </div>
          </div>
        </div>

        {/* Categories Filter */}
        {productCategories.length > 1 && (
          <div className="bg-white mt-4 px-4 py-3 border-b border-gray-200">
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({vendorProducts.length})
              </button>
              {productCategories.map(category => {
                const count = vendorProducts.filter(p => p.categoryId === category.id).length
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name} ({count})
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Competitor Comparison Toggle */}
        {similarProducts.length > 0 && (
          <div className="bg-white px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">
                Products ({filteredProducts.length})
              </h2>
              <button
                onClick={() => setShowCompetitorComparison(!showCompetitorComparison)}
                className={`flex items-center space-x-1 p-2 rounded-lg ${
                  showCompetitorComparison 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm">Compare</span>
              </button>
            </div>
          </div>
        )}

        {/* Competitor Comparison Section */}
        {showCompetitorComparison && similarProducts.length > 0 && (
          <div className="bg-white px-4 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                Price Comparison
              </h3>
              <button 
                onClick={() => navigate('/category/1')}
                className="text-sm text-primary font-medium hover:text-primary-600"
              >
                See all
              </button>
            </div>
            <div className="space-y-3">
              {similarProducts.slice(0, 3).map((comparison) => (
                <Card 
                  key={comparison.productName} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(comparison.productName)}`)}
                >
                  <div className="p-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-900 truncate flex-1">
                        {comparison.productName}
                      </h3>
                      <Badge variant="success" size="sm">
                        Save ₹{comparison.priceRange}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <span>{comparison.vendorCount} vendors</span>
                      <span className="mx-2">•</span>
                      <span>From ₹{comparison.lowestPrice}</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-primary h-1.5 rounded-full" 
                        style={{ width: `${Math.min(100, (comparison.lowestPrice / comparison.highestPrice) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* View Mode Toggle */}
        {!showCompetitorComparison && (
          <div className="bg-white px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">
                Products ({filteredProducts.length})
              </h2>
              <div className="flex items-center space-x-2">
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
          </div>
        )}

        {/* Products */}
        {!showCompetitorComparison && (
          <div className="bg-white p-4">
            {viewMode === 'grid' ? (
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
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
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
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">This vendor doesn't have products in this category yet</p>
              </div>
            )}
          </div>
        )}

        {/* Business Hours */}
        <Card className="mt-4 mx-4" padding="md">
          <h3 className="font-semibold text-gray-900 mb-3">Business Hours</h3>
          <div className="space-y-2">
            {Object.entries(vendor.businessHours).map(([day, hours]) => (
              <div key={day} className="flex justify-between items-center text-sm">
                <span className="capitalize font-medium text-gray-700">{day}</span>
                <span className="text-gray-600">
                  {hours.isClosed ? 'Closed' : `${hours.open} - ${hours.close}`}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Address */}
        <Card className="mt-4 mx-4 mb-4" padding="md">
          <h3 className="font-semibold text-gray-900 mb-3">Location</h3>
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-gray-900">{vendor.address.addressLine1}</p>
              <p className="text-gray-600">{vendor.address.city}, {vendor.address.state} {vendor.address.postalCode}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => navigate('/chat')}
        className="fixed bottom-20 right-4 bg-primary hover:bg-primary-600 text-white p-4 rounded-full shadow-lg z-50 transition-transform duration-300 ease-in-out transform hover:scale-105"
        aria-label="Open chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle">
          <path d="M7.9 20A9 9 0 1 0 4 16.1a2 2 0 0 1 2.1-2.1L12 12l3.9-3.9a2 2 0 0 1 2.1-2.1A9 9 0 1 0 7.9 20z" />
        </svg>
      </button>

      <BottomNav userType="customer" />
    </div>
  )
}