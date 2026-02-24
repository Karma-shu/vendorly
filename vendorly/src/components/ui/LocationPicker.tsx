import React, { useState, useEffect, useCallback } from 'react'
import { Search, MapPin, Navigation, X, Check } from 'lucide-react'
import { Button } from './Button'

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

interface LocationPickerProps {
  isOpen: boolean
  onClose: () => void
  onSelectLocation: (location: Location) => void
  currentLocation?: Location | null
}

// Free location APIs alternatives to Google Maps API
const LOCATION_SERVICES = {
  // OpenStreetMap Nominatim (Free)
  nominatim: 'https://nominatim.openstreetmap.org',
  
  // MapBox Geocoding (Free tier: 100,000 requests/month)
  mapbox: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
  
  // Positionstack (Free tier: 25,000 requests/month)
  positionstack: 'http://api.positionstack.com/v1/forward'
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  isOpen,
  onClose,
  onSelectLocation,
  currentLocation
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<Location[]>([])
  const [userLocation, setUserLocation] = useState<Location | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(currentLocation || null)

  // Popular Indian locations for quick access
  const popularLocations: Location[] = [
    {
      id: 'mumbai-andheri',
      address: 'Andheri West',
      area: 'Andheri West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400058',
      coordinates: { lat: 19.1356, lng: 72.8262 }
    },
    {
      id: 'delhi-cp',
      address: 'Connaught Place',
      area: 'Connaught Place',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110001',
      coordinates: { lat: 28.6315, lng: 77.2167 }
    },
    {
      id: 'bangalore-koramangala',
      address: 'Koramangala',
      area: 'Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034',
      coordinates: { lat: 12.9279, lng: 77.6271 }
    },
    {
      id: 'chennai-tnagar',
      address: 'T. Nagar',
      area: 'T. Nagar',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600017',
      coordinates: { lat: 13.0418, lng: 80.2341 }
    },
    {
      id: 'pune-koregaon',
      address: 'Koregaon Park',
      area: 'Koregaon Park',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
      coordinates: { lat: 18.5362, lng: 73.8958 }
    },
    {
      id: 'hyderabad-hitech',
      address: 'HITEC City',
      area: 'HITEC City',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081',
      coordinates: { lat: 17.4435, lng: 78.3772 }
    }
  ]

  // Get user's current location using browser geolocation
  const getCurrentLocation = useCallback(() => {
    setIsLoading(true)
    
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser')
      setIsLoading(false)
      return
    }

    // Check if we're on HTTPS (required for geolocation in modern browsers)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      alert('Location access requires HTTPS. Please use a secure connection.')
      setIsLoading(false)
      return
    }

    console.log('Requesting geolocation...')
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        console.log('Got coordinates:', latitude, longitude)
        
        try {
          // Use reverse geocoding to get address from coordinates
          const location = await reverseGeocode(latitude, longitude)
          console.log('Reverse geocoded location:', location)
          setUserLocation(location)
          // Auto-select the current location
          setSelectedLocation(location)
        } catch (error) {
          console.error('Failed to get address from coordinates:', error)
          // Fallback: create location with just coordinates
          const fallbackLocation: Location = {
            id: `current-${Date.now()}`,
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            area: 'Current Location',
            city: 'Unknown',
            state: 'Unknown',
            pincode: '',
            coordinates: { lat: latitude, lng: longitude }
          }
          setUserLocation(fallbackLocation)
          setSelectedLocation(fallbackLocation)
        } finally {
          setIsLoading(false)
        }
      },
      (error) => {
        console.error('Geolocation error:', error)
        let errorMessage = 'Failed to get your location. '
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access in your browser settings and try again.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable. Please check your GPS/WiFi.'
            break
          case error.TIMEOUT:
            errorMessage += 'Location request timed out. Please try again.'
            break
          default:
            errorMessage += 'An unknown error occurred.'
            break
        }
        alert(errorMessage)
        setIsLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // 15 seconds
        maximumAge: 300000 // 5 minutes
      }
    )
  }, [])

  // Reverse geocoding using free OpenStreetMap Nominatim API
  const reverseGeocode = async (lat: number, lng: number): Promise<Location> => {
    const response = await fetch(
      `${LOCATION_SERVICES.nominatim}/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18`
    )
    
    if (!response.ok) {
      throw new Error('Failed to reverse geocode')
    }
    
    const data = await response.json()
    console.log('Reverse geocode response:', data)
    const address = data.address || {}
    
    return {
      id: `current-${Date.now()}`,
      address: data.display_name || 'Current Location',
      area: address.suburb || address.neighbourhood || address.quarter || address.residential || '',
      city: address.city || address.town || address.village || address.municipality || '',
      state: address.state || address.region || '',
      pincode: address.postcode || '',
      coordinates: { lat, lng }
    }
  }

  // Search locations using free OpenStreetMap Nominatim API
  const searchLocations = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSearchResults([])
      return
    }

    setIsLoading(true)
    
    try {
      // Add India bias to search
      const searchUrl = `${LOCATION_SERVICES.nominatim}/search?format=json&q=${encodeURIComponent(query)}&countrycodes=IN&limit=10&addressdetails=1`
      
      const response = await fetch(searchUrl)
      
      if (!response.ok) {
        throw new Error('Search failed')
      }
      
      const data = await response.json()
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const locations: Location[] = data.map((item: any, index: number) => {
        const address = item.address || {}
        return {
          id: `search-${index}`,
          address: item.display_name,
          area: address.suburb || address.neighbourhood || address.quarter || '',
          city: address.city || address.town || address.village || '',
          state: address.state || '',
          pincode: address.postcode || '',
          coordinates: {
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon)
          }
        }
      })
      
      setSearchResults(locations)
    } catch (error) {
      console.error('Location search failed:', error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchLocations(searchQuery)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location)
  }

  const handleConfirmSelection = () => {
    if (selectedLocation) {
      onSelectLocation(selectedLocation)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full max-w-md mx-auto rounded-t-2xl sm:rounded-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Choose Location</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for area, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Current Location Button */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={getCurrentLocation}
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 p-3 border rounded-lg transition-colors disabled:opacity-50 ${
              isLoading 
                ? 'border-gray-300 text-gray-500 bg-gray-50' 
                : 'border-primary text-primary hover:bg-primary-50'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Getting location...
              </>
            ) : (
              <>
                <Navigation className="w-5 h-5" />
                Use current location
              </>
            )}
          </button>
          {isLoading && (
            <p className="text-xs text-gray-500 text-center mt-2">
              Please allow location access in your browser
            </p>
          )}
        </div>

        {/* Location List */}
        <div className="flex-1 overflow-y-auto">
          {/* Current Location Result */}
          {userLocation && (
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Current Location</h3>
              <button
                onClick={() => handleLocationSelect(userLocation)}
                className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                  selectedLocation?.id === userLocation.id
                    ? 'border-primary bg-primary-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{userLocation.area || userLocation.city}</p>
                    <p className="text-sm text-gray-600 truncate">{userLocation.address}</p>
                  </div>
                  {selectedLocation?.id === userLocation.id && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
              </button>
            </div>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Search Results</h3>
              <div className="space-y-2">
                {searchResults.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => handleLocationSelect(location)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                      selectedLocation?.id === location.id
                        ? 'border-primary bg-primary-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{location.area || location.city}</p>
                        <p className="text-sm text-gray-600 truncate">{location.address}</p>
                      </div>
                      {selectedLocation?.id === location.id && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Locations */}
          {!searchQuery && searchResults.length === 0 && (
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Popular Locations</h3>
              <div className="space-y-2">
                {popularLocations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => handleLocationSelect(location)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                      selectedLocation?.id === location.id
                        ? 'border-primary bg-primary-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{location.area}, {location.city}</p>
                        <p className="text-sm text-gray-600">{location.state} • {location.pincode}</p>
                      </div>
                      {selectedLocation?.id === location.id && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Button
            onClick={handleConfirmSelection}
            disabled={!selectedLocation}
            className="w-full"
          >
            Confirm Location
          </Button>
        </div>
      </div>
    </div>
  )
}