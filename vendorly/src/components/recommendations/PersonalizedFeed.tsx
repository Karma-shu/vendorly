import React, { useEffect } from 'react'
import { RecommendationWidget } from './RecommendationWidget'
import { Card, Badge } from '../ui'
import { Sparkles, TrendingUp, Users, Heart, Package } from 'lucide-react'

interface PersonalizedFeedProps {
  userId: string
  className?: string
}

interface FeedSection {
  id: string
  title: string
  subtitle: string
  type: 'personalized' | 'similar' | 'trending' | 'frequently_bought' | 'category'
  icon: React.ReactNode
  category?: string
  enabled: boolean
}

export const PersonalizedFeed: React.FC<PersonalizedFeedProps> = ({
  userId,
  className = ''
}) => {
  const userProfile = {
    name: 'User',
    favorite_categories: ['Electronics', 'Fashion'],
    recent_searches: ['wireless earbuds', 'smart watch'],
    loyalty_tier: 'gold'
  }

  const feedSections: FeedSection[] = [
    {
      id: 'for_you',
      title: 'Recommended For You',
      subtitle: 'Based on your browsing history and preferences',
      type: 'personalized',
      icon: <Sparkles className="w-5 h-5 text-purple-600" />,
      enabled: true
    },
    {
      id: 'trending',
      title: 'Trending Now',
      subtitle: 'Popular products in your area',
      type: 'trending',
      icon: <TrendingUp className="w-5 h-5 text-orange-600" />,
      enabled: true
    },
    {
      id: 'electronics',
      title: 'Electronics You May Like',
      subtitle: 'Based on your interest in Electronics',
      type: 'category',
      category: 'Electronics',
      icon: <Package className="w-5 h-5 text-blue-600" />,
      enabled: true
    },
    {
      id: 'fashion',
      title: 'Fashion Picks',
      subtitle: 'Curated for your style',
      type: 'category',
      category: 'Fashion',
      icon: <Heart className="w-5 h-5 text-pink-600" />,
      enabled: true
    },
    {
      id: 'popular',
      title: 'Popular Choices',
      subtitle: 'What others are buying',
      type: 'frequently_bought',
      icon: <Users className="w-5 h-5 text-green-600" />,
      enabled: true
    }
  ]

  useEffect(() => {
    loadUserProfile()
  }, [userId])

  const loadUserProfile = async () => {
    // In real implementation, fetch user profile from API
    // For now, using mock data
  }

  const getLoyaltyBadge = (tier: string) => {
    const tierConfig = {
      bronze: { color: 'bg-orange-100 text-orange-800', text: 'Bronze Member' },
      silver: { color: 'bg-gray-100 text-gray-800', text: 'Silver Member' },
      gold: { color: 'bg-yellow-100 text-yellow-800', text: 'Gold Member' },
      platinum: { color: 'bg-purple-100 text-purple-800', text: 'Platinum Member' }
    }
    const config = tierConfig[tier as keyof typeof tierConfig]
    return <Badge className={config.color}>{config.text}</Badge>
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* User Profile Banner */}
      <Card className="p-6 bg-gradient-to-r from-primary-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {userProfile.name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Welcome back, {userProfile.name}!
              </h2>
              <p className="text-gray-600">
                Discover products tailored just for you
              </p>
            </div>
          </div>
          <div>
            {getLoyaltyBadge(userProfile.loyalty_tier)}
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-white rounded-lg p-3">
            <p className="text-sm text-gray-600">Favorite Categories</p>
            <div className="flex gap-1 mt-1 flex-wrap">
              {userProfile.favorite_categories.map(cat => (
                <Badge key={cat} className="bg-primary-100 text-primary-800 text-xs">
                  {cat}
                </Badge>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-sm text-gray-600">Recent Searches</p>
            <div className="flex gap-1 mt-1 flex-wrap">
              {userProfile.recent_searches.slice(0, 2).map(search => (
                <Badge key={search} className="bg-gray-100 text-gray-800 text-xs">
                  {search}
                </Badge>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-sm text-gray-600">Recommendations</p>
            <p className="text-lg font-bold text-primary-600 mt-1">
              {feedSections.filter(s => s.enabled).length * 6}+ items
            </p>
          </div>
        </div>
      </Card>

      {/* Recommendation Sections */}
      {feedSections
        .filter(section => section.enabled)
        .map((section) => (
          <div key={section.id}>
            <RecommendationWidget
              title={section.title}
              subtitle={section.subtitle}
              type={section.type}
              userId={userId}
              category={section.category}
              limit={8}
            />
          </div>
        ))}

      {/* AI-Powered Insights */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              AI-Powered Shopping Insights
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                🎯 <strong>Best Time to Buy:</strong> Electronics prices drop 15-20% during weekend sales
              </p>
              <p>
                💰 <strong>Save More:</strong> Combine items from the same vendor to get free delivery
              </p>
              <p>
                ⭐ <strong>Quality Tip:</strong> Products with 4.5+ ratings have 95% satisfaction rate
              </p>
              <p>
                📦 <strong>Smart Pick:</strong> 3 items in your wishlist are now on sale!
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}