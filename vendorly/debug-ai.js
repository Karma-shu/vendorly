// Direct AI Service Test - Run in browser console
// Open browser console on http://localhost:3003/ai-test and paste this

async function quickAITest() {
  console.log('🧪 Quick AI Service Test')
  
  try {
    // Import the service
    const { getAIChatService } = await import('./src/services/aiChatService.js')
    
    const aiService = getAIChatService()
    console.log('✅ AI Service initialized')
    
    const testContext = {
      userId: 'test_user',
      userType: 'customer',
      location: { area: 'Koramangala', city: 'Bangalore' }
    }
    
    console.log('🚀 Sending test message...')
    const response = await aiService.sendMessage('Hello! Can you help me track my order?', testContext)
    
    console.log('🎉 AI Response received:')
    console.log('Message:', response.message)
    console.log('Confidence:', response.confidence)
    console.log('Intent:', response.intent)
    
    return response
  } catch (error) {
    console.error('❌ Test failed:', error)
    return { error: error.message }
  }
}

// Auto-run
quickAITest()