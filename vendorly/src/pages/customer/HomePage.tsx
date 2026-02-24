import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, TrendingUp, Clock, Star, Navigation, BarChart3 } from 'lucide-react'
import { Header } from '../../components/layout/Header'
import { BottomNav } from '../../components/layout/BottomNav'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Rating } from '../../components/ui/Rating'
import { Input } from '../../components/ui/Input'
import { LocationPicker } from '../../components/ui/LocationPicker'
import { mockCategories, mockVendors, mockProducts } from '../../utils/mockData'
import { 
  calculateDistance, 
  findNearbyVendors, 
  sortVendorsByDistance, 
  formatDistance,
  groupProductsForComparison
} from '../../utils/locationUtils'
import type { ProductWithVendorInfo, ProductComparison } from '../../types'

interface Location {
  id: string
  address: string
  area: string
  city: string
  state: string
  pincode: string
  coordinates: {
    lat: number
    lng: number
  }
}

export const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const [location, setLocation] = useState('Andheri West, Mumbai')
  const [searchQuery, setSearchQuery] = useState('')
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<Location | null>({
    id: 'default',
    address: 'Andheri West, Mumbai, Maharashtra',
    area: 'Andheri West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400058',
    coordinates: { lat: 19.1356, lng: 72.8262 }
  })
  
  // State for nearby products and vendors
  const [nearbyVendors, setNearbyVendors] = useState<any[]>([])
  const [nearbyProducts, setNearbyProducts] = useState<(ProductWithVendorInfo | any)[]>([])
  const [productComparisons, setProductComparisons] = useState<ProductComparison[]>([])

  // Simulate getting user location and calculating nearby vendors/products
  useEffect(() => {
    const userCoords = { lat: 19.1356, lng: 72.8262 } // Default Mumbai coords
    
    // Find nearby vendors within 10km
    const nearby = findNearbyVendors(userCoords, mockVendors, 10)
    setNearbyVendors(nearby)
    
    // Get products from nearby vendors
    const nearbyProductList = mockProducts.filter(product => 
      nearby.some(vendor => vendor.id === product.vendorId)
    )
    
    // Add distance information to products
    const productsWithDistance = nearbyProductList.map(product => {
      const vendor = nearby.find(v => v.id === product.vendorId)
      if (vendor) {
        return {
          ...product,
          vendorInfo: {
            ...vendor,
            distance: vendor.distance,
            estimatedDeliveryTime: Math.ceil(vendor.distance * 5 + 15)
          }
        } as ProductWithVendorInfo
      }
      return product
    })
    
    setNearbyProducts(productsWithDistance)
    
    // Group products for comparison
    const grouped = groupProductsForComparison(productsWithDistance)
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
    
    setProductComparisons(comparisons)
  }, [])

  const handleLocationClick = () => {
    setShowLocationPicker(true)
  }

  const handleLocationSelect = (selectedLocation: Location) => {
    setCurrentLocation(selectedLocation)
    setLocation(`${selectedLocation.area}, ${selectedLocation.city}`)
    console.log('Selected location:', selectedLocation)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <Header
        showLocation
        location={location}
        onLocationClick={handleLocationClick}
        showCart
        cartCount={3}
        onCartClick={() => navigate('/cart')}
        showNotifications
        notificationCount={2}
        onNotificationClick={() => navigate('/notifications')}
      />

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-20">
        <div className="max-w-md mx-auto px-4 py-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for products, vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Categories Section */}
        <section className="bg-white px-4 py-6 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 font-heading mb-4">
            Shop by Category
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {mockCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => navigate(`/category/${category.id}`)}
                className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mb-2 text-2xl">
                  {category.icon}
                </div>
                <span className="text-xs text-gray-700 text-center font-medium">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Featured Banner */}
        <section className="px-4 mb-4">
          <Card className="bg-gradient-to-r from-primary to-primary-600 text-white overflow-hidden">
            <div className="p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-heading mb-2">
                  Get 20% Off
                </h3>
                <p className="text-sm opacity-90 mb-3">
                  On your first order from local vendors
                </p>
                <Badge variant="default" className="bg-white text-primary">
                  Use code: FIRST20
                </Badge>
              </div>
              <div className="text-6xl opacity-20">
                🎉
              </div>
            </div>
          </Card>
        </section>

        {/* Nearby Products Comparison */}
        {productComparisons.length > 0 && (
          <section className="px-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 font-heading flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                Nearby Price Comparisons
              </h2>
              <button 
                onClick={() => navigate('/category/1')} // Navigate to any category to see more comparisons
                className="text-sm text-primary font-medium hover:text-primary-600"
              >
                See all
              </button>
            </div>
            <div className="space-y-3">
              {productComparisons.slice(0, 2).map((comparison) => (
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
          </section>
        )}

        {/* Trending Products */}
        <section className="px-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 font-heading flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-secondary" />
              Trending Now
            </h2>
            <button 
              onClick={() => navigate('/search?filter=trending')}
              className="text-sm text-primary font-medium hover:text-primary-600"
            >
              See all
            </button>
          </div>
          <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
            {mockProducts.slice(0, 4).map((product) => (
              <Card
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="min-w-[160px] cursor-pointer hover:shadow-lg transition-shadow"
                padding="none"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-t-lg"
                />
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    {product.unit}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-semibold">
                      ₹{product.price}
                    </span>
                    {product.discountPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        ₹{product.discountPrice}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Nearby Vendors */}
        <section className="px-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 font-heading flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-accent" />
              Vendors Near You
            </h2>
            <button 
              onClick={() => navigate('/search?filter=nearby')}
              className="text-sm text-primary font-medium hover:text-primary-600"
            >
              See all
            </button>
          </div>
          <div className="space-y-3">
            {nearbyVendors.slice(0, 3).map((vendor) => (
              <Card
                key={vendor.id}
                onClick={() => navigate(`/vendor/${vendor.id}`)}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                padding="md"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">
                      {vendor.businessType === 'Fruit Shop' ? '🍎' :
                       vendor.businessType === 'Vegetable Shop' ? '🥬' :
                       vendor.businessType === 'Pharmacy' ? '💊' : '🏪'}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {vendor.businessName}
                      </h3>
                      {vendor.verified && (
                        <Badge variant="success" size="sm">
                          Verified
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {vendor.businessType}
                    </p>
                    
                    <Rating
                      rating={vendor.rating}
                      totalRatings={vendor.totalRatings}
                      size="sm"
                    />
                    
                    <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {formatDistance(vendor.distance)}
                      </span>
                      <span>
                        Min. ₹{vendor.minimumOrder}
                      </span>
                      <span>
                        Delivery ₹{vendor.deliveryFee}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
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

      {/* Bottom Navigation */}
      <BottomNav userType="customer" />

      {/* Location Picker Modal */}
      <LocationPicker
        isOpen={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onSelectLocation={handleLocationSelect}
        currentLocation={currentLocation}
      />
    </div>
  )
}