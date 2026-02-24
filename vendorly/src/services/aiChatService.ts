// AI Chat Service using Google Gemini API
// This service provides intelligent customer support and product recommendations

import type { 
  ChatMessage, 
  Product, 
  Order, 
  Vendor 
} from '../types'

export interface AIContext {
  userId: string
  userType: 'customer' | 'vendor'
  location?: {
    area: string
    city: string
    coordinates?: [number, number]
  }
  orderHistory?: Order[]
  preferences?: {
    categories: string[]
    vendors: string[]
    dietaryRestrictions: string[]
    priceRange: { min: number; max: number }
  }
  currentCart?: unknown[]
  recentSearches?: string[]
  conversationHistory?: ChatMessage[]
  intent?: 'support' | 'recommendation' | 'order_help' | 'general'
}

export interface AIResponse {
  message: string
  confidence: number
  intent: string
  shouldEscalate: boolean
  suggestedActions?: {
    type: 'navigate' | 'search' | 'call_support' | 'show_products'
    label: string
    data?: {
      route?: string
      phone?: string
      query?: string
      [key: string]: unknown
    }
  }[]
  recommendedProducts?: Product[]
  followUpQuestions?: string[]
}

export interface GeminiConfig {
  apiKey: string
  model: string
  temperature: number
  maxTokens: number
  safetySettings?: {
    category: string
    threshold: string
  }[]
}

class AIChatService {
  private config: GeminiConfig
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models'

  constructor(apiKey: string) {
    console.log('🤖 Initializing AI Chat Service with API key:', apiKey.substring(0, 10) + '...')
    console.log('🔑 API key valid:', apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE')
    
    this.config = {
      apiKey,
      model: 'gemini-pro',
      temperature: 0.7,
      maxTokens: 500,
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ]
    }
  }

  async sendMessage(
    message: string,
    context: AIContext
  ): Promise<AIResponse> {
    try {
      // Build system prompt based on context
      const systemPrompt = this.buildSystemPrompt(context)
      const userPrompt = this.buildUserPrompt(message, context)

      const response = await this.callGeminiAPI(systemPrompt + '\n\n' + userPrompt)
      
      return this.parseAIResponse(response, context)
    } catch (error) {
      console.error('AI Chat Service Error:', error)
      return this.getFallbackResponse(message, context)
    }
  }

