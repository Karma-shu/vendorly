import React from 'react'
import ReviewsPage from '../shared/ReviewsPage'

const TestOriginalReviewsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ReviewsPage 
        currentUserId="customer1" 
        currentUserType="customer" 
      />
    </div>
  )
}

export default TestOriginalReviewsPage