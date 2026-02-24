import React from 'react'
import { ReviewPage } from '../../components/reviews/ReviewPage'
import { mockReviews } from '../../utils/mockReviewData'
import type { Review } from '../../types'

const ReviewPageExample: React.FC = () => {
  // Mock function to handle review submission
  const handleReviewSubmit = async (reviewData: {
    rating: number
    comment: string
    images: File[]
  }) => {
    // In a real app, this would send the data to your backend
    console.log('Submitting review:', reviewData)
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        alert('Review submitted successfully!')
        resolve()
      }, 1000)
    })
  }

  // Mock function to handle helpful votes
  const handleHelpful = (reviewId: string) => {
    console.log('Marking review as helpful:', reviewId)
    alert('Thank you for marking this review as helpful!')
  }

  // Mock function to handle report
  const handleReport = (reviewId: string) => {
    console.log('Reporting review:', reviewId)
    alert('Review reported. Thank you for helping us maintain quality.')
  }

  return (
    <ReviewPage
      entityId="prod1"
      entityType="product"
      entityName="Fresh Organic Tomatoes"
      entityImage="https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&h=300&fit=crop"
      currentUserId="customer1"
      currentUserType="customer"
      reviews={mockReviews}
      onReviewSubmit={handleReviewSubmit}
      onHelpful={handleHelpful}
      onReport={handleReport}
    />
  )
}

export default ReviewPageExample