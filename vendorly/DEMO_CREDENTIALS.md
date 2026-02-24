# Vendorly - Demo Login Credentials

## 🎯 Quick Access Demo Accounts

The Vendorly application includes two demo accounts for testing all features:

### 👤 Customer Account
**Email:** `customer@demo.com`  
**Password:** `demo123`

**Features Available:**
- ✅ Browse products and vendors
- ✅ Search and filter functionality  
- ✅ Add items to cart
- ✅ Complete checkout process
- ✅ View order history
- ✅ Track orders in real-time
- ✅ Manage addresses and payment methods

### 🏪 Vendor Account  
**Email:** `vendor@demo.com`  
**Password:** `demo123`

**Features Available:**
- ⏳ Vendor dashboard (Phase 3 - Coming Soon)
- ⏳ Product management
- ⏳ Order management
- ⏳ Business analytics

## 🚀 How to Use Demo Credentials

### Method 1: Auto-Fill on Login Page
1. Go to the Login page (`/login`)
2. Click on either the **Customer Account** or **Vendor Account** card
3. Credentials will be auto-filled
4. Click **Sign In**

### Method 2: Manual Entry
1. Go to the Login page (`/login`)
2. Enter email and password manually
3. Click **Sign In**

### Method 3: Copy from Welcome Page
1. Visit the Welcome page (`/welcome`)
2. View demo credentials in the blue card
3. Copy credentials using the copy button
4. Navigate to login and paste

## 📱 Testing the Customer Experience

After logging in with the customer account, you can test:

1. **Home Dashboard** (`/home`)
   - Browse categories
   - View trending products
   - Discover nearby vendors

2. **Search & Browse** (`/search`)
   - Search for products/vendors
   - Apply filters and sorting
   - Switch between grid/list views

3. **Shopping Flow**
   - Add products to cart (`/cart`)
   - Proceed to checkout (`/checkout`)
   - Select address and payment method
   - Place order

4. **Order Management**
   - View order history (`/orders`)
   - Track active orders (`/orders/:orderId`)
   - Filter and search orders

## 🛍️ Sample Products Available

The demo includes realistic Indian market data:

- **Fruits:** Fresh Apples (₹180/kg), Bananas (₹60/dozen)
- **Vegetables:** Tomatoes (₹40/kg), Fresh Spinach (₹35/bunch)  
- **Medicines:** Paracetamol 500mg (₹25/pack)

## 🏪 Sample Vendors

- **Fresh Fruits Corner** - Rating: 4.5/5, Free delivery above ₹100
- **Green Vegetable Mart** - Rating: 4.8/5, Free delivery above ₹150
- **City Pharmacy** - Rating: 4.9/5, 24/7 service, Free delivery above ₹50

## 🔐 Authentication Features

- ✅ Login validation with demo credentials
- ✅ User type detection (Customer/Vendor)
- ✅ Automatic routing based on user type
- ✅ Session persistence with localStorage
- ✅ Error handling for invalid credentials

## 💡 Development Notes

- Demo credentials are stored in `src/utils/demoCredentials.ts`
- Authentication state is managed with localStorage for demo purposes
- Real authentication will be implemented with Supabase in production
- All demo data is in `src/utils/mockData.ts`

## 🎨 UI Components Used

- **DemoCredentialsCard**: Reusable component for showing credentials
- **Auto-fill functionality**: Click-to-fill login forms
- **Copy-to-clipboard**: Easy credential sharing
- **Visual indicators**: User type icons and colors

---

**Ready to test?** Start with the customer account to experience the complete shopping journey from discovery to order tracking! 🛒✨