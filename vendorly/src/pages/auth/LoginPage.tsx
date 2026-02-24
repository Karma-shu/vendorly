import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Mail, Lock, Eye, EyeOff, ArrowLeft, User, Store } from 'lucide-react'
import { validateDemoLogin, QUICK_LOGIN } from '../../utils/demoCredentials'

interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  
  const { 
    register, 
    handleSubmit, 
    setValue,
    formState: { errors, isValid }
  } = useForm<LoginFormData>({
    mode: 'onChange'
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setLoginError('')
    
    try {
      // Validate with demo credentials
      const result = validateDemoLogin(data.email, data.password)
      
      if (result.success) {
        // Store user data in localStorage for demo
        localStorage.setItem('demoUser', JSON.stringify({
          userType: result.userType,
          profile: result.profile,
          isAuthenticated: true
        }))
        
        // Navigate based on user type
        if (result.userType === 'customer') {
          navigate('/home')
        } else {
          navigate('/vendor-dashboard')
        }
      } else {
        setLoginError(result.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      setLoginError('An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = (userType: 'customer' | 'vendor') => {
    if (userType === 'customer') {
      setValue('email', 'customer@demo.com')
      setValue('password', 'demo123')
    } else {
      setValue('email', 'vendor@demo.com')
      setValue('password', 'demo123')
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
            Welcome Back
          </h1>
        </div>

        {/* Form */}
        <div className="flex-1 flex flex-col justify-center py-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 font-heading mb-2">
              Sign in to your account
            </h2>
            <p className="text-gray-600">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <span className="text-blue-600">🎯</span>
              Demo Login Credentials
            </h3>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleDemoLogin('customer')}
                className="w-full p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-900">Customer Account</div>
                    <div className="text-sm text-blue-600">{QUICK_LOGIN.customer}</div>
                  </div>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => handleDemoLogin('vendor')}
                className="w-full p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Store className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-900">Vendor Account</div>
                    <div className="text-sm text-blue-600">{QUICK_LOGIN.vendor}</div>
                  </div>
                </div>
              </button>
            </div>
            <p className="text-xs text-blue-600 mt-3">
              Click above to auto-fill credentials, then sign in
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{loginError}</p>
              </div>
            )}
            
            <Input
              label="Email or Phone"
              type="email"
              placeholder="Enter your email or phone number"
              leftIcon={Mail}
              error={errors.email?.message}
              {...register('email', {
                required: 'Email or phone is required',
                validate: (value) => {
                  // Allow demo emails or valid email format
                  if (value === 'customer@demo.com' || value === 'vendor@demo.com') {
                    return true
                  }
                  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                  return emailRegex.test(value) || 'Please enter a valid email address'
                }
              })}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              leftIcon={Lock}
              rightIcon={showPassword ? EyeOff : Eye}
              onRightIconClick={() => setShowPassword(!showPassword)}
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  {...register('rememberMe')}
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>

              <Link 
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary-600 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              disabled={!isValid}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center py-6">
          <span className="text-gray-600">Don't have an account? </span>
          <Link 
            to="/register"
            className="text-primary font-medium hover:text-primary-600 transition-colors"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}