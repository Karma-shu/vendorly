import { createBrowserRouter, Navigate } from 'react-router-dom'
import { WelcomePage } from '../pages/auth/WelcomePage'
import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'
import { OTPVerifyPage } from '../pages/auth/OTPVerifyPage'
import { UserTypePage } from '../pages/auth/UserTypePage'
import { VendorOnboardingPage } from '../pages/vendor/VendorOnboardingPage'
import { HomePage } from '../pages/customer/HomePage'
import { SearchPage } from '../pages/customer/SearchPage'
import { CategoryPage } from '../pages/customer/CategoryPage'
import { VendorPage } from '../pages/customer/VendorPage'
import { ProductPage } from '../pages/customer/ProductPage'
import { CartPage } from '../pages/customer/CartPage'
import CheckoutPage from '../pages/customer/CheckoutPage'
import OrdersPage from '../pages/customer/OrdersPage'
import OrderTrackingPage from '../pages/customer/OrderTrackingPage'
import VendorDashboard from '../pages/vendor/VendorDashboard'
import ProductManagement from '../pages/vendor/ProductManagement'
import VendorOrders from '../pages/vendor/VendorOrders'
import VendorAnalytics from '../pages/vendor/VendorAnalytics'
import VendorSettings from '../pages/vendor/VendorSettings'
import ChatPage from '../pages/shared/ChatPage'
import SupportCenter from '../pages/shared/SupportCenter'
import ReviewsPage from '../pages/shared/ReviewsPage'
import NotificationCenter from '../pages/shared/NotificationCenter'
import { PaymentPage } from '../pages/customer/PaymentPage'
import AdvancedAnalytics from '../pages/shared/AdvancedAnalytics'
import AIChatDemo from '../pages/shared/AIChatDemo'
import { AITest } from '../pages/shared/AITest'
import { EnvTest } from '../pages/shared/EnvTest'
import { DirectAITest } from '../pages/shared/DirectAITest'
import { DebugMenu } from '../pages/shared/DebugMenu'
import { RecommendationsPage } from '../pages/customer/RecommendationsPage'
import { ProfilePage } from '../pages/customer/ProfilePage'
import React from 'react'
// Admin pages with lazy loading - commented out as they are not used in active router
/*
const AdminDashboardPage = React.lazy(() => import('../pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })))
const VendorManagementPage = React.lazy(() => import('../pages/admin/VendorManagementPage').then(m => ({ default: m.VendorManagementPage })))
const CommissionManagementPage = React.lazy(() => import('../pages/admin/CommissionManagementPage').then(m => ({ default: m.CommissionManagementPage })))
const CustomerManagementPage = React.lazy(() => import('../pages/admin/CustomerManagementPage').then(m => ({ default: m.CustomerManagementPage })))
*/

// Placeholder components - commented out as they are not used in active router
/*
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-600">This page is under development</p>
    </div>
  </div>
)
*/

// Review Page Example - commented out as they are not used in active router
/*
const ReviewPageExample = React.lazy(() => import('../pages/examples/ReviewPageExample'))
const TestReviewComponents = React.lazy(() => import('../pages/examples/TestReviewComponents'))
const TestOriginalReviewsPage = React.lazy(() => import('../pages/examples/TestOriginalReviewsPage'))
const DiagnosticsPage = React.lazy(() => import('../pages/examples/DiagnosticsPage'))
*/

export { optimizedRouter as router } from './optimizedRouter'

// Legacy route configuration kept for reference
/* const legacyRouter = createBrowserRouter([
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>}>
            <AdminDashboardPage />
          </Suspense>
        )
      },
      {
        path: 'vendors',
        element: (
          <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>}>
            <VendorManagementPage />
          </Suspense>
        )
      },
      {
        path: 'commission',
        element: (
          <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>}>
            <CommissionManagementPage />
          </Suspense>
        )
      },
      {
        path: 'customers',
        element: (
          <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>}>
            <CustomerManagementPage />
          </Suspense>
        )
      }
    ]
  },
  {
    path: '/profile',
    element: <ProfilePage />
  },
  {
    path: '*',
    element: <PlaceholderPage title="Page Not Found" />
  }
]); */
