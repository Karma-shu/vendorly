import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ShoppingBag, Store, Users, TrendingUp } from 'lucide-react'

type UserType = 'customer' | 'vendor'

export const UserTypePage: React.FC = () => {
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleContinue = async () => {
    if (!selectedType) return

    setIsLoading(true)
    try {
      // TODO: Store user type in auth context/state
      console.log('Selected user type:', selectedType)
      
      // Simulate API call to update user profile
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect based on user type
      if (selectedType === 'customer') {
        navigate('/home')
      } else {
        navigate('/vendor-onboarding')
      }
    } catch (error) {
      console.error('User type selection error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="section-padding min-h-screen flex flex-col">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-gray-900 font-heading mb-2">
            Choose Your Role
          </h1>
          <p className="text-gray-600">
            Select how you'd like to use Vendorly
          </p>
        </div>

        {/* User Type Options */}
        <div className="flex-1 space-y-6 py-8">
          {/* Customer Option */}
          <Card
            variant={selectedType === 'customer' ? 'elevated' : 'outlined'}
            padding="lg"
            className={`cursor-pointer transition-all duration-200 ${
              selectedType === 'customer' 
                ? 'border-primary ring-2 ring-primary-200 bg-primary-50' 
                : 'hover:border-gray-300 hover:shadow-md'
            }`}
            onClick={() => setSelectedType('customer')}
          >
            <div className="flex items-start space-x-4">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                selectedType === 'customer' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                <ShoppingBag className="w-8 h-8" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 font-heading mb-2">
                  I'm a Customer
                </h3>
                <p className="text-gray-600 mb-4">
                  Shop from local vendors and get quick delivery of groceries, medicines, and daily essentials.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                    Browse products from nearby vendors
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                    Quick delivery in your area
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                    Support local businesses
                  </div>
                </div>
              </div>
              
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedType === 'customer' 
                  ? 'border-primary bg-primary' 
                  : 'border-gray-300'
              }`}>
                {selectedType === 'customer' && (
                  <div className="w-3 h-3 bg-white rounded-full" />
                )}
              </div>
            </div>
          </Card>

          {/* Vendor Option */}
          <Card
            variant={selectedType === 'vendor' ? 'elevated' : 'outlined'}
            padding="lg"
            className={`cursor-pointer transition-all duration-200 ${
              selectedType === 'vendor' 
                ? 'border-primary ring-2 ring-primary-200 bg-primary-50' 
                : 'hover:border-gray-300 hover:shadow-md'
            }`}
            onClick={() => setSelectedType('vendor')}
          >
            <div className="flex items-start space-x-4">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                selectedType === 'vendor' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                <Store className="w-8 h-8" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 font-heading mb-2">
                  I'm a Vendor
                </h3>
                <p className="text-gray-600 mb-4">
                  Sell your products online and reach more customers in your local area.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                    Manage your inventory digitally
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                    Reach customers in your area
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                    Grow your business online
                  </div>
                </div>
              </div>
              
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedType === 'vendor' 
                  ? 'border-primary bg-primary' 
                  : 'border-gray-300'
              }`}>
                {selectedType === 'vendor' && (
                  <div className="w-3 h-3 bg-white rounded-full" />
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="py-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 font-heading mb-2">
              Why Choose Vendorly?
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">Community First</p>
              <p className="text-xs text-gray-600">Supporting local economy</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">Quick Growth</p>
              <p className="text-xs text-gray-600">Fast, reliable service</p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="pb-8">
          <Button
            onClick={handleContinue}
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            disabled={!selectedType}
          >
            {isLoading ? 'Setting up...' : 'Continue'}
          </Button>
          
          <p className="text-center text-sm text-gray-500 mt-4">
            You can change this later in your profile settings
          </p>
        </div>
      </div>
    </div>
  )
}