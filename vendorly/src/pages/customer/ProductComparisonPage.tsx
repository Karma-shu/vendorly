import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Star, Clock, BarChart3 } from 'lucide-react'
import { Header } from '../../components/layout/Header'
import { BottomNav } from '../../components/layout/BottomNav'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Rating } from '../../components/ui/Rating'
import { mockVendors, mockProducts } from '../../utils/mockData'
import { 
  calculateDistance, 
  findNearbyVendors, 
  formatDistance
} from '../../utils/locationUtils'
import type { ProductWithVendorInfo, ProductComparison } from '../../types'

export const ProductComparisonPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const productName = searchParams.get('productName') || ''
  
  const [productComparisons, setProductComparisons] = useState<ProductComparison[]>([])
  const [selectedProduct, setSelectedProduct] = useState<string>(productName)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({ lat: 19.0760, lng: 72.8777 })

  useEffect(() => {
    // Find products with the given name from different vendors
    const productsByName = mockProducts.filter(p => 
      p.name.toLowerCase().includes(selectedProduct.toLowerCase())
    )
    
    // Group by name for comparison
    const grouped: Record<string, ProductWithVendorInfo[]> = {}
    
    productsByName.forEach(product => {
      const vendor = mockVendors.find(v => v.id === product.vendorId)
      if (vendor && vendor.address.latitude && vendor.address.longitude) {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          vendor.address.latitude,
          vendor.address.longitude
        )
        
        const productWithVendorInfo: ProductWithVendorInfo = {
          ...product,
          vendorInfo: {
            id: vendor.id,
            businessName: vendor.businessName,
            businessType: vendor.businessType,
            verified: vendor.verified,
            rating: vendor.rating,
            totalRatings: vendor.totalRatings,
            deliveryRadius: vendor.deliveryRadius,
            deliveryFee: vendor.deliveryFee,
            minimumOrder: vendor.minimumOrder || 0,
            distance: distance,
            estimatedDeliveryTime: Math.ceil(distance * 5 + 15)
          }
        }
        
        const key = product.name.toLowerCase()
        if (!grouped[key]) {
          grouped[key] = []
        }
        grouped[key].push(productWithVendorInfo)
      }
    })
    
    // Convert to ProductComparison format
    const comparisons: ProductComparison[] = Object.values(grouped)
      .filter(group => group.length > 1) // Only groups with multiple vendors
      .map(group => {
        const prices = group.map(p => p.price)
        return {
          productName: group[0].name,
          vendors: group,
          lowestPrice: Math.min(...prices),
          highestPrice: Math.max(...prices),
          averagePrice: prices.reduce((a, b) => a + b, 0) / prices.length,
          priceRange: Math.max(...prices) - Math.min(...prices),
          vendorCount: group.length
        }
      })
    
    setProductComparisons(comparisons)
  }, [selectedProduct, userLocation])

  const handleProductSelect = (productName: string) => {
    setSelectedProduct(productName)
    navigate(`/compare-products?productName=${encodeURIComponent(productName)}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <Header
        showBackButton
        onBackClick={() => navigate(-1)}
        title="Product Comparison"
        showCart
        cartCount={3}
        onCartClick={() => navigate('/cart')}
      />

      <div className="max-w-md mx-auto">
        {/* Search for Products to Compare */}
        <div className="bg-white px-4 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search for products to compare..."
              value={selectedProduct}
              onChange={(e) => handleProductSelect(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Comparison Summary */}
        <div className="bg-white px-4 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-primary" />
              Comparing {productComparisons.length} Products
            </h2>
            <span className="text-sm text-gray-500">
              Sorted by price
            </span>
          </div>
        </div>

        {/* Product Comparison List */}
        <div className="p-4">
          {productComparisons.length > 0 ? (
            <div className="space-y-4">
              {productComparisons.map((comparison) => (
                <Card key={comparison.productName} padding="md">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg text-gray-900">{comparison.productName}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
                      <span>{comparison.vendorCount} vendors</span>
                      <span>₹{comparison.lowestPrice} - ₹{comparison.highestPrice}</span>
                      <span className="text-green-600 font-medium">
                        Save up to ₹{comparison.priceRange}
                      </span>
                    </div>
                  </div>
                  
                  {/* Vendor Comparison Table */}
                  <div className="space-y-3">
                    {comparison.vendors
                      .sort((a, b) => a.price - b.price) // Sort by price
                      .map((product) => (
                        <div 
                          key={product.id} 
                          className={`border rounded-lg p-3 ${product.price === comparison.lowestPrice ? 'border-primary bg-primary-50' : 'border-gray-200'}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900">
                                  {product.vendorInfo?.businessName || 'Vendor'}
                                </h4>
                                {product.price === comparison.lowestPrice && (
                                  <Badge variant="success" size="sm">
                                    Best Price
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center mt-1 space-x-4 text-sm">
                                <div className="flex items-center text-gray-600">
                                  <Star className="w-4 h-4 mr-1 text-yellow-500" />
                                  <span>{product.vendorInfo?.rating}</span>
                                </div>
                                
                                <div className="flex items-center text-gray-600">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  <span>{formatDistance(product.vendorInfo?.distance || 0)}</span>
                                </div>
                                
                                <div className="flex items-center text-gray-600">
                                  <Clock className="w-4 h-4 mr-1" />
                                  <span>~{product.vendorInfo?.estimatedDeliveryTime} min</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="font-semibold text-lg text-primary">
                                ₹{product.price}
                              </div>
                              <div className="text-xs text-gray-500">
                                + ₹{product.vendorInfo?.deliveryFee} delivery
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center mt-3 space-x-2">
                            <Button
                              variant="primary"
                              size="sm"
                              fullWidth
                              onClick={() => navigate(`/product/${product.id}`)}
                            >
                              View Product
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/vendor/${product.vendorId}`)}
                            >
                              Visit Store
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products to compare</h3>
              <p className="text-gray-600 mb-4">
                Search for a product name to see price comparisons from different vendors
              </p>
              <Button
                variant="primary"
                onClick={() => handleProductSelect('Apple')}
              >
                Try "Apple"
              </Button>
            </div>
          )}
        </div>
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