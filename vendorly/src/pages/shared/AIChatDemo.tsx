import React, { useState } from 'react'
import { Bot, User, Sparkles, MessageSquare, TrendingUp, ShoppingBag, Headphones } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { AIChat } from '../../components/ui/AIChat'
import type { AIContext } from '../../services/aiChatService'

const AIChatDemo: React.FC = () => {
  const [selectedDemo, setSelectedDemo] = useState<'customer' | 'vendor' | null>(null)
  const [showChat, setShowChat] = useState(false)

  const customerContext: AIContext = {
    userId: 'demo_customer',
    userType: 'customer',
    location: {
      area: 'Koramangala',
      city: 'Bangalore',
      coordinates: [12.9279, 77.6271]
    },
    preferences: {
      categories: ['groceries', 'restaurants'],
      vendors: ['Fresh Mart', 'Spice Kitchen'],
      dietaryRestrictions: ['vegetarian'],
      priceRange: { min: 50, max: 1000 }
    },
    recentSearches: ['tomatoes', 'biryani', 'medicines'],
    intent: 'general'
  }

  const vendorContext: AIContext = {
    userId: 'demo_vendor',
    userType: 'vendor',
    location: {
      area: 'Indiranagar',
      city: 'Bangalore'
    },
    intent: 'general'
  }

  const demoScenarios = [
    {
      type: 'customer' as const,
      title: 'Customer Support AI',
      description: 'Experience intelligent customer assistance',
      icon: <Headphones className="w-8 h-8 text-blue-600" />,
      features: [
        'Order tracking and delivery updates',
        'Product recommendations based on preferences',
        'Payment issue resolution',
        'Local vendor suggestions',
        'Multi-language support (Hindi, English)'
      ],
      sampleQueries: [
        "Track my recent order",
        "Recommend dinner options near me",
        "Help with payment failure",
        "Find fresh vegetables in Koramangala"
      ]
    },
    {
      type: 'vendor' as const,
      title: 'Vendor Business AI',
      description: 'Get AI-powered business insights and support',
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      features: [
        'Business performance analysis',
        'Inventory management suggestions',
        'Customer behavior insights',
        'Marketing strategy recommendations',
        'Competitor analysis and pricing tips'
      ],
      sampleQueries: [
        "How to improve my business ratings?",
        "Analyze my sales performance this month",
        "Best times to run promotions",
        "Help with inventory management"
      ]
    }
  ]

  const aiFeatures = [
    {
      icon: <Bot className="w-6 h-6 text-purple-600" />,
      title: 'Natural Language Understanding',
      description: 'Understands context, intent, and Indian colloquialisms'
    },
    {
      icon: <Sparkles className="w-6 h-6 text-yellow-600" />,
      title: 'Contextual Responses',
      description: 'Remembers conversation history and user preferences'
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-blue-600" />,
      title: 'Proactive Assistance',
      description: 'Suggests actions and follow-up questions'
    },
    {
      icon: <ShoppingBag className="w-6 h-6 text-green-600" />,
      title: 'Smart Recommendations',
      description: 'AI-powered product and vendor suggestions'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <div className="flex items-center justify-center mb-4">
              <Bot className="w-12 h-12 mr-4" />
              <h1 className="text-4xl font-heading font-bold">
                Vendorly AI Assistant
              </h1>
            </div>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Experience the future of hyperlocal commerce with our intelligent AI assistant. 
              Get instant support, personalized recommendations, and business insights.
            </p>
            <Badge variant="success" className="mt-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by Google Gemini AI
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showChat ? (
          <>
            {/* AI Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {aiFeatures.map((feature, index) => (
                <Card key={index} className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </Card>
              ))}
            </div>

            {/* Demo Scenarios */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {demoScenarios.map((scenario) => (
                <Card key={scenario.type} className="p-8">
                  <div className="flex items-center mb-6">
                    {scenario.icon}
                    <div className="ml-4">
                      <h2 className="text-2xl font-heading font-bold text-gray-900">
                        {scenario.title}
                      </h2>
                      <p className="text-gray-600">{scenario.description}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features:</h3>
                    <ul className="space-y-2">
                      {scenario.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <Sparkles className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sample Queries */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Try These Queries:</h3>
                    <div className="space-y-2">
                      {scenario.sampleQueries.map((query, index) => (
                        <div
                          key={index}
                          className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => {
                            setSelectedDemo(scenario.type)
                            setShowChat(true)
                          }}
                        >
                          "{query}"
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Try Demo Button */}
                  <Button 
                    onClick={() => {
                      setSelectedDemo(scenario.type)
                      setShowChat(true)
                    }}
                    className="w-full"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Try {scenario.title}
                  </Button>
                </Card>
              ))}
            </div>

            {/* Technical Details */}
            <Card className="mt-12 p-8">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">
                Technical Implementation
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Model</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Google Gemini Pro</li>
                    <li>• Context-aware responses</li>
                    <li>• Multi-language support</li>
                    <li>• Safety filtering</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Intent recognition</li>
                    <li>• Conversation memory</li>
                    <li>• Smart actions</li>
                    <li>• Confidence scoring</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Integration</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Real-time responses</li>
                    <li>• User context analysis</li>
                    <li>• Escalation to humans</li>
                    <li>• Analytics & feedback</li>
                  </ul>
                </div>
              </div>
            </Card>
          </>
        ) : (
          /* Chat Interface */
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Bot className="w-8 h-8 text-purple-600" />
                <div>
                  <h2 className="text-2xl font-heading font-bold text-gray-900">
                    {selectedDemo === 'customer' ? 'Customer AI Assistant' : 'Vendor Business AI'}
                  </h2>
                  <p className="text-gray-600">
                    {selectedDemo === 'customer' 
                      ? 'Get help with orders, recommendations, and support'
                      : 'Get business insights, analytics, and growth strategies'
                    }
                  </p>
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={() => {
                  setShowChat(false)
                  setSelectedDemo(null)
                }}
              >
                ← Back to Demo
              </Button>
            </div>

            <Card className="h-[600px]">
              <AIChat
                currentUserId={selectedDemo === 'customer' ? 'demo_customer' : 'demo_vendor'}
                currentUserType={selectedDemo || 'customer'}
                context={selectedDemo === 'customer' ? customerContext : vendorContext}
                className="h-full"
              />
            </Card>

            {/* Quick Tips */}
            <Card className="mt-6 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                💡 Tips for Better AI Interaction
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Be Specific:</h4>
                  <p>"Track order #ORD123" instead of "Where's my order?"</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Provide Context:</h4>
                  <p>"Recommend vegetarian dinner for 4 people" is better than "Food suggestions"</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Use Natural Language:</h4>
                  <p>Ask questions like you would to a human assistant</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Try Follow-ups:</h4>
                  <p>Click on suggested questions to continue the conversation</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default AIChatDemo