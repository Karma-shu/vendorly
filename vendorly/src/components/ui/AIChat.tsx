import React, { useState, useRef, useEffect } from 'react'
import { Bot, User, Send, Sparkles, ArrowRight, ThumbsUp, ThumbsDown, AlertTriangle } from 'lucide-react'
import { Button } from './Button'
import { Badge } from './Badge'
import { getAIChatService, type AIContext, type AIResponse, isAIChatConfigured, testAIConnection } from '../../services/aiChatService'
import type { ChatMessage } from '../../types'

interface AIChatMessage extends ChatMessage {
  isAI?: boolean
  aiResponse?: AIResponse
}

interface AIChatProps {
  currentUserId: string
  currentUserType: 'customer' | 'vendor'
  context?: AIContext
  onClose?: () => void
  className?: string
}

export const AIChat: React.FC<AIChatProps> = ({
  currentUserId,
  currentUserType,
  context,
  onClose,
  className = ''
}) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome',
      conversationId: 'ai-chat',
      senderId: 'ai',
      senderType: 'vendor', // AI acts as support
      senderName: 'Vendorly AI Assistant',
      message: `Hello! I'm your AI assistant. I can help you with orders, product recommendations, support queries, and more. How can I assist you today?`,
      messageType: 'text',
      timestamp: new Date().toISOString(),
      isRead: true,
      isAI: true
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isAIEnabled, setIsAIEnabled] = useState(true)
  const [apiConfigured, setApiConfigured] = useState(isAIChatConfigured())
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Check if API is configured when component mounts and when it changes
  useEffect(() => {
    setApiConfigured(isAIChatConfigured())
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage: AIChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: 'ai-chat',
      senderId: currentUserId,
      senderType: currentUserType,
      senderName: 'You',
      message: newMessage.trim(),
      messageType: 'text',
      timestamp: new Date().toISOString(),
      isRead: true,
      isAI: false
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')

    if (isAIEnabled) {
      setIsTyping(true)
      
      try {
        // Get AI response using the real Gemini API
        const aiContext: AIContext = {
          userId: currentUserId,
          userType: currentUserType,
          conversationHistory: [...messages], // Create a copy of messages to avoid mutations
          ...context
        }

        const aiService = getAIChatService()
        const aiResponse = await aiService.sendMessage(newMessage.trim(), aiContext)

        const aiMessage: AIChatMessage = {
          id: `ai-${Date.now()}`,
          conversationId: 'ai-chat',
          senderId: 'ai',
          senderType: 'vendor',
          senderName: 'Vendorly AI Assistant',
          message: aiResponse.message,
          messageType: 'text',
          timestamp: new Date().toISOString(),
          isRead: true,
          isAI: true,
          aiResponse
        }

        setMessages(prev => [...prev, aiMessage])
      } catch (error) {
        console.error('AI Response Error:', error)
        
        const errorMessage: AIChatMessage = {
          id: `error-${Date.now()}`,
          conversationId: 'ai-chat',
          senderId: 'ai',
          senderType: 'vendor',
          senderName: 'Vendorly AI Assistant',
          message: "I'm sorry, I'm having trouble connecting to the AI service right now. This could be due to an invalid API key or network issues. Please check your configuration or contact support.",
          messageType: 'text',
          timestamp: new Date().toISOString(),
          isRead: true,
          isAI: true
        }

        setMessages(prev => [...prev, errorMessage])
      } finally {
        setIsTyping(false)
      }
    }
  }

  const handleActionClick = (action: NonNullable<AIResponse['suggestedActions']>[number]) => {
    if (action.type === 'navigate' && action.data?.route) {
      window.location.href = action.data.route
    } else if (action.type === 'call_support' && action.data?.phone) {
      window.open(`tel:${action.data.phone}`)
    } else if (action.type === 'search' && action.data?.query) {
      window.location.href = `/search?q=${encodeURIComponent(action.data.query)}`
    } else if (action.type === 'show_products' && action.data?.category) {
      window.location.href = `/category/${action.data.category}`
    }
  }

  const handleFeedback = (messageId: string, feedback: 'helpful' | 'not_helpful') => {
    console.log(`Feedback for message ${messageId}: ${feedback}`)
    // In real implementation, send feedback to analytics
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Assistant</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Online</span>
              <Badge variant="info" size="sm">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAIEnabled(!isAIEnabled)}
          >
            {isAIEnabled ? 'Disable AI' : 'Enable AI'}
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!apiConfigured && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-yellow-800">AI Chat Not Configured</p>
              <p className="text-xs text-yellow-700 mt-1">
                The Gemini API key is not properly configured. The chat will use mock responses until a valid API key is provided in your environment variables.
              </p>
              <p className="text-xs text-yellow-600 mt-1 font-mono bg-yellow-100 p-1 rounded">
                VITE_GEMINI_API_KEY=your_api_key_here
              </p>
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-xs lg:max-w-md ${message.isAI ? 'bg-gray-100' : 'bg-primary text-white'} rounded-lg p-3`}>
              {/* Message Header */}
              <div className="flex items-center gap-2 mb-2">
                {message.isAI ? (
                  <Bot className="w-4 h-4 text-purple-600" />
                ) : (
                  <User className="w-4 h-4" />
                )}
                <span className={`text-xs font-medium ${message.isAI ? 'text-gray-700' : 'text-white'}`}>
                  {message.senderName}
                </span>
                <span className={`text-xs ${message.isAI ? 'text-gray-500' : 'text-white/70'}`}>
                  {formatTime(message.timestamp)}
                </span>
              </div>

              {/* Message Content */}
              <p className={`text-sm ${message.isAI ? 'text-gray-800' : 'text-white'}`}>
                {message.message}
              </p>

              {/* AI Response Actions */}
              {message.isAI && message.aiResponse?.suggestedActions && message.aiResponse.suggestedActions.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.aiResponse.suggestedActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleActionClick(action)}
                      className="w-full justify-start"
                    >
                      <ArrowRight className="w-3 h-3 mr-2" />
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}

              {/* Follow-up Questions */}
              {message.isAI && message.aiResponse?.followUpQuestions && message.aiResponse.followUpQuestions.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-600 mb-2">You might also ask:</p>
                  <div className="space-y-1">
                    {message.aiResponse.followUpQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => setNewMessage(question)}
                        className="block w-full text-left text-xs text-blue-600 hover:text-blue-800 py-1 px-2 rounded hover:bg-blue-50 transition-colors"
                      >
                        "{question}"
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Feedback */}
              {message.isAI && (
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Was this helpful?</span>
                    <button
                      onClick={() => handleFeedback(message.id, 'helpful')}
                      className="p-1 hover:bg-green-100 rounded transition-colors"
                    >
                      <ThumbsUp className="w-3 h-3 text-gray-400 hover:text-green-600" />
                    </button>
                    <button
                      onClick={() => handleFeedback(message.id, 'not_helpful')}
                      className="p-1 hover:bg-red-100 rounded transition-colors"
                    >
                      <ThumbsDown className="w-3 h-3 text-gray-400 hover:text-red-600" />
                    </button>
                  </div>
                  
                  {message.aiResponse?.confidence && (
                    <span className="text-xs text-gray-500">
                      {Math.round(message.aiResponse.confidence * 100)}% confident
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-600" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        {!apiConfigured && (
          <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Using mock responses. Configure VITE_GEMINI_API_KEY for real AI responses.
            </p>
          </div>
        )}
        
        {!isAIEnabled && (
          <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              AI assistance is disabled. Enable it to get intelligent responses.
            </p>
          </div>
        )}
        
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isAIEnabled ? "Ask me anything..." : "Type your message..."}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={isTyping}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isTyping}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mt-3">
          {currentUserType === 'customer' && (
            <>
              <button
                onClick={() => setNewMessage("Track my recent order")}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                Track Order
              </button>
              <button
                onClick={() => setNewMessage("Recommend products for dinner")}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                Get Recommendations
              </button>
              <button
                onClick={() => setNewMessage("Help with payment issue")}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                Payment Help
              </button>
            </>
          )}
          
          {currentUserType === 'vendor' && (
            <>
              <button
                onClick={() => setNewMessage("How to improve my business ratings?")}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                Business Tips
              </button>
              <button
                onClick={() => setNewMessage("Analyze my sales performance")}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                Sales Analysis
              </button>
              <button
                onClick={() => setNewMessage("Help with inventory management")}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                Inventory Help
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}