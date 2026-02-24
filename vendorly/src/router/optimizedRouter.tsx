import { createBrowserRouter, Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import { createLazyRoute } from '../components/performance/LazyRouteWrapper'

// Lazy-loaded components with performance monitoring
const LazyWelcomePage = createLazyRoute(() => import('../pages/auth/WelcomePage'), 'WelcomePage')
const LazyLoginPage = createLazyRoute(() => import('../pages/auth/LoginPage'), 'LoginPage')
const LazyRegisterPage = createLazyRoute(() => import('../pages/auth/RegisterPage'), 'RegisterPage')
const LazyOTPVerifyPage = createLazyRoute(() => import('../pages/auth/OTPVerifyPage'), 'OTPVerifyPage')
const LazyUserTypePage = createLazyRoute(() => import('../pages/auth/UserTypePage'), 'UserTypePage')
const LazyVendorOnboardingPage = createLazyRoute(() => import('../pages/vendor/VendorOnboardingPage'), 'VendorOnboardingPage')

// Customer pages with lazy loading
const LazyHomePage = createLazyRoute(() => import('../pages/customer/HomePage'), 'HomePage')
const LazySearchPage = createLazyRoute(() => import('../pages/customer/SearchPage'), 'SearchPage')
const LazyCategoryPage = createLazyRoute(() => import('../pages/customer/CategoryPage'), 'CategoryPage')
const LazyVendorPage = createLazyRoute(() => import('../pages/customer/VendorPage'), 'VendorPage')
const LazyProductPage = createLazyRoute(() => import('../pages/customer/ProductPage'), 'ProductPage')
const LazyCartPage = createLazyRoute(() => import('../pages/customer/CartPage'), 'CartPage')
const LazyCheckoutPage = createLazyRoute(() => import('../pages/customer/CheckoutPage'), 'CheckoutPage')
const LazyOrdersPage = createLazyRoute(() => import('../pages/customer/OrdersPage'), 'OrdersPage')
const LazyOrderTrackingPage = createLazyRoute(() => import('../pages/customer/OrderTrackingPage'), 'OrderTrackingPage')
const LazyEnhancedSearchPage = createLazyRoute(() => import('../pages/customer/EnhancedSearchPage'), 'EnhancedSearchPage')
const LazyMultiLanguagePage = createLazyRoute(() => import('../pages/customer/MultiLanguagePage'), 'MultiLanguagePage')

// Vendor pages with lazy loading
const LazyVendorDashboard = createLazyRoute(() => import('../pages/vendor/VendorDashboard'), 'VendorDashboard')
const LazyProductManagement = createLazyRoute(() => import('../pages/vendor/ProductManagement'), 'ProductManagement')
const LazyVendorOrders = createLazyRoute(() => import('../pages/vendor/VendorOrders'), 'VendorOrders')
const LazyVendorAnalytics = createLazyRoute(() => import('../pages/vendor/VendorAnalytics'), 'VendorAnalytics')
const LazyVendorSettings = createLazyRoute(() => import('../pages/vendor/VendorSettings'), 'VendorSettings')

// Shared pages with lazy loading
const LazyChatPage = createLazyRoute(() => import('../pages/shared/ChatPage'), 'ChatPage')
const LazySupportCenter = createLazyRoute(() => import('../pages/shared/SupportCenter'), 'SupportCenter')
const LazyReviewsPage = createLazyRoute(() => import('../pages/shared/ReviewsPage'), 'ReviewsPage')
const LazyNotificationCenter = createLazyRoute(() => import('../pages/shared/NotificationCenter'), 'NotificationCenter')
const LazyAdvancedAnalytics = createLazyRoute(() => import('../pages/shared/AdvancedAnalytics'), 'AdvancedAnalytics')
const LazyAIChatDemo = createLazyRoute(() => import('../pages/shared/AIChatDemo'), 'AIChatDemo')
const LazyAITest = createLazyRoute(() => import('../pages/shared/AITest'), 'AITest')
const LazyEnvTest = createLazyRoute(() => import('../pages/shared/EnvTest'), 'EnvTest')
const LazyDirectAITest = createLazyRoute(() => import('../pages/shared/DirectAITest'), 'DirectAITest')
const LazyDebugMenu = createLazyRoute(() => import('../pages/shared/DebugMenu'), 'DebugMenu')

// Route configuration with performance optimization
const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/welcome" replace />
  },
  // Authentication routes (highest priority)
  {
    path: '/welcome',
    element: <LazyWelcomePage />
  },
  {
    path: '/login',
    element: <LazyLoginPage />
  },
  {
    path: '/register',
    element: <LazyRegisterPage />
  },
  {
    path: '/otp-verify',
    element: <LazyOTPVerifyPage />
  },
  {
    path: '/user-type',
    element: <LazyUserTypePage />
  },
  {
    path: '/vendor-onboarding',
    element: <LazyVendorOnboardingPage />
  },
  // Customer routes (most frequently accessed)
  {
    path: '/home',
    element: <LazyHomePage />
  },
  {
    path: '/search',
    element: <LazySearchPage />
  },
  {
    path: '/enhanced-search',
    element: <LazyEnhancedSearchPage />
  },
  {
    path: '/multi-language',
    element: <LazyMultiLanguagePage />
  },
  {
    path: '/category/:id',
    element: <LazyCategoryPage />
  },
  {
    path: '/vendor/:id',
    element: <LazyVendorPage />
  },
  {
    path: '/product/:id',
    element: <LazyProductPage />
  },
  {
    path: '/cart',
    element: <LazyCartPage />
  },
  {
    path: '/checkout',
    element: <LazyCheckoutPage />
  },
  {
    path: '/orders',
    element: <LazyOrdersPage />
  },
  {
    path: '/orders/:orderId',
    element: <LazyOrderTrackingPage />
  },
  // Vendor routes (business users)
  {
    path: '/vendor-dashboard',
    element: <LazyVendorDashboard />
  },
  {
    path: '/vendor/orders',
    element: <LazyVendorOrders />
  },
  {
    path: '/vendor/products',
    element: <LazyProductManagement />
  },
  {
    path: '/vendor/analytics',
    element: <LazyVendorAnalytics />
  },
  {
    path: '/vendor/settings',
    element: <LazyVendorSettings />
  },
  // Shared pages (moderate priority)
  {
    path: '/chat',
    element: <LazyChatPage currentUserId="customer1" currentUserType="customer" />
  },
  {
    path: '/support',
    element: <LazySupportCenter currentUserId="customer1" currentUserType="customer" />
  },
  {
    path: '/reviews',
    element: <LazyReviewsPage currentUserId="customer1" currentUserType="customer" />
  },
  {
    path: '/reviews/vendor/:vendorId',
    element: <LazyReviewsPage currentUserId="customer1" currentUserType="customer" />
  },
  {
    path: '/reviews/product/:productId',
    element: <LazyReviewsPage currentUserId="customer1" currentUserType="customer" />
  },
  {
    path: '/notifications',
    element: <LazyNotificationCenter currentUserId="customer1" currentUserType="customer" />
  },
  {
    path: '/analytics',
    element: <LazyAdvancedAnalytics userType="admin" />
  },
  {
    path: '/vendor/advanced-analytics',
    element: <LazyAdvancedAnalytics userType="vendor" />
  },
  // Development and testing routes (lowest priority)
  {
    path: '/ai-demo',
    element: <LazyAIChatDemo />
  },
  {
    path: '/ai-test',
    element: <LazyAITest />
  },
  {
    path: '/env-test',
    element: <LazyEnvTest />
  },
  {
    path: '/direct-ai-test',
    element: <LazyDirectAITest />
  },
  {
    path: '/debug',
    element: <LazyDebugMenu />
  },
  // Placeholder routes
  {
    path: '/profile',
    element: <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">This page is under development</p>
      </div>
    </div>
  },
  // Catch-all route
  {
    path: '*',
    element: <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-600">This page is under development</p>
      </div>
    </div>
  }
]

