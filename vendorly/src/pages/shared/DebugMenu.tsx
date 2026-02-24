import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Settings, Bot, TestTube, Eye, MessageSquare } from 'lucide-react'

export const DebugMenu: React.FC = () => {
  const debugRoutes = [
    {
      path: '/env-test',
      title: 'Environment Variables Test',
      description: 'Check if all environment variables are loaded correctly',
      icon: Settings,
      color: 'bg-blue-500'
    },
    {
      path: '/direct-ai-test',
      title: 'Direct AI Service Test',
      description: 'Test the AI service directly without chat interface',
      icon: TestTube,
      color: 'bg-green-500'
    },
    {
      path: '/ai-test',
      title: 'AI Integration Test',
      description: 'Comprehensive AI integration test with UI',
      icon: Bot,
      color: 'bg-purple-500'
    },
    {
      path: '/ai-demo',
      title: 'AI Chat Demo',
      description: 'Full AI chat interface demonstration',
      icon: MessageSquare,
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            <Eye className="inline-block w-8 h-8 mr-3 text-blue-600" />
            Debug & Test Menu
          </h1>
          <p className="text-gray-600">
            Test various aspects of the AI integration and environment configuration.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {debugRoutes.map((route) => {
            const IconComponent = route.icon
            return (
              <Card key={route.path} className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${route.color} rounded-lg flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {route.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {route.description}
                    </p>
                    <Link to={route.path}>
                      <Button variant="outline" size="sm">
                        Open Test
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <Card className="mt-8 p-6">
          <h2 className="text-xl font-semibold mb-4">Current Environment Status</h2>
          <div className="grid gap-3 text-sm">
            <div className="flex justify-between">
              <span>Gemini API Key:</span>
              <span className={`font-mono ${import.meta.env.VITE_GEMINI_API_KEY ? 'text-green-600' : 'text-red-600'}`}>
                {import.meta.env.VITE_GEMINI_API_KEY ? 
                  `${import.meta.env.VITE_GEMINI_API_KEY.substring(0, 10)}...` : 
                  'NOT SET'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span>AI Chat Enabled:</span>
              <span className={`${import.meta.env.VITE_ENABLE_AI_CHAT === 'true' ? 'text-green-600' : 'text-red-600'}`}>
                {import.meta.env.VITE_ENABLE_AI_CHAT || 'false'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Development Mode:</span>
              <span className={`${import.meta.env.VITE_DEV_MODE === 'true' ? 'text-blue-600' : 'text-gray-600'}`}>
                {import.meta.env.VITE_DEV_MODE || 'false'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Current Server:</span>
              <span className="text-blue-600">
                {window.location.origin}
              </span>
            </div>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <Link to="/home">
            <Button variant="outline">
              ← Back to App
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}