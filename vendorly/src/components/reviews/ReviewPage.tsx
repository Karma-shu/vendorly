import React, { useState } from 'react'
import { Star, TrendingUp, Award } from 'lucide-react'
import { ReviewList, ReviewSummary, ReviewForm } from '../ui/Review'  // This import should work
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import type { Review } from '../../types'

interface ReviewPageProps {
  entityId: string
  entityType: 'product' | 'vendor'
  entityName: string
  entityImage?: string
  _currentUserId?: string
  currentUserType?: 'customer' | 'vendor'
  reviews: Review[]
  onReviewSubmit: (reviewData: {
    rating: number
    comment: string
    images: File[]
  }) => Promise<void>
  onHelpful?: (reviewId: string) => void
  onReport?: (reviewId: string) => void
}

export const ReviewPage: React.FC<ReviewPageProps> = ({
  entityId,
  entityType,
  entityName,
  entityImage,
  _currentUserId = 'customer1',
  currentUserType = 'customer',
  reviews,
  onReviewSubmit,
  onHelpful,
  onReport
}) => {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filter reviews for this specific entity
  const entityReviews = reviews.filter(review => {
    if (entityType === 'product' && review.productId === entityId) return true
    if (entityType === 'vendor' && review.vendorId === entityId) return true
    return false
  })

  // Calculate review statistics
  const totalReviews = entityReviews.length
  const averageRating = totalReviews > 0 
    ? entityReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0

  // ratingDistribution is defined but never used
  /*
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: entityReviews.filter(review => review.rating === rating).length,
    percentage: totalReviews > 0 
      ? (entityReviews.filter(review => review.rating === rating).length / totalReviews) * 100 
      : 0
  }))
  */

  const recentReviews = entityReviews
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  const handleSubmitReview = async (reviewData: {
    rating: number
    comment: string
    images: File[]
  }) => {
    setIsSubmitting(true)
    try {
      await onReviewSubmit(reviewData)
      setShowReviewForm(false)
    } catch (error) {
      console.error('Failed to submit review:', error)
      alert('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMarkHelpful = (reviewId: string) => {
    if (onHelpful) {
      onHelpful(reviewId)
    }
  }

  const handleReportReview = (reviewId: string) => {
    if (onReport) {
      onReport(reviewId)
    } else {
      // Default report action
      alert('Review reported. Thank you for helping us maintain quality.')
    }
  }

  // formatDate is defined but never used
  /*
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  */

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center gap-4">
              {entityImage && (
                <img 
                  src={entityImage} 
                  alt={entityName}
                  className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                />
              )}
              <div>
                <h1 className="text-2xl font-heading font-bold text-gray-900">
                  {entityName} Reviews
                </h1>
                <p className="text-gray-600 mt-1">
                  {entityType === 'product' 
                    ? 'Customer reviews for this product' 
                    : 'Customer reviews for this vendor'}
                </p>
              </div>
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
                onSubmit={handleSubmitReview}
                onCancel={() => setShowReviewForm(false)}
                isSubmitting={isSubmitting}
              />
            )}

            {/* Reviews List */}
            <ReviewList
              reviews={entityReviews}
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
              reviews={entityReviews}
              averageRating={averageRating}
              totalReviews={totalReviews}
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
                    {totalReviews > 0 
                      ? Math.round((entityReviews.filter(r => r.isVerified).length / totalReviews) * 100) 
                      : 0}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">With Photos</span>
                  <span className="text-sm font-medium text-gray-900">
                    {entityReviews.filter(r => r.images && r.images.length > 0).length}
                  </span>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-heading font-semibold text-gray-900 mb-4">
                Recent Reviews
              </h3>
              
              <div className="space-y-3">
                {recentReviews.map((review) => (
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

            {/* Action Button */}
            {currentUserType === 'customer' && !showReviewForm && (
              <Button 
                onClick={() => setShowReviewForm(true)}
                className="w-full"
                size="lg"
              >
                Write a Review
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}