// Create optimized router with performance monitoring
export const optimizedRouter = createBrowserRouter(routes, {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
})

// Route preloading utilities
export const routePreloader = {
  // Preload critical routes
  preloadCriticalRoutes: () => {
    const criticalRoutes = [
      () => import('../pages/customer/HomePage'),
      () => import('../pages/customer/SearchPage'),
      () => import('../pages/customer/CartPage'),
      () => import('../pages/auth/LoginPage')
    ]

    criticalRoutes.forEach(route => {
      // Preload during idle time
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => route())
      } else {
        setTimeout(() => route(), 100)
      }
    })
  },

  // Preload route based on user behavior
  preloadOnHover: (routeImport: () => Promise<unknown>) => {
    return {
      onMouseEnter: () => {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => routeImport())
        } else {
          routeImport()
        }
      }
    }
  },

  // Predictive preloading based on current route
  predictivePreload: (currentPath: string) => {
    const preloadMap: Record<string, (() => Promise<unknown>)[]> = {
      '/home': [
        () => import('../pages/customer/SearchPage'),
        () => import('../pages/customer/CartPage'),
        () => import('../pages/customer/CategoryPage')
      ],
      '/search': [
        () => import('../pages/customer/ProductPage'),
        () => import('../pages/customer/VendorPage'),
        () => import('../pages/customer/CartPage')
      ],
      '/product': [
        () => import('../pages/customer/CartPage'),
        () => import('../pages/customer/VendorPage'),
        () => import('../pages/customer/CheckoutPage')
      ],
      '/cart': [
        () => import('../pages/customer/CheckoutPage'),
        () => import('../pages/customer/OrdersPage')
      ]
    }

    const routesToPreload = preloadMap[currentPath] || []
    routesToPreload.forEach(route => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => route())
      }
    })
  }
}

// Performance monitoring for routing
export const routingPerformance = {
  // Track route change performance
  trackRouteChange: (from: string, to: string) => {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      // Log performance metrics
      console.log(`[Route Performance] ${from} → ${to}: ${duration.toFixed(2)}ms`)
      
      // Send to analytics in production
      if (import.meta.env.PROD) {
        // Send to analytics service
        console.log('Route change analytics:', { from, to, duration })
      }
    }
  },

  // Monitor bundle loading
  trackBundleLoad: (routeName: string) => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        if (entry.name.includes(routeName)) {
          console.log(`[Bundle Load] ${routeName}: ${entry.duration.toFixed(2)}ms`)
        }
      })
    })

    observer.observe({ entryTypes: ['navigation', 'resource'] })
    
    return () => observer.disconnect()
  }
}