import React, { useState } from 'react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { AlertTriangle, CheckCircle, Bot, Settings } from 'lucide-react'
import { testAIIntegration } from '../../utils/aiIntegrationTest'

export const AITest: React.FC = () => {
  const [testResult, setTestResult] = useState<any>(null)
  const [isTestRunning, setIsTestRunning] = useState(false)

  const runTest = async () => {
    setIsTestRunning(true)
    try {
      const result = await testAIIntegration()
      setTestResult(result)
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : String(error)
      })
    } finally {
      setIsTestRunning(false)
    }
  }

  const envVars = {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
    enableAI: import.meta.env.VITE_ENABLE_AI_CHAT,
    devMode: import.meta.env.VITE_DEV_MODE
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            <Bot className="inline-block w-8 h-8 mr-3 text-purple-600" />
            AI Integration Test
          </h1>
          <p className="text-gray-600">
            Test the Gemini AI integration and verify environment configuration.
          </p>
        </div>

        {/* Environment Check */}
        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Environment Configuration
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Gemini API Key</span>
                <Badge variant={envVars.apiKey && envVars.apiKey !== 'YOUR_GEMINI_API_KEY_HERE' ? 'success' : 'error'}>
                  {envVars.apiKey && envVars.apiKey !== 'YOUR_GEMINI_API_KEY_HERE' 
                    ? `${envVars.apiKey.substring(0, 10)}...` 
                    : 'Not Set'
                  }
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">AI Chat Enabled</span>
                <Badge variant={envVars.enableAI === 'true' ? 'success' : 'error'}>
                  {envVars.enableAI}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">Development Mode</span>
                <Badge variant={envVars.devMode === 'true' ? 'info' : 'default'}>
                  {envVars.devMode}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Test Controls */}
        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Run Integration Test</h2>
            
            <Button 
              onClick={runTest} 
              disabled={isTestRunning}
              className="w-full"
            >
              {isTestRunning ? 'Testing AI Connection...' : 'Test AI Integration'}
            </Button>
          </div>
        </Card>

        {/* Test Results */}
        {testResult && (
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                {testResult.success ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    Test Passed
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                    Test Failed
                  </>
                )}
              </h2>

              {testResult.success ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">AI Response</h3>
                    <p className="text-green-700 mb-3">{testResult.response.message}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-green-800">Confidence:</span>
                        <span className="ml-2 text-green-700">
                          {Math.round(testResult.response.confidence * 100)}%
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-green-800">Intent:</span>
                        <span className="ml-2 text-green-700">{testResult.response.intent}</span>
                      </div>
                    </div>
                  </div>

                  {testResult.response.suggestedActions && testResult.response.suggestedActions.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Suggested Actions</h4>
                      <div className="space-y-2">
                        {testResult.response.suggestedActions.map((action: any, index: number) => (
                          <Badge key={index} variant="info" className="mr-2">
                            {action.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {testResult.response.followUpQuestions && testResult.response.followUpQuestions.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Follow-up Questions</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {testResult.response.followUpQuestions.map((question: string, index: number) => (
                          <li key={index}>{question}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-800 mb-2">Error Details</h3>
                  <p className="text-red-700 font-mono text-sm">{testResult.error}</p>
                  
                  <div className="mt-4">
                    <h4 className="font-medium text-red-800 mb-2">Environment Status</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center">
                        <span className="text-red-700">API Key Present:</span>
                        <Badge 
                          variant={testResult.environment?.hasApiKey ? 'success' : 'error'}
                          size="sm"
                          className="ml-2"
                        >
                          {testResult.environment?.hasApiKey ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                      <div className="flex items-center">
                        <span className="text-red-700">AI Enabled:</span>
                        <Badge 
                          variant={testResult.environment?.isAIEnabled ? 'success' : 'error'}
                          size="sm"
                          className="ml-2"
                        >
                          {testResult.environment?.isAIEnabled ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>
            
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">1. Configure Environment</h3>
                <p>Make sure your <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> file contains:</p>
                <pre className="bg-gray-100 p-3 rounded mt-2 text-xs">
{`VITE_GEMINI_API_KEY=AIzaSyD3mRCjv8Ets3fTInBRSSTIEHM3kh6C3rU
VITE_ENABLE_AI_CHAT=true
VITE_DEV_MODE=true`}
                </pre>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">2. Restart Development Server</h3>
                <p>After updating environment variables, restart the dev server:</p>
                <code className="bg-gray-100 px-2 py-1 rounded">npm run dev</code>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">3. Test AI Chat</h3>
                <p>Visit the AI Chat Demo page to test the integration:</p>
                <code className="bg-gray-100 px-2 py-1 rounded">/ai-demo</code>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}