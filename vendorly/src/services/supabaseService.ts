// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createClient } from '@supabase/supabase-js'

// Supabase configuration
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Always use mock mode for this version
export const supabase = null

// Database service with fallback to mock data
export const supabaseService = {
  // Check if Supabase is configured
  isConfigured: () => false,

  // Users
  async getUser(userId: string) {
    return {
      id: userId,
      email: 'demo@vendorly.com',
      name: 'Demo User',
      phone: '+91 9876543210',
      user_type: 'customer',
      created_at: new Date().toISOString()
    }
  },

  async updateUser(userId: string, updates: Record<string, unknown>) {
    return { id: userId, ...updates, updated_at: new Date().toISOString() }
  },

  // Products
  async getProducts(vendorId?: string, limit: number = 20) {
    const { mockProducts } = await import('../utils/mockData')
    let products = mockProducts
    
    if (vendorId) {
      products = products.filter(p => p.vendorId === vendorId)
    }
    
    return products.slice(0, limit)
  },

  // Orders
  async createOrder(orderData: Record<string, unknown>) {
    return { id: 'ORD' + Date.now(), ...orderData, created_at: new Date().toISOString() }
  },

  // Authentication
  async signIn(email: string, password: string) {
    console.log('Attempting sign in for:', email, 'with password length:', password.length)
    throw new Error('Authentication requires Supabase configuration')
  },

  async signOut() {
    // No-op in mock mode
  }
}

export default supabaseService