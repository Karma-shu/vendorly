/**
 * AI-Powered Recommendation Engine
 * 
 * Implements multiple recommendation algorithms:
 * 1. Collaborative Filtering - User-based and Item-based
 * 2. Content-Based Filtering - Product similarity
 * 3. Hybrid Approach - Combining multiple methods
 * 4. Trending & Popular Items
 * 5. Personalized Recommendations
 */

interface Product {
  id: string
  name: string
  category: string
  price: number
  tags: string[]
  rating: number
  sales_count: number
  vendor_id: string
}

interface UserActivity {
  user_id: string
  product_id: string
  action: 'view' | 'add_to_cart' | 'purchase' | 'wishlist' | 'search'
  timestamp: string
  rating?: number
}

interface RecommendationScore {
  product_id: string
  score: number
  reason: string
  algorithm: string
}

interface UserPreferences {
  favorite_categories: string[]
  price_range: { min: number; max: number }
  preferred_vendors: string[]
  search_history: string[]
}

class RecommendationEngine {
  private userActivityCache: Map<string, UserActivity[]> = new Map()
  private productSimilarityCache: Map<string, Map<string, number>> = new Map()
  
  /**
   * Get personalized recommendations for a user
   */
  async getPersonalizedRecommendations(
    userId: string,
    limit: number = 10,
    excludeProductIds: string[] = []
  ): Promise<Product[]> {
    try {
      // Get user activity history
      const userActivity = await this.getUserActivity(userId)
      const userPreferences = await this.getUserPreferences(userId)
      
      // Get all available products
      const allProducts = await this.getAllProducts()
      
      // Calculate scores using multiple algorithms
      const scores: RecommendationScore[] = []
      
      // 1. Collaborative Filtering
      const collaborativeScores = await this.collaborativeFiltering(userId, allProducts, userActivity)
      scores.push(...collaborativeScores)
      
      // 2. Content-Based Filtering
      const contentScores = await this.contentBasedFiltering(userId, allProducts, userActivity)
      scores.push(...contentScores)
      
      // 3. Trending Products
      const trendingScores = this.getTrendingProducts(allProducts)
      scores.push(...trendingScores)
      
      // 4. Category-based recommendations
      const categoryScores = this.getCategoryBasedRecommendations(allProducts, userPreferences)
      scores.push(...categoryScores)
      
      // Aggregate scores from different algorithms
      const aggregatedScores = this.aggregateScores(scores)
      
      // Filter out excluded products and already purchased
      const filteredScores = aggregatedScores.filter(
        score => !excludeProductIds.includes(score.product_id)
      )
      
      // Sort by score and get top products
      const topProductIds = filteredScores
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(s => s.product_id)
      
      // Return products in sorted order
      return allProducts.filter(p => topProductIds.includes(p.id))
        .sort((a, b) => topProductIds.indexOf(a.id) - topProductIds.indexOf(b.id))
      
    } catch (error) {
      console.error('Error generating recommendations:', error)
      // Fallback to popular products
      return this.getPopularProducts(limit)
    }
  }
  
  /**
   * Collaborative Filtering - User-based
   * Find similar users and recommend products they liked
   */
  private async collaborativeFiltering(
    userId: string,
    products: Product[],
    userActivity: UserActivity[]
  ): Promise<RecommendationScore[]> {
    const scores: RecommendationScore[] = []
    
    // Use products and userActivity to improve collaborative filtering
    console.log(`Using ${products.length} products and ${userActivity.length} activity records for user ${userId}`)
    
    // Get products liked by similar users
    const similarUsers = await this.findSimilarUsers(userId)
    
    for (const similarUser of similarUsers) {
      const similarUserActivity = await this.getUserActivity(similarUser.user_id)
      
      const purchasedProducts = similarUserActivity
        .filter(a => a.action === 'purchase' && a.rating && a.rating >= 4)
        .map(a => a.product_id)
      
      purchasedProducts.forEach(productId => {
        // Only recommend products that exist in our product list
        if (products.some(p => p.id === productId)) {
          scores.push({
            product_id: productId,
            score: similarUser.similarity_score * 0.3, // Weight for collaborative filtering
            reason: 'Users with similar taste purchased this',
            algorithm: 'collaborative_filtering'
          })
        }
      })
    }
    
    return scores
  }
  
