# 🚀 Vendorly Deployment Guide

## 📋 **Deployment Options**

### **Option 1: Vercel + Supabase (Recommended)**
- **Frontend**: Vercel hosting (free tier available)
- **Backend**: Supabase services (free tier available)
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage

### **Option 2: Netlify + Supabase**
- **Frontend**: Netlify hosting
- **Backend**: Supabase services
- **Deploy**: Git-based deployment

### **Option 3: Self-hosted**
- **Frontend**: Your own server
- **Backend**: Supabase services or self-hosted

---

## 🛠️ **Step-by-Step Deployment**

### **Step 1: Set Up Supabase Backend**

#### **1.1 Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in or create account
4. Click "New Project"
5. Choose organization and region
6. Enter project name (e.g., "vendorly")
7. Set database password
8. Click "Create new project"

#### **1.2 Get Project Credentials**
1. Go to your project dashboard
2. Click "Settings" → "API"
3. Copy:
   - **Project URL**: `VITE_SUPABASE_URL`
   - **anon key**: `VITE_SUPABASE_ANON_KEY`

#### **1.3 Set Up Database Schema**
Run this SQL in the Supabase SQL Editor:

```sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  phone VARCHAR,
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
```

### **Step 2: Configure Environment Variables**

Create a `.env.production` file:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional APIs (add your own keys)
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
VITE_RAZORPAY_KEY_ID=your-razorpay-key
VITE_GEMINI_API_KEY=your-gemini-key

# Feature Flags
VITE_ENABLE_MAPS=true
VITE_ENABLE_PAYMENTS=true
VITE_ENABLE_AI_CHAT=true
VITE_ENABLE_ANALYTICS=true
```

### **Step 3: Deploy Frontend to Vercel**

#### **Method 1: GitHub Integration (Recommended)**
1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for deployment"
   git branch -M main
   git remote add origin https://github.com/yourusername/vendorly.git
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com)
3. Sign in with GitHub
4. Click "New Project"
5. Select your vendorly repository
6. Configure project:
   - Framework: Vite
   - Root directory: ./
   - Build command: `npm run build`
   - Output directory: `dist`
7. Add environment variables from your `.env.production` file
8. Click "Deploy"

#### **Method 2: Vercel CLI**
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   cd vendorly
   vercel login
   vercel --prod
   ```

### **Step 4: Configure Authentication**

1. In Supabase Dashboard:
   - Go to "Authentication" → "Settings"
   - Enable Email signup
   - Set site URL to your Vercel deployment URL
   - Add your domain to "Redirect URLs"

2. Test authentication:
   - Visit your deployed app
   - Try signing up with a new email
   - Check Supabase Auth users table

---

## 🎯 **Advanced Configuration**

### **Custom Domain**
1. In Vercel:
   - Go to your project → Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. In Supabase:
   - Update redirect URLs to include your custom domain

### **Environment-Specific Config**
```bash
# Development
.env.development

# Production
.env.production

# Local testing
.env.local
```

### **CI/CD Pipeline**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 🔧 **Monitoring & Analytics**

### **Vercel Analytics**
- Built-in performance monitoring
- Real-time visitor analytics
- Deployment tracking

### **Supabase Monitoring**
- Database performance
- API usage tracking
- Authentication metrics

### **Error Tracking**
```bash
# Install Sentry for error tracking
npm install @sentry/react @sentry/tracing

# Configure in main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

---

## 💰 **Pricing Considerations**

### **Free Tier Options**
- **Vercel**: 100GB bandwidth, 1000 deployments/month
- **Supabase**: 500MB database, 2GB storage, 500K requests/month

### **Scaling Costs**
- **Database**: $25/month for 8GB RAM, 2vCPU
- **Bandwidth**: $20/month for 1TB
- **Storage**: $7/month for 100GB

---

## 🚀 **Go Live Checklist**

### **Pre-Launch**
- [ ] Test all features locally
- [ ] Verify environment variables
- [ ] Test authentication flow
- [ ] Check database connections
- [ ] Validate payment integration
- [ ] Test mobile responsiveness
- [ ] Verify SEO metadata

### **Launch Day**
- [ ] Deploy to production
- [ ] Test critical user flows
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify SSL certificate
- [ ] Test all integrations

### **Post-Launch**
- [ ] Set up monitoring alerts
- [ ] Configure backup strategies
- [ ] Monitor user feedback
- [ ] Track performance metrics
- [ ] Plan for scaling

---

## 🆘 **Troubleshooting**

### **Common Issues**

#### **Build Failures**
```bash
# Clear cache and rebuild
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### **Environment Variables Not Loading**
```bash
# Verify variables are prefixed with VITE_
console.log(import.meta.env.VITE_SUPABASE_URL)
```

#### **CORS Errors**
- Add your domain to Supabase settings
- Check redirect URLs configuration

#### **Database Connection**
```bash
# Test connection in browser console
supabase
  .from('users')
  .select('*')
  .then(console.log)
  .catch(console.error)
```

---

**🎉 Your Vendorly app is now ready for production deployment!**

The recommended approach is:
1. **Vercel** for frontend hosting
2. **Supabase** for backend services
3. **GitHub** for version control
4. **Free tier** to start, scale as needed