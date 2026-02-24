import React from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { WelcomePage } from './pages/auth/WelcomePage'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { OTPVerifyPage } from './pages/auth/OTPVerifyPage'
import { UserTypePage } from './pages/auth/UserTypePage'
import { VendorOnboardingPage } from './pages/vendor/VendorOnboardingPage'
import { HomePage } from './pages/customer/HomePage'
import { SearchPage } from './pages/customer/SearchPage'
import { CategoryPage } from './pages/customer/CategoryPage'
import { VendorPage } from './pages/customer/VendorPage'
import { ProductPage } from './pages/customer/ProductPage'
import { CartPage } from './pages/customer/CartPage'
import CheckoutPage from './pages/customer/CheckoutPage'
import OrdersPage from './pages/customer/OrdersPage'
import OrderTrackingPage from './pages/customer/OrderTrackingPage'
import VendorDashboard from './pages/vendor/VendorDashboard'
import ProductManagement from './pages/vendor/ProductManagement'
import VendorOrders from './pages/vendor/VendorOrders'
import VendorAnalytics from './pages/vendor/VendorAnalytics'
import VendorSettings from './pages/vendor/VendorSettings'
import ChatPage from './pages/shared/ChatPage'
import SupportCenter from './pages/shared/SupportCenter'
import ReviewsPage from './pages/shared/ReviewsPage'
import NotificationCenter from './pages/shared/NotificationCenter'
import { PaymentPage } from './pages/customer/PaymentPage'
import AdvancedAnalytics from './pages/shared/AdvancedAnalytics'
import AIChatDemo from './pages/shared/AIChatDemo'
import { AITest } from './pages/shared/AITest'
import { EnvTest } from './pages/shared/EnvTest'
import { DirectAITest } from './pages/shared/DirectAITest'
import { DebugMenu } from './pages/shared/DebugMenu'
import { RecommendationsPage } from './pages/customer/RecommendationsPage'
import { ProfilePage } from './pages/customer/ProfilePage'
import { AdminLayout } from './components/admin'

// Create a router without any lazy-loaded components to avoid potential issues
const mockRouter = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/welcome" replace />
  },
  {
    path: '/welcome',
    element: <WelcomePage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  },
  {
    path: '/otp-verify',
    element: <OTPVerifyPage />
  },
  {
    path: '/user-type',
    element: <UserTypePage />
  },
  {
    path: '/vendor-onboarding',
    element: <VendorOnboardingPage />
  },
  {
    path: '/home',
    element: <HomePage />
  },
  {
    path: '/search',
    element: <SearchPage />
  },
  {
    path: '/payment',
    element: <PaymentPage 
      orderId="demo-order" 
      amount={599} 
      description="Demo payment for Vendorly order" 
      userDetails={{
        name: "Demo User",
        email: "demo@example.com",
        phone: "+91-9876543210"
      }}
    />
  },
  {
    path: '/category/:id',
    element: <CategoryPage />
  },
  {
    path: '/vendor/:id',
    element: <VendorPage />
  },
  {
    path: '/product/:id',
    element: <ProductPage />
  },
  {
    path: '/cart',
    element: <CartPage />
  },
  {
    path: '/checkout',
    element: <CheckoutPage />
  },
  {
    path: '/orders',
    element: <OrdersPage />
  },
  {
    path: '/orders/:orderId',
    element: <OrderTrackingPage />
  },
  {
    path: '/recommendations',
    element: <RecommendationsPage />
  },
  // Vendor Routes
  {
    path: '/vendor-dashboard',
    element: <VendorDashboard />
  },
  {
    path: '/vendor/orders',
    element: <VendorOrders />
  },
  {
    path: '/vendor/products',
    element: <ProductManagement />
  },
  {
    path: '/vendor/analytics',
    element: <VendorAnalytics />
  },
  {
    path: '/vendor/settings',
    element: <VendorSettings />
  },
  // Shared Pages (Phase 4)
  {
    path: '/chat',
    element: <ChatPage currentUserId="customer1" currentUserType="customer" />
  },
  {
    path: '/support',
    element: <SupportCenter currentUserId="customer1" currentUserType="customer" />
  },
  {
    path: '/reviews',
    element: <ReviewsPage currentUserId="customer1" currentUserType="customer" />
  },
  {
    path: '/reviews/vendor/:vendorId',
    element: <ReviewsPage currentUserId="customer1" currentUserType="customer" />
  },
  {
    path: '/reviews/product/:productId',
    element: <ReviewsPage currentUserId="customer1" currentUserType="customer" />
  },
  {
    path: '/notifications',
    element: <NotificationCenter currentUserId="customer1" currentUserType="customer" />
  },
  {
    path: '/analytics',
    element: <AdvancedAnalytics userType="admin" />
  },
  {
    path: '/ai-demo',
    element: <AIChatDemo />
  },
  {
    path: '/ai-test',
    element: <AITest />
  },
  {
    path: '/env-test',
    element: <EnvTest />
  },
  {
    path: '/direct-ai-test',
    element: <DirectAITest />
  },
  {
    path: '/debug',
    element: <DebugMenu />
  },
  {
    path: '/vendor/advanced-analytics',
    element: <AdvancedAnalytics userType="vendor" />
  },
  // Admin Routes
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <div className="p-6">Admin Dashboard</div>
      },
      {
        path: 'vendors',
        element: <div className="p-6">Vendor Management</div>
      },
      {
        path: 'commission',
        element: <div className="p-6">Commission Management</div>
      },
      {
        path: 'customers',
        element: <div className="p-6">Customer Management</div>
      }
    ]
  },
  {
    path: '/profile',
    element: <ProfilePage />
  },
  {
    path: '*',
    element: <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-600">The page you're looking for doesn't exist.</p>
      </div>
    </div>
  }
])

function App() {
  return (
    <div className="font-body">
      <RouterProvider router={mockRouter} />
    </div>
  )
}

export default App