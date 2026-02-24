// Supabase database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string | null
          phone: string
          email: string | null
          user_type: 'customer' | 'vendor'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          phone: string
          email?: string | null
          user_type: 'customer' | 'vendor'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          phone?: string
          email?: string | null
          user_type?: 'customer' | 'vendor'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      vendors: {
        Row: {
          id: string
          user_id: string
          business_name: string
          business_type: string
          description: string | null
          address: unknown // JSON object
          phone: string
          email: string | null
          gstin: string | null
          is_verified: boolean
          is_active: boolean
          rating: number | null
          review_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          business_type: string
          description?: string | null
          address?: unknown
          phone: string
          email?: string | null
          gstin?: string | null
          is_verified?: boolean
          is_active?: boolean
          rating?: number | null
          review_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          business_type?: string
          description?: string | null
          address?: unknown
          phone?: string
          email?: string | null
          gstin?: string | null
          is_verified?: boolean
          is_active?: boolean
          rating?: number | null
          review_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          image: string | null
          parent_id: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image?: string | null
          parent_id?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image?: string | null
          parent_id?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          vendor_id: string
          category_id: string
          name: string
          description: string | null
          price: number
          images: string[] // Array of image URLs
          stock_quantity: number
          min_quantity: number
          max_quantity: number
          unit: string
          weight: number | null
          dimensions: unknown | null // JSON object for length, width, height
          tags: string[] | null
          is_active: boolean
          is_featured: boolean
          rating: number | null
          review_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vendor_id: string
          category_id: string
          name: string
          description?: string | null
          price: number
          images?: string[]
          stock_quantity?: number
          min_quantity?: number
          max_quantity?: number
          unit?: string
          weight?: number | null
          dimensions?: unknown | null
          tags?: string[] | null
          is_active?: boolean
          is_featured?: boolean
          rating?: number | null
          review_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vendor_id?: string
          category_id?: string
          name?: string
          description?: string | null
          price?: number
          images?: string[]
          stock_quantity?: number
          min_quantity?: number
          max_quantity?: number
          unit?: string
          weight?: number | null
          dimensions?: unknown | null
          tags?: string[] | null
          is_active?: boolean
          is_featured?: boolean
          rating?: number | null
          review_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          vendor_id: string
          status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled'
          total_amount: number
          tax_amount: number
          delivery_fee: number
          discount_amount: number
          payment_method: string
          payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_id: string | null
          delivery_address: unknown // JSON object
          special_instructions: string | null
          estimated_delivery: string | null
          actual_delivery: string | null
          cancellation_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vendor_id: string
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled'
          total_amount: number
          tax_amount?: number
          delivery_fee?: number
          discount_amount?: number
          payment_method: string
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_id?: string | null
          delivery_address: unknown
          special_instructions?: string | null
          estimated_delivery?: string | null
          actual_delivery?: string | null
          cancellation_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vendor_id?: string
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled'
          total_amount?: number
          tax_amount?: number
          delivery_fee?: number
          discount_amount?: number
          payment_method?: string
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_id?: string | null
          delivery_address?: unknown
          special_instructions?: string | null
          estimated_delivery?: string | null
          actual_delivery?: string | null
          cancellation_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          total_price: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          total_price: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          total_price?: number
          notes?: string | null
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          order_id: string | null
          product_id: string | null
          vendor_id: string | null
          rating: number
          comment: string | null
          images: string[] | null
          is_verified: boolean
          helpful_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          order_id?: string | null
          product_id?: string | null
          vendor_id?: string | null
          rating: number
          comment?: string | null
          images?: string[] | null
          is_verified?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          order_id?: string | null
          product_id?: string | null
          vendor_id?: string | null
          rating?: number
          comment?: string | null
          images?: string[] | null
          is_verified?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          type: 'home' | 'work' | 'other'
          label: string | null
          line1: string
          line2: string | null
          city: string
          state: string
          pincode: string
          country: string
          latitude: number | null
          longitude: number | null
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'home' | 'work' | 'other'
          label?: string | null
          line1: string
          line2?: string | null
          city: string
          state: string
          pincode: string
          country?: string
          latitude?: number | null
          longitude?: number | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'home' | 'work' | 'other'
          label?: string | null
          line1?: string
          line2?: string | null
          city?: string
          state?: string
          pincode?: string
          country?: string
          latitude?: number | null
          longitude?: number | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      carts: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'order' | 'promotion' | 'system' | 'reminder'
          title: string
          message: string
          data: unknown | null // JSON object
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'order' | 'promotion' | 'system' | 'reminder'
          title: string
          message: string
          data?: unknown | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'order' | 'promotion' | 'system' | 'reminder'
          title?: string
          message?: string
          data?: unknown | null
          is_read?: boolean
          created_at?: string
        }
      }
      loyalty_users: {
        Row: {
          id: string
          user_id: string
          total_points: number
          available_points: number
          tier: string
          join_date: string
          last_activity: string
          lifetime_spent: number
          referral_code: string
          referred_users: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_points?: number
          available_points?: number
          tier?: string
          join_date?: string
          last_activity?: string
          lifetime_spent?: number
          referral_code: string
          referred_users?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_points?: number
          available_points?: number
          tier?: string
          join_date?: string
          last_activity?: string
          lifetime_spent?: number
          referral_code?: string
          referred_users?: number
          created_at?: string
          updated_at?: string
        }
      }
      loyalty_transactions: {
        Row: {
          id: string
          user_id: string
          type: 'earn' | 'redeem' | 'expire' | 'bonus'
          points: number
          reason: string
          description: string
          order_id: string | null
          reward_id: string | null
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'earn' | 'redeem' | 'expire' | 'bonus'
          points: number
          reason: string
          description: string
          order_id?: string | null
          reward_id?: string | null
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'earn' | 'redeem' | 'expire' | 'bonus'
          points?: number
          reason?: string
          description?: string
          order_id?: string | null
          reward_id?: string | null
          expires_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_type: 'customer' | 'vendor'
      order_status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled'
      payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
      notification_type: 'order' | 'promotion' | 'system' | 'reminder'
      address_type: 'home' | 'work' | 'other'
      loyalty_transaction_type: 'earn' | 'redeem' | 'expire' | 'bonus'
    }
  }
}