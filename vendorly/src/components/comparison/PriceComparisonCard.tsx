import React from 'react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Rating } from '../ui/Rating'
import { MapPin, Star, Clock } from 'lucide-react'
import { formatDistance } from '../../utils/locationUtils'
import type { ProductWithVendorInfo } from '../../types'

interface PriceComparisonCardProps {
  product: ProductWithVendorInfo
  isBestPrice?: boolean
  onClick?: () => void
}

export const PriceComparisonCard: React.FC<PriceComparisonCardProps> = ({
  product,
  isBestPrice = false,
  onClick
}) => {
  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-shadow border ${isBestPrice ? 'border-primary bg-primary-50' : 'border-gray-200'}`} 
      padding="md"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">
              {product.vendorInfo?.businessName || 'Vendor'}
            </h4>
            {isBestPrice && (
              <Badge variant="success" size="sm">
                Best Price
              </Badge>
            )}
          </div>
          
          <div className="flex items-center mt-1 space-x-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Star className="w-4 h-4 mr-1 text-yellow-500" />
              <span>{product.vendorInfo?.rating}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{formatDistance(product.vendorInfo?.distance || 0)}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              <span>~{product.vendorInfo?.estimatedDeliveryTime} min</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="font-semibold text-lg text-primary">
            ₹{product.price}
          </div>
          <div className="text-xs text-gray-500">
            + ₹{product.vendorInfo?.deliveryFee} delivery
          </div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div className="flex-1 min-w-0">
            <h5 className="font-medium text-gray-900 truncate">{product.name}</h5>
            <p className="text-xs text-gray-500">{product.unit}</p>
            <Rating rating={product.vendorInfo?.rating || 0} showValue={false} size="sm" />
          </div>
        </div>
      </div>
    </Card>
  )
}