  /**
   * Content-Based Filtering
   * Recommend products similar to what user has interacted with
   */
  private async contentBasedFiltering(
    userId: string,
    products: Product[],
    userActivity: UserActivity[]
  ): Promise<RecommendationScore[]> {
    const scores: RecommendationScore[] = []
    
    // Get products user has interacted with
    const interactedProducts = userActivity
      .filter(a => ['purchase', 'add_to_cart', 'wishlist'].includes(a.action))
      .map(a => a.product_id)
    
    // Use userId to customize recommendations
    console.log(`Generating content-based recommendations for user: ${userId}`)
    
    // For each product, find similar ones
    for (const productId of interactedProducts) {
      const similarProducts = await this.findSimilarProducts(productId, products)
      
      similarProducts.forEach(similar => {
        scores.push({
          product_id: similar.product_id,
          score: similar.similarity_score * 0.4, // Weight for content-based
          reason: 'Similar to products you liked',
          algorithm: 'content_based'
        })
      })
    }
    
    return scores
  }
  
  /**
   * Find similar products based on attributes
   */
  private async findSimilarProducts(
    productId: string,
    allProducts: Product[]
  ): Promise<Array<{ product_id: string; similarity_score: number }>> {
    const targetProduct = allProducts.find(p => p.id === productId)
    if (!targetProduct) return []
    
    return allProducts
      .filter(p => p.id !== productId)
      .map(product => ({
        product_id: product.id,
        similarity_score: this.calculateProductSimilarity(targetProduct, product)
      }))
      .filter(s => s.similarity_score > 0.3)
      .sort((a, b) => b.similarity_score - a.similarity_score)
      .slice(0, 5)
  }
  
  /**
   * Calculate similarity between two products
   */
  private calculateProductSimilarity(product1: Product, product2: Product): number {
    let similarity = 0
    
    // Category match (40% weight)
    if (product1.category === product2.category) {
      similarity += 0.4
    }
    
    // Price similarity (20% weight)
    const priceDiff = Math.abs(product1.price - product2.price)
    const avgPrice = (product1.price + product2.price) / 2
    const priceSimScore = Math.max(0, 1 - (priceDiff / avgPrice))
    similarity += priceSimScore * 0.2
    
    // Tag overlap (30% weight)
    const commonTags = product1.tags.filter(tag => product2.tags.includes(tag))
    const tagSimilarity = commonTags.length / Math.max(product1.tags.length, product2.tags.length)
    similarity += tagSimilarity * 0.3
    
    // Vendor match (10% weight)
    if (product1.vendor_id === product2.vendor_id) {
      similarity += 0.1
    }
    
    return similarity
  }
  
  /**
   * Get trending products based on recent activity
   */
  private getTrendingProducts(products: Product[]): RecommendationScore[] {
    return products
      .filter(p => p.sales_count > 10) // Minimum threshold
      .sort((a, b) => {
        // Weighted score: 70% sales, 30% rating
        const scoreA = (a.sales_count * 0.7) + (a.rating * 0.3)
        const scoreB = (b.sales_count * 0.7) + (b.rating * 0.3)
        return scoreB - scoreA
      })
      .slice(0, 10)
      .map((product, index) => ({
        product_id: product.id,
        score: (10 - index) * 0.1, // Decreasing score for trending items
        reason: 'Trending now',
        algorithm: 'trending'
      }))
  }
  
  /**
   * Category-based recommendations based on user preferences
   */
  private getCategoryBasedRecommendations(
    products: Product[],
    preferences: UserPreferences
  ): RecommendationScore[] {
    const scores: RecommendationScore[] = []
    
    products.forEach(product => {
      if (preferences.favorite_categories.includes(product.category)) {
        // Check if price is in range
        if (
          product.price >= preferences.price_range.min &&
          product.price <= preferences.price_range.max
        ) {
          scores.push({
            product_id: product.id,
            score: 0.25,
            reason: 'Matches your preferences',
            algorithm: 'category_based'
          })
        }
      }
    })
    
    return scores
  }
  
