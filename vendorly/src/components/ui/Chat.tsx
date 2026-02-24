import React, { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, MoreVertical, Phone, Video, X, File } from 'lucide-react'
import { Button } from './Button'
import { Card } from './Card'
import type { ChatMessage, ChatConversation, ChatAttachment } from '../../types'

interface ChatWindowProps {
  conversation: ChatConversation
  messages: ChatMessage[]
  currentUserId: string
  currentUserType: 'customer' | 'vendor'
  onSendMessage: (message: string, attachments?: ChatAttachment[]) => void
  onClose?: () => void
  className?: string
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  currentUserId,
  currentUserType,
  onSendMessage,
  onClose,
  className = ''
}) => {
  const [newMessage, setNewMessage] = useState('')
  const [attachments, setAttachments] = useState<ChatAttachment[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim() || attachments.length > 0) {
      onSendMessage(newMessage.trim(), attachments)
      setNewMessage('')
      setAttachments([])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    // Mock file handling - in real app, upload files and get URLs
    const newAttachments: ChatAttachment[] = files.map((file, index) => ({
      id: `attachment-${Date.now()}-${index}`,
      type: file.type.startsWith('image/') ? 'image' : 'file',
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size
    }))
    setAttachments(prev => [...prev, ...newAttachments])
  }

  const removeAttachment = (attachmentId: string) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId))
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const otherUser = currentUserType === 'customer' 
    ? { name: conversation.vendorName, avatar: conversation.vendorAvatar }
    : { name: conversation.customerName, avatar: conversation.customerAvatar }

  return (
    <div className={`flex flex-col h-full bg-white rounded-lg shadow-lg ${className}`}>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {otherUser.avatar ? (
              <img src={otherUser.avatar} alt={otherUser.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-medium text-gray-600">
                {otherUser.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{otherUser.name}</h3>
            <p className="text-sm text-gray-500">
              {currentUserType === 'customer' ? 'Vendor' : 'Customer'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwn = message.senderId === currentUserId
          
          return (
            <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md`}>
                {!isOwn && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-gray-600">{message.senderName}</span>
                  </div>
                )}
                
                <div className={`rounded-lg px-4 py-2 ${
                  isOwn 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  {message.message && (
                    <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                  )}
                  
                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment) => (
                        <div key={attachment.id}>
                          {attachment.type === 'image' ? (
                            <img 
                              src={attachment.url} 
                              alt={attachment.name}
                              className="rounded max-w-full h-auto cursor-pointer hover:opacity-90"
                              onClick={() => window.open(attachment.url, '_blank')}
                            />
                          ) : (
                            <div className={`flex items-center gap-2 p-2 rounded ${
                              isOwn ? 'bg-primary-600' : 'bg-gray-200'
                            }`}>
                              <File className="w-4 h-4" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm truncate">{attachment.name}</p>
                                <p className="text-xs opacity-75">{formatFileSize(attachment.size)}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                  {isOwn && (
                    <span className="text-xs text-gray-500">
                      {message.isRead ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachment Preview */}
      {attachments.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="relative">
                {attachment.type === 'image' ? (
                  <div className="relative">
                    <img 
                      src={attachment.url} 
                      alt={attachment.name}
                      className="w-16 h-16 object-cover rounded border"
                    />
                    <button
                      onClick={() => removeAttachment(attachment.id)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-white rounded border max-w-32">
                    <File className="w-4 h-4 text-gray-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs truncate">{attachment.name}</p>
                    </div>
                    <button
                      onClick={() => removeAttachment(attachment.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-end gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt"
            className="hidden"
          />
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="w-full resize-none border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              style={{ 
                minHeight: '42px',
                maxHeight: '120px'
              }}
            />
          </div>
          
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim() && attachments.length === 0}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Chat List Component
interface ChatListProps {
  conversations: ChatConversation[]
  onSelectConversation: (conversation: ChatConversation) => void
  selectedConversationId?: string
  currentUserType: 'customer' | 'vendor'
}

export const ChatList: React.FC<ChatListProps> = ({
  conversations,
  onSelectConversation,
  selectedConversationId,
  currentUserType
}) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffHours < 24) {
      return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    } else if (diffHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    }
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        const otherUser = currentUserType === 'customer'
          ? { name: conversation.vendorName, avatar: conversation.vendorAvatar }
          : { name: conversation.customerName, avatar: conversation.customerAvatar }
        
        const isSelected = conversation.id === selectedConversationId
        
        return (
          <Card
            key={conversation.id}
            className={`p-4 cursor-pointer transition-colors ${
              isSelected ? 'bg-primary-50 border-primary-200' : 'hover:bg-gray-50'
            }`}
            onClick={() => onSelectConversation(conversation)}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {otherUser.avatar ? (
                    <img src={otherUser.avatar} alt={otherUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-medium text-gray-600">
                      {otherUser.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                {conversation.isActive && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 truncate">{otherUser.name}</h3>
                  <span className="text-xs text-gray-500">{formatTime(conversation.lastMessage.timestamp)}</span>
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage.message || 'Attachment'}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full min-w-5 h-5 flex items-center justify-center">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}