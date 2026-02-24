import React, { useEffect, useState } from 'react'
import { Card } from '../ui'
import { ChevronLeft, ChevronRight, Star, ShoppingCart, TrendingUp } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  image: string
  rating: number
  category: string
  discount?: number
}

interface RecommendationWidgetProps {
  title: string
  subtitle?: string
  _productIds?: string[]
  type: 'personalized' | 'similar' | 'trending' | 'frequently_bought' | 'category'
  userId?: string
  currentProductId?: string
  category?: string
  limit?: number
  className?: string
}

export const RecommendationWidget: React.FC<RecommendationWidgetProps> = ({
  title,
  subtitle,
  _productIds,
  type,
  userId,
  currentProductId,
  category,
  limit = 6,
  className = ''
}) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [scrollPosition, setScrollPosition] = useState(0)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  const loadRecommendations = React.useCallback(async () => {
    try {
      setLoading(true)
      
      // Mock recommendation data based on type
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Wireless Earbuds Pro',
          price: 2499,
          image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300',
          rating: 4.5,
          category: 'Electronics',
          discount: 20
        },
        {
          id: '2',
          name: 'Smart Watch Series 5',
          price: 4999,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
          rating: 4.7,
          category: 'Electronics'
        },
        {
          id: '3',
          name: 'Premium Leather Wallet',
          price: 899,
          image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=300',
          rating: 4.3,
          category: 'Fashion',
          discount: 15
        },
        {
          id: '4',
          name: 'Portable Bluetooth Speaker',
          price: 1799,
          image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300',
          rating: 4.6,
          category: 'Electronics'
        },
        {
          id: '5',
          name: 'Fitness Tracker Band',
          price: 1299,
          image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=300',
          rating: 4.4,
          category: 'Electronics',
          discount: 10
        },
        {
          id: '6',
          name: 'Wireless Mouse',
          price: 699,
          image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=300',
          rating: 4.2,
          category: 'Electronics'
        }
      ]

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setProducts(mockProducts.slice(0, limit))
    } catch (error) {
      console.error('Error loading recommendations:', error)
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    loadRecommendations()
  }, [type, userId, currentProductId, category, loadRecommendations])

  // Second definition of loadRecommendations removed to prevent duplicate declaration

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return
    
    const scrollAmount = 300
    const newPosition = direction === 'left' 
      ? scrollPosition - scrollAmount 
      : scrollPosition + scrollAmount
    
    scrollContainerRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    })
    setScrollPosition(newPosition)
  }

  const handleAddToCart = (productId: string) => {
    // Track interaction
    console.log('Added to cart:', productId)
    // In real app, add to cart and track for recommendations
  }

  if (loading) {
    return (
      <div className={`py-8 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="flex gap-4 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-64 flex-shrink-0">
                <div className="bg-gray-200 h-64 rounded-lg mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className={`py-8 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          </div>
          {subtitle && (
            <p className="text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            disabled={scrollPosition <= 0}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <Card
            key={product.id}
            className="w-64 flex-shrink-0 cursor-pointer group hover:shadow-lg transition-shadow"
          >
            <div className="relative overflow-hidden rounded-t-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.discount && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                  {product.discount}% OFF
                </div>
              )}
              <button
                onClick={() => handleAddToCart(product.id)}
                className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-50"
              >
                <ShoppingCart className="w-5 h-5 text-primary-600" />
              </button>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                {product.name}
              </h3>
              
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600">{product.rating}</span>
                <span className="text-sm text-gray-400">({Math.floor(Math.random() * 500)})</span>
              </div>
              
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-gray-900">
                  ₹{product.discount 
                    ? Math.floor(product.price * (1 - product.discount / 100))
                    : product.price}
                </span>
                {product.discount && (
                  <span className="text-sm text-gray-500 line-through">
                    ₹{product.price}
                  </span>
                )}
              </div>
              
              <div className="mt-2">
                <span className="text-xs text-gray-500">{product.category}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}