import React from 'react'
import { User, Store, Copy, Check } from 'lucide-react'
import { QUICK_LOGIN } from '../utils/demoCredentials'

interface DemoCredentialsCardProps {
  onCredentialClick?: (userType: 'customer' | 'vendor') => void
  showClickAction?: boolean
}

export const DemoCredentialsCard: React.FC<DemoCredentialsCardProps> = ({ 
  onCredentialClick, 
  showClickAction = false 
}) => {
  const [copiedText, setCopiedText] = React.useState('')

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(type)
      setTimeout(() => setCopiedText(''), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
      <div className="text-center mb-4">
        <h3 className="font-heading font-bold text-blue-900 text-lg mb-2">
          🎯 Demo Login Credentials
        </h3>
        <p className="text-blue-700 text-sm">
          Test the application with these ready-to-use accounts
        </p>
      </div>
      
      <div className="space-y-3">
        {/* Customer Account */}
        <div 
          className={`bg-white border border-blue-200 rounded-lg p-4 ${
            showClickAction ? 'cursor-pointer hover:bg-blue-50 transition-colors' : ''
          }`}
          onClick={() => showClickAction && onCredentialClick?.('customer')}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">Customer Account</div>
                <div className="text-sm text-gray-600 mb-2">Full shopping experience</div>
                <div className="bg-gray-50 rounded px-2 py-1 text-xs font-mono text-gray-700">
                  {QUICK_LOGIN.customer}
                </div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                copyToClipboard(QUICK_LOGIN.customer, 'customer')
              }}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Copy credentials"
            >
              {copiedText === 'customer' ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
          {showClickAction && (
            <div className="mt-2 text-xs text-blue-600">
              Click to auto-fill login form
            </div>
          )}
        </div>

        {/* Vendor Account */}
        <div 
          className={`bg-white border border-blue-200 rounded-lg p-4 ${
            showClickAction ? 'cursor-pointer hover:bg-blue-50 transition-colors' : ''
          }`}
          onClick={() => showClickAction && onCredentialClick?.('vendor')}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Store className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">Vendor Account</div>
                <div className="text-sm text-gray-600 mb-2">Business dashboard (Phase 3)</div>
                <div className="bg-gray-50 rounded px-2 py-1 text-xs font-mono text-gray-700">
                  {QUICK_LOGIN.vendor}
                </div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                copyToClipboard(QUICK_LOGIN.vendor, 'vendor')
              }}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Copy credentials"
            >
              {copiedText === 'vendor' ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
          {showClickAction && (
            <div className="mt-2 text-xs text-blue-600">
              Click to auto-fill login form
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-100 rounded-lg">
        <div className="text-xs text-blue-800">
          <strong>💡 Quick Testing:</strong>
          <ul className="mt-1 space-y-1">
            <li>• Customer: Browse, shop, checkout, track orders</li>
            <li>• Vendor: Manage products, orders (Phase 3)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}