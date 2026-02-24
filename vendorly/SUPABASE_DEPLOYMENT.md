# 🚀 Supabase Deployment Guide for Vendorly

## 📋 **Deployment Overview**

Supabase offers multiple deployment options for your Vendorly app:
1. **Frontend Hosting** - Static site hosting (recommended)
2. **Backend Services** - Database, Auth, Storage, Edge Functions
3. **Full-Stack Deployment** - Complete application hosting

---

## 🔧 **Prerequisites**

### **Required Accounts:**
- ✅ **Supabase Account** - [supabase.com](https://supabase.com)
- ✅ **GitHub Account** - For code repository
- ✅ **Vercel Account** - For frontend hosting (recommended with Supabase)

### **Project Requirements:**
- ✅ **Built Project** - `npm run build` successful
- ✅ **Environment Variables** - Configured properly
- ✅ **Git Repository** - Code pushed to GitHub

---

## 🎯 **Method 1: Frontend + Supabase Backend (Recommended)**

### **Step 1: Set Up Supabase Backend**

#### **1.1 Create Supabase Project**
```bash
# Visit https://supabase.com/dashboard
# Click "New Project"
# Choose organization and project details
```

#### **1.2 Get Project Credentials**
```bash
# From your Supabase Dashboard:
# Settings → API
# Copy these values:
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### **1.3 Set Up Database Schema**
```sql
-- Run in Supabase SQL Editor
-- Create tables for Vendorly app

-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  phone VARCHAR,
  avatar_url TEXT,
  user_type VARCHAR CHECK (user_type IN ('customer', 'vendor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Vendors table
CREATE TABLE vendors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR NOT NULL,
  business_type VARCHAR NOT NULL,
  description TEXT,
  address JSONB,
  phone VARCHAR,
  email VARCHAR,
  is_verified BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  delivery_fee INTEGER DEFAULT 0,
  minimum_order INTEGER DEFAULT 0,
  delivery_radius INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  business_hours JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category_id VARCHAR,
  images TEXT[],
  stock INTEGER DEFAULT 0,
  unit VARCHAR,
  weight DECIMAL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES users(id),
  vendor_id UUID REFERENCES vendors(id),
  status VARCHAR CHECK (status IN ('pending', 'accepted', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled')),
  total_amount INTEGER NOT NULL,
  delivery_fee INTEGER DEFAULT 0,
  tax INTEGER DEFAULT 0,
  delivery_address JSONB,
  payment_method VARCHAR,
  payment_status VARCHAR,
  estimated_delivery_time VARCHAR,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Order items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
```

### **Step 2: Configure Environment Variables**

#### **2.1 Update .env file**
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Other APIs (optional)
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
VITE_RAZORPAY_KEY_ID=your-razorpay-key
VITE_GEMINI_API_KEY=your-gemini-key

# Feature Flags
VITE_ENABLE_MAPS=true
VITE_ENABLE_PAYMENTS=true
VITE_ENABLE_AI_CHAT=true
VITE_ENABLE_ANALYTICS=true
```

#### **2.2 Update Supabase Service**
```typescript
// src/services/supabaseService.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database operations
export const supabaseService = {
  // Users
  async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  async updateUser(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Vendors
  async getVendors(limit = 10) {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('is_active', true)
      .limit(limit)
    
    if (error) throw error
    return data
  },

  // Products
  async getProducts(vendorId?: string, limit = 20) {
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
    
    if (vendorId) {
      query = query.eq('vendor_id', vendorId)
    }
    
    const { data, error } = await query.limit(limit)
    
    if (error) throw error
    return data
  },

  // Orders
  async createOrder(orderData: any) {
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getOrders(customerId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        ),
        vendors (*)
      `)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
}
```

### **Step 3: Deploy Frontend to Vercel**

#### **3.1 Install Vercel CLI**
```bash
npm i -g vercel
```

#### **3.2 Deploy via GitHub Integration**
```bash
# Method 1: GitHub Integration (Recommended)
# 1. Push your code to GitHub
git add .
git commit -m "Prepare for Supabase deployment"
git push origin main

# 2. Visit vercel.com
# 3. Connect GitHub repository
# 4. Select vendorly project
# 5. Configure environment variables
# 6. Deploy automatically
```

#### **3.3 Manual Deployment**
```bash
# Method 2: Vercel CLI
cd vendorly
vercel login
vercel

# Follow prompts:
# ? Set up and deploy "vendorly"? [Y/n] y
# ? Which scope do you want to deploy to? [Your Account]
# ? Link to existing project? [y/N] n
# ? What's your project's name? vendorly
# ? In which directory is your code located? ./
# ? Want to override the settings? [y/N] n
```

#### **3.4 Configure Environment Variables on Vercel**
```bash
# Via Vercel Dashboard:
# 1. Go to your project → Settings → Environment Variables
# 2. Add all environment variables:

VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = your-anon-key
VITE_GOOGLE_MAPS_API_KEY = your-maps-key
VITE_RAZORPAY_KEY_ID = your-razorpay-key

# 3. Redeploy to apply changes
```

---

## 🎯 **Method 2: Supabase Edge Functions (Full Backend)**

### **Step 1: Install Supabase CLI**
```bash
npm install -g supabase
supabase login
```

### **Step 2: Initialize Supabase Project**
```bash
cd vendorly
supabase init
supabase start
```

### **Step 3: Create Edge Functions**
```bash
# Create API endpoints
supabase functions new users
supabase functions new products
supabase functions new orders

# Example Edge Function (supabase/functions/users/index.ts)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { data, error } = await supabaseClient
      .from('users')
      .select('*')

    if (error) throw error

    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      },
    )
  }
})
```

### **Step 4: Deploy Edge Functions**
```bash
supabase functions deploy users
supabase functions deploy products
supabase functions deploy orders
```

---

## 🎯 **Method 3: Docker + Supabase (Advanced)**

### **Step 1: Create Dockerfile**
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### **Step 2: Create nginx.conf**
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /api {
            proxy_pass https://your-project.supabase.co;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

### **Step 3: Build and Deploy**
```bash
# Build Docker image
docker build -t vendorly .

