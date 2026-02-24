import React, { useState } from 'react'
import { ChatWindow, ChatList } from '../../components/ui/Chat'
import { Card } from '../../components/ui/Card'
import { MessageCircle } from 'lucide-react'
import { mockChatConversations, getMessagesByConversationId, getConversationsForUser } from '../../utils/mockChatData'
import type { ChatConversation, ChatMessage, ChatAttachment } from '../../types'

interface ChatPageProps {
  currentUserId: string
  currentUserType: 'customer' | 'vendor'
}

const ChatPage: React.FC<ChatPageProps> = ({ 
  currentUserId = 'customer1', 
  currentUserType = 'customer' 
}) => {
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null)
  const [conversations] = useState<ChatConversation[]>(getConversationsForUser(currentUserId, currentUserType))
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const handleSelectConversation = (conversation: ChatConversation) => {
    setSelectedConversation(conversation)
    const conversationMessages = getMessagesByConversationId(conversation.id)
    setMessages(conversationMessages)
  }

  const handleSendMessage = (message: string, attachments?: ChatAttachment[]) => {
    if (!selectedConversation) return

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: currentUserId,
      senderType: currentUserType,
      senderName: currentUserType === 'customer' ? selectedConversation.customerName : selectedConversation.vendorName,
      message,
      messageType: 'text',
      timestamp: new Date().toISOString(),
      isRead: false,
      attachments
    }

    setMessages(prev => [...prev, newMessage])
    
    // Mock: Update conversation's last message
    setSelectedConversation(prev => prev ? {
      ...prev,
      lastMessage: newMessage,
      updatedAt: newMessage.timestamp
    } : null)
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Chat List Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-heading font-semibold text-gray-900 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-primary" />
            Messages
          </h1>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <ChatList
            conversations={conversations}
            onSelectConversation={handleSelectConversation}
            selectedConversationId={selectedConversation?.id}
            currentUserType={currentUserType}
          />
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            messages={messages}
            currentUserId={currentUserId}
            currentUserType={currentUserType}
            onSendMessage={handleSendMessage}
            className="h-full"
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Card className="p-8 text-center max-w-md">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-600">
                Choose a conversation from the left to start messaging
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatPage