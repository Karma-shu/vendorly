import type { VendorAnalytics, DailyStats, TopProduct, VendorNotification, VendorOrder } from '../types'

// Mock Vendor Analytics Data
export const mockVendorAnalytics: VendorAnalytics = {
  totalRevenue: 125000,
  totalOrders: 342,
  averageOrderValue: 365,
  customerCount: 156,
  rating: 4.8,
  completionRate: 94.2
}

// Mock Daily Statistics (Last 7 days)
export const mockDailyStats: DailyStats[] = [
  { date: '2024-01-03', revenue: 8500, orders: 23, customers: 18 },
  { date: '2024-01-04', revenue: 12300, orders: 34, customers: 28 },
  { date: '2024-01-05', revenue: 15600, orders: 42, customers: 35 },
  { date: '2024-01-06', revenue: 9800, orders: 28, customers: 22 },
  { date: '2024-01-07', revenue: 18200, orders: 51, customers: 41 },
  { date: '2024-01-08', revenue: 14500, orders: 39, customers: 31 },
  { date: '2024-01-09', revenue: 16800, orders: 45, customers: 37 }
]

// Mock Top Selling Products
export const mockTopProducts: TopProduct[] = [
  {
    productId: '1',
    productName: 'Fresh Apples',
    sales: 85,
    revenue: 15300,
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400'
  },
  {
    productId: '2',
    productName: 'Bananas',
    sales: 120,
    revenue: 7200,
    image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400'
  },
  {
    productId: '6',
    productName: 'Fresh Oranges',
    sales: 65,
    revenue: 9750,
    image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400'
  },
  {
    productId: '7',
    productName: 'Grapes',
    sales: 45,
    revenue: 6750,
    image: 'https://images.unsplash.com/photo-1515779122185-2390ccdf060b?w=400'
  },
  {
    productId: '8',
    productName: 'Mangoes',
    sales: 38,
    revenue: 9500,
    image: 'https://images.unsplash.com/photo-1553279903-fcc6c9a8e5d9?w=400'
  }
]

// Mock Vendor Notifications
export const mockVendorNotifications: VendorNotification[] = [
  {
    id: '1',
    type: 'order',
    title: 'New Order Received',
    message: 'Order #ORD1704876543 for ₹420 from John Doe',
    isRead: false,
    createdAt: '2024-01-09T14:30:00Z'
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment Received',
    message: 'Payment of ₹365 received for Order #ORD1704876542',
    isRead: false,
    createdAt: '2024-01-09T13:45:00Z'
  },
  {
    id: '3',
    type: 'review',
    title: 'New Customer Review',
    message: 'John Doe left a 5-star review for your store',
    isRead: true,
    createdAt: '2024-01-09T12:20:00Z'
  },
  {
    id: '4',
    type: 'system',
    title: 'Inventory Alert',
    message: 'Fresh Apples stock is running low (5 kg remaining)',
    isRead: true,
    createdAt: '2024-01-09T11:15:00Z'
  },
  {
    id: '5',
    type: 'order',
    title: 'Order Completed',
    message: 'Order #ORD1704876541 has been delivered successfully',
    isRead: true,
    createdAt: '2024-01-09T10:30:00Z'
  }
]

