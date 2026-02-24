import React, { useState } from 'react'
import { Search, Phone, Mail, MessageCircle, HelpCircle, BookOpen, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { SupportTicketList, SupportTicketDetail } from '../../components/ui/SupportTicket'
import { useNavigate } from 'react-router-dom'
import type { SupportTicket, FAQ } from '../../types'

// Mock FAQ Data
const mockFAQs: FAQ[] = [
  {
    id: 'faq1',
    question: 'How do I place an order?',
    answer: 'To place an order, browse products, add items to cart, proceed to checkout, select delivery address and payment method, then confirm your order.',
    category: 'orders',
    isPopular: true,
    tags: ['orders', 'checkout', 'buying'],
    helpfulCount: 45,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'faq2',
    question: 'What payment methods are accepted?',
    answer: 'We accept Cash on Delivery, UPI payments, Credit/Debit cards, and digital wallets like Paytm, PhonePe, and Google Pay.',
    category: 'payment',
    isPopular: true,
    tags: ['payment', 'cod', 'upi', 'cards'],
    helpfulCount: 38,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'faq3',
    question: 'How can I track my order?',
    answer: 'You can track your order in the Orders section of your account. You will also receive SMS and push notifications for order updates.',
    category: 'orders',
    isPopular: true,
    tags: ['tracking', 'orders', 'notifications'],
    helpfulCount: 42,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'faq4',
    question: 'What is the delivery time?',
    answer: 'Most orders are delivered within 15-30 minutes. Delivery time may vary based on distance and vendor availability.',
    category: 'delivery',
    isPopular: true,
    tags: ['delivery', 'time', 'speed'],
    helpfulCount: 35,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'faq5',
    question: 'How do I cancel my order?',
    answer: 'You can cancel your order before it is picked up by the vendor. Go to Orders > Select Order > Cancel Order. Refunds are processed within 2-3 business days.',
    category: 'orders',
    isPopular: false,
    tags: ['cancel', 'refund', 'orders'],
    helpfulCount: 28,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'faq6',
    question: 'How do I register as a vendor?',
    answer: 'To register as a vendor, select "Register as Vendor" during sign-up. You will need to provide business documents, PAN card, and bank details for verification.',
    category: 'vendor',
    isPopular: false,
    tags: ['vendor', 'registration', 'business'],
    helpfulCount: 15,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'faq7',
    question: 'What are the vendor commission rates?',
    answer: 'Commission rates vary by category: Groceries (3%), Restaurants (15%), Pharmacy (5%), Electronics (8%). No setup fees or hidden charges.',
    category: 'vendor',
    isPopular: false,
    tags: ['vendor', 'commission', 'rates', 'pricing'],
    helpfulCount: 22,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'faq8',
    question: 'How do I update my delivery address?',
    answer: 'Go to Profile > Manage Addresses > Add/Edit Address. You can set a default address or choose during checkout.',
    category: 'account',
    isPopular: false,
    tags: ['address', 'profile', 'delivery'],
    helpfulCount: 31,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

// Mock Support Tickets
const mockSupportTickets: SupportTicket[] = [
  {
    id: 'TKT001',
    userId: 'customer1',
    userType: 'customer',
    subject: 'Order not delivered',
    description: 'My order #ORD123 was supposed to be delivered 2 hours ago but I haven\'t received it yet.',
    category: 'order',
    priority: 'high',
    status: 'open',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    attachments: [],
    messages: [
      {
        id: 'msg1',
        ticketId: 'TKT001',
        senderId: 'customer1',
        senderName: 'Rahul Sharma',
        senderType: 'customer',
        message: 'My order #ORD123 was supposed to be delivered 2 hours ago but I haven\'t received it yet.',
        attachments: [],
        isInternal: false,
        createdAt: '2024-01-15T10:30:00Z'
      }
    ]
  }
]

interface SupportCenterProps {
  currentUserId?: string
  currentUserType?: 'customer' | 'vendor'
}

const SupportCenter: React.FC<SupportCenterProps> = ({
  currentUserId = 'customer1',
  currentUserType = 'customer'
}) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'help' | 'tickets' | 'contact'>('help')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'orders' | 'payment' | 'delivery' | 'vendor' | 'account'>('all')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(mockSupportTickets)

  // Filter FAQs
  const filteredFAQs = mockFAQs.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const popularFAQs = filteredFAQs.filter(faq => faq.isPopular)

  const handleCreateTicket = () => {
    // Navigate to create ticket page or open modal
    console.log('Create new support ticket')
  }

  const handleSendTicketMessage = (message: string, attachments?: any[]) => {
    // In real app, this would send to backend
    console.log('Send message:', message, attachments)
  }

  const handleUpdateTicketStatus = (status: SupportTicket['status']) => {
    if (selectedTicket) {
      setSupportTickets(prev => 
        prev.map(ticket => 
          ticket.id === selectedTicket.id 
            ? { ...ticket, status, updatedAt: new Date().toISOString() }
            : ticket
        )
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-heading font-bold text-gray-900">Support Center</h1>
            <p className="text-gray-600 mt-1">Get help and find answers to your questions</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('help')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'help'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <HelpCircle className="w-4 h-4 inline-block mr-2" />
              Help & FAQ
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tickets'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageCircle className="w-4 h-4 inline-block mr-2" />
              My Tickets
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'contact'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Phone className="w-4 h-4 inline-block mr-2" />
              Contact Us
            </button>
          </nav>
        </div>

        {/* Help & FAQ Tab */}
        {activeTab === 'help' && (
          <div className="space-y-8">
            {/* Search */}
            <Card className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-heading font-semibold text-gray-900 mb-2">
                  How can we help you?
                </h2>
                <p className="text-gray-600">Search our knowledge base or browse categories</p>
              </div>
              
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search for help..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 py-3 text-lg"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center">
                  {['all', 'orders', 'payment', 'delivery', 'vendor', 'account'].map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category as any)}
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        selectedCategory === category
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category === 'all' ? 'All Topics' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Popular FAQs */}
            {searchQuery === '' && selectedCategory === 'all' && (
              <div>
                <h3 className="text-lg font-heading font-semibold text-gray-900 mb-4">
                  Popular Questions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {popularFAQs.map((faq) => (
                    <Card key={faq.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2">{faq.answer}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 mt-1 ml-2" />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* All FAQs */}
            <div>
              <h3 className="text-lg font-heading font-semibold text-gray-900 mb-4">
                {searchQuery || selectedCategory !== 'all' ? 'Search Results' : 'All Questions'}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({filteredFAQs.length} {filteredFAQs.length === 1 ? 'result' : 'results'})
                </span>
              </h3>
              
              {filteredFAQs.length === 0 ? (
                <Card className="p-8 text-center">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No results found</h4>
                  <p className="text-gray-600 mb-4">
                    Try different keywords or browse our popular questions above
                  </p>
                  <Button onClick={() => setActiveTab('tickets')}>
                    Create Support Ticket
                  </Button>
                </Card>
              ) : (
                <div className="space-y-3">
                  {filteredFAQs.map((faq) => (
                    <Card key={faq.id} className="overflow-hidden">
                      <button
                        onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                        className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{faq.question}</h4>
                          {expandedFAQ === faq.id ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </button>
                      
                      {expandedFAQ === faq.id && (
                        <div className="px-4 pb-4 border-t border-gray-100">
                          <p className="text-gray-700 pt-3">{faq.answer}</p>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Support Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <SupportTicketList
                tickets={supportTickets}
                onSelectTicket={setSelectedTicket}
                onCreateTicket={handleCreateTicket}
                selectedTicketId={selectedTicket?.id}
                currentUserType={currentUserType}
              />
            </div>
            
            <div className="lg:col-span-2">
              {selectedTicket ? (
                <SupportTicketDetail
                  ticket={selectedTicket}
                  onSendMessage={handleSendTicketMessage}
                  onUpdateStatus={handleUpdateTicketStatus}
                  currentUserId={currentUserId}
                  currentUserType={currentUserType}
                />
              ) : (
                <Card className="p-8 text-center">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a ticket</h3>
                  <p className="text-gray-600">Choose a support ticket from the list to view details</p>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Contact Us Tab */}
        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600 mb-4">Speak to our customer support team</p>
              <p className="text-lg font-semibold text-gray-900 mb-2">+91 1800-123-4567</p>
              <p className="text-sm text-gray-500">Mon-Sun: 6:00 AM - 12:00 AM</p>
              <Button className="mt-4 w-full">
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
            </Card>

            <Card className="p-6 text-center">
              <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600 mb-4">Send us your queries and we'll respond</p>
              <p className="text-lg font-semibold text-gray-900 mb-2">support@vendorly.in</p>
              <p className="text-sm text-gray-500">Response within 24 hours</p>
              <Button className="mt-4 w-full">
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            </Card>

            <Card className="p-6 text-center">
              <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600 mb-4">Chat with our support team in real-time</p>
              <p className="text-lg font-semibold text-gray-900 mb-2">Available Now</p>
              <p className="text-sm text-gray-500">Average response: 2 minutes</p>
              <Button 
                className="mt-4 w-full"
                onClick={() => navigate('/chat')}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Chat
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default SupportCenter