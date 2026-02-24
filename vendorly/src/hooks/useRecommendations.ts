import { useState, useEffect } from 'react'
import { recommendationService } from '../services/recommendationService'
import type { Product as MainProduct } from '../types'
import type { Product as RecommendationProductType } from '../services/recommendationEngine'

export const useRecommendations = (
  userId: string,
  options: {
    limit?: number
    type?: 'personalized' | 'trending' | 'similar'
    productId?: string
    autoRefresh?: boolean
  } = {}
) => {
  const { limit = 10, type = 'personalized', productId, autoRefresh = false } = options
  
  const [recommendations, setRecommendations] = useState<MainProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    loadRecommendations()
    
    if (autoRefresh) {
      const interval = setInterval(loadRecommendations, 5 * 60 * 1000) // Refresh every 5 minutes
      return () => clearInterval(interval)
    }
  }, [userId, type, limit, productId])
  
  const loadRecommendations = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let products: RecommendationProductType[] = []
      
      if (type === 'similar' && productId) {
        products = await recommendationService.getSimilarProducts(productId, limit)
      } else {
        products = await recommendationService.getRecommendations(userId, { limit, type })
      }
      
      // Convert to MainProduct type
      const convertedProducts = products.map(product => ({
        id: product.id,
        vendorId: product.vendor_id || '',
        name: product.name,
        description: '',
        price: product.price,
        categoryId: '',
        images: [''], // Default empty image array
        stock: 0,
        unit: '',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as MainProduct))
      
      setRecommendations(convertedProducts)
    } catch (err) {
      setError(err as Error)
      console.error('Error loading recommendations:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const refresh = () => {
    loadRecommendations()
  }
  
  const trackView = async (productId: string) => {
    await recommendationService.trackProductView(userId, productId)
  }
  
  const trackAddToCart = async (productId: string) => {
    await recommendationService.trackAddToCart(userId, productId)
  }
  
  return {
    recommendations,
    loading,
    error,
    refresh,
    trackView,
    trackAddToCart
  }
}

export const useSearchRecommendations = (query: string, userId?: string) => {
  const [recommendations, setRecommendations] = useState<MainProduct[]>([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    if (!query || query.length < 2) {
      setRecommendations([])
      return
    }
    
    const loadSearchRecommendations = async () => {
      try {
        setLoading(true)
        const products: RecommendationProductType[] = await recommendationService.getSearchRecommendations(query, userId)
        
        // Convert to MainProduct type
        const convertedProducts = products.map(product => ({
          id: product.id,
          vendorId: product.vendor_id || '',
          name: product.name,
          description: '',
          price: product.price,
          categoryId: '',
          images: [''], // Default empty image array
          stock: 0,
          unit: '',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as MainProduct))
        
        setRecommendations(convertedProducts)
      } catch (error) {
        console.error('Error loading search recommendations:', error)
      } finally {
        setLoading(false)
      }
    }
    
    // Debounce search
    const timeout = setTimeout(loadSearchRecommendations, 300)
    return () => clearTimeout(timeout)
  }, [query, userId])
  
  return { recommendations, loading }
}

export const useFrequentlyBoughtTogether = (productId: string) => {
  const [products, setProducts] = useState<MainProduct[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const result: RecommendationProductType[] = await recommendationService.getFrequentlyBoughtTogether(productId)
        
        // Convert to MainProduct type
        const convertedProducts = result.map(product => ({
          id: product.id,
          vendorId: product.vendor_id || '',
          name: product.name,
          description: '',
          price: product.price,
          categoryId: '',
          images: [''], // Default empty image array
          stock: 0,
          unit: '',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as MainProduct))
        
        setProducts(convertedProducts)
      } catch (error) {
        console.error('Error loading frequently bought together:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadProducts()
  }, [productId])
  
  return { products, loading }
}