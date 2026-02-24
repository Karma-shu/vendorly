import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '../ui'
import { paymentService, PAYMENT_METHODS, UPI_APPS, type RazorpayResponse, type EMIOption } from '../../services/paymentService'
import { CreditCard, Smartphone, Building, Wallet, Calculator, Clock, CheckCircle, AlertCircle, Info } from 'lucide-react'

interface PaymentGatewayProps {
  amount: number
  orderId: string
  userDetails: {
    name: string
    email: string
    phone: string
  }
  description: string
  onSuccess: (paymentData: RazorpayResponse) => void
  onFailure?: (error: unknown) => void
  onCancel?: () => void
}

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  amount,
  orderId,
  userDetails,
  description,
  onSuccess,
  onFailure,
  onCancel
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('upi')
  const [selectedUPIApp, setSelectedUPIApp] = useState<string>('')
  const [selectedEMI, setSelectedEMI] = useState<EMIOption | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [emiOptions, setEmiOptions] = useState<EMIOption[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showEMIOptions, setShowEMIOptions] = useState(false)
  const [customUPI, setCustomUPI] = useState('')
  const [error, setError] = useState<string>('')

  // Load EMI options when EMI is selected
  React.useEffect(() => {
    if (selectedMethod === 'emi' && amount >= 1000) {
      paymentService.getEMIOptions(amount).then(setEmiOptions)
    }
  }, [selectedMethod, amount])

  const handlePayment = async () => {
    try {
      setIsProcessing(true)
      setError('')

      const preferredMethods = [selectedMethod]
      
      await paymentService.initiatePayment({
        orderId,
        amount,
        userDetails,
        description,
        preferredMethods,
        onSuccess: async (response) => {
          setIsProcessing(false)
          
          // Verify payment
          const isValid = await paymentService.verifyPayment(response)
          if (isValid) {
            onSuccess(response)
          } else {
            setError('Payment verification failed')
            if (onFailure) {
              onFailure(new Error('Payment verification failed'))
            }
          }
        },
        onFailure: (error) => {
          setIsProcessing(false)
          const errorObj = error as { description?: string };
          setError(errorObj.description || 'Payment failed')
          if (onFailure) {
            onFailure(error)
          }
        },
        onDismiss: () => {
          setIsProcessing(false)
          if (onCancel) {
            onCancel()
          }
        }
      })
    } catch (error) {
      setIsProcessing(false)
      setError(error instanceof Error ? error.message : 'Payment failed')
      if (onFailure) {
        onFailure(error)
      }
    }
  }

  const handleUPIPayment = () => {
    if (selectedUPIApp) {
      // Open specific UPI app
      const upiLink = paymentService.generateUPILink({
        upiId: 'vendorly@paytm', // Your UPI ID
        amount,
        name: 'Vendorly',
        description,
        transactionId: orderId
      })
      
      window.open(upiLink, '_blank')
    } else if (customUPI) {
      // Use custom UPI ID
      handlePayment()
    } else {
      // Show UPI options
      handlePayment()
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return <CreditCard className="w-5 h-5" />
      case 'upi': return <Smartphone className="w-5 h-5" />
      case 'netbanking': return <Building className="w-5 h-5" />
      case 'wallet': return <Wallet className="w-5 h-5" />
      case 'emi': return <Calculator className="w-5 h-5" />
      case 'paylater': return <Clock className="w-5 h-5" />
      default: return <CreditCard className="w-5 h-5" />
    }
  }

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Order ID:</span>
              <span className="font-mono text-sm">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span>Description:</span>
              <span>{description}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount:</span>
              <span className="text-primary">{formatCurrency(amount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PAYMENT_METHODS.filter(method => {
              if (method.minAmount && amount < method.minAmount) return false
              if (method.maxAmount && amount > method.maxAmount) return false
              return method.isEnabled
            }).map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-4 border rounded-lg text-left transition-all ${
                  selectedMethod === method.id
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  {getMethodIcon(method.type)}
                  <div className="flex-1">
                    <div className="font-medium">{method.name}</div>
                    <div className="text-sm text-gray-500">{method.description}</div>
                    {method.feePercentage && (
                      <div className="text-xs text-orange-600 mt-1">
                        +{method.feePercentage}% processing fee
                      </div>
                    )}
                  </div>
                  <div className="text-2xl">{method.icon}</div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* UPI Specific Options */}
      {selectedMethod === 'upi' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              UPI Payment Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* UPI Apps */}
            <div>
              <h4 className="font-medium mb-3">Pay with UPI App</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {UPI_APPS.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => setSelectedUPIApp(app.id)}
                    className={`p-3 border rounded-lg text-center transition-all ${
                      selectedUPIApp === app.id
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-xl mb-1">{app.icon}</div>
                    <div className="text-sm font-medium">{app.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center text-gray-500">or</div>

            {/* Custom UPI ID */}
            <div>
              <h4 className="font-medium mb-2">Enter UPI ID</h4>
              <Input
                placeholder="yourname@upi"
                value={customUPI}
                onChange={(e) => setCustomUPI(e.target.value)}
                className="mb-2"
              />
              <p className="text-sm text-gray-500">
                Enter your UPI ID (e.g., yourname@paytm, yourname@phonepe)
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* EMI Options */}
      {selectedMethod === 'emi' && amount >= 1000 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              EMI Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            {emiOptions.length > 0 ? (
              <div className="space-y-3">
                {emiOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedEMI(option)}
                    className={`w-full p-4 border rounded-lg text-left transition-all ${
                      selectedEMI?.duration === option.duration
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">
                          {option.duration} months @ {option.interestRate}% p.a.
                        </div>
                        <div className="text-sm text-gray-500">
                          {option.bank} {option.cardType} card
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          {formatCurrency(option.monthlyAmount)}/month
                        </div>
                        <div className="text-sm text-gray-500">
                          Total: {formatCurrency(option.totalAmount)}
                        </div>
                      </div>
                    </div>
                    {option.processingFee > 0 && (
                      <div className="text-xs text-orange-600 mt-2">
                        Processing fee: {formatCurrency(option.processingFee)}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calculator className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">Loading EMI options...</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Info */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Secure Payment</span>
          </div>
          <p className="text-sm text-green-600 mt-1">
            Your payment is secured by Razorpay with 256-bit SSL encryption
          </p>
        </CardContent>
      </Card>

      {/* Payment Button */}
      <div className="space-y-4">
        <Button
          onClick={selectedMethod === 'upi' ? handleUPIPayment : handlePayment}
          disabled={isProcessing || (selectedMethod === 'emi' && !selectedEMI)}
          className="w-full py-3 text-lg"
          size="lg"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            <>Pay {formatCurrency(amount)}</>
          )}
        </Button>

        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isProcessing}
            className="w-full"
          >
            Cancel
          </Button>
        )}
      </div>

      {/* Payment Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-2 text-blue-700">
            <Info className="w-5 h-5 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Payment Information</p>
              <ul className="space-y-1 text-blue-600">
                <li>• Payments are processed instantly</li>
                <li>• You will receive confirmation via SMS and email</li>
                <li>• Refunds take 3-5 business days to process</li>
                <li>• Contact support for payment issues</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}