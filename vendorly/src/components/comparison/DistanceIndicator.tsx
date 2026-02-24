import React from 'react'
import { MapPin } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { formatDistance } from '../../utils/locationUtils'

interface DistanceIndicatorProps {
  distance: number
  className?: string
}

export const DistanceIndicator: React.FC<DistanceIndicatorProps> = ({
  distance,
  className = ''
}) => {
  // Determine badge variant based on distance
  const getVariant = () => {
    if (distance < 2) return 'success' as const
    if (distance < 5) return 'default' as const
    if (distance < 10) return 'warning' as const
    return 'error' as const
  }

  // Determine badge text based on distance
  const getText = () => {
    if (distance < 1) return `<1 km away`
    if (distance < 2) return `Nearby (${formatDistance(distance)})`
    if (distance < 5) return `Close (${formatDistance(distance)})`
    if (distance < 10) return `Moderate (${formatDistance(distance)})`
    return `Far (${formatDistance(distance)})`
  }

  return (
    <Badge variant={getVariant()} className={className}>
      <div className="flex items-center">
        <MapPin className="w-3 h-3 mr-1" />
        <span>{getText()}</span>
      </div>
    </Badge>
  )
}