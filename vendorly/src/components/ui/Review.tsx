import React, { useState } from 'react'
import { Star, ThumbsUp, MessageSquare, Camera, Filter, Check, X } from 'lucide-react'
import { Button } from './Button'
import { Card } from './Card'
import { Badge } from './Badge'
import type { Review } from '../../types'



interface ReviewListProps {
  reviews: Review[]
  onHelpful?: (reviewId: string) => void
  onReport?: (reviewId: string) => void
  showFilters?: boolean
  showVendorReply?: boolean
}

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  onHelpful,
  onReport,
  showFilters = true,
  showVendorReply = true
}) => {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating_high' | 'rating_low' | 'helpful'>('newest')
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [showImagesOnly, setShowImagesOnly] = useState(false)

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter(review => {
      if (filterRating && review.rating !== filterRating) return false
      if (showImagesOnly && (!review.images || review.images.length === 0)) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'rating_high':
          return b.rating - a.rating
        case 'rating_low':
          return a.rating - b.rating
        case 'helpful':
          return b.helpfulCount - a.helpfulCount
        default:
          return 0
      }
    })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const starSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      {showFilters && (
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter & Sort:</span>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'rating_high' | 'rating_low' | 'helpful')}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rating_high">Highest Rating</option>
              <option value="rating_low">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rating:</span>
              <div className="flex gap-1">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                    className={`px-2 py-1 rounded text-sm ${
                      filterRating === rating
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {rating}★
                  </button>
                ))}
                {filterRating && (
                  <button
                    onClick={() => setFilterRating(null)}
                    className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showImagesOnly}
                onChange={(e) => setShowImagesOnly(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              With Photos Only
            </label>
          </div>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
            <p className="text-gray-600">
              {reviews.length === 0 
                ? 'Be the first to leave a review!' 
                : 'Try adjusting your filters to see more reviews.'
              }
            </p>
          </Card>
        ) : (
          filteredReviews.map((review) => (
            <Card key={review.id} className="p-6">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                    {review.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">{review.customerName}</h4>
                      {review.isVerified && (
                        <Badge variant="success" size="sm">
                          <Check className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="mb-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {review.images.map((image, index) => (
                      <div key={index} className="flex-shrink-0">
                        <img
                          src={image}
                          alt={`Review image ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vendor Reply */}
              {showVendorReply && review.vendorReply && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-primary">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-900">Vendor Response</span>
                    <span className="text-xs text-gray-500">
                      {formatDate(review.vendorReply.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{review.vendorReply.message}</p>
                </div>
              )}

              {/* Review Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  {onHelpful && (
                    <button
                      onClick={() => onHelpful(review.id)}
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Helpful ({review.helpfulCount})
                    </button>
                  )}
                </div>
                
                {onReport && (
                  <button
                    onClick={() => onReport(review.id)}
                    className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Report
                  </button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

// Review Form Component for creating new reviews
interface ReviewFormProps {
  orderId?: string
  vendorId?: string
  productId?: string
  onSubmit: (reviewData: {
    rating: number
    comment: string
    images: File[]
  }) => void
  onCancel?: () => void
  isSubmitting?: boolean
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  orderId,
  vendorId,
  productId,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + images.length > 5) {
      alert('You can upload maximum 5 images')
      return
    }

    setImages(prev => [...prev, ...files])

    // Create preview URLs
    files.forEach(file => {
      const url = URL.createObjectURL(file)
      setImagePreviewUrls(prev => [...prev, url])
    })
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviewUrls(prev => {
      const newUrls = prev.filter((_, i) => i !== index)
      // Revoke the URL to free memory
      URL.revokeObjectURL(prev[index])
      return newUrls
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      alert('Please select a rating')
      return
    }
    if (!comment.trim()) {
      alert('Please write a review comment')
      return
    }

    onSubmit({
      rating,
      comment: comment.trim(),
      images
    })
  }

  const renderStarInput = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="p-1 transition-colors"
          >
            <Star
              className={`w-8 h-8 ${
                star <= (hoveredRating || rating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300 hover:text-yellow-200'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {rating > 0 && (
            <>
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </>
          )}
        </span>
      </div>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-heading font-semibold text-gray-900 mb-6">Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating *
          </label>
          {renderStarInput()}
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with others..."
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {comment.length}/500 characters
          </p>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Photos (Optional)
          </label>
          
          <div className="flex items-start gap-4">
            <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
              <Camera className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-500 mt-1">Add</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={images.length >= 5}
              />
            </label>
            
            <div className="flex gap-2 overflow-x-auto">
              {imagePreviewUrls.map((url, index) => (
                <div key={index} className="relative flex-shrink-0">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <p className="text-xs text-gray-500 mt-1">
            Upload up to 5 photos (JPG, PNG, max 5MB each)
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}

// Review Summary Component
interface ReviewSummaryProps {
  reviews: Review[]
  averageRating: number
  totalReviews: number
}

export const ReviewSummary: React.FC<ReviewSummaryProps> = ({
  reviews,
  averageRating,
  totalReviews
}) => {
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(review => review.rating === rating).length
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
    return { rating, count, percentage }
  })

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Overall Rating */}
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {averageRating.toFixed(1)}
          </div>
          {renderStars(Math.round(averageRating))}
          <p className="text-sm text-gray-600 mt-2">
            Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 w-8">
                {rating}★
              </span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8 text-right">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}