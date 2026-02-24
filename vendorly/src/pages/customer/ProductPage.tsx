import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Heart, Share2, ShoppingCart, Plus, Minus, Store, MapPin } from 'lucide-react'
import { Header } from '../../components/layout/Header'
import { BottomNav } from '../../components/layout/BottomNav'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { mockProducts, mockVendors } from '../../utils/mockData'

export const ProductPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [quantity, setQuantity] = useState(1)
  const [isFavorited, setIsFavorited] = useState(false)

  const product = mockProducts.find(p => p.id === id)
  const vendor = product ? mockVendors.find(v => v.id === product.vendorId) : null
  const relatedProducts = mockProducts.filter(p => 
    p.categoryId === product?.categoryId && p.id !== product?.id
  ).slice(0, 4)

  if (!product || !vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Product not found</h1>
          <Button onClick={() => navigate('/home')}>Go Home</Button>
        </div>
      </div>
    )
  }

  const totalPrice = product.price * quantity
  const isInStock = product.stock > 0
  const maxQuantity = Math.min(product.stock, 10)

  const handleAddToCart = () => {
    console.log('Adding to cart:', { productId: product.id, quantity, totalPrice })
    navigate('/cart')
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header
        showBackButton
        onBackClick={() => navigate(-1)}
        title="Product Details"
        rightContent={
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              icon={Heart}
              onClick={() => setIsFavorited(!isFavorited)}
              className={`!p-2 ${isFavorited ? 'text-red-500' : 'text-gray-600'}`}
            />
            <Button variant="ghost" size="sm" icon={Share2} className="!p-2" />
          </div>
        }
      />

      <div className="max-w-md mx-auto">
        {/* Product Image */}
        <div className="bg-white">
          <div className="relative">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-80 object-cover"
            />
            {!isInStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Badge variant="error" size="lg">Out of Stock</Badge>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <Card className="mt-4 mx-4" padding="lg">
          <div className="space-y-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 font-heading mb-2">{product.name}</h1>
              <p className="text-gray-600">{product.description}</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-primary">₹{product.price}</span>
                <span className="text-gray-500 ml-2">per {product.unit}</span>
              </div>
              {isInStock && (
                <Badge variant="success">In Stock ({product.stock})</Badge>
              )}
            </div>
          </div>
        </Card>

        {/* Vendor Info */}
        <Card 
          className="mt-4 mx-4 cursor-pointer hover:shadow-lg transition-shadow" 
          padding="md"
          onClick={() => navigate(`/vendor/${vendor.id}`)}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-xl">
              {vendor.businessType === 'Fruit Shop' ? '🍎' :
               vendor.businessType === 'Vegetable Shop' ? '🥬' :
               vendor.businessType === 'Pharmacy' ? '💊' : '🏪'}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900">{vendor.businessName}</h3>
                {vendor.verified && <Badge variant="success" size="sm">Verified</Badge>}
              </div>
              <p className="text-sm text-gray-600">{vendor.businessType}</p>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <MapPin className="w-3 h-3 mr-1" />
                {vendor.deliveryRadius} km away • Delivery ₹{vendor.deliveryFee}
              </div>
            </div>
            <Store className="w-5 h-5 text-gray-400" />
          </div>
        </Card>

        {/* Add to Cart */}
        {isInStock && (
          <div className="sticky bottom-20 mt-6 mx-4">
            <Card padding="lg" className="shadow-lg">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700">Qty:</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Minus}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="!p-2"
                    />
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Plus}
                      onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                      disabled={quantity >= maxQuantity}
                      className="!p-2"
                    />
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  icon={ShoppingCart}
                  onClick={handleAddToCart}
                  className="flex-1"
                >
                  Add ₹{totalPrice}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-6 mx-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 font-heading mb-4">Related Products</h3>
            <div className="grid grid-cols-2 gap-3">
              {relatedProducts.map(relatedProduct => (
                <Card
                  key={relatedProduct.id}
                  onClick={() => navigate(`/product/${relatedProduct.id}`)}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  padding="none"
                >
                  <img
                    src={relatedProduct.images[0]}
                    alt={relatedProduct.name}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <div className="p-3">
                    <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">
                      {relatedProduct.name}
                    </h4>
                    <span className="text-primary font-semibold">₹{relatedProduct.price}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => navigate('/chat')}
        className="fixed bottom-32 right-4 bg-primary hover:bg-primary-600 text-white p-4 rounded-full shadow-lg z-50 transition-transform duration-300 ease-in-out transform hover:scale-105"
        aria-label="Open chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle">
          <path d="M7.9 20A9 9 0 1 0 4 16.1a2 2 0 0 1 2.1-2.1L12 12l3.9-3.9a2 2 0 0 1 2.1-2.1A9 9 0 1 0 7.9 20z" />
        </svg>
      </button>

      <BottomNav userType="customer" />
    </div>
  )
}