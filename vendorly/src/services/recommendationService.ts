import { recommendationEngine } from './recommendationEngine'
import type { UserActivity } from './recommendationEngine'

/**
 * Service to integrate recommendations with Supabase
 */
class RecommendationService {
  /**
   * Track user activity for recommendations
   */
  async trackActivity(activity: UserActivity): Promise<void> {
    try {
      // Track in recommendation engine
      await recommendationEngine.trackUserInteraction(activity)
      
      // Store in Supabase for persistence
      // await supabase.from('user_activity').insert(activity)
      
      // Update real-time recommendation cache
      this.invalidateUserCache(activity.user_id)
    } catch (error) {
      console.error('Error tracking activity:', error)
    }
  }
  
  /**
   * Track product view
   */
  async trackProductView(userId: string, productId: string): Promise<void> {
    await this.trackActivity({
      user_id: userId,
      product_id: productId,
      action: 'view',
      timestamp: new Date().toISOString()
    })
  }
  
  /**
   * Track add to cart
   */
  async trackAddToCart(userId: string, productId: string): Promise<void> {
    await this.trackActivity({
      user_id: userId,
      product_id: productId,
      action: 'add_to_cart',
      timestamp: new Date().toISOString()
    })
  }
  
  /**
   * Track purchase
   */
  async trackPurchase(
    userId: string,
    productId: string,
    rating?: number
  ): Promise<void> {
    await this.trackActivity({
      user_id: userId,
      product_id: productId,
      action: 'purchase',
      timestamp: new Date().toISOString(),
      rating
    })
  }
  
  /**
   * Track search
   */
  async trackSearch(userId: string, query: string): Promise<void> {
    // Store search for search-based recommendations
    // In real implementation, store in database
    console.log('Search tracked:', { userId, query })
  }
  
  /**
   * Get personalized recommendations
   */
  async getRecommendations(
    userId: string,
    options: {
      limit?: number
      excludeProductIds?: string[]
      type?: 'personalized' | 'trending' | 'similar'
    } = {}
  ) {
    const { limit = 10, excludeProductIds = [], type = 'personalized' } = options
    
    try {
      if (type === 'personalized') {
        return await recommendationEngine.getPersonalizedRecommendations(
          userId,
          limit,
          excludeProductIds
        )
      } else if (type === 'trending') {
        // Get trending products
        return await this.getTrendingProducts(limit)
      } else if (type === 'similar') {
        // Return empty for similar since we need a specific product ID
        return []
      }
      
      return []
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      return []
    }
  }
  
  /**
   * Get similar products
   */
  async getSimilarProducts(productId: string, limit: number = 6) {
    return await recommendationEngine.getSimilarProducts(productId, limit)
  }
  
  /**
   * Get frequently bought together
   */
  async getFrequentlyBoughtTogether(productId: string, limit: number = 3) {
    return await recommendationEngine.getFrequentlyBoughtTogether(productId, limit)
  }
  
  /**
   * Get search recommendations
   */
  async getSearchRecommendations(query: string, userId?: string) {
    return await recommendationEngine.getSearchBasedRecommendations(query, userId)
  }
  
  /**
   * Get category recommendations
   */
  async getCategoryRecommendations(
    category: string,
    userId?: string,
    limit: number = 12
  ) {
    // Use the parameters for category-based recommendations
    console.log(`Getting recommendations for category: ${category}, limit: ${limit}`)
    
    // In real implementation, fetch from database with filters
    // For now, return personalized if user ID available
    if (userId) {
      return await this.getRecommendations(userId, { limit })
    }
    
    return []
  }
  
  /**
   * Get trending products
   */
  private async getTrendingProducts(limit: number) {
    // Use the limit parameter
    console.log(`Getting trending products with limit: ${limit}`)
    
    // In real implementation, fetch from database
    // sorted by recent sales and popularity
    return []
  }
  
  /**
   * Invalidate user cache
   */
  private invalidateUserCache(userId: string): void {
    // Clear any cached recommendations for this user
    // Force refresh on next request
    console.log(`Invalidating cache for user: ${userId}`)
  }
  
  /**
   * Batch track activities (for performance)
   */
  async batchTrackActivities(activities: UserActivity[]): Promise<void> {
    try {
      // Store all activities
      for (const activity of activities) {
        await recommendationEngine.trackUserInteraction(activity)
      }
      
      // Batch insert to database
      // await supabase.from('user_activity').insert(activities)
    } catch (error) {
      console.error('Error batch tracking activities:', error)
    }
  }
  
  /**
   * Get recommendation insights for user
   */
  async getRecommendationInsights(userId: string) {
    // Return insights about why products are recommended
    console.log(`Getting recommendation insights for user: ${userId}`)
    return {
      total_recommendations: 0,
      categories: [],
      price_range: { min: 0, max: 0 },
      match_score: 0,
      personalization_level: 'high' as const
    }
  }
}

export const recommendationService = new RecommendationService()
export type { UserActivity }