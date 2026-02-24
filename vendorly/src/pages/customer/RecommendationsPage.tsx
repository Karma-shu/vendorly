import React from 'react'
import { PersonalizedFeed } from '../../components/recommendations/PersonalizedFeed'

export const RecommendationsPage: React.FC = () => {
  // In real app, get user ID from auth context
  const userId = 'current-user-id'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PersonalizedFeed userId={userId} />
      </div>
    </div>
  )
}