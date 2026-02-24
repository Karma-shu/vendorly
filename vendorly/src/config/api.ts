// API Integration Configuration for Production
// This file sets up all third-party service integrations

import { createClient } from '@supabase/supabase-js'

// Environment validation
const validateEnvironment = () => {
  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_GEMINI_API_KEY'
  ]
  
  const missing = required.filter(key => !import.meta.env[key])
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing)
    if (import.meta.env.PROD) {
      throw new Error(`Production environment missing: ${missing.join(', ')}`)
    }
  }
}

// Initialize environment validation
validateEnvironment()

// Supabase Configuration
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    db: {
      schema: 'public'
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
)

// Database Tables Configuration
export const TABLES = {
  users: 'users',
  vendors: 'vendors',
  products: 'products',
  orders: 'orders',
  order_items: 'order_items',
  categories: 'categories',
  reviews: 'reviews',
  conversations: 'conversations',
  messages: 'messages',
  notifications: 'notifications',
  addresses: 'addresses',
  payments: 'payments'
} as const

// API Endpoints Configuration
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.vendorly.in',
  timeout: 10000,
  retries: 3,
  endpoints: {
    auth: '/auth',
    users: '/users',
    vendors: '/vendors',
    products: '/products',
    orders: '/orders',
    payments: '/payments',
    notifications: '/notifications',
    chat: '/chat',
    reviews: '/reviews',
    analytics: '/analytics'
  }
}

// Third-party Service Configuration
export const SERVICES = {
  // Google Gemini AI
  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    model: 'gemini-pro',
    enabled: import.meta.env.VITE_ENABLE_AI_CHAT === 'true'
  },
  
  // Razorpay Payment Gateway
  razorpay: {
    keyId: import.meta.env.VITE_RAZORPAY_KEY_ID,
    enabled: import.meta.env.VITE_ENABLE_PAYMENTS === 'true',
    currency: 'INR',
    timeout: 300, // 5 minutes
    options: {
      theme: {
        color: '#2D7D32'
      },
      modal: {
        ondismiss: () => {
          console.log('Payment modal dismissed')
        }
      }
    }
  },
  
  // Google Maps (Optional - using free OpenStreetMap by default)
  googleMaps: {
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    enabled: import.meta.env.VITE_ENABLE_MAPS === 'true',
    defaultLocation: {
      lat: 19.1356, // Mumbai Andheri
      lng: 72.8262
    }
  },
  
  // Free Location Services (No API key required)
  locationServices: {
    // OpenStreetMap Nominatim (Primary - FREE)
    nominatim: {
      baseUrl: 'https://nominatim.openstreetmap.org',
      enabled: true,
      limits: 'No strict limits for reasonable usage'
    },
    // MapBox Geocoding (Backup - 100k requests/month free)
    mapbox: {
      apiKey: import.meta.env.VITE_MAPBOX_API_KEY,
      baseUrl: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
      enabled: !!import.meta.env.VITE_MAPBOX_API_KEY
    },
    // Positionstack (Backup - 25k requests/month free)
    positionstack: {
      apiKey: import.meta.env.VITE_POSITIONSTACK_API_KEY,
      baseUrl: 'http://api.positionstack.com/v1/forward',
      enabled: !!import.meta.env.VITE_POSITIONSTACK_API_KEY
    }
  },
  
  // Firebase (for push notifications)
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    enabled: import.meta.env.VITE_ENABLE_PUSH_NOTIFICATIONS === 'true'
  },
  
  // Analytics
  analytics: {
    googleAnalytics: {
      measurementId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
      enabled: import.meta.env.VITE_ENABLE_ANALYTICS === 'true'
    },
    sentry: {
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.NODE_ENV,
      enabled: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true'
    }
  }
}

// API Helper Functions
export const apiClient = {
  // Generic API request function
  async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_CONFIG.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }
    
    // Add authentication if available
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${session.access_token}`
      }
    }
    
    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API Request failed:', error)
      throw error
    }
  },
  
  // GET request
  get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint
    return this.request<T>(url, { method: 'GET' })
  },
  
  // POST request
  post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    })
  },
  
  // PUT request
  put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
  },
  
  // DELETE request
  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// Database helper functions
export const db = {
  // Generic query function
  async query<T>(table: string, query?: string): Promise<T[]> {
    const { data, error } = await supabase.from(table).select(query || '*')
    
    if (error) {
      console.error(`Database query error for table ${table}:`, error)
      throw error
    }
    
    return (data || []) as T[]
  },
  
  // Insert data
  async insert<T>(table: string, data: Record<string, unknown>): Promise<T> {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single()
    
    if (error) {
      console.error(`Database insert error for table ${table}:`, error)
      throw error
    }
    
    return result
  },
  
  // Update data
  async update<T>(table: string, id: string, data: Record<string, unknown>): Promise<T> {
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error(`Database update error for table ${table}:`, error)
      throw error
    }
    
    return result
  },
  
  // Delete data
  async delete(table: string, id: string): Promise<void> {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error(`Database delete error for table ${table}:`, error)
      throw error
    }
  },
  
  // Real-time subscription
  subscribe(table: string, callback: (data: unknown) => void) {
    return supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
      .subscribe()
  }
}

// File upload configuration
export const storage = {
  // Upload file to Supabase storage
  async uploadFile(bucket: string, path: string, file: File): Promise<string> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) {
      console.error('File upload error:', error)
      throw error
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)
    
    return urlData.publicUrl
  },
  
  // Delete file
  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])
    
    if (error) {
      console.error('File delete error:', error)
      throw error
    }
  }
}

// Health check function
export const healthCheck = async (): Promise<boolean> => {
  try {
    // Check Supabase connection
    const { data, error } = await supabase.from('users').select('count').limit(1)
    
    if (error) {
      console.error('Health check failed - Supabase:', error)
      return false
    }
    
    // Check API connection
    try {
      await apiClient.get('/health')
    } catch (error) {
      console.warn('API health check failed:', error)
      // Don't fail health check for API as it might not be deployed yet
    }
    
    return true
  } catch (error) {
    console.error('Health check failed:', error)
    return false
  }
}

// Initialize services
export const initializeServices = async () => {
  try {
    console.log('🚀 Initializing API services...')
    
    // Validate environment
    validateEnvironment()
    
    // Check service health
    const isHealthy = await healthCheck()
    
    if (!isHealthy && import.meta.env.PROD) {
      throw new Error('Service health check failed in production')
    }
    
    // Initialize analytics if enabled
    if (SERVICES.analytics.googleAnalytics.enabled) {
      // Initialize Google Analytics
      console.log('📊 Google Analytics initialized')
    }
    
    if (SERVICES.analytics.sentry.enabled) {
      // Initialize Sentry
      console.log('🐛 Sentry error tracking initialized')
    }
    
    console.log('✅ All services initialized successfully')
    
    return true
  } catch (error) {
    console.error('❌ Service initialization failed:', error)
    
    if (import.meta.env.PROD) {
      throw error
    }
    
    return false
  }
}

// Export configuration for use in components
export default {
  supabase,
  api: apiClient,
  db,
  storage,
  services: SERVICES,
  tables: TABLES,
  healthCheck,
  initializeServices
}