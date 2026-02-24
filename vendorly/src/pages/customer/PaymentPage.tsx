import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '../../components/ui'
import { PaymentGateway } from '../../components/payment/PaymentGateway'
import type { RazorpayResponse } from '../../services/paymentService'
import { CheckCircle, AlertCircle, Receipt, Download, Share2, RefreshCw } from 'lucide-react'

interface PaymentPageProps {
  orderId: string
  amount: number
  description: string
  userDetails: {
    name: string
    email: string
    phone: string
  }
  onPaymentSuccess?: (paymentData: RazorpayResponse) => void
  onPaymentFailure?: (error: any) => void
}

export const PaymentPage: React.FC<PaymentPageProps> = ({
  orderId,
  amount,
  description,
  userDetails,
  onPaymentSuccess,
  onPaymentFailure
}) => {
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending')
  const [paymentData, setPaymentData] = useState<RazorpayResponse | null>(null)
  const [error, setError] = useState<string>('')

  const handlePaymentSuccess = (response: RazorpayResponse) => {
    setPaymentData(response)
    setPaymentStatus('success')
    setError('')
    
    if (onPaymentSuccess) {
      onPaymentSuccess(response)
    }
  }

  const handlePaymentFailure = (error: any) => {
    setPaymentStatus('failed')
    setError(error.description || error.message || 'Payment failed')
    
    if (onPaymentFailure) {
      onPaymentFailure(error)
    }
  }

  const handleRetryPayment = () => {
    setPaymentStatus('pending')
    setError('')
    setPaymentData(null)
  }

  const downloadReceipt = () => {
    // Generate and download payment receipt
    const receiptData = {
      orderId,
      paymentId: paymentData?.razorpay_payment_id,
      amount,
      description,
      userDetails,
      timestamp: new Date().toISOString()
    }

    const dataStr = JSON.stringify(receiptData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `receipt-${orderId}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const shareReceipt = () => {
    if (navigator.share && paymentData) {
      navigator.share({
        title: 'Payment Receipt - Vendorly',
        text: `Payment successful for order ${orderId}. Amount: ₹${amount.toLocaleString()}`,
        url: window.location.href
      })
    }
  }

  if (paymentStatus === 'success' && paymentData) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Success Card */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-800 mb-2">Payment Successful!</h2>
            <p className="text-green-700">
              Your payment has been processed successfully
            </p>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Order ID</label>
                <p className="font-mono text-sm">{orderId}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Payment ID</label>
                <p className="font-mono text-sm">{paymentData.razorpay_payment_id}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Amount Paid</label>
                <p className="font-bold text-lg">₹{amount.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Payment Time</label>
                <p>{new Date().toLocaleString()}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="text-sm text-gray-500">Description</label>
              <p>{description}</p>
            </div>

            <div className="border-t pt-4">
              <label className="text-sm text-gray-500">Customer Details</label>
              <div className="mt-2 space-y-1">
                <p><span className="font-medium">Name:</span> {userDetails.name}</p>
                <p><span className="font-medium">Email:</span> {userDetails.email}</p>
                <p><span className="font-medium">Phone:</span> {userDetails.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={downloadReceipt}
            variant="outline"
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
          
          {'share' in navigator && (
            <Button
              onClick={shareReceipt}
              variant="outline"
              className="flex-1"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Receipt
            </Button>
          )}
          
          <Button
            onClick={() => window.location.href = '/orders'}
            className="flex-1"
          >
            View Orders
          </Button>
        </div>

        {/* Security Notice */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="text-blue-700 text-sm">
              <p className="font-medium mb-1">Important:</p>
              <ul className="space-y-1">
                <li>• Save this receipt for your records</li>
                <li>• SMS and email confirmation will be sent shortly</li>
                <li>• For support, quote your Payment ID: {paymentData.razorpay_payment_id}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Failure Card */}
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-800 mb-2">Payment Failed</h2>
            <p className="text-red-700 mb-4">
              {error || 'Something went wrong with your payment'}
            </p>
            <Button
              onClick={handleRetryPayment}
              className="mt-4"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Order ID:</span>
                <span className="font-mono text-sm">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-bold">₹{amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Description:</span>
                <span>{description}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="text-yellow-700 text-sm">
              <p className="font-medium mb-2">Need Help?</p>
              <ul className="space-y-1">
                <li>• Check your internet connection and try again</li>
                <li>• Ensure you have sufficient balance in your account</li>
                <li>• Try a different payment method</li>
                <li>• Contact our support team if the issue persists</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
        <p className="text-gray-600">Secure and fast payment processing</p>
      </div>

      <PaymentGateway
        amount={amount}
        orderId={orderId}
        userDetails={userDetails}
        description={description}
        onSuccess={handlePaymentSuccess}
        onFailure={handlePaymentFailure}
        onCancel={() => window.history.back()}
      />
    </div>
  )
}