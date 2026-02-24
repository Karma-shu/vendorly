import React, { useState, useEffect } from 'react'
import { Search, Mic, Camera, TrendingUp, Clock, MapPin, Filter } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { VoiceSearch } from '../../components/ui/VoiceSearch'
import { useEnhancedSearch } from '../../hooks/useEnhancedSearch'
import { BarcodeScannerButton } from '../../components/ui/BarcodeScannerButton'
import { mockProducts, mockVendors } from '../../utils/mockData'

export const EnhancedSearchPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchMode, setSearchMode] = useState<'products' | 'vendors'>('products')
  const [showVoiceSearch, setShowVoiceSearch] = useState(false)
  
  const {
    searchHistory,
    voiceSearchCount,
    handleVoiceSearch,
    addToHistory,
    getSearchSuggestions
  } = useEnhancedSearch()

  // Perform search
  const performSearch = async (query: string) => {
    if (!query.trim()) return

    setIsSearching(true)
    addToHistory(query)
    
    // Update URL
    setSearchParams({ q: query })
    setSearchQuery(query)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock search logic
      const lowerQuery = query.toLowerCase()
      
      if (searchMode === 'products') {
        const filtered = mockProducts.filter(product => 
          product.name.toLowerCase().includes(lowerQuery) ||
          product.description.toLowerCase().includes(lowerQuery)
        )
        setSearchResults(filtered)
      } else {
        const filtered = mockVendors.filter(vendor =>
          vendor.businessName.toLowerCase().includes(lowerQuery) ||
          vendor.businessType.toLowerCase().includes(lowerQuery) ||
          vendor.address.city.toLowerCase().includes(lowerQuery)
        )
        setSearchResults(filtered)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  // Handle voice search result
  const handleVoiceSearchResult = (query: string) => {
    const processedQuery = handleVoiceSearch(query)
    performSearch(processedQuery)
    setShowVoiceSearch(false)
  }

  // Handle barcode scan result
  const handleBarcodeResult = (barcode: string, type: string) => {
    const searchQuery = `barcode:${barcode}`
    performSearch(searchQuery)
    
    // Analytics tracking
    if (window.gtag) {
      window.gtag('event', 'barcode_search', {
        barcode,
        barcode_type: type
      })
    }
  }

  // Load initial search if query in URL
  useEffect(() => {
    const urlQuery = searchParams.get('q')
    if (urlQuery) {
      performSearch(urlQuery)
    }
  }, [])

  const trendingSearches = [
    'Biryani near me',
    'Fresh vegetables',
    'Medicine delivery',
    'Electronics deals',
    'Grocery offers'
  ]

  const searchSuggestions = getSearchSuggestions(searchQuery)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)}
            >
              ←
            </Button>
            <h1 className="text-lg font-semibold">Enhanced Search</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Search Modes */}
        <div className="flex gap-2">
          <Button
            variant={searchMode === 'products' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSearchMode('products')}
          >
            Products
          </Button>
          <Button
            variant={searchMode === 'vendors' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSearchMode('vendors')}
          >
            Vendors
          </Button>
        </div>

        {/* Traditional Search */}
        <Card className="p-4">
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && performSearch(searchQuery)}
                placeholder={`Search for ${searchMode}...`}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Button
                onClick={() => performSearch(searchQuery)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                size="sm"
                disabled={!searchQuery.trim() || isSearching}
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>

            {/* Search Suggestions */}
            {searchQuery && searchSuggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {searchSuggestions.map((suggestion: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => performSearch(suggestion)}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Advanced Search Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Voice Search */}
          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold">Voice Search</h3>
                {voiceSearchCount > 0 && (
                  <Badge variant="info" size="sm">
                    Used {voiceSearchCount} times
                  </Badge>
                )}
              </div>
              
              {showVoiceSearch ? (
                <VoiceSearch
                  onSearch={handleVoiceSearchResult}
                  placeholder="Try saying 'Find fresh vegetables near me'"
                />
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Search using your voice for a hands-free experience
                  </p>
                  <Button
                    onClick={() => setShowVoiceSearch(true)}
                    variant="outline"
                    className="w-full"
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    Start Voice Search
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Barcode Scanner */}
          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold">Barcode Scanner</h3>
              </div>
              <p className="text-sm text-gray-600">
                Scan product barcodes to find items instantly
              </p>
              <BarcodeScannerButton
                onScanResult={handleBarcodeResult}
                className="w-full"
              />
            </div>
          </Card>
        </div>

        {/* Search History */}
        {searchHistory.length > 0 && (
          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold">Recent Searches</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.slice(0, 5).map((query: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => performSearch(query)}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Trending Searches */}
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold">Trending Searches</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((query, index) => (
                <button
                  key={index}
                  onClick={() => performSearch(query)}
                  className="px-3 py-2 text-sm bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition-colors"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Search Results */}
        {(searchResults.length > 0 || isSearching) && (
          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  {isSearching ? 'Searching...' : `${searchResults.length} Results`}
                </h3>
                {searchQuery && (
                  <Badge variant="info">
                    "{searchQuery}"
                  </Badge>
                )}
              </div>

              {isSearching ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-gray-600 mt-2">Searching {searchMode}...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="grid gap-4">
                  {searchResults.map((item, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        if (searchMode === 'products') {
                          navigate(`/product/${item.id}`)
                        } else {
                          navigate(`/vendor/${item.id}`)
                        }
                      }}
                    >
                      <div className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {searchMode === 'products' ? item.description : item.category}
                          </p>
                          {searchMode === 'products' ? (
                            <p className="font-semibold text-primary mt-1">₹{item.price}</p>
                          ) : (
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{item.location.area}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No {searchMode} found for "{searchQuery}"</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Try different keywords or voice search
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}