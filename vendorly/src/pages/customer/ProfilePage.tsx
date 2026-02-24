import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Input, Badge, Modal } from '../../components/ui'
import { supabaseService } from '../../services/supabaseService'
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Camera, 
  Edit,
  Save,
  X,
  Shield,
  Bell,
  CreditCard,
  Gift,
  Star,
  ShoppingBag,
  Clock,
  Settings
} from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  location: {
    address: string
    city: string
    state: string
    pincode: string
  }
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum'
  loyaltyPoints: number
  totalOrders: number
  totalSpent: number
  joinedDate: string
  preferences: {
    notifications: boolean
    newsletter: boolean
    smsUpdates: boolean
    emailOffers: boolean
  }
}

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile>({
    id: 'user123',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@email.com',
    phone: '+91 9876543210',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    location: {
      address: '123 MG Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001'
    },
    loyaltyTier: 'gold',
    loyaltyPoints: 2450,
    totalOrders: 47,
    totalSpent: 23450,
    joinedDate: '2024-01-15',
    preferences: {
      notifications: true,
      newsletter: true,
      smsUpdates: false,
      emailOffers: true
    }
  })

  const [editing, setEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState(profile)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fileInputRef] = useState(React.createRef<HTMLInputElement>())

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      // Try to load from Supabase first
      const userId = localStorage.getItem('demoUser') ? JSON.parse(localStorage.getItem('demoUser') || '{}').profile?.id : null
      if (userId && supabaseService.isConfigured()) {
        const userProfile = await supabaseService.getUser(userId)
        if (userProfile) {
          const formattedProfile: UserProfile = {
            id: userProfile.id,
            name: userProfile.name,
            email: userProfile.email,
            phone: userProfile.phone || '',
            avatar: '',
            location: {
              address: '',
              city: '',
              state: '',
              pincode: ''
            },
            loyaltyTier: 'gold',
            loyaltyPoints: 2450,
            totalOrders: 47,
            totalSpent: 23450,
            joinedDate: userProfile.created_at,
            preferences: {
              notifications: true,
              newsletter: true,
              smsUpdates: false,
              emailOffers: true
            }
          }
          setProfile(formattedProfile)
          setEditedProfile(formattedProfile)
          return
        }
      }
      
      // Load from localStorage if available
      const savedProfile = localStorage.getItem('vendorly_user_profile')
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile)
        setProfile(parsedProfile)
        setEditedProfile(parsedProfile)
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
      // Fallback to default profile
    }
  }

  const handleSaveProfile = async () => {
    try {
      setLoading(true)
      
      // Try to save to Supabase first
      const userId = profile.id
      if (userId && supabaseService.isConfigured()) {
        try {
          await supabaseService.updateUser(userId, {
            name: editedProfile.name,
            email: editedProfile.email,
            phone: editedProfile.phone
          })
          alert('Profile updated successfully!')
        } catch (error) {
          console.error('Failed to update profile in Supabase:', error)
          // Fallback to localStorage
        }
      }
      
      // Save to localStorage for persistence
      localStorage.setItem('vendorly_user_profile', JSON.stringify(editedProfile))
      
      // Update local state
      setProfile(editedProfile)
      setEditing(false)
      
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditedProfile(profile)
    setEditing(false)
  }

  const handleInputChange = (field: string, value: any) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleLocationChange = (field: string, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }))
  }

  const handlePreferenceChange = (field: string, value: boolean) => {
    setEditedProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }))
  }

  // Photo upload functionality
  const handlePhotoUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }
      
      // Create object URL for preview
      const imageUrl = URL.createObjectURL(file)
      
      // Update profile with new avatar
      const updatedProfile = { ...editedProfile, avatar: imageUrl }
      setEditedProfile(updatedProfile)
      setProfile(updatedProfile)
      
      // Save to localStorage
      localStorage.setItem('vendorly_user_profile', JSON.stringify(updatedProfile))
      
      setShowAvatarModal(false)
      alert('Profile picture updated successfully!')
      
      // In real app, upload to server
      // uploadProfileImage(file)
    }
  }

  // Quick action handlers
  const handleChangePassword = () => {
    // Navigate to change password page or show modal
    alert('Change Password functionality - In real app, this would open a secure password change form')
  }

  const handleNotificationSettings = () => {
    // Navigate to notification settings or show modal
    alert('Notification Settings - In real app, this would open detailed notification preferences')
  }

  const handlePaymentMethods = () => {
    // Navigate to payment methods page
    alert('Payment Methods - In real app, this would show saved cards, UPI, wallets etc.')
  }

  const handleAccountSettings = () => {
    // Navigate to account settings page
    alert('Account Settings - In real app, this would open advanced account management options')
  }

  const getLoyaltyBadge = (tier: string) => {
    const tierConfig = {
      bronze: { color: 'bg-orange-100 text-orange-800', text: 'Bronze Member', icon: '🥉' },
      silver: { color: 'bg-gray-100 text-gray-800', text: 'Silver Member', icon: '🥈' },
      gold: { color: 'bg-yellow-100 text-yellow-800', text: 'Gold Member', icon: '🥇' },
      platinum: { color: 'bg-purple-100 text-purple-800', text: 'Platinum Member', icon: '💎' }
    }
    const config = tierConfig[tier as keyof typeof tierConfig]
    return (
      <Badge className={`${config.color} text-sm px-3 py-1`}>
        {config.icon} {config.text}
      </Badge>
    )
  }

  const getNextTierProgress = () => {
    const tierThresholds = { bronze: 1000, silver: 5000, gold: 15000, platinum: 50000 }
    const currentTier = profile.loyaltyTier
    
    if (currentTier === 'platinum') {
      return { nextTier: 'platinum', progress: 100, needed: 0 }
    }
    
    const nextTiers = { bronze: 'silver', silver: 'gold', gold: 'platinum' }
    const nextTier = nextTiers[currentTier as keyof typeof nextTiers]
    const threshold = tierThresholds[nextTier as keyof typeof tierThresholds]
    const progress = Math.min((profile.totalSpent / threshold) * 100, 100)
    const needed = Math.max(threshold - profile.totalSpent, 0)
    
    return { nextTier, progress, needed }
  }

  const tierProgress = getNextTierProgress()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                {!editing ? (
                  <Button
                    variant="outline"
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                      className="flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleSaveProfile}
                      isLoading={loading}
                      className="flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </Button>
                  </div>
                )}
              </div>

              {/* Profile Avatar */}
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  {editing && (
                    <button
                      onClick={() => setShowAvatarModal(true)}
                      className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{profile.name}</h3>
                  <p className="text-gray-600">Member since {new Date(profile.joinedDate).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <Input
                    value={editing ? editedProfile.name : profile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!editing}
                    leftIcon={User}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input
                    value={editing ? editedProfile.email : profile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!editing}
                    type="email"
                    leftIcon={Mail}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <Input
                    value={editing ? editedProfile.phone : profile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!editing}
                    leftIcon={Phone}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <Input
                    value={editing ? editedProfile.location.pincode : profile.location.pincode}
                    onChange={(e) => handleLocationChange('pincode', e.target.value)}
                    disabled={!editing}
                    leftIcon={MapPin}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <Input
                    value={editing ? editedProfile.location.address : profile.location.address}
                    onChange={(e) => handleLocationChange('address', e.target.value)}
                    disabled={!editing}
                    leftIcon={MapPin}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <Input
                    value={editing ? editedProfile.location.city : profile.location.city}
                    onChange={(e) => handleLocationChange('city', e.target.value)}
                    disabled={!editing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <Input
                    value={editing ? editedProfile.location.state : profile.location.state}
                    onChange={(e) => handleLocationChange('state', e.target.value)}
                    disabled={!editing}
                  />
                </div>
              </div>
            </Card>

            {/* Notification Preferences */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { key: 'notifications', label: 'Push Notifications', desc: 'Receive push notifications for orders and updates' },
                  { key: 'newsletter', label: 'Newsletter', desc: 'Get weekly newsletters with deals and offers' },
                  { key: 'smsUpdates', label: 'SMS Updates', desc: 'Receive SMS for important order updates' },
                  { key: 'emailOffers', label: 'Email Offers', desc: 'Get promotional emails with special offers' }
                ].map((pref) => (
                  <div key={pref.key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{pref.label}</p>
                      <p className="text-sm text-gray-600">{pref.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editing ? editedProfile.preferences[pref.key as keyof typeof editedProfile.preferences] : profile.preferences[pref.key as keyof typeof profile.preferences]}
                        onChange={(e) => handlePreferenceChange(pref.key, e.target.checked)}
                        disabled={!editing}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Stats & Loyalty */}
          <div className="space-y-6">
            {/* Loyalty Status */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Loyalty Status</h3>
              <div className="text-center mb-4">
                {getLoyaltyBadge(profile.loyaltyTier)}
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Points Balance</span>
                  <span className="font-semibold">{profile.loyaltyPoints.toLocaleString()}</span>
                </div>
                
                {tierProgress.nextTier !== 'platinum' && (
                  <>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${tierProgress.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-center text-sm text-gray-600">
                      Spend ₹{tierProgress.needed.toLocaleString()} more to reach {tierProgress.nextTier} tier
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Account Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-600">Total Orders</span>
                  </div>
                  <span className="font-semibold">{profile.totalOrders}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600">Total Spent</span>
                  </div>
                  <span className="font-semibold">₹{profile.totalSpent.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-600">Rewards Earned</span>
                  </div>
                  <span className="font-semibold">{profile.loyaltyPoints}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span className="text-gray-600">Member Since</span>
                  </div>
                  <span className="font-semibold">{new Date(profile.joinedDate).getFullYear()}</span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleChangePassword}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleNotificationSettings}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Notification Settings
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handlePaymentMethods}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payment Methods
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleAccountSettings}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Avatar Upload Modal */}
        <Modal
          isOpen={showAvatarModal}
          onClose={() => setShowAvatarModal(false)}
          title="Update Profile Picture"
        >
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mx-auto mb-4">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              
              <Button 
                variant="primary" 
                className="flex items-center gap-2 mx-auto"
                onClick={handlePhotoUpload}
              >
                <Camera className="w-4 h-4" />
                Upload New Photo
              </Button>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Upload a new profile picture. Recommended size: 300x300px (Max: 5MB)
            </p>
            <div className="text-xs text-gray-500 text-center">
              Supported formats: JPG, PNG, GIF
            </div>
          </div>
        </Modal>
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => navigate('/chat')}
        className="fixed bottom-20 right-4 bg-primary hover:bg-primary-600 text-white p-4 rounded-full shadow-lg z-50 transition-transform duration-300 ease-in-out transform hover:scale-105"
        aria-label="Open chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle">
          <path d="M7.9 20A9 9 0 1 0 4 16.1a2 2 0 0 1 2.1-2.1L12 12l3.9-3.9a2 2 0 0 1 2.1-2.1A9 9 0 1 0 7.9 20z" />
        </svg>
      </button>
    </div>
  )
}