import React from 'react'
import { Star, StarHalf } from 'lucide-react'

interface RatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  totalRatings?: number
  className?: string
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = true,
  totalRatings,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }
  
  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }
  
  const renderStars = () => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`star-${i}`}
          className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`}
        />
      )
    }
    
    // Half star
    if (hasHalfStar && fullStars < maxRating) {
      stars.push(
        <StarHalf
          key="star-half"
          className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`}
        />
      )
    }
    
    // Empty stars
    const emptyStars = maxRating - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          className={`${sizeClasses[size]} text-gray-300`}
        />
      )
    }
    
    return stars
  }
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center space-x-0.5">
        {renderStars()}
      </div>
      
      {showValue && (
        <span className={`ml-2 font-medium text-gray-700 ${textSizeClasses[size]}`}>
          {rating.toFixed(1)}
        </span>
      )}
      
      {totalRatings !== undefined && (
        <span className={`ml-1 text-gray-500 ${textSizeClasses[size]}`}>
          ({totalRatings})
        </span>
      )}
    </div>
  )
}