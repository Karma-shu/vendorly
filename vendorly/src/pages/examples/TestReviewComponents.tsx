import React from 'react'
import { ReviewList, ReviewSummary, ReviewForm } from '../../components/ui/Review'
import { mockReviews } from '../../utils/mockReviewData'
import { Card } from '../../components/ui/Card'
import type { Review } from '../../types'

const TestReviewComponents: React.FC = () => {
  const handleSubmit = async (reviewData: {
    rating: number
    comment: string
    images: File[]
  }) => {
    console.log('Submitting review:', reviewData)
    alert('Review submitted successfully!')
  }

  const handleHelpful = (reviewId: string) => {
    console.log('Marking review as helpful:', reviewId)
  }

  const handleReport = (reviewId: string) => {
    console.log('Reporting review:', reviewId)
  }

  const averageRating = mockReviews.length > 0 
    ? mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length 
    : 0

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Review Components</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Review Form</h2>
              <ReviewForm onSubmit={handleSubmit} />
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Review List</h2>
              <ReviewList 
                reviews={mockReviews} 
                onHelpful={handleHelpful} 
                onReport={handleReport} 
              />
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Review Summary</h2>
              <ReviewSummary 
                reviews={mockReviews} 
                averageRating={averageRating} 
                totalReviews={mockReviews.length} 
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestReviewComponents