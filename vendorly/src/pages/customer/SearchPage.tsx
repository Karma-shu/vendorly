import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, MapPin, Navigation, Filter } from 'lucide-react'
import { Header } from '../../components/layout/Header'
import { BottomNav } from '../../components/layout/BottomNav'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Rating } from '../../components/ui/Rating'
import { Modal } from '../../components/ui/Modal'
import { mockProducts, mockVendors } from '../../utils/mockData'
import { 
  calculateDistance, 
  findNearbyVendors, 
  sortVendorsByDistance, 
  formatDistance,
  getDeliverableVendors
} from '../../utils/locationUtils'
import type { LocationFilter, ProductWithVendorInfo } from '../../types'

type ViewMode = 'products' | 'vendors'
type SortOption = 'relevance' | 'price_low' | 'price_high' | 'rating' | 'distance'

export const SearchPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [viewMode, setViewMode] = useState<ViewMode>('products')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('relevance')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  
  // Location state
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationFilter, setLocationFilter] = useState<LocationFilter>({
    radius: 10,
    sortBy: 'distance',
    deliveryOnly: false,
    minRating: 0,
    maxDeliveryFee: 100,
    categories: []
  })
  const [showLocationFilters, setShowLocationFilters] = useState(false)
  
  // Enhanced product filtering with location awareness
  const getFilteredProducts = () => {
    let products = mockProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    // Apply price filter
    products = products.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      products = products.filter(product => 
        selectedCategories.includes(product.categoryId)
      )
    }
    
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
              estimatedDeliveryTime: Math.ceil(distance * 5 + 15) // Simple estimation
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
    
    return products
  }
  
  const getFilteredVendors = () => {
    let vendors = mockVendors.filter(vendor =>
      vendor.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.businessType.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    // Apply location filtering
    if (userLocation) {
      if (locationFilter.deliveryOnly) {
        vendors = getDeliverableVendors(userLocation, vendors)
      } else {
        const vendorsWithDistance = sortVendorsByDistance(userLocation, vendors)
        vendors = vendorsWithDistance.filter(vendor => vendor.distance <= locationFilter.radius)
      }
    }
    
    // Apply rating filter
    vendors = vendors.filter(vendor => vendor.rating >= locationFilter.minRating)
    
    // Apply delivery fee filter
    vendors = vendors.filter(vendor => vendor.deliveryFee <= locationFilter.maxDeliveryFee)
    
    // Apply sorting
    if (sortBy === 'distance' && userLocation) {
      // Already sorted above
    } else if (sortBy === 'rating') {
      vendors = vendors.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'price_low') {
      vendors = vendors.sort((a, b) => a.deliveryFee - b.deliveryFee)
    } else if (sortBy === 'price_high') {
      vendors = vendors.sort((a, b) => b.deliveryFee - a.deliveryFee)
    }
    
    return vendors
  }
  
  const filteredProducts = getFilteredProducts()
  const filteredVendors = getFilteredVendors()
  
  // Simulate getting user location (in real app, this would come from context/location service)
  useEffect(() => {
    // Mock user location - in real app, get from browser geolocation or stored preference
    setUserLocation({ lat: 19.0760, lng: 72.8777 }) // Mumbai coordinates
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <Header
        showBackButton
        onBackClick={() => navigate(-1)}
        title="Search"
        showCart
        cartCount={3}
        onCartClick={() => navigate('/cart')}
      />

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-20">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                autoFocus
              />
            </div>
            <Button
              variant="outline"
              size="md"
              icon={SlidersHorizontal}
              onClick={() => setShowFilters(true)}
              className="!p-3"
            />
            <Button
              variant="outline"
              size="md"
              icon={Navigation}
              onClick={() => setShowLocationFilters(true)}
              className="!p-3"
            />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* View Mode Toggle */}
        <div className="bg-white px-4 py-3 border-b border-gray-200">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('products')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                viewMode === 'products'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Products ({filteredProducts.length})
            </button>
            <button
              onClick={() => setViewMode('vendors')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                viewMode === 'vendors'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Vendors ({filteredVendors.length})
            </button>
          </div>
        </div>

        {/* Sort Options */}
        <div className="bg-white px-4 py-3 border-b border-gray-200">
          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
            <span className="text-sm text-gray-600 mr-2">Sort:</span>
            {[
              { value: 'relevance', label: 'Relevance' },
              { value: 'price_low', label: 'Price: Low to High' },
              { value: 'price_high', label: 'Price: High to Low' },
              { value: 'rating', label: 'Rating' },
              { value: 'distance', label: 'Distance' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value as SortOption)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  sortBy === option.value
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="p-4">
          {searchQuery && (
            <p className="text-sm text-gray-600 mb-4">
              {viewMode === 'products' ? filteredProducts.length : filteredVendors.length} results for "{searchQuery}"
            </p>
          )}

          {viewMode === 'products' ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  padding="none"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">{product.unit}</p>
                    
                    {/* Price and Distance Info */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-primary font-semibold">₹{product.price}</span>
                      {product.stock > 0 ? (
                        <Badge variant="success" size="sm">In Stock</Badge>
                      ) : (
                        <Badge variant="error" size="sm">Out of Stock</Badge>
                      )}
                    </div>
                    
                    {/* Vendor and Distance Info */}
                    {'vendorInfo' in product && product.vendorInfo && (
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="truncate max-w-[100px]">
                          {product.vendorInfo.businessName}
                        </span>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{formatDistance((product.vendorInfo as any).distance)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredVendors.map((vendor) => (
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
                          <Badge variant="success" size="sm">Verified</Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{vendor.businessType}</p>
                      <Rating rating={vendor.rating} totalRatings={vendor.totalRatings} size="sm" />
                      
                      <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>
                            {('distance' in vendor) 
                              ? `${formatDistance((vendor as any).distance)} away` 
                              : `${vendor.deliveryRadius} km delivery radius`}
                          </span>
                        </div>
                        <span>Min. ₹{vendor.minimumOrder}</span>
                        <span>Delivery ₹{vendor.deliveryFee}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {((viewMode === 'products' && filteredProducts.length === 0) ||
            (viewMode === 'vendors' && filteredVendors.length === 0)) && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Location Filter Modal */}
      <Modal
        isOpen={showLocationFilters}
        onClose={() => setShowLocationFilters(false)}
        title="Location Filters"
        size="md"
      >
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Delivery Radius</h3>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="1"
                max="20"
                value={locationFilter.radius}
                onChange={(e) => setLocationFilter(prev => ({
                  ...prev,
                  radius: parseInt(e.target.value)
                }))}
                className="w-full"
              />
              <span className="text-sm font-medium text-gray-700 min-w-[40px]">
                {locationFilter.radius} km
              </span>
            </div>
          </div>
                
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Sort By</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'distance', label: 'Distance' },
                { value: 'rating', label: 'Rating' },
                { value: 'price_low', label: 'Price: Low' },
                { value: 'price_high', label: 'Price: High' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setLocationFilter(prev => ({
                    ...prev,
                    sortBy: option.value as any
                  }))}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    locationFilter.sortBy === option.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
                
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Delivery Only</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={locationFilter.deliveryOnly}
                onChange={(e) => setLocationFilter(prev => ({
                  ...prev,
                  deliveryOnly: e.target.checked
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
                
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Minimum Rating</h3>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={locationFilter.minRating}
              onChange={(e) => setLocationFilter(prev => ({
                ...prev,
                minRating: parseFloat(e.target.value)
              }))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>{locationFilter.minRating}+</span>
              <span>5</span>
            </div>
          </div>
                
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Maximum Delivery Fee</h3>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={locationFilter.maxDeliveryFee}
              onChange={(e) => setLocationFilter(prev => ({
                ...prev,
                maxDeliveryFee: parseInt(e.target.value)
              }))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>₹0</span>
              <span>₹{locationFilter.maxDeliveryFee}</span>
              <span>₹100</span>
            </div>
          </div>
                
          <div className="flex space-x-3">
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                setLocationFilter({
                  radius: 10,
                  sortBy: 'distance',
                  deliveryOnly: false,
                  minRating: 0,
                  maxDeliveryFee: 100,
                  categories: []
                })
                setShowLocationFilters(false)
              }}
            >
              Reset
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={() => setShowLocationFilters(false)}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Original Filter Modal */}
      <Modal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filters"
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
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                setPriceRange([0, 1000])
                setSelectedCategories([])
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