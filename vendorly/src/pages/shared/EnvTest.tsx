import React from 'react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'

export const EnvTest: React.FC = () => {
  const envVars = {
    geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY,
    enableAI: import.meta.env.VITE_ENABLE_AI_CHAT,
    devMode: import.meta.env.VITE_DEV_MODE,
    appName: import.meta.env.VITE_APP_NAME,
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL
  }

  console.log('🔍 Environment Variables Check:')
  console.log('All env vars:', import.meta.env)
  console.log('Gemini API Key:', envVars.geminiApiKey)
  console.log('AI Enabled:', envVars.enableAI)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Environment Variables Test</h1>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">VITE_GEMINI_API_KEY</span>
                <div className="flex items-center gap-2">
                  <Badge variant={envVars.geminiApiKey ? 'success' : 'error'}>
                    {envVars.geminiApiKey ? 'SET' : 'NOT SET'}
                  </Badge>
                  {envVars.geminiApiKey && (
                    <span className="text-sm text-gray-600">
                      {envVars.geminiApiKey.substring(0, 10)}...
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">VITE_ENABLE_AI_CHAT</span>
                <Badge variant={envVars.enableAI === 'true' ? 'success' : 'error'}>
                  {envVars.enableAI || 'undefined'}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">VITE_DEV_MODE</span>
                <Badge variant={envVars.devMode === 'true' ? 'info' : 'default'}>
                  {envVars.devMode || 'undefined'}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">VITE_APP_NAME</span>
                <Badge variant={envVars.appName ? 'success' : 'error'}>
                  {envVars.appName || 'undefined'}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">VITE_API_BASE_URL</span>
                <Badge variant={envVars.apiBaseUrl ? 'success' : 'error'}>
                  {envVars.apiBaseUrl || 'undefined'}
                </Badge>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded">
              <h3 className="font-medium text-blue-900 mb-2">Debug Info</h3>
              <p className="text-sm text-blue-800">
                Check the browser console for detailed environment variable logs.
              </p>
              <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto">
                {JSON.stringify(envVars, null, 2)}
              </pre>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}