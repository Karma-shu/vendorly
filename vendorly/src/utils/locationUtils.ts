// Location utilities for distance calculation and vendor proximity services

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of first point
 * @param lng1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lng2 Longitude of second point
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * Find vendors within a specified radius
 * @param userLocation User's current location
 * @param vendors Array of vendors with location data
 * @param radiusKm Radius in kilometers
 * @returns Array of vendors within radius with distance info
 */
export const findNearbyVendors = (
  userLocation: { lat: number; lng: number },
  vendors: any[],
  radiusKm: number
): any[] => {
  return vendors
    .map(vendor => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        vendor.address.latitude,
        vendor.address.longitude
      );
      return { ...vendor, distance };
    })
    .filter(vendor => vendor.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
};

/**
 * Sort vendors by distance from user location
 * @param userLocation User's current location
 * @param vendors Array of vendors
 * @returns Vendors sorted by distance (closest first)
 */
export const sortVendorsByDistance = (
  userLocation: { lat: number; lng: number },
  vendors: any[]
): any[] => {
  return vendors
    .map(vendor => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        vendor.address.latitude,
        vendor.address.longitude
      );
      return { ...vendor, distance };
    })
    .sort((a, b) => a.distance - b.distance);
};

/**
 * Estimate delivery time based on distance and vendor parameters
 * @param distance Distance in kilometers
 * @param vendorParams Vendor-specific delivery parameters
 * @returns Estimated delivery time in minutes
 */
export const estimateDeliveryTime = (
  distance: number,
  vendorParams: {
    basePrepTime: number; // minutes
    deliverySpeed: number; // km/minute
    maxDistance: number; // km
  }
): number => {
  if (distance > vendorParams.maxDistance) {
    return 0; // Not deliverable
  }
  
  const travelTime = distance / vendorParams.deliverySpeed;
  return Math.ceil(vendorParams.basePrepTime + travelTime);
};

/**
 * Format distance for display
 * @param distance Distance in kilometers
 * @returns Formatted distance string
 */
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

/**
 * Check if vendor delivers to user's location
 * @param userLocation User's location
 * @param vendor Vendor with delivery radius
 * @returns Boolean indicating if delivery is possible
 */
export const canDeliverToLocation = (
  userLocation: { lat: number; lng: number },
  vendor: any
): boolean => {
  const distance = calculateDistance(
    userLocation.lat,
    userLocation.lng,
    vendor.address.latitude,
    vendor.address.longitude
  );
  return distance <= vendor.deliveryRadius;
};

/**
 * Get vendors that can deliver to user's location
 * @param userLocation User's location
 * @param vendors Array of vendors
 * @returns Array of deliverable vendors with distance info
 */
export const getDeliverableVendors = (
  userLocation: { lat: number; lng: number },
  vendors: any[]
): any[] => {
  return vendors
    .map(vendor => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        vendor.address.latitude,
        vendor.address.longitude
      );
      return { ...vendor, distance };
    })
    .filter(vendor => vendor.distance <= vendor.deliveryRadius)
    .sort((a, b) => a.distance - b.distance);
};

/**
 * Group products by name/category for comparison
 * @param products Array of products from different vendors
 * @returns Grouped products for comparison
 */
export const groupProductsForComparison = (products: any[]): any[] => {
  const grouped: Record<string, any[]> = {};
  
  products.forEach(product => {
    // Create a key based on product name (case insensitive, trimmed)
    const key = product.name.toLowerCase().trim();
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(product);
  });
  
  // Return groups that have multiple vendors
  return Object.values(grouped)
    .filter(group => group.length > 1)
    .map(group => ({
      productName: group[0].name,
      vendors: group.map(product => ({
        ...product,
        vendorInfo: product.vendor // Assuming vendor info is attached
      }))
    }));
};

/**
 * Find similar products across vendors using fuzzy matching
 * @param products Array of all products
 * @param targetProduct Product to find matches for
 * @param threshold Similarity threshold (0-1)
 * @returns Array of similar products
 */
export const findSimilarProducts = (
  products: any[],
  targetProduct: any,
  threshold: number = 0.7
): any[] => {
  const targetName = targetProduct.name.toLowerCase();
  
  return products.filter(product => {
    if (product.id === targetProduct.id) return false;
    
    const productName = product.name.toLowerCase();
    const categoryMatch = product.categoryId === targetProduct.categoryId;
    
    // Simple string similarity (can be enhanced with more sophisticated algorithms)
    const nameSimilarity = calculateStringSimilarity(targetName, productName);
    
    return categoryMatch && nameSimilarity >= threshold;
  });
};

/**
 * Calculate string similarity using Jaro-Winkler distance
 * @param str1 First string
 * @param str2 Second string
 * @returns Similarity score (0-1)
 */
const calculateStringSimilarity = (str1: string, str2: string): number => {
  // Simple implementation - can be enhanced
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const matchingChars = longer.split('').filter(char => shorter.includes(char)).length;
  return matchingChars / longer.length;
};

/**
 * Get location context for display
 * @param location Location object
 * @returns Formatted location string
 */
export const getLocationContext = (location: any): string => {
  if (!location) return 'Location not set';
  
  return `${location.area || location.city}, ${location.state || 'India'}`;
};

/**
 * Validate coordinates
 * @param lat Latitude
 * @param lng Longitude
 * @returns Boolean indicating if coordinates are valid
 */
export const isValidCoordinates = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};