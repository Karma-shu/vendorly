import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'

interface RegisterFormData {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid },
    watch
  } = useForm<RegisterFormData>({
    mode: 'onChange'
  })

  const password = watch('password')

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      // TODO: Implement actual registration logic with Supabase
      console.log('Registration data:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to OTP verification
      navigate('/otp-verify', { 
        state: { 
          phone: data.phone, 
          email: data.email 
        }
      })
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="section-padding min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center py-6">
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate(-1)}
            className="!p-2 mr-2"
          />
          <h1 className="text-xl font-semibold text-gray-900 font-heading">
            Create Account
          </h1>
        </div>

        {/* Form */}
        <div className="flex-1 py-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 font-heading mb-2">
              Join Vendorly
            </h2>
            <p className="text-gray-600">
              Create your account to start shopping locally
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              leftIcon={User}
              error={errors.name?.message}
              {...register('name', {
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                }
              })}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email address"
              leftIcon={Mail}
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address'
                }
              })}
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="Enter your phone number"
              leftIcon={Phone}
              error={errors.phone?.message}
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: 'Please enter a valid 10-digit phone number'
                }
              })}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              leftIcon={Lock}
              rightIcon={showPassword ? EyeOff : Eye}
              onRightIconClick={() => setShowPassword(!showPassword)}
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Password must contain uppercase, lowercase, and number'
                }
              })}
            />

            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              leftIcon={Lock}
              rightIcon={showConfirmPassword ? EyeOff : Eye}
              onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => 
                  value === password || 'Passwords do not match'
              })}
            />

            <div className="space-y-4">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary mt-1"
                  {...register('acceptTerms', {
                    required: 'You must accept the terms and conditions'
                  })}
                />
                <span className="ml-3 text-sm text-gray-600">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:text-primary-600">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-primary hover:text-primary-600">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-sm text-red-600">{errors.acceptTerms.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              disabled={!isValid}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center py-6">
          <span className="text-gray-600">Already have an account? </span>
          <Link 
            to="/login"
            className="text-primary font-medium hover:text-primary-600 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}