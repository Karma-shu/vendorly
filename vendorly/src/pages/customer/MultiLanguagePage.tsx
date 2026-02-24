import React from 'react'
import { useI18n, useTranslation } from '../../contexts/I18nContext'
import { LanguageToggle } from '../../components/i18n/LanguageSelector'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui'
import { Globe, Users, Smartphone, Heart } from 'lucide-react'

export const MultiLanguagePage: React.FC = () => {
  const { currentLanguage, formatCurrency, formatDate, isRTL } = useI18n()
  const { t } = useTranslation('common')
  const authT = useTranslation('auth').t
  const productsT = useTranslation('products').t
  const ordersT = useTranslation('orders').t

  const sampleProducts = [
    {
      name: {
        en: 'Chicken Biryani',
        hi: 'चिकन बिरयानी',
        ta: 'சிக்கன் பிரியாணி',
        te: 'చికెన్ బిర్యానీ',
        bn: 'চিকেন বিরিয়ানি'
      },
      price: 299,
      rating: 4.5
    },
    {
      name: {
        en: 'Fresh Vegetables',
        hi: 'ताज़ी सब्जियां',
        ta: 'புதிய காய்கறிகள்',
        te: 'తాజా కూరగాయలు',
        bn: 'তাজা সবজি'
      },
      price: 150,
      rating: 4.2
    },
    {
      name: {
        en: 'Masala Chai',
        hi: 'मसाला चाय',
        ta: 'மசாலா சாய்',
        te: 'మసాలా చాయ్',
        bn: 'মসলা চা'
      },
      price: 25,
      rating: 4.8
    }
  ]

  const getProductName = (product: typeof sampleProducts[0]) => {
    return product.name[currentLanguage.code as keyof typeof product.name] || product.name.en
  }

  return (
    <div className={`p-6 max-w-6xl mx-auto space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🌐 Multi-Language Support Demo
        </h1>
        <p className="text-gray-600">
          Experience Vendorly in your preferred language
        </p>
      </div>

      {/* Language Selector */}
      <div className="flex justify-center">
        <div className="flex items-center gap-4">
          <Globe className="w-6 h-6 text-primary" />
          <span className="font-medium">{t('language', 'Language')}:</span>
          <LanguageToggle compact />
        </div>
      </div>

      {/* Current Language Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">{currentLanguage.flag}</span>
            {t('language', 'Language')}: {currentLanguage.nativeName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-sm text-gray-500">Code</h4>
              <p className="text-lg font-bold">{currentLanguage.code.toUpperCase()}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-sm text-gray-500">Direction</h4>
              <p className="text-lg font-bold">{currentLanguage.direction.toUpperCase()}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-sm text-gray-500">Sample Date</h4>
              <p className="text-lg font-bold">{formatDate(new Date())}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-sm text-gray-500">Sample Price</h4>
              <p className="text-lg font-bold">{formatCurrency(299)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Translation Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Common UI Translations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              {t('common', 'Common UI Elements')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-gray-500">Search</p>
                  <p className="font-medium">{t('search', 'Search')}</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-gray-500">Home</p>
                  <p className="font-medium">{t('home', 'Home')}</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-gray-500">Profile</p>
                  <p className="font-medium">{t('profile', 'Profile')}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-gray-500">Settings</p>
                  <p className="font-medium">{t('settings', 'Settings')}</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-gray-500">Notifications</p>
                  <p className="font-medium">{t('notifications', 'Notifications')}</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-gray-500">Help</p>
                  <p className="font-medium">{t('help', 'Help')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Authentication Translations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {authT('welcomeTitle', 'Authentication')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <p className="text-sm text-gray-500">Welcome Title</p>
                <p className="font-medium">{authT('welcomeTitle', 'Welcome to Vendorly')}</p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium">{authT('phoneNumber', 'Phone Number')}</p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium">{authT('customer', 'Customer')}</p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-sm text-gray-500">Vendor</p>
                <p className="font-medium">{authT('vendor', 'Vendor')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Showcase */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            {productsT('trending', 'Trending Products')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sampleProducts.map((product, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-bold text-lg mb-2">{getProductName(product)}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold">
                    {formatCurrency(product.price)}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm">{product.rating}</span>
                  </div>
                </div>
                <button className="w-full mt-3 bg-primary text-white py-2 rounded-lg font-medium">
                  {productsT('addToCart', 'Add to Cart')}
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Orders Section */}
      <Card>
        <CardHeader>
          <CardTitle>{ordersT('myOrders', 'My Orders')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{ordersT('orderNumber', 'Order Number')}: #VND-001</p>
                <p className="text-sm text-gray-500">
                  {ordersT('orderDate', 'Order Date')}: {formatDate(new Date())}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">{formatCurrency(574)}</p>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {ordersT('delivered', 'Delivered')}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{ordersT('orderNumber', 'Order Number')}: #VND-002</p>
                <p className="text-sm text-gray-500">
                  {ordersT('orderDate', 'Order Date')}: {formatDate(new Date(Date.now() - 24 * 60 * 60 * 1000))}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">{formatCurrency(299)}</p>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {ordersT('preparing', 'Preparing')}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Info */}
      <Card>
        <CardHeader>
          <CardTitle>🌟 Multi-Language Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl mb-2">🗣️</div>
              <h4 className="font-bold">Native Script Support</h4>
              <p className="text-sm text-gray-600 mt-1">
                Hindi (हिन्दी), Tamil (தமிழ்), Telugu (తెలుగు), Bengali (বাংলা)
              </p>
            </div>
            
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl mb-2">💰</div>
              <h4 className="font-bold">Cultural Formatting</h4>
              <p className="text-sm text-gray-600 mt-1">
                Date, time, currency, and number formatting
              </p>
            </div>
            
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl mb-2">📱</div>
              <h4 className="font-bold">Browser Detection</h4>
              <p className="text-sm text-gray-600 mt-1">
                Automatic language detection from browser settings
              </p>
            </div>
            
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl mb-2">💾</div>
              <h4 className="font-bold">Persistent Preference</h4>
              <p className="text-sm text-gray-600 mt-1">
                Language preference saved locally
              </p>
            </div>
            
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl mb-2">🔄</div>
              <h4 className="font-bold">Real-time Switching</h4>
              <p className="text-sm text-gray-600 mt-1">
                Instant language change without page reload
              </p>
            </div>
            
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl mb-2">🌍</div>
              <h4 className="font-bold">RTL Support Ready</h4>
              <p className="text-sm text-gray-600 mt-1">
                Right-to-left layout support for Urdu/Arabic
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}