// Mock Vendor Orders (from vendor perspective)
export const mockVendorOrders: VendorOrder[] = [
  {
    id: 'ORD1704876543',
    customerId: 'customer1',
    vendorId: '1',
    customerName: 'John Doe',
    customerPhone: '+91 98765 43210',
    items: [
      {
        id: '1',
        productId: '1',
        quantity: 2,
        price: 180,
        product: {
          id: '1',
          vendorId: '1',
          name: 'Fresh Apples',
          description: 'Premium quality Kashmir apples',
          price: 180,
          categoryId: '3',
          images: ['https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400'],
          stock: 50,
          unit: 'kg',
          weight: 1,
          isActive: true,
          createdAt: '2024-01-09T14:30:00Z',
          updatedAt: '2024-01-09T14:30:00Z',
        }
      },
      {
        id: '2',
        productId: '2',
        quantity: 1,
        price: 60,
        product: {
          id: '2',
          vendorId: '1',
          name: 'Bananas',
          description: 'Fresh yellow bananas',
          price: 60,
          categoryId: '3',
          images: ['https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400'],
          stock: 100,
          unit: 'dozen',
          isActive: true,
          createdAt: '2024-01-09T14:30:00Z',
          updatedAt: '2024-01-09T14:30:00Z',
        }
      }
    ],
    status: 'pending',
    totalAmount: 420,
    deliveryFee: 0,
    tax: 21,
    deliveryAddress: {
      id: '1',
      label: 'Home',
      addressLine1: '123 Residential Complex',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India'
    },
    estimatedDeliveryTime: '25-30 mins',
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    createdAt: '2024-01-09T14:30:00Z',
    updatedAt: '2024-01-09T14:30:00Z',
    preparationTime: 15
  },
  {
    id: 'ORD1704876542',
    customerId: 'customer2',
    vendorId: '1',
    customerName: 'Priya Singh',
    customerPhone: '+91 98765 43211',
    items: [
      {
        id: '3',
        productId: '1',
        quantity: 3,
        price: 180,
        product: {
          id: '1',
          vendorId: '1',
          name: 'Fresh Apples',
          description: 'Premium quality Kashmir apples',
          price: 180,
          categoryId: '3',
          images: ['https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400'],
          stock: 50,
          unit: 'kg',
          weight: 1,
          isActive: true,
          createdAt: '2024-01-09T13:45:00Z',
          updatedAt: '2024-01-09T13:45:00Z',
        }
      }
    ],
    status: 'preparing',
    totalAmount: 567,
    deliveryFee: 20,
    tax: 27,
    deliveryAddress: {
      id: '2',
      label: 'Office',
      addressLine1: '456 Business Park',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400002',
      country: 'India'
    },
    estimatedDeliveryTime: '20-25 mins',
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    createdAt: '2024-01-09T13:45:00Z',
    updatedAt: '2024-01-09T14:00:00Z',
    acceptedAt: '2024-01-09T13:47:00Z',
    preparationTime: 20
  },
  {
    id: 'ORD1704876541',
    customerId: 'customer3',
    vendorId: '1',
    customerName: 'Amit Kumar',
    customerPhone: '+91 98765 43212',
    items: [
      {
        id: '4',
        productId: '2',
        quantity: 2,
        price: 60,
        product: {
          id: '2',
          vendorId: '1',
          name: 'Bananas',
          description: 'Fresh yellow bananas',
          price: 60,
          categoryId: '3',
          images: ['https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400'],
          stock: 100,
          unit: 'dozen',
          isActive: true,
          createdAt: '2024-01-09T10:30:00Z',
          updatedAt: '2024-01-09T10:30:00Z',
        }
      }
    ],
    status: 'delivered',
    totalAmount: 120,
    deliveryFee: 0,
    tax: 6,
    deliveryAddress: {
      id: '3',
      label: 'Home',
      addressLine1: '789 Garden Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400003',
      country: 'India'
    },
    actualDeliveryTime: '18 mins',
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    createdAt: '2024-01-09T10:30:00Z',
    updatedAt: '2024-01-09T11:00:00Z',
    acceptedAt: '2024-01-09T10:32:00Z',
    preparationTime: 12
  },
  {
    id: 'ORD1704876540',
    customerId: 'customer4',
    vendorId: '1',
    customerName: 'Sneha Patel',
    customerPhone: '+91 98765 43213',
    items: [
      {
        id: '5',
        productId: '1',
        quantity: 1,
        price: 180,
        product: {
          id: '1',
          vendorId: '1',
          name: 'Fresh Apples',
          description: 'Premium quality Kashmir apples',
          price: 180,
          categoryId: '3',
          images: ['https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400'],
          stock: 50,
          unit: 'kg',
          weight: 1,
          isActive: true,
          createdAt: '2024-01-09T09:15:00Z',
          updatedAt: '2024-01-09T09:15:00Z',
        }
      }
    ],
    status: 'out_for_delivery',
    totalAmount: 189,
    deliveryFee: 0,
    tax: 9,
    deliveryAddress: {
      id: '4',
      label: 'Home',
      addressLine1: '321 Park Avenue',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400004',
      country: 'India'
    },
    estimatedDeliveryTime: '10-15 mins',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    createdAt: '2024-01-09T09:15:00Z',
    updatedAt: '2024-01-09T09:45:00Z',
    acceptedAt: '2024-01-09T09:17:00Z',
    preparationTime: 18,
    deliveryPartnerId: 'dp001'
  },
  {
    id: 'ORD1704876539',
    customerId: 'customer5',
    vendorId: '2',
    customerName: 'Ravi Kumar',
    customerPhone: '+91 98765 43214',
    items: [
      {
        id: '6',
        productId: '3',
        quantity: 2,
        price: 40,
        product: {
          id: '3',
          vendorId: '2',
          name: 'Tomatoes',
          description: 'Fresh farm tomatoes, perfect for cooking',
          price: 40,
          categoryId: '2',
          images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400'],
          stock: 75,
          unit: 'kg',
          weight: 1,
          isActive: true,
          createdAt: '2024-01-09T08:45:00Z',
          updatedAt: '2024-01-09T08:45:00Z',
        }
      },
      {
        id: '7',
        productId: '4',
        quantity: 1,
        price: 35,
        product: {
          id: '4',
          vendorId: '2',
          name: 'Fresh Spinach',
          description: 'Organic spinach leaves, rich in iron',
          price: 35,
          categoryId: '2',
          images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400'],
          stock: 30,
          unit: 'bunch',
          isActive: true,
          createdAt: '2024-01-09T08:45:00Z',
          updatedAt: '2024-01-09T08:45:00Z',
        }
      }
    ],
    status: 'accepted',
    totalAmount: 115,
    deliveryFee: 15,
    tax: 6,
    deliveryAddress: {
      id: '5',
      label: 'Apartment',
      addressLine1: '543 Garden Complex',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400005',
      country: 'India'
    },
    estimatedDeliveryTime: '25-30 mins',
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    createdAt: '2024-01-09T08:45:00Z',
    updatedAt: '2024-01-09T09:00:00Z',
    acceptedAt: '2024-01-09T08:50:00Z',
    preparationTime: 10
  },
  {
    id: 'ORD1704876538',
    customerId: 'customer6',
    vendorId: '3',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98765 43215',
    items: [
      {
        id: '8',
        productId: '5',
        quantity: 2,
        price: 25,
        product: {
          id: '5',
          vendorId: '3',
          name: 'Paracetamol 500mg',
          description: 'Pain relief and fever reducer, 10 tablets',
          price: 25,
          categoryId: '4',
          images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'],
          stock: 200,
          unit: 'pack',
          isActive: true,
          createdAt: '2024-01-09T07:30:00Z',
          updatedAt: '2024-01-09T07:30:00Z',
        }
      }
    ],
    status: 'delivered',
    totalAmount: 50,
    deliveryFee: 30,
    tax: 3,
    deliveryAddress: {
      id: '6',
      label: 'Home',
      addressLine1: '789 Medical Lane',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400006',
      country: 'India'
    },
    actualDeliveryTime: '15 mins',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    createdAt: '2024-01-09T07:30:00Z',
    updatedAt: '2024-01-09T08:00:00Z',
    acceptedAt: '2024-01-09T07:35:00Z',
    preparationTime: 5
  },
  {
    id: 'ORD1704876537',
    customerId: 'customer7',
    vendorId: '4',
    customerName: 'Suresh Patel',
    customerPhone: '+91 98765 43216',
    items: [
      {
        id: '9',
        productId: '6',
        quantity: 1,
        price: 2500,
        product: {
          id: '6',
          vendorId: '4',
          name: 'Bluetooth Speaker',
          description: 'Waterproof portable Bluetooth speaker with 20W output',
          price: 2500,
          categoryId: '8',
          images: ['https://images.unsplash.com/photo-1606220588911-4a4260c1d7f6?w=400'],
          stock: 25,
          unit: 'pieces',
          weight: 0.5,
          isActive: true,
          createdAt: '2024-01-09T06:15:00Z',
          updatedAt: '2024-01-09T06:15:00Z',
        }
      }
    ],
    status: 'cancelled',
    totalAmount: 2500,
    deliveryFee: 50,
    tax: 150,
    deliveryAddress: {
      id: '7',
      label: 'Office',
      addressLine1: '101 Tech Park',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560001',
      country: 'India'
    },
    estimatedDeliveryTime: '2-3 days',
    paymentMethod: 'card',
    paymentStatus: 'refunded',
    createdAt: '2024-01-09T06:15:00Z',
    updatedAt: '2024-01-09T06:30:00Z'
  },
  {
    id: 'ORD1704876536',
    customerId: 'customer8',
    vendorId: '5',
    customerName: 'Divya Nair',
    customerPhone: '+91 98765 43217',
    items: [
      {
        id: '10',
        productId: '7',
        quantity: 3,
        price: 45,
        product: {
          id: '7',
          vendorId: '5',
          name: 'Whole Wheat Bread',
          description: 'Freshly baked whole wheat bread, healthy and nutritious',
          price: 45,
          categoryId: '6',
          images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'],
          stock: 60,
          unit: 'pack',
          weight: 0.4,
          isActive: true,
          createdAt: '2024-01-09T05:00:00Z',
          updatedAt: '2024-01-09T05:00:00Z',
        }
      }
    ],
    status: 'delivered',
    totalAmount: 135,
    deliveryFee: 25,
    tax: 7,
    deliveryAddress: {
      id: '8',
      label: 'Home',
      addressLine1: '202 Bakery Street',
      city: 'Chennai',
      state: 'Tamil Nadu',
      postalCode: '600001',
      country: 'India'
    },
    actualDeliveryTime: '20 mins',
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    createdAt: '2024-01-09T05:00:00Z',
    updatedAt: '2024-01-09T05:30:00Z',
    acceptedAt: '2024-01-09T05:05:00Z',
    preparationTime: 8
  },
  {
    id: 'ORD1704876535',
    customerId: 'customer9',
    vendorId: '6',
    customerName: 'Manoj Desai',
    customerPhone: '+91 98765 43218',
    items: [
      {
        id: '11',
        productId: '8',
        quantity: 2,
        price: 120,
        product: {
          id: '8',
          vendorId: '6',
          name: 'Organic Brown Rice',
          description: 'Premium organic brown rice, unpolished and healthy',
          price: 120,
          categoryId: '1',
          images: ['https://images.unsplash.com/photo-1603486460800-9fd8de11a4ad?w=400'],
          stock: 100,
          unit: 'kg',
          weight: 1,
          isActive: true,
          createdAt: '2024-01-09T04:15:00Z',
          updatedAt: '2024-01-09T04:15:00Z',
        }
      }
    ],
    status: 'pending',
    totalAmount: 240,
    deliveryFee: 35,
    tax: 12,
    deliveryAddress: {
      id: '9',
      label: 'Home',
      addressLine1: '303 Organic Avenue',
      city: 'Hyderabad',
      state: 'Telangana',
      postalCode: '500001',
      country: 'India'
    },
    estimatedDeliveryTime: '30-45 mins',
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    createdAt: '2024-01-09T04:15:00Z',
    updatedAt: '2024-01-09T04:15:00Z',
    preparationTime: 15
  },
  {
    id: 'ORD1704876534',
    customerId: 'customer10',
    vendorId: '7',
    customerName: 'Komal Shah',
    customerPhone: '+91 98765 43219',
    items: [
      {
        id: '12',
        productId: '9',
        quantity: 1,
        price: 80,
        product: {
          id: '9',
          vendorId: '7',
          name: 'Turmeric Powder',
          description: 'Pure organic turmeric powder, anti-inflammatory properties',
          price: 80,
          categoryId: '1',
          images: ['https://images.unsplash.com/photo-1585747860718-2b5384ef940a?w=400'],
          stock: 80,
          unit: 'pack',
          weight: 0.2,
          isActive: true,
          createdAt: '2024-01-09T03:30:00Z',
          updatedAt: '2024-01-09T03:30:00Z',
        }
      }
    ],
    status: 'preparing',
    totalAmount: 80,
    deliveryFee: 20,
    tax: 4,
    deliveryAddress: {
      id: '10',
      label: 'Home',
      addressLine1: '404 Spice Market',
      city: 'Delhi',
      state: 'Delhi',
      postalCode: '110001',
      country: 'India'
    },
    estimatedDeliveryTime: '20-25 mins',
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    createdAt: '2024-01-09T03:30:00Z',
    updatedAt: '2024-01-09T03:45:00Z',
    acceptedAt: '2024-01-09T03:35:00Z',
    preparationTime: 10
  },
  {
    id: 'ORD1704876533',
    customerId: 'customer11',
    vendorId: '8',
    customerName: 'Rajesh Nair',
    customerPhone: '+91 98765 43220',
    items: [
      {
        id: '13',
        productId: '10',
        quantity: 1,
        price: 250,
        product: {
          id: '10',
          vendorId: '8',
          name: 'Chicken Breast',
          description: 'Fresh chicken breast, boneless and skinless',
          price: 250,
          categoryId: '7',
          images: ['https://images.unsplash.com/photo-1603486460800-9fd8de11a4ad?w=400'],
          stock: 40,
          unit: 'kg',
          weight: 1,
          isActive: true,
          createdAt: '2024-01-09T02:45:00Z',
          updatedAt: '2024-01-09T02:45:00Z',
        }
      }
    ],
    status: 'delivered',
    totalAmount: 250,
    deliveryFee: 40,
    tax: 13,
    deliveryAddress: {
      id: '11',
      label: 'Home',
      addressLine1: '505 Meat Street',
      city: 'Kolkata',
      state: 'West Bengal',
      postalCode: '700001',
      country: 'India'
    },
    actualDeliveryTime: '25 mins',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    createdAt: '2024-01-09T02:45:00Z',
    updatedAt: '2024-01-09T03:15:00Z',
    acceptedAt: '2024-01-09T02:50:00Z',
    preparationTime: 15
  },
  {
    id: 'ORD1704876532',
    customerId: 'customer12',
    vendorId: '9',
    customerName: 'Sunita Iyer',
    customerPhone: '+91 98765 43221',
    items: [
      {
        id: '14',
        productId: '11',
        quantity: 2,
        price: 60,
        product: {
          id: '11',
          vendorId: '9',
          name: 'Fresh Milk',
          description: 'Pasteurized fresh milk, packed daily',
          price: 60,
          categoryId: '5',
          images: ['https://images.unsplash.com/photo-1554995204-2e8b0bca7e0f?w=400'],
          stock: 150,
          unit: 'liters',
          weight: 1,
          isActive: true,
          createdAt: '2024-01-09T02:00:00Z',
          updatedAt: '2024-01-09T02:00:00Z',
        }
      }
    ],
    status: 'out_for_delivery',
    totalAmount: 120,
    deliveryFee: 15,
    tax: 6,
    deliveryAddress: {
      id: '12',
      label: 'Home',
      addressLine1: '606 Milk Road',
      city: 'Pune',
      state: 'Maharashtra',
      postalCode: '411001',
      country: 'India'
    },
    estimatedDeliveryTime: '10-15 mins',
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    createdAt: '2024-01-09T02:00:00Z',
    updatedAt: '2024-01-09T02:30:00Z',
    acceptedAt: '2024-01-09T02:05:00Z',
    preparationTime: 8,
    deliveryPartnerId: 'dp002'
  },
  {
    id: 'ORD1704876531',
    customerId: 'customer13',
    vendorId: '10',
    customerName: 'Vijay Reddy',
    customerPhone: '+91 98765 43222',
    items: [
      {
        id: '15',
        productId: '12',
        quantity: 1,
        price: 120,
        product: {
          id: '12',
          vendorId: '10',
          name: 'Vitamin C Tablets',
          description: 'Effervescent vitamin C tablets, 1000mg per tablet',
          price: 120,
          categoryId: '4',
          images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'],
          stock: 90,
          unit: 'pack',
          weight: 0.1,
          isActive: true,
          createdAt: '2024-01-09T01:15:00Z',
          updatedAt: '2024-01-09T01:15:00Z',
        }
      }
    ],
    status: 'delivered',
    totalAmount: 120,
    deliveryFee: 25,
    tax: 6,
    deliveryAddress: {
      id: '13',
      label: 'Home',
      addressLine1: '707 Health Avenue',
      city: 'Ahmedabad',
      state: 'Gujarat',
      postalCode: '380001',
      country: 'India'
    },
    actualDeliveryTime: '22 mins',
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    createdAt: '2024-01-09T01:15:00Z',
    updatedAt: '2024-01-09T01:45:00Z',
    acceptedAt: '2024-01-09T01:20:00Z',
    preparationTime: 10
  },
  {
    id: 'ORD1704876530',
    customerId: 'customer14',
    vendorId: '1',
    customerName: 'Anjali Gupta',
    customerPhone: '+91 98765 43223',
    items: [
      {
        id: '16',
        productId: '13',
        quantity: 3,
        price: 100,
        product: {
          id: '13',
          vendorId: '1',
          name: 'Oranges',
          description: 'Sweet and juicy oranges from Nagpur',
          price: 100,
          categoryId: '3',
          images: ['https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400'],
          stock: 65,
          unit: 'kg',
          weight: 1,
          isActive: true,
          createdAt: '2024-01-09T00:30:00Z',
          updatedAt: '2024-01-09T00:30:00Z',
        }
      }
    ],
    status: 'accepted',
    totalAmount: 300,
    deliveryFee: 0,
    tax: 15,
    deliveryAddress: {
      id: '14',
      label: 'Home',
      addressLine1: '808 Fruit Lane',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400007',
      country: 'India'
    },
    estimatedDeliveryTime: '25-30 mins',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    createdAt: '2024-01-09T00:30:00Z',
    updatedAt: '2024-01-09T00:45:00Z',
    acceptedAt: '2024-01-09T00:35:00Z',
    preparationTime: 12
  },
  {
    id: 'ORD1704876529',
    customerId: 'customer15',
    vendorId: '2',
    customerName: 'Arun Krishnan',
    customerPhone: '+91 98765 43224',
    items: [
      {
        id: '17',
        productId: '14',
        quantity: 2,
        price: 50,
        product: {
          id: '14',
          vendorId: '2',
          name: 'Carrots',
          description: 'Fresh organic carrots, rich in beta-carotene',
          price: 50,
          categoryId: '2',
          images: ['https://images.unsplash.com/photo-1586901533053-18dbcdbab0f0?w=400'],
          stock: 85,
          unit: 'kg',
          weight: 1,
          isActive: true,
          createdAt: '2024-01-08T23:45:00Z',
          updatedAt: '2024-01-08T23:45:00Z',
        }
      }
    ],
    status: 'pending',
    totalAmount: 100,
    deliveryFee: 15,
    tax: 5,
    deliveryAddress: {
      id: '15',
      label: 'Home',
      addressLine1: '909 Veg Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400008',
      country: 'India'
    },
    estimatedDeliveryTime: '30-35 mins',
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    createdAt: '2024-01-08T23:45:00Z',
    updatedAt: '2024-01-08T23:45:00Z',
    preparationTime: 15
  }
]

