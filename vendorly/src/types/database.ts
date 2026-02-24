// Database schema types for Vendorly app
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          phone: string | null
          user_type: 'customer' | 'vendor'
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          email: string
          name: string
          phone?: string | null
          user_type: 'customer' | 'vendor'
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string | null
          user_type?: 'customer' | 'vendor'
          created_at?: string
          updated_at?: string | null
        }
      }
      vendors: {
        Row: {
          id: string
          user_id: string
          business_name: string
          business_type: string
          description: string | null
          address: Json | null
          phone: string | null
          email: string | null
          is_verified: boolean
          rating: number | null
          total_ratings: number | null
          delivery_fee: number | null
          minimum_order: number | null
          delivery_radius: number | null
          is_active: boolean
          business_hours: Json | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          business_type: string
          description?: string | null
          address?: Json | null
          phone?: string | null
          email?: string | null
          is_verified?: boolean
          rating?: number | null
          total_ratings?: number | null
          delivery_fee?: number | null
          minimum_order?: number | null
          delivery_radius?: number | null
          is_active?: boolean
          business_hours?: Json | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          business_type?: string
          description?: string | null
          address?: Json | null
          phone?: string | null
          email?: string | null
          is_verified?: boolean
          rating?: number | null
          total_ratings?: number | null
          delivery_fee?: number | null
          minimum_order?: number | null
          delivery_radius?: number | null
          is_active?: boolean
          business_hours?: Json | null
          created_at?: string
          updated_at?: string | null
        }
      }
      products: {
        Row: {
          id: string
          vendor_id: string
          name: string
          description: string | null
          price: number
          category_id: string | null
          images: string[] | null
          stock: number | null
          unit: string | null
          weight: number | null
          is_active: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          vendor_id: string
          name: string
          description?: string | null
          price: number
          category_id?: string | null
          images?: string[] | null
          stock?: number | null
          unit?: string | null
          weight?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          vendor_id?: string
          name?: string
          description?: string | null
          price?: number
          category_id?: string | null
          images?: string[] | null
          stock?: number | null
          unit?: string | null
          weight?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          vendor_id: string
          status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled'
          total_amount: number
          delivery_fee: number | null
          tax: number | null
          delivery_address: Json | null
          payment_method: string | null
          payment_status: string | null
          estimated_delivery_time: string | null
          notes: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          customer_id: string
          vendor_id: string
          status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled'
          total_amount: number
          delivery_fee?: number | null
          tax?: number | null
          delivery_address?: Json | null
          payment_method?: string | null
          payment_status?: string | null
          estimated_delivery_time?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          customer_id?: string
          vendor_id?: string
          status?: 'pending' | 'accepted' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled'
          total_amount?: number
          delivery_fee?: number | null
          tax?: number | null
          delivery_address?: Json | null
          payment_method?: string | null
          payment_status?: string | null
          estimated_delivery_time?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
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
      [_ in never]: never
    }
  }
}