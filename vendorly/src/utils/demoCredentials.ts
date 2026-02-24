// Demo credentials for testing the application
export const DEMO_CREDENTIALS = {
  customer: {
    email: 'customer@demo.com',
    password: 'demo123',
    userType: 'customer' as const,
    profile: {
      name: 'John Doe',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    }
  },
  vendor: {
    email: 'vendor@demo.com',
    password: 'demo123',
    userType: 'vendor' as const,
    profile: {
      name: 'Raj Kumar',
      businessName: 'Fresh Fruits Corner',
      phone: '+91 98765 12345',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    }
  }
}

// Quick test credentials
export const QUICK_LOGIN = {
  // Customer login - full shopping experience
  customer: 'customer@demo.com / demo123',
  
  // Vendor login - business dashboard (Phase 3)
  vendor: 'vendor@demo.com / demo123'
}

// Validate demo login credentials
export const validateDemoLogin = (email: string, password: string) => {
  const customer = DEMO_CREDENTIALS.customer
  const vendor = DEMO_CREDENTIALS.vendor
  
  if (email === customer.email && password === customer.password) {
    return {
      success: true,
      userType: customer.userType,
      profile: customer.profile
    }
  }
  
  if (email === vendor.email && password === vendor.password) {
    return {
      success: true,
      userType: vendor.userType,
      profile: vendor.profile
    }
  }
  
  return {
    success: false,
    error: 'Invalid credentials. Use demo credentials: customer@demo.com / demo123'
  }
}