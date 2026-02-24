// AI Integration Test - Verify Gemini API Connection
import { getAIChatService } from '../services/aiChatService'

export const testAIIntegration = async () => {
  try {
    console.log('🤖 Testing AI Integration...')
    
    const aiService = getAIChatService()
    const testContext = {
      userId: 'test_user',
      userType: 'customer' as const,
      location: {
        area: 'Koramangala',
        city: 'Bangalore'
      }
    }

    const response = await aiService.sendMessage('Hello, can you help me?', testContext)
    
    console.log('✅ AI Integration Test Results:')
    console.log('- Message:', response.message)
    console.log('- Confidence:', response.confidence)
    console.log('- Intent:', response.intent)
    console.log('- Should Escalate:', response.shouldEscalate)
    
    if (response.suggestedActions && response.suggestedActions.length > 0) {
      console.log('- Suggested Actions:', response.suggestedActions.length)
    }
    
    if (response.followUpQuestions && response.followUpQuestions.length > 0) {
      console.log('- Follow-up Questions:', response.followUpQuestions.length)
    }

    // Test environment variables
    const hasApiKey = !!import.meta.env.VITE_GEMINI_API_KEY
    const isAIEnabled = import.meta.env.VITE_ENABLE_AI_CHAT === 'true'
    
    console.log('🔧 Environment Check:')
    console.log('- API Key Present:', hasApiKey ? '✅' : '❌')
    console.log('- AI Chat Enabled:', isAIEnabled ? '✅' : '❌')
    
    return {
      success: true,
      response,
      environment: { hasApiKey, isAIEnabled }
    }
    
  } catch (error) {
    console.error('❌ AI Integration Test Failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      environment: {
        hasApiKey: !!import.meta.env.VITE_GEMINI_API_KEY,
        isAIEnabled: import.meta.env.VITE_ENABLE_AI_CHAT === 'true'
      }
    }
  }
}

// Auto-run test in development mode
if (import.meta.env.VITE_DEV_MODE === 'true') {
  testAIIntegration().then(result => {
    if (result.success) {
      console.log('🎉 AI Integration Test Passed!')
    } else {
      console.warn('⚠️ AI Integration Test Failed - Check API key and configuration')
    }
  })
}