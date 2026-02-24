import React, { useState } from 'react'
import VendorLayout from '../../components/layout/VendorLayout'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { 
  Store,
  MapPin,
  Clock,
  Phone,
  Mail,
  Camera,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Settings,
  Bell,
  Shield,
  CreditCard,
  FileText
} from 'lucide-react'

const VendorSettings: React.FC = () => {
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [businessInfo, setBusinessInfo] = useState({
    businessName: 'Fresh Fruits Corner',
    description: 'Premium quality fresh fruits delivered to your doorstep. We source directly from farmers to ensure the best quality and freshness.',
    email: 'vendor@demo.com',
    phone: '+91 98765 12345',
    address: {
      addressLine1: '123 Main Street',
      addressLine2: 'Near City Mall',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India'
    },
    businessHours: {
      monday: { open: '08:00', close: '20:00', isClosed: false },
      tuesday: { open: '08:00', close: '20:00', isClosed: false },
      wednesday: { open: '08:00', close: '20:00', isClosed: false },
      thursday: { open: '08:00', close: '20:00', isClosed: false },
      friday: { open: '08:00', close: '20:00', isClosed: false },
      saturday: { open: '08:00', close: '20:00', isClosed: false },
      sunday: { open: '09:00', close: '18:00', isClosed: false }
    },
    deliveryRadius: 5,
    minimumOrder: 100,
    deliveryFee: 20
  })

  const [notifications, setNotifications] = useState({
    emailOrders: true,
    smsOrders: true,
    pushOrders: true,
    emailPromotions: false,
    smsPromotions: false,
    pushPromotions: true
  })

  const handleSaveSection = (section: string) => {
    // Mock save - in real app, this would call an API
    console.log('Saving section:', section)
    setEditingSection(null)
  }

  const handleCancelEdit = () => {
    setEditingSection(null)
    // Reset form data to original state if needed
  }

  const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

  return (
    <VendorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900">Business Settings</h1>
            <p className="text-gray-600">Manage your business profile and preferences</p>
          </div>
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Verified Business
          </Badge>
        </div>

        {/* Business Profile */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Store className="w-6 h-6 text-primary" />
              <h2 className="text-lg font-heading font-semibold text-gray-900">Business Profile</h2>
            </div>
            {editingSection !== 'profile' ? (
              <Button variant="outline" size="sm" onClick={() => setEditingSection('profile')}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button size="sm" onClick={() => handleSaveSection('profile')}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Business Logo */}
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 relative group">
                <Store className="w-12 h-12 text-gray-400" />
                {editingSection === 'profile' && (
                  <button className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-600">Business Logo</p>
            </div>

            {/* Business Details */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                  {editingSection === 'profile' ? (
                    <Input
                      value={businessInfo.businessName}
                      onChange={(e) => setBusinessInfo({...businessInfo, businessName: e.target.value})}
                    />
                  ) : (
                    <p className="font-medium text-gray-900">{businessInfo.businessName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  {editingSection === 'profile' ? (
                    <Input
                      type="email"
                      value={businessInfo.email}
                      onChange={(e) => setBusinessInfo({...businessInfo, email: e.target.value})}
                    />
                  ) : (
                    <p className="text-gray-900">{businessInfo.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  {editingSection === 'profile' ? (
                    <Input
                      value={businessInfo.phone}
                      onChange={(e) => setBusinessInfo({...businessInfo, phone: e.target.value})}
                    />
                  ) : (
                    <p className="text-gray-900">{businessInfo.phone}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                {editingSection === 'profile' ? (
                  <textarea
                    rows={3}
                    value={businessInfo.description}
                    onChange={(e) => setBusinessInfo({...businessInfo, description: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-700">{businessInfo.description}</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Address & Delivery */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-primary" />
              <h2 className="text-lg font-heading font-semibold text-gray-900">Address & Delivery</h2>
            </div>
            {editingSection !== 'address' ? (
              <Button variant="outline" size="sm" onClick={() => setEditingSection('address')}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button size="sm" onClick={() => handleSaveSection('address')}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
                {editingSection === 'address' ? (
                  <Input
                    value={businessInfo.address.addressLine1}
                    onChange={(e) => setBusinessInfo({
                      ...businessInfo,
                      address: {...businessInfo.address, addressLine1: e.target.value}
                    })}
                  />
                ) : (
                  <p className="text-gray-900">{businessInfo.address.addressLine1}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                {editingSection === 'address' ? (
                  <Input
                    value={businessInfo.address.addressLine2}
                    onChange={(e) => setBusinessInfo({
                      ...businessInfo,
                      address: {...businessInfo.address, addressLine2: e.target.value}
                    })}
                  />
                ) : (
                  <p className="text-gray-900">{businessInfo.address.addressLine2}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  {editingSection === 'address' ? (
                    <Input
                      value={businessInfo.address.city}
                      onChange={(e) => setBusinessInfo({
                        ...businessInfo,
                        address: {...businessInfo.address, city: e.target.value}
                      })}
                    />
                  ) : (
                    <p className="text-gray-900">{businessInfo.address.city}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                  {editingSection === 'address' ? (
                    <Input
                      value={businessInfo.address.postalCode}
                      onChange={(e) => setBusinessInfo({
                        ...businessInfo,
                        address: {...businessInfo.address, postalCode: e.target.value}
                      })}
                    />
                  ) : (
                    <p className="text-gray-900">{businessInfo.address.postalCode}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Radius (km)</label>
                  {editingSection === 'address' ? (
                    <Input
                      type="number"
                      value={businessInfo.deliveryRadius}
                      onChange={(e) => setBusinessInfo({...businessInfo, deliveryRadius: Number(e.target.value)})}
                    />
                  ) : (
                    <p className="text-gray-900">{businessInfo.deliveryRadius} km</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Fee (₹)</label>
                  {editingSection === 'address' ? (
                    <Input
                      type="number"
                      value={businessInfo.deliveryFee}
                      onChange={(e) => setBusinessInfo({...businessInfo, deliveryFee: Number(e.target.value)})}
                    />
                  ) : (
                    <p className="text-gray-900">₹{businessInfo.deliveryFee}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Order (₹)</label>
                {editingSection === 'address' ? (
                  <Input
                    type="number"
                    value={businessInfo.minimumOrder}
                    onChange={(e) => setBusinessInfo({...businessInfo, minimumOrder: Number(e.target.value)})}
                  />
                ) : (
                  <p className="text-gray-900">₹{businessInfo.minimumOrder}</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Business Hours */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-primary" />
              <h2 className="text-lg font-heading font-semibold text-gray-900">Business Hours</h2>
            </div>
            {editingSection !== 'hours' ? (
              <Button variant="outline" size="sm" onClick={() => setEditingSection('hours')}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button size="sm" onClick={() => handleSaveSection('hours')}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {dayNames.map((day) => {
              const dayData = businessInfo.businessHours[day as keyof typeof businessInfo.businessHours]
              return (
                <div key={day} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <span className="w-20 text-sm font-medium text-gray-900 capitalize">{day}</span>
                    {editingSection === 'hours' ? (
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!dayData.isClosed}
                          onChange={(e) => {
                            const newHours = {...businessInfo.businessHours}
                            newHours[day as keyof typeof newHours].isClosed = !e.target.checked
                            setBusinessInfo({...businessInfo, businessHours: newHours})
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Open</span>
                      </label>
                    ) : (
                      dayData.isClosed ? (
                        <Badge variant="error" size="sm">Closed</Badge>
                      ) : (
                        <Badge variant="success" size="sm">Open</Badge>
                      )
                    )}
                  </div>
                  
                  {!dayData.isClosed && (
                    <div className="flex items-center gap-2">
                      {editingSection === 'hours' ? (
                        <>
                          <input
                            type="time"
                            value={dayData.open}
                            onChange={(e) => {
                              const newHours = {...businessInfo.businessHours}
                              newHours[day as keyof typeof newHours].open = e.target.value
                              setBusinessInfo({...businessInfo, businessHours: newHours})
                            }}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                          <span className="text-gray-500">to</span>
                          <input
                            type="time"
                            value={dayData.close}
                            onChange={(e) => {
                              const newHours = {...businessInfo.businessHours}
                              newHours[day as keyof typeof newHours].close = e.target.value
                              setBusinessInfo({...businessInfo, businessHours: newHours})
                            }}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </>
                      ) : (
                        <span className="text-sm text-gray-600">
                          {dayData.open} - {dayData.close}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Card>

        {/* Notification Preferences */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-primary" />
            <h2 className="text-lg font-heading font-semibold text-gray-900">Notification Preferences</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Order Notifications</h3>
              <div className="space-y-3">
                {[
                  { key: 'emailOrders', label: 'Email notifications for new orders' },
                  { key: 'smsOrders', label: 'SMS notifications for new orders' },
                  { key: 'pushOrders', label: 'Push notifications for new orders' }
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notifications[key as keyof typeof notifications]}
                      onChange={(e) => setNotifications({
                        ...notifications,
                        [key]: e.target.checked
                      })}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="ml-3 text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Marketing Notifications</h3>
              <div className="space-y-3">
                {[
                  { key: 'emailPromotions', label: 'Email promotions and updates' },
                  { key: 'smsPromotions', label: 'SMS promotions and offers' },
                  { key: 'pushPromotions', label: 'Push notifications for promotions' }
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notifications[key as keyof typeof notifications]}
                      onChange={(e) => setNotifications({
                        ...notifications,
                        [key]: e.target.checked
                      })}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="ml-3 text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </VendorLayout>
  )
}

export default VendorSettings