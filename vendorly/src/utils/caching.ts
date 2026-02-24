// Advanced caching utilities for performance optimization
import React from 'react'

// Cache interface
interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
  hits: number
}

// Memory cache implementation
class MemoryCache<T> {
  private cache = new Map<string, CacheEntry<T>>()
  private maxSize: number
  private defaultTTL: number
  private stats = { size: 0, totalHits: 0, avgHits: 0 }

  constructor(maxSize = 100, defaultTTL = 5 * 60 * 1000) { // 5 minutes default
    this.maxSize = maxSize
    this.defaultTTL = defaultTTL
  }

  set(key: string, data: T, ttl?: number): void {
    const now = Date.now()
    const expiresAt = now + (ttl || this.defaultTTL)

    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = Array.from(this.cache.keys())[0]
      if (oldestKey) {
        this.cache.delete(oldestKey)
      }
    }

    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt,
      hits: 0
    })
  }

  get(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    entry.hits++
    return entry.data
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return false
    }
    
    return true
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  getStats() {
    const entries = Array.from(this.cache.values())
    return {
      size: this.cache.size,
      totalHits: entries.reduce((sum, entry) => sum + entry.hits, 0),
      avgHits: entries.length > 0 ? entries.reduce((sum, entry) => sum + entry.hits, 0) / entries.length : 0
    }
  }
}

// LocalStorage cache with TTL
class LocalStorageCache<T> {
  private prefix: string
  private defaultTTL: number