# Run locally
docker run -p 3000:80 vendorly

# Deploy to cloud platform (Heroku, DigitalOcean, etc.)
```

---

## 🔧 **Environment Configuration**

### **Development Environment**
```bash
# .env.development
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-dev-key
VITE_APP_ENV=development
```

### **Production Environment**
```bash
# .env.production
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-prod-key
VITE_APP_ENV=production
```

### **Build Configuration**
```json
// package.json
{
  "scripts": {
    "build:dev": "vite build --mode development",
    "build:prod": "vite build --mode production",
    "preview": "vite preview",
    "deploy": "npm run build:prod && vercel --prod"
  }
}
```

---

## 🎯 **Recommended Deployment Strategy**

### **Option 1: Vercel + Supabase (Easiest)**
- ✅ **Frontend**: Vercel hosting
- ✅ **Backend**: Supabase services
- ✅ **Database**: Supabase PostgreSQL
- ✅ **Auth**: Supabase Auth
- ✅ **Storage**: Supabase Storage
- ✅ **Cost**: Free tier available

### **Option 2: Netlify + Supabase**
- ✅ **Frontend**: Netlify hosting
- ✅ **Backend**: Supabase services
- ✅ **Deploy**: Git-based deployment
- ✅ **Features**: Form handling, serverless functions

### **Option 3: Self-hosted + Supabase**
- ✅ **Frontend**: Your own server
- ✅ **Backend**: Supabase services
- ✅ **Control**: Full server control
- ✅ **Cost**: Server costs apply

---

## 🚀 **Deployment Checklist**

### **Pre-Deployment:**
- [ ] Code builds successfully (`npm run build`)
- [ ] All environment variables configured
- [ ] Database schema created in Supabase
- [ ] API endpoints tested
- [ ] Authentication flows working
- [ ] Static assets optimized

### **Post-Deployment:**
- [ ] Site loads correctly
- [ ] All features working
- [ ] Database connections active
- [ ] API calls successful
- [ ] Authentication working
- [ ] Performance optimized
- [ ] Error monitoring setup

---

## 🔧 **Troubleshooting**

### **Common Issues:**

#### **Build Errors**
```bash
# Fix build issues
npm install
npm run build

# Check for missing dependencies
npm audit fix
```

#### **Environment Variables**
```bash
# Verify environment variables
echo $VITE_SUPABASE_URL

# Check in browser console
console.log(import.meta.env.VITE_SUPABASE_URL)
```

#### **CORS Issues**
```typescript
// Add CORS headers in Supabase
// Dashboard → Settings → API → CORS
// Add your domain: https://your-app.vercel.app
```

#### **Database Connection**
```typescript
// Test Supabase connection
import { supabase } from './services/supabaseService'

supabase.from('users').select('*').then(console.log)
```

---

## 💡 **Best Practices**

### **Security:**
- ✅ Use environment variables for secrets
- ✅ Enable Row Level Security (RLS)
- ✅ Validate user inputs
- ✅ Implement proper authentication

### **Performance:**
- ✅ Optimize images and assets
- ✅ Enable caching headers
- ✅ Use CDN for static files
- ✅ Minimize bundle size

### **Monitoring:**
- ✅ Set up error tracking (Sentry)
- ✅ Monitor performance (Vercel Analytics)
- ✅ Track user behavior (Google Analytics)
- ✅ Monitor API usage (Supabase Dashboard)

---

**🎉 Your Vendorly app is now ready for production deployment on Supabase!**

Choose the method that best fits your needs:
- **Beginners**: Method 1 (Vercel + Supabase)
- **Advanced**: Method 2 (Edge Functions)
- **Enterprise**: Method 3 (Docker + Self-hosted)