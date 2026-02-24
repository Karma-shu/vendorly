import React, { useState } from 'react'
import { Search, Plus, MessageCircle, Clock, CheckCircle, AlertCircle, User, Paperclip } from 'lucide-react'
import { Button } from './Button'
import { Card } from './Card'
import { Badge } from './Badge'
import { Input } from './Input'
import type { SupportTicket, SupportMessage } from '../../types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FilterPlaceholder = null;

interface SupportTicketListProps {
  tickets: SupportTicket[]
  onSelectTicket: (ticket: SupportTicket) => void
  onCreateTicket: () => void
  selectedTicketId?: string
  currentUserType: 'customer' | 'vendor'
}

export const SupportTicketList: React.FC<SupportTicketListProps> = ({
  tickets,
  onSelectTicket,
  onCreateTicket,
  selectedTicketId,
  currentUserType
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all')
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'order' | 'payment' | 'technical' | 'general' | 'account'>('all')

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = searchQuery === '' || 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusConfig = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open':
        return { variant: 'warning' as const, icon: AlertCircle, label: 'Open' }
      case 'in_progress':
        return { variant: 'info' as const, icon: Clock, label: 'In Progress' }
      case 'resolved':
        return { variant: 'success' as const, icon: CheckCircle, label: 'Resolved' }
      case 'closed':
        return { variant: 'default' as const, icon: CheckCircle, label: 'Closed' }
      default:
        return { variant: 'default' as const, icon: AlertCircle, label: status }
    }
  }

  const getPriorityConfig = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'urgent':
        return { variant: 'error' as const, label: 'Urgent' }
      case 'high':
        return { variant: 'warning' as const, label: 'High' }
      case 'medium':
        return { variant: 'info' as const, label: 'Medium' }
      case 'low':
        return { variant: 'default' as const, label: 'Low' }
      default:
        return { variant: 'default' as const, label: priority }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 24) {
      return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    } else if (diffHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-semibold text-gray-900">Support Tickets</h2>
        <Button onClick={onCreateTicket}>
          <Plus className="w-4 h-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'open' | 'in_progress' | 'resolved' | 'closed')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as 'all' | 'order' | 'payment' | 'technical' | 'general' | 'account')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="order">Order Issues</option>
            <option value="payment">Payment</option>
            <option value="technical">Technical</option>
            <option value="general">General</option>
            <option value="account">Account</option>
          </select>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{filteredTickets.length} tickets</span>
          </div>
        </div>
      </Card>

      {/* Ticket List */}
      <div className="space-y-3">
        {filteredTickets.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first support ticket to get help'}
            </p>
            {!searchQuery && statusFilter === 'all' && categoryFilter === 'all' && (
              <Button onClick={onCreateTicket}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Ticket
              </Button>
            )}
          </Card>
        ) : (
          filteredTickets.map((ticket) => {
            const statusConfig = getStatusConfig(ticket.status)
            const priorityConfig = getPriorityConfig(ticket.priority)
            const StatusIcon = statusConfig.icon
            const isSelected = ticket.id === selectedTicketId
            const lastMessage = ticket.messages[ticket.messages.length - 1]
            
            return (
              <Card
                key={ticket.id}
                className={`p-4 cursor-pointer transition-colors ${
                  isSelected ? 'bg-primary-50 border-primary-200' : 'hover:bg-gray-50'
                }`}
                onClick={() => onSelectTicket(ticket)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <StatusIcon className={`w-5 h-5 ${
                      ticket.status === 'open' ? 'text-yellow-600' :
                      ticket.status === 'in_progress' ? 'text-blue-600' :
                      ticket.status === 'resolved' ? 'text-green-600' :
                      'text-gray-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900 truncate">{ticket.subject}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-500">#{ticket.id}</span>
                          <Badge variant={statusConfig.variant} size="sm">
                            {statusConfig.label}
                          </Badge>
                          <Badge variant={priorityConfig.variant} size="sm">
                            {priorityConfig.label}
                          </Badge>
                          <span className="text-sm text-gray-500 capitalize">{ticket.category}</span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{formatDate(ticket.updatedAt)}</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {ticket.description}
                    </p>
                    
                    {lastMessage && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User className="w-4 h-4" />
                        <span>Last reply by {lastMessage.senderName}</span>
                        <span>•</span>
                        <span>{formatDate(lastMessage.createdAt)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{ticket.messages.length}</span>
                    <MessageCircle className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

// Support Ticket Detail Component
interface SupportTicketDetailProps {
  ticket: SupportTicket
  onSendMessage: (message: string, attachments?: any[]) => void
  onUpdateStatus: (status: SupportTicket['status']) => void
  currentUserId: string
  currentUserType: 'customer' | 'vendor'
}

export const SupportTicketDetail: React.FC<SupportTicketDetailProps> = ({
  ticket,
  onSendMessage,
  onUpdateStatus,
  currentUserId,
  currentUserType
}) => {
  const [newMessage, setNewMessage] = useState('')
  const [attachments, setAttachments] = useState<any[]>([])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim(), attachments)
      setNewMessage('')
      setAttachments([])
    }
  }

  const getStatusConfig = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open':
        return { variant: 'warning' as const, icon: AlertCircle, label: 'Open' }
      case 'in_progress':
        return { variant: 'info' as const, icon: Clock, label: 'In Progress' }
      case 'resolved':
        return { variant: 'success' as const, icon: CheckCircle, label: 'Resolved' }
      case 'closed':
        return { variant: 'default' as const, icon: CheckCircle, label: 'Closed' }
      default:
        return { variant: 'default' as const, icon: AlertCircle, label: status }
    }
  }

  const getPriorityConfig = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'urgent':
        return { variant: 'error' as const, label: 'Urgent' }
      case 'high':
        return { variant: 'warning' as const, label: 'High' }
      case 'medium':
        return { variant: 'info' as const, label: 'Medium' }
      case 'low':
        return { variant: 'default' as const, label: 'Low' }
      default:
        return { variant: 'default' as const, label: priority }
    }
  }

  const statusConfig = getStatusConfig(ticket.status)
  const priorityConfig = getPriorityConfig(ticket.priority)

  return (
    <div className="space-y-6">
      {/* Ticket Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-heading font-semibold text-gray-900">{ticket.subject}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-gray-500">#{ticket.id}</span>
              <Badge variant={statusConfig.variant}>
                {statusConfig.label}
              </Badge>
              <Badge variant={priorityConfig.variant}>
                {priorityConfig.label}
              </Badge>
              <span className="text-sm text-gray-500 capitalize">{ticket.category}</span>
            </div>
          </div>
          
          {currentUserType === 'vendor' && ticket.status !== 'closed' && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateStatus('in_progress')}
                disabled={ticket.status === 'in_progress'}
              >
                Mark In Progress
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateStatus('resolved')}
                disabled={ticket.status === 'resolved'}
              >
                Mark Resolved
              </Button>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700">{ticket.description}</p>
          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {ticket.attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center gap-2 bg-white rounded px-3 py-2 text-sm">
                  <Paperclip className="w-4 h-4 text-gray-400" />
                  <span>{attachment.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Messages */}
      <Card className="p-6">
        <h3 className="text-lg font-heading font-semibold text-gray-900 mb-4">Conversation</h3>
        
        <div className="space-y-4 mb-6">
          {ticket.messages.map((message) => {
            const isOwn = message.senderId === currentUserId
            
            return (
              <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md ${isOwn ? 'bg-primary text-white' : 'bg-gray-100 text-gray-900'} rounded-lg p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-sm font-medium ${isOwn ? 'text-primary-100' : 'text-gray-700'}`}>
                      {message.senderName}
                    </span>
                    <span className={`text-xs ${isOwn ? 'text-primary-200' : 'text-gray-500'}`}>
                      {new Date(message.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                  
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center gap-2 text-sm">
                          <Paperclip className="w-3 h-3" />
                          <span>{attachment.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Reply Form */}
        {ticket.status !== 'closed' && (
          <div className="border-t border-gray-200 pt-4">
            <div className="space-y-3">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your reply..."
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm">
                  <Paperclip className="w-4 h-4 mr-2" />
                  Attach File
                </Button>
                
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  Send Reply
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}