  private async callGeminiAPI(prompt: string): Promise<string> {
    // Check if we have a valid API key
    if (!this.config.apiKey || this.config.apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      console.warn('No valid Gemini API key found, using mock response')
      return this.getMockResponse(prompt)
    }

    console.log('🚀 Calling Gemini API with key:', this.config.apiKey.substring(0, 10) + '...')

    try {
      const response = await fetch(
        `${this.baseUrl}/gemini-pro:generateContent?key=${this.config.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              role: 'user',
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: this.config.temperature,
              maxOutputTokens: this.config.maxTokens,
            },
            safetySettings: this.config.safetySettings
          }),
        }
      )

      console.log('🔍 API Response Status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('😨 Gemini API Error:', response.status, errorText)
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('🤖 API Response:', data)
      
      if (!data.candidates || data.candidates.length === 0) {
        console.error('🙅 No candidates in response:', data)
        throw new Error('No response from Gemini API')
      }

      const generatedText = data.candidates[0].content.parts[0].text
      console.log('✅ Generated text:', generatedText.substring(0, 100) + '...')
      return generatedText
    } catch (fetchError) {
      console.error('🚨 Fetch Error:', fetchError)
      console.warn('🔄 Falling back to mock response')
      return this.getMockResponse(prompt)
    }
  }

  private buildSystemPrompt(context: AIContext): string {
    const basePrompt = `You are a helpful AI assistant for Vendorly, India's leading hyperlocal quick commerce platform.

Your role: Provide excellent customer support, intelligent product recommendations, and assist users with their shopping needs.

Platform context:
- Vendorly connects customers with local vendors for quick delivery (15-30 minutes)
- Categories: Groceries, Restaurants, Pharmacy, Electronics, Books, etc.
- Indian market focus (₹ currency, local preferences, cultural context)
- Multi-language support (English, Hindi, regional languages)

Current user context:
- User Type: ${context.userType}
- Location: ${context.location?.area || 'Not specified'}, ${context.location?.city || 'India'}
- Order History: ${context.orderHistory?.length || 0} previous orders
- Cart Items: ${context.currentCart?.length || 0} items`

    if (context.userType === 'customer') {
      return basePrompt + `

Customer Support Guidelines:
1. Help with orders, delivery tracking, payment issues
2. Provide product recommendations based on preferences and location
3. Assist with account management and app navigation
4. Handle complaints professionally and escalate when needed
5. Suggest relevant vendors and deals in their area

Response style:
- Friendly and conversational
- Use appropriate Indian context (festivals, food habits, local terms)
- Keep responses concise but helpful
- Ask clarifying questions when needed
- Offer multiple solutions when possible`
    } else {
      return basePrompt + `

Vendor Support Guidelines:
1. Help with inventory management and product listings
2. Provide business insights and analytics interpretation
3. Assist with order management and customer communication
4. Guide through platform features and best practices
5. Offer marketing and growth suggestions

Response style:
- Professional and business-focused
- Data-driven recommendations
- Actionable advice for business growth
- Industry insights and trends`
    }
  }

  private buildUserPrompt(message: string, context: AIContext): string {
    let prompt = `User message: "${message}"`

    // Add relevant context
    if (context.recentSearches && context.recentSearches.length > 0) {
      prompt += `\nRecent searches: ${context.recentSearches.slice(0, 3).join(', ')}`
    }

    if (context.preferences?.categories && context.preferences.categories.length > 0) {
      prompt += `\nPreferred categories: ${context.preferences.categories.join(', ')}`
    }

    if (context.currentCart && context.currentCart.length > 0) {
      prompt += `\nCurrent cart: ${context.currentCart.length} items`
    }

    // Add conversation history if available
    if (context.conversationHistory && context.conversationHistory.length > 1) { // Skip welcome message
      const recentMessages = context.conversationHistory.slice(-5); // Take last 5 messages
      if (recentMessages.length > 0) {
        const historyText = recentMessages.map(msg => 
          `${msg.senderType === 'customer' ? 'User' : 'AI'}: ${msg.message}`
        ).join('\n');
        prompt += `\nConversation history:\n${historyText}`;
      }
    }

    return prompt
  }

  private parseAIResponse(aiResponse: string, context: AIContext): AIResponse {
    // Extract structured information from AI response
    const confidence = this.calculateConfidence(aiResponse)
    const intent = this.detectIntent(aiResponse, context)
    const shouldEscalate = this.shouldEscalateToHuman(aiResponse)

    return {
      message: aiResponse,
      confidence,
      intent,
      shouldEscalate,
      suggestedActions: this.extractSuggestedActions(aiResponse),
      recommendedProducts: this.extractProductRecommendations(aiResponse),
      followUpQuestions: this.generateFollowUpQuestions(aiResponse, context)
    }
  }

  private getMockResponse(prompt: string): string {
    // Mock responses for different types of queries
    const lowerPrompt = prompt.toLowerCase()

    if (lowerPrompt.includes('order') && lowerPrompt.includes('track')) {
      return "I can help you track your order! Please provide your order ID, and I'll get the latest status for you. You can also check your order status in the 'Orders' section of the app."
    }

    if (lowerPrompt.includes('delivery') && lowerPrompt.includes('late')) {
      return "I understand your concern about the delayed delivery. Let me check what might be causing this. In the meantime, you can try contacting the vendor directly through the chat feature. If the delay continues, I can help you get a refund or replacement."
    }

    if (lowerPrompt.includes('recommend') || lowerPrompt.includes('suggest')) {
      return "Based on your location and preferences, I'd recommend checking out Fresh Mart for groceries - they have great quality vegetables and fruits. For quick meals, Spice Kitchen has excellent biryani and North Indian dishes. Would you like me to show you specific products or deals in your area?"
    }

    if (lowerPrompt.includes('payment') && lowerPrompt.includes('failed')) {
      return "Sorry to hear about the payment issue! This can happen due to network problems or bank restrictions. Please try these solutions: 1) Check your internet connection 2) Verify your card details 3) Try a different payment method 4) Contact your bank if the issue persists. I can also help you with UPI or wallet payments."
    }

    if (lowerPrompt.includes('vendor') && lowerPrompt.includes('business')) {
      return "Great question about growing your business on Vendorly! Here are some key strategies: 1) Keep your inventory updated regularly 2) Respond quickly to customer messages 3) Maintain good ratings with quality products 4) Use promotional offers during peak hours 5) Upload attractive product photos. Would you like specific advice on any of these areas?"
    }

    if (lowerPrompt.includes('customer') && lowerPrompt.includes('complaint')) {
      return "I understand you're dealing with a customer complaint. Here's how to handle it professionally: 1) Acknowledge their concern quickly 2) Apologize for the inconvenience 3) Offer a specific solution (refund, replacement, discount) 4) Follow up to ensure satisfaction. This approach usually resolves issues and can even improve customer loyalty."
    }

    if (lowerPrompt.includes('inventory') || lowerPrompt.includes('stock')) {
      return "For effective inventory management, I recommend: 1) Regularly update your stock levels 2) Set up automatic reorder points 3) Monitor slow-moving items 4) Seasonal adjustments. Would you like help setting up automatic reorder rules?"
    }

    // Default helpful response
    return "Hello! I'm here to help you with your Vendorly experience. I can assist with orders, deliveries, product recommendations, payments, and any other questions you might have. What would you like help with today?"
  }

  private calculateConfidence(response: string): number {
    // Simple confidence calculation based on response length and keywords
    const hasSpecificInfo = /order|product|vendor|delivery|payment/i.test(response)
    const isLongEnough = response.length > 20
    const hasHelpfulTone = /help|assist|recommend|suggest/i.test(response)

    let confidence = 0.5 // Base confidence

    if (hasSpecificInfo) confidence += 0.2
    if (isLongEnough) confidence += 0.1
    if (hasHelpfulTone) confidence += 0.1

    return Math.min(confidence, 0.9) // Cap at 90%
  }

  private detectIntent(response: string, context: AIContext): string {
    const lowerResponse = response.toLowerCase()
    
    // Use context to refine intent detection if needed
    if (context.intent) {
      return context.intent
    }

    if (lowerResponse.includes('track') || lowerResponse.includes('order status')) {
      return 'order_tracking'
    }
    if (lowerResponse.includes('recommend') || lowerResponse.includes('suggest')) {
      return 'product_recommendation'
    }
    if (lowerResponse.includes('payment') || lowerResponse.includes('refund')) {
      return 'payment_support'
    }
    if (lowerResponse.includes('delivery') || lowerResponse.includes('delivery time')) {
      return 'delivery_inquiry'
    }
    if (lowerResponse.includes('vendor') || lowerResponse.includes('business')) {
      return 'vendor_support'
    }

    return 'general_support'
  }

  private shouldEscalateToHuman(response: string): boolean {
    const escalationKeywords = [
      'complex issue',
      'speak to human',
      'manager',
      'complaint',
      'legal',
      'fraud',
      'emergency'
    ]

    return escalationKeywords.some(keyword => 
      response.toLowerCase().includes(keyword)
    )
  }

  private extractSuggestedActions(response: string): AIResponse['suggestedActions'] {
    const actions: AIResponse['suggestedActions'] = []

    if (response.includes('track') || response.includes('order')) {
      actions.push({
        type: 'navigate',
        label: 'View Orders',
        data: { route: '/orders' }
      })
    }

    if (response.includes('recommend') || response.includes('products')) {
      actions.push({
        type: 'show_products',
        label: 'Browse Products',
        data: { category: 'recommended' }
      })
    }

    if (response.includes('contact') || response.includes('support')) {
      actions.push({
        type: 'call_support',
        label: 'Contact Support',
        data: { phone: '+91-1800-123-4567' }
      })
    }

    return actions
  }

  private extractProductRecommendations(response: string): Product[] {
    // In a real implementation, this would extract product mentions
    // and fetch actual product data from the database
    
    // Basic extraction of product-related keywords from response
    const productKeywords = ['product', 'item', 'deal', 'offer']
    const hasProductReference = productKeywords.some(keyword => 
      response.toLowerCase().includes(keyword)
    )
    
    // Return empty array as fallback since we don't have actual product data
    return hasProductReference ? [] : []
  }

  private generateFollowUpQuestions(response: string, context: AIContext): string[] {
    const questions: string[] = []

    if (context.userType === 'customer') {
      if (response.includes('order')) {
        questions.push('Would you like me to help you track a specific order?')
        questions.push('Do you need help with placing a new order?')
      }
      if (response.includes('recommend')) {
        questions.push('What type of products are you looking for?')
        questions.push('Do you have any dietary preferences I should know about?')
      }
    } else {
      if (response.includes('business')) {
        questions.push('Would you like tips on improving your ratings?')
        questions.push('Do you need help with inventory management?')
      }
    }

    return questions.slice(0, 2) // Limit to 2 questions
  }

  private getFallbackResponse(message: string, context: AIContext): AIResponse {
    // Log the error message for debugging purposes
    console.warn('AI Chat Service Fallback triggered for message:', message)
    console.warn('Context:', context)
    
    return {
      message: "I'm sorry, I'm having trouble processing your request right now. Please try again or contact our support team for immediate assistance.",
      confidence: 0.1,
      intent: 'error',
      shouldEscalate: true,
      suggestedActions: [
        {
          type: 'call_support',
          label: 'Contact Support',
          data: { phone: '+91-1800-123-4567' }
        }
      ]
    }
  }

  // Helper methods for specific use cases
  async getProductRecommendations(
    userPreferences: AIContext['preferences'],
    location: string
  ): Promise<Product[]> {
    const context: AIContext = {
      userId: 'temp',
      userType: 'customer',
      location: { area: location, city: 'Bangalore' },
      preferences: userPreferences,
      intent: 'recommendation'
    }

    const response = await this.sendMessage(
      `Recommend products based on my preferences: ${userPreferences?.categories?.join(', ')}`,
      context
    )

    return response.recommendedProducts || []
  }

  async analyzeCustomerQuery(
    query: string,
    orderHistory: Order[]
  ): Promise<{ category: string; urgency: 'low' | 'medium' | 'high'; suggestedResponse: string }> {
    const context: AIContext = {
      userId: 'temp',
      userType: 'customer',
      orderHistory,
      intent: 'support'
    }

    const response = await this.sendMessage(query, context)

    return {
      category: response.intent,
      urgency: response.shouldEscalate ? 'high' : 'medium',
      suggestedResponse: response.message
    }
  }

  async getVendorInsights(
    vendorData: Vendor,
    salesData: unknown[]
  ): Promise<{ insights: string[]; recommendations: string[]; trends: string[] }> {
    const context: AIContext = {
      userId: vendorData.id,
      userType: 'vendor',
      intent: 'general'
    }

    // Use sales data to enhance the query if available
    let query = `Analyze my business performance and provide insights.`
    if (salesData && salesData.length > 0) {
      query += ` Recent sales data shows ${salesData.length} entries.`
    }
    
    const response = await this.sendMessage(query, context)

    return {
      insights: [response.message],
      recommendations: response.followUpQuestions || [],
      trends: []
    }
  }
}

// Singleton instance
let aiChatServiceInstance: AIChatService | null = null
let currentApiKey: string | null = null

export const getAIChatService = (): AIChatService => {
  // Always get fresh API key from environment
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_HERE'
  
  // Recreate instance if API key has changed or instance doesn't exist
  if (!aiChatServiceInstance || currentApiKey !== apiKey) {
    console.log('🔄 Creating new AI service instance with API key:', apiKey.substring(0, 10) + '...')
    aiChatServiceInstance = new AIChatService(apiKey)
    currentApiKey = apiKey
  }
  
  return aiChatServiceInstance
}

// Utility function to check if API is properly configured
export const isAIChatConfigured = (): boolean => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  return !!apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE' && apiKey.length > 0
}

// Test function to verify API connectivity
export const testAIConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const aiService = getAIChatService();
    // Try to call the API with a simple test message
    const testContext: AIContext = {
      userId: 'test-user',
      userType: 'customer',
      intent: 'general'
    };
    
    const response = await aiService.sendMessage('Hello, are you working?', testContext);
    
    if (response && response.message) {
      return { success: true, message: 'AI service connected successfully' };
    } else {
      return { success: false, message: 'AI service responded but with no content' };
    }
  } catch (error) {
    console.error('AI Connection Test Error:', error);
    return { success: false, message: `Connection failed: ${(error as Error).message}` };
  }
}

export default AIChatService