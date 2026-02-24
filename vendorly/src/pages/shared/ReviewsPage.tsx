import React, { useState } from 'react'
import { Star, Filter, TrendingUp, Award } from 'lucide-react'
import { ReviewList, ReviewSummary, ReviewForm } from '../../components/ui/Review'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { mockReviews, getReviewStats } from '../../utils/mockReviewData'
import type { Review } from '../../types'

interface ReviewsPageProps {
  vendorId?: string
  productId?: string
  currentUserId?: string
  currentUserType?: 'customer' | 'vendor'
}

const ReviewsPage: React.FC<ReviewsPageProps> = ({
  vendorId,
  productId,
  currentUserId = 'customer1',
  currentUserType = 'customer'
}) => {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filter reviews based on context
  const filteredReviews = reviews.filter(review => {
    if (vendorId && review.vendorId !== vendorId) return false
    if (productId && review.productId !== productId) return false
    return true
  })

  const stats = getReviewStats(filteredReviews)

  const handleSubmitReview = async (reviewData: {
    rating: number
    comment: string
    images: File[]
  }) => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newReview: Review = {
        id: `rev${Date.now()}`,
        orderId: undefined,
        customerId: currentUserId,
        vendorId: vendorId,
        productId: productId,
        customerName: 'You', // In real app, get from user profile
        rating: reviewData.rating,
        comment: reviewData.comment,
        images: reviewData.images.map(file => URL.createObjectURL(file)),
        isVerified: true,
        helpfulCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setReviews(prev => [newReview, ...prev])
      setShowReviewForm(false)
      
      // Show success message
      alert('Review submitted successfully!')
    } catch (error) {
      console.error('Failed to submit review:', error)
      alert('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMarkHelpful = (reviewId: string) => {
    setReviews(prev => 
      prev.map(review => 
        review.id === reviewId 
          ? { ...review, helpfulCount: review.helpfulCount + 1 }
          : review
      )
    )
  }

  const handleReportReview = (reviewId: string) => {
    // In real app, this would send report to backend
    alert('Review reported. Thank you for helping us maintain quality.')
  }

  const getPageTitle = () => {
    if (productId) return 'Product Reviews'
    if (vendorId) return 'Vendor Reviews'
    return 'All Reviews'
  }

  const getPageDescription = () => {
    if (productId) return 'See what customers are saying about this product'
    if (vendorId) return 'Read reviews from customers who have shopped here'
    return 'Browse all customer reviews and ratings'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-heading font-bold text-gray-900">
                  {getPageTitle()}
                </h1>
                <p className="text-gray-600 mt-1">{getPageDescription()}</p>
              </div>
              
              {currentUserType === 'customer' && !showReviewForm && (
                <Button onClick={() => setShowReviewForm(true)}>
                  Write Review
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Review Form */}
            {showReviewForm && currentUserType === 'customer' && (
              <ReviewForm
                vendorId={vendorId}
                productId={productId}
                onSubmit={handleSubmitReview}
                onCancel={() => setShowReviewForm(false)}
                isSubmitting={isSubmitting}
              />
            )}

            {/* Reviews List */}
            <ReviewList
              reviews={filteredReviews}
              onHelpful={handleMarkHelpful}
              onReport={handleReportReview}
              showFilters={true}
              showVendorReply={currentUserType === 'customer'}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Review Summary */}
            <ReviewSummary
              reviews={filteredReviews}
              averageRating={stats.averageRating}
              totalReviews={stats.totalReviews}
            />

            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-heading font-semibold text-gray-900 mb-4">
                Review Insights
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Recent Trend</span>
                  </div>
                  <Badge variant="success">Improving</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-sm text-gray-600">Top Rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">5.0</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Verified Reviews</span>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.round((filteredReviews.filter(r => r.isVerified).length / filteredReviews.length) * 100)}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">With Photos</span>
                  <span className="text-sm font-medium text-gray-900">
                    {filteredReviews.filter(r => r.images && r.images.length > 0).length}
                  </span>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-heading font-semibold text-gray-900 mb-4">
                Recent Activity
              </h3>
              
              <div className="space-y-3">
                {stats.recentReviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold">
                      {review.customerName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {review.customerName}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= review.rating 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewsPage