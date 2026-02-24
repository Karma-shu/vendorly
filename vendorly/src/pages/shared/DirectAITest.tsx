import React, { useState } from 'react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { getAIChatService } from '../../services/aiChatService'

export const DirectAITest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const testDirectAI = async () => {
    setIsLoading(true)
    setTestResult('Testing AI service...')
    
    try {
      console.log('🧪 Starting direct AI test')
      
      // Get environment variables
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      console.log('🔑 API Key from env:', apiKey?.substring(0, 10) + '...')
      
      // Initialize service
      const aiService = getAIChatService()
      console.log('🤖 AI Service initialized')
      
      // Test context
      const testContext = {
        userId: 'test_user',
        userType: 'customer' as const,
        location: {
          area: 'Koramangala',
          city: 'Bangalore'
        }
      }
      
      console.log('📤 Sending test message...')
      
      // Send message
      const response = await aiService.sendMessage('Hello! Can you help me?', testContext)
      
      console.log('📥 Response received:', response)
      
      setTestResult(JSON.stringify(response, null, 2))
      
    } catch (error) {
      console.error('❌ Direct AI test failed:', error)
      setTestResult(`Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Direct AI Service Test</h1>
            
            <div className="mb-6">
              <Button 
                onClick={testDirectAI} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Testing...' : 'Test AI Service Directly'}
              </Button>
            </div>

            {testResult && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Test Result:</h3>
                <pre className="text-sm overflow-auto whitespace-pre-wrap">
                  {testResult}
                </pre>
              </div>
            )}

            <div className="mt-6 text-sm text-gray-600">
              <p><strong>Environment Check:</strong></p>
              <p>API Key: {import.meta.env.VITE_GEMINI_API_KEY ? 
                `${import.meta.env.VITE_GEMINI_API_KEY.substring(0, 10)}...` : 
                'NOT SET'
              }</p>
              <p>AI Enabled: {import.meta.env.VITE_ENABLE_AI_CHAT}</p>
              <p>Dev Mode: {import.meta.env.VITE_DEV_MODE}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}