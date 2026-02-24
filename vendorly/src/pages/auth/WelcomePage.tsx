import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { ShoppingBag, MapPin, Clock } from 'lucide-react'

export const WelcomePage: React.FC = () => {
  return (
    <div className="page-container">
      <div className="section-padding min-h-screen flex flex-col">
        {/* Header with Logo */}
        <div className="text-center py-8">
          <div className="w-24 h-24 mx-auto bg-primary rounded-2xl flex items-center justify-center mb-6">
            <ShoppingBag className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 font-heading mb-2">
            Vendorly
          </h1>
          <p className="text-lg text-gray-600">
            Your neighborhood marketplace
          </p>
        </div>

        {/* Features Section */}
        <div className="flex-1 space-y-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 font-heading mb-6">
              Connect with Local Vendors
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Get fresh groceries, medicines, and daily essentials delivered quickly from trusted local vendors in your area.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="space-y-6">
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Hyperlocal</h3>
                <p className="text-gray-600 text-sm">Shop from vendors in your neighborhood</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-orange-50 rounded-lg">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mr-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Quick Delivery</h3>
                <p className="text-gray-600 text-sm">Get your orders delivered in minutes</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mr-4">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Support Local</h3>
                <p className="text-gray-600 text-sm">Help local businesses grow and thrive</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 pb-8">
          <Link to="/register">
            <Button variant="primary" size="lg" fullWidth>
              Get Started
            </Button>
          </Link>
          
          <div className="text-center">
            <span className="text-gray-600">Already have an account? </span>
            <Link 
              to="/login" 
              className="text-primary font-medium hover:text-primary-600 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}