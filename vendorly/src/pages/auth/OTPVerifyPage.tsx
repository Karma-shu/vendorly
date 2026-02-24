import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { ArrowLeft, Smartphone } from 'lucide-react'

export const OTPVerifyPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const phone = location.state?.phone || '+91 ***** *****'
  const email = location.state?.email || 'user@example.com'

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendTimer])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newOtp = [...otp]
    
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i]
    }
    setOtp(newOtp)
    
    // Focus appropriate input
    const nextIndex = Math.min(pastedData.length, 5)
    inputRefs.current[nextIndex]?.focus()
  }

  const isOtpComplete = otp.every(digit => digit !== '')

  const handleVerify = async () => {
    if (!isOtpComplete) return

    setIsLoading(true)
    try {
      // TODO: Implement actual OTP verification logic with Supabase
      const otpCode = otp.join('')
      console.log('Verifying OTP:', otpCode)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to user type selection
      navigate('/user-type')
    } catch (error) {
      console.error('OTP verification error:', error)
      // Reset OTP on error
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return

    setIsLoading(true)
    try {
      // TODO: Implement actual resend OTP logic
      console.log('Resending OTP to:', phone)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Reset timer
      setResendTimer(60)
      setCanResend(false)
    } catch (error) {
      console.error('Resend OTP error:', error)
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
            Verify OTP
          </h1>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center py-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto bg-primary-50 rounded-full flex items-center justify-center mb-6">
              <Smartphone className="w-10 h-10 text-primary" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 font-heading mb-2">
              Enter Verification Code
            </h2>
            <p className="text-gray-600 mb-2">
              We've sent a 6-digit code to
            </p>
            <p className="text-gray-900 font-medium">
              {phone}
            </p>
          </div>

          {/* OTP Input */}
          <div className="mb-8">
            <div className="flex justify-center space-x-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => { inputRefs.current[index] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                />
              ))}
            </div>

            <Button
              onClick={handleVerify}
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              disabled={!isOtpComplete}
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </Button>
          </div>

          {/* Resend */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Didn't receive the code?
            </p>
            
            {canResend ? (
              <Button
                variant="ghost"
                onClick={handleResend}
                disabled={isLoading}
              >
                Resend Code
              </Button>
            ) : (
              <p className="text-gray-500">
                Resend code in {resendTimer}s
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            By verifying, you agree to receive SMS messages from Vendorly
          </p>
        </div>
      </div>
    </div>
  )
}