  constructor(prefix = 'vendorly_cache_', defaultTTL = 30 * 60 * 1000) { // 30 minutes default
    this.prefix = prefix
    this.defaultTTL = defaultTTL
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`
  }

  set(key: string, data: T, ttl?: number): void {
    try {
      const now = Date.now()
      const expiresAt = now + (ttl || this.defaultTTL)
      
      const cacheEntry = {
        data,
        timestamp: now,
        expiresAt
      }

      localStorage.setItem(this.getKey(key), JSON.stringify(cacheEntry))
    } catch (error) {
      console.warn('Failed to set localStorage cache:', error)
    }
  }

  get(key: string): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key))
      if (!item) return null

      const entry = JSON.parse(item)
      
      if (Date.now() > entry.expiresAt) {
        this.delete(key)
        return null
      }

      return entry.data
    } catch (error) {
      console.warn('Failed to get localStorage cache:', error)
      return null
    }
  }

  has(key: string): boolean {
    try {
      const item = localStorage.getItem(this.getKey(key))
      if (!item) return false

      const entry = JSON.parse(item)
      
      if (Date.now() > entry.expiresAt) {
        this.delete(key)
        return false
      }

      return true
    } catch {
      return false
    }
  }

  delete(key: string): void {
    try {
      localStorage.removeItem(this.getKey(key))
    } catch (error) {
      console.warn('Failed to delete localStorage cache:', error)
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix))
      keys.forEach(key => localStorage.removeItem(key))
    } catch (error) {
      console.warn('Failed to clear localStorage cache:', error)
    }
  }
}

// Global cache instances
export const memoryCache = new MemoryCache()
export const localStorageCache = new LocalStorageCache()

// React hook for cached API calls
export const useCachedFetch = <T,>(
  key: string,
  fetchFn: () => Promise<T>,
  options: {
    ttl?: number
    useMemory?: boolean
    useLocalStorage?: boolean
    staleWhileRevalidate?: boolean
  } = {}
) => {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes
    useMemory = true,
    useLocalStorage = true,
    staleWhileRevalidate = true
  } = options

  const [data, setData] = React.useState<T | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    let mounted = true

    const loadData = async () => {
      try {
        // Try memory cache first
        if (useMemory && memoryCache.has(key)) {
          const cachedData = memoryCache.get(key)
          if (cachedData && mounted) {
            setData(cachedData as T)
            setLoading(false)
            return cachedData
          }
        }

        // Try localStorage cache
        if (useLocalStorage && localStorageCache.has(key)) {
          const cachedData = localStorageCache.get(key)
          if (cachedData && mounted) {
            setData(cachedData as T)
            setLoading(false)
            
            // If stale-while-revalidate, continue to fetch fresh data
            if (!staleWhileRevalidate) {
              return cachedData
            }
          }
        }

        // Fetch fresh data
        const freshData = await fetchFn()
        
        if (mounted) {
          setData(freshData)
          setLoading(false)
          setError(null)

          // Cache the fresh data
          if (useMemory) {
            memoryCache.set(key, freshData, ttl)
          }
          if (useLocalStorage) {
            localStorageCache.set(key, freshData, ttl)
          }
        }

        return freshData
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'))
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      mounted = false
    }
  }, [key, ttl, useMemory, useLocalStorage, staleWhileRevalidate, fetchFn])

  const refetch = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const freshData = await fetchFn()
      setData(freshData)
      setLoading(false)

      // Update caches
      if (useMemory) {
        memoryCache.set(key, freshData, ttl)
      }
      if (useLocalStorage) {
        localStorageCache.set(key, freshData, ttl)
      }

      return freshData
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
      setLoading(false)
      throw err
    }
  }, [key, fetchFn, ttl, useMemory, useLocalStorage])

  const invalidate = React.useCallback(() => {
    if (useMemory) {
      memoryCache.delete(key)
    }
    if (useLocalStorage) {
      localStorageCache.delete(key)
    }
  }, [key, useMemory, useLocalStorage])

  return {
    data,
    loading,
    error,
    refetch,
    invalidate
  }
}

// React hook for memoized computations with cache
export const useMemoizedComputation = <T, Args extends readonly unknown[]>(
  computeFn: (...args: Args) => T,
  deps: Args,
  ttl = 60 * 1000 // 1 minute
) => {
  const cacheKey = React.useMemo(() => {
    return `computed_${JSON.stringify(deps)}`
  }, [deps])

  const [result, setResult] = React.useState<T | null>(() => {
    const cached = memoryCache.get(cacheKey)
    return cached as T | null
  })

  React.useEffect(() => {
    if (memoryCache.has(cacheKey)) {
      const cached = memoryCache.get(cacheKey)
      if (cached !== null) {
        setResult(cached as T)
        return
      }
    }

    const computed = computeFn(...deps)
    memoryCache.set(cacheKey, computed, ttl)
    setResult(computed)
  }, [cacheKey, computeFn, deps, ttl])

  return result
}

// Service Worker cache utilities
export const swCache = {
  // Cache API requests
  cacheRequest: async (request: Request, response: Response, cacheName = 'api-cache') => {
    try {
      const cache = await caches.open(cacheName)
      await cache.put(request, response.clone())
    } catch (error) {
      console.warn('Failed to cache request:', error)
    }
  },

  // Get cached response
  getCachedResponse: async (request: Request, cacheName = 'api-cache'): Promise<Response | null> => {
    try {
      const cache = await caches.open(cacheName)
      const matched = await cache.match(request)
      return matched || null
    } catch (error) {
      console.warn('Failed to get cached response:', error)
      return null
    }
  },

  // Clear specific cache
  clearCache: async (cacheName: string) => {
    try {
      await caches.delete(cacheName)
    } catch (error) {
      console.warn('Failed to clear cache:', error)
    }
  },

  // Clear all caches
  clearAllCaches: async () => {
    try {
      const cacheNames = await caches.keys()
      await Promise.all(cacheNames.map(name => caches.delete(name)))
    } catch (error) {
      console.warn('Failed to clear all caches:', error)
    }
  }
}

// Cache invalidation strategies
export const cacheInvalidation = {
  // Invalidate by pattern
  invalidateByPattern: (pattern: string) => {
    // Clear memory cache entries matching pattern
    const memoryKeys = Array.from(memoryCache['cache'].keys())
    memoryKeys.forEach(key => {
      if (key.includes(pattern)) {
        memoryCache.delete(key)
      }
    })

    // Clear localStorage entries matching pattern
    try {
      const localKeys = Object.keys(localStorage).filter(key => 
        key.startsWith(localStorageCache['prefix']) && key.includes(pattern)
      )
      localKeys.forEach(key => localStorage.removeItem(key))
    } catch (error) {
      console.warn('Failed to invalidate localStorage pattern:', error)
    }
  },

  // Invalidate by tags
  invalidateByTags: (tags: string[]) => {
    tags.forEach(tag => {
      cacheInvalidation.invalidateByPattern(tag)
    })
  },

  // Time-based invalidation
  scheduleInvalidation: (key: string, delay: number) => {
    setTimeout(() => {
      memoryCache.delete(key)
      localStorageCache.delete(key)
    }, delay)
  }
}

// Cache warming utilities
export const cacheWarming = {
  // Warm cache with critical data
  warmCriticalData: async (criticalEndpoints: Array<{ key: string; fetchFn: () => Promise<unknown> }>) => {
    const promises = criticalEndpoints.map(async ({ key, fetchFn }) => {
      try {
        const data = await fetchFn()
        memoryCache.set(key, data)
        localStorageCache.set(key, data)
      } catch (error) {
        console.warn(`Failed to warm cache for ${key}:`, error)
      }
    })

    await Promise.allSettled(promises)
  },

  // Predictive caching based on user behavior
  predictiveCache: async (userRoute: string, nextLikelyRoutes: string[]) => {
    // This would typically analyze user behavior patterns
    // and preload data for likely next actions
    console.log('Predictive caching for:', userRoute, nextLikelyRoutes)
  }
}