// Additional vendor products for management
export const mockVendorProducts = [
  {
    id: '1',
    vendorId: '1',
    name: 'Fresh Apples',
    description: 'Premium quality Kashmir apples, crisp and sweet',
    price: 180,
    categoryId: '3',
    images: ['https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400'],
    stock: 45, // Updated stock after sales
    unit: 'kg',
    weight: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-09T14:30:00Z',
  },
  {
    id: '2',
    vendorId: '1',
    name: 'Bananas',
    description: 'Fresh yellow bananas, rich in potassium',
    price: 60,
    categoryId: '3',
    images: ['https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400'],
    stock: 97, // Updated stock
    unit: 'dozen',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-09T14:30:00Z',
  },
  {
    id: '3',
    vendorId: '2',
    name: 'Tomatoes',
    description: 'Fresh farm tomatoes, perfect for cooking',
    price: 40,
    categoryId: '2',
    images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400'],
    stock: 75,
    unit: 'kg',
    weight: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-09T14:30:00Z',
  },
  {
    id: '4',
    vendorId: '2',
    name: 'Fresh Spinach',
    description: 'Organic spinach leaves, rich in iron',
    price: 35,
    categoryId: '2',
    images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400'],
    stock: 30,
    unit: 'bunch',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-09T14:30:00Z',
  },
  {
    id: '5',
    vendorId: '3',
    name: 'Paracetamol 500mg',
    description: 'Pain relief and fever reducer, 10 tablets',
    price: 25,
    categoryId: '4',
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'],
    stock: 200,
    unit: 'pack',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-09T14:30:00Z',
  },
  {
    id: '6',
    vendorId: '1',
    name: 'Fresh Oranges',
    description: 'Juicy oranges from Nagpur, rich in Vitamin C',
    price: 150,
    categoryId: '3',
    images: ['https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400'],
    stock: 35,
    unit: 'kg',
    weight: 1,
    isActive: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-09T00:00:00Z',
  },
  {
    id: '7',
    vendorId: '1',
    name: 'Green Grapes',
    description: 'Sweet and seedless green grapes',
    price: 200,
    categoryId: '3',
    images: ['https://images.unsplash.com/photo-1515779122185-2390ccdf060b?w=400'],
    stock: 25,
    unit: 'kg',
    weight: 1,
    isActive: true,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-09T00:00:00Z',
  },
  {
    id: '8',
    vendorId: '1',
    name: 'Alphonso Mangoes',
    description: 'King of mangoes - Alphonso variety from Ratnagiri',
    price: 250,
    categoryId: '3',
    images: ['https://images.unsplash.com/photo-1553279903-fcc6c9a8e5d9?w=400'],
    stock: 0, // Out of stock
    unit: 'kg',
    weight: 1,
    isActive: false, // Disabled due to out of season
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-09T00:00:00Z',
  },
  {
    id: '9',
    vendorId: '4',
    name: 'Bluetooth Speaker',
    description: 'Waterproof portable Bluetooth speaker with 20W output',
    price: 2500,
    categoryId: '8',
    images: ['https://images.unsplash.com/photo-1606220588911-4a4260c1d7f6?w=400'],
    stock: 25,
    unit: 'pieces',
    weight: 0.5,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-09T14:30:00Z',
  },
  {
    id: '10',
    vendorId: '5',
    name: 'Whole Wheat Bread',
    description: 'Freshly baked whole wheat bread, healthy and nutritious',
    price: 45,
    categoryId: '6',
    images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'],
    stock: 60,
    unit: 'pack',
    weight: 0.4,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-09T14:30:00Z',
  },
  {
    id: '11',
    vendorId: '6',
    name: 'Organic Brown Rice',
    description: 'Premium organic brown rice, unpolished and healthy',
    price: 120,
    categoryId: '1',
    images: ['https://images.unsplash.com/photo-1603486460800-9fd8de11a4ad?w=400'],
    stock: 100,
    unit: 'kg',
    weight: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-09T14:30:00Z',
  },
  {
    id: '12',
    vendorId: '7',
    name: 'Turmeric Powder',
    description: 'Pure organic turmeric powder, anti-inflammatory properties',
    price: 80,
    categoryId: '1',
    images: ['https://images.unsplash.com/photo-1585747860718-2b5384ef940a?w=400'],
    stock: 80,
    unit: 'pack',
    weight: 0.2,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-09T14:30:00Z',
  },
  {
    id: '13',
    vendorId: '8',
    name: 'Chicken Breast',
    description: 'Fresh chicken breast, boneless and skinless',
    price: 250,
    categoryId: '7',
    images: ['https://images.unsplash.com/photo-1603486460800-9fd8de11a4ad?w=400'],
    stock: 40,
    unit: 'kg',
    weight: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-09T14:30:00Z',
  },
  {
    id: '14',
    vendorId: '9',
    name: 'Fresh Milk',
    description: 'Pasteurized fresh milk, packed daily',
    price: 60,
    categoryId: '5',
    images: ['https://images.unsplash.com/photo-1554995204-2e8b0bca7e0f?w=400'],
    stock: 150,
    unit: 'liters',
    weight: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-09T14:30:00Z',
  },
  {
    id: '15',
    vendorId: '10',
    name: 'Vitamin C Tablets',
    description: 'Effervescent vitamin C tablets, 1000mg per tablet',
    price: 120,
    categoryId: '4',
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'],
    stock: 90,
    unit: 'pack',
    weight: 0.1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-09T14:30:00Z',
  }
]

// Helper functions for vendor data
export const getTodayStats = () => {
  const today = mockDailyStats[mockDailyStats.length - 1]
  return {
    todayRevenue: today.revenue,
    todayOrders: today.orders,
    todayCustomers: today.customers,
    growthRate: 12.5 // Mock growth rate
  }
}

export const getUnreadNotifications = () => {
  return mockVendorNotifications.filter(n => !n.isRead)
}

export const getPendingOrdersCount = () => {
  return mockVendorOrders.filter(order => order.status === 'pending').length
}

export const getActiveOrdersCount = () => {
  return mockVendorOrders.filter(order => 
    ['accepted', 'preparing', 'ready', 'out_for_delivery'].includes(order.status)
  ).length
}