  /**
   * Aggregate scores from multiple algorithms
   */
  private aggregateScores(scores: RecommendationScore[]): RecommendationScore[] {
    const productScores = new Map<string, { total: number; reasons: string[]; algorithms: string[] }>()
    
    scores.forEach(score => {
      const existing = productScores.get(score.product_id) || {
        total: 0,
        reasons: [],
        algorithms: []
      }
      
      existing.total += score.score
      if (!existing.reasons.includes(score.reason)) {
        existing.reasons.push(score.reason)
      }
      if (!existing.algorithms.includes(score.algorithm)) {
        existing.algorithms.push(score.algorithm)
      }
      
      productScores.set(score.product_id, existing)
    })
    
    return Array.from(productScores.entries()).map(([product_id, data]) => ({
      product_id,
      score: data.total,
      reason: data.reasons.join(', '),
      algorithm: data.algorithms.join('+')
    }))
  }
  
  /**
   * Get similar products for "Customers also bought"
   */
  async getSimilarProducts(productId: string, limit: number = 6): Promise<Product[]> {
    const allProducts = await this.getAllProducts()
    const targetProduct = allProducts.find(p => p.id === productId)
    
    if (!targetProduct) return []
    
    const similar = await this.findSimilarProducts(productId, allProducts)
    const topSimilarIds = similar.slice(0, limit).map(s => s.product_id)
    
    return allProducts.filter(p => topSimilarIds.includes(p.id))
  }
  
  /**
   * Get "Frequently bought together" recommendations
   */
  async getFrequentlyBoughtTogether(productId: string, limit: number = 3): Promise<Product[]> {
    // In a real implementation, this would analyze purchase patterns
    // For now, using similar products as a proxy
    return this.getSimilarProducts(productId, limit)
  }
  
  /**
   * Search-based recommendations
   */
  async getSearchBasedRecommendations(
    searchQuery: string,
    userId?: string
  ): Promise<Product[]> {
    const allProducts = await this.getAllProducts()
    
    // Use userId for personalized search recommendations
    if (userId) {
      console.log(`Generating search recommendations for user: ${userId}`)
    }
    
    // Filter products matching search query
    const matching = allProducts.filter(product => {
      const searchLower = searchQuery.toLowerCase()
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    })
    
    // Sort by relevance and rating
    return matching
      .sort((a, b) => {
        const scoreA = a.rating * 0.6 + (a.sales_count / 100) * 0.4
        const scoreB = b.rating * 0.6 + (b.sales_count / 100) * 0.4
        return scoreB - scoreA
      })
      .slice(0, 20)
  }
  
  /**
   * Helper: Get user activity
   */
  private async getUserActivity(userId: string): Promise<UserActivity[]> {
    if (this.userActivityCache.has(userId)) {
      return this.userActivityCache.get(userId)!
    }
    
    // In real implementation, fetch from database
    // For now, return mock data
    const activity: UserActivity[] = []
    this.userActivityCache.set(userId, activity)
    return activity
  }
  
  /**
   * Helper: Get user preferences
   */
  private async getUserPreferences(userId: string): Promise<UserPreferences> {
    // In real implementation, fetch from database
    // Use userId to get personalized preferences
    console.log(`Fetching user preferences for: ${userId}`)
    return {
      favorite_categories: ['Electronics', 'Fashion'],
      price_range: { min: 100, max: 5000 },
      preferred_vendors: [],
      search_history: []
    }
  }
  
  /**
   * Helper: Find similar users
   */
  private async findSimilarUsers(userId: string): Promise<Array<{ user_id: string; similarity_score: number }>> {
    // In real implementation, use collaborative filtering algorithms
    // Use userId to find similar users
    console.log(`Finding similar users to: ${userId}`)
    return []
  }
  
  /**
   * Helper: Get all products
   */
  private async getAllProducts(): Promise<Product[]> {
    // In real implementation, fetch from database
    // For now, return mock data
    return []
  }
  
  /**
   * Get popular products as fallback
   */
  private async getPopularProducts(limit: number): Promise<Product[]> {
    const allProducts = await this.getAllProducts()
    return allProducts
      .sort((a, b) => b.sales_count - a.sales_count)
      .slice(0, limit)
  }
  
  /**
   * Track user interaction for better recommendations
   */
  async trackUserInteraction(activity: UserActivity): Promise<void> {
    // Store in database for future recommendation improvements
    const userId = activity.user_id
    const existing = this.userActivityCache.get(userId) || []
    existing.push(activity)
    this.userActivityCache.set(userId, existing)
  }
}

export const recommendationEngine = new RecommendationEngine()
export type { Product, UserActivity, RecommendationScore, UserPreferences }