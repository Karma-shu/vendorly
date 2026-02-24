import type { InventoryItem, Supplier, PurchaseOrder, StockMovement, InventoryAlert, InventoryForecast, AutoReorderRule } from '../types/inventory'

// Mock Suppliers
export const mockSuppliers: Supplier[] = [
  {
    id: 'supplier-1',
    name: 'Fresh Farm Supplies',
    contactPerson: 'Rajesh Kumar',
    email: 'rajesh@freshfarm.com',
    phone: '+91-9876543210',
    address: {
      line1: '123 Farm Road',
      line2: 'Sector 5',
      city: 'Gurgaon',
      state: 'Haryana',
      pincode: '122001',
      country: 'India'
    },
    paymentTerms: '30 days',
    deliveryTime: 2,
    minimumOrderQuantity: 100,
    rating: 4.7,
    isPreferred: true,
    isActive: true,
    contracts: [
      {
        id: 'contract-1',
        supplierId: 'supplier-1',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        products: [
          {
            productId: 'prod-1',
            unitPrice: 45,
            minOrderQuantity: 50,
            discount: 5,
            currency: 'INR'
          }
        ],
        terms: ['Fresh produce guarantee', 'Quality assurance', 'Timely delivery'],
        isActive: true
      }
    ]
  },
  {
    id: 'supplier-2',
    name: 'Spice World Distributors',
    contactPerson: 'Meera Patel',
    email: 'meera@spiceworld.com',
    phone: '+91-9876543211',
    address: {
      line1: '456 Spice Market',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India'
    },
    paymentTerms: '15 days',
    deliveryTime: 1,
    minimumOrderQuantity: 50,
    rating: 4.5,
    isPreferred: false,
    isActive: true,
    contracts: []
  },
  {
    id: 'supplier-3',
    name: 'Dairy Fresh Co.',
    contactPerson: 'Amit Singh',
    email: 'amit@dairyfresh.com',
    phone: '+91-9876543212',
    address: {
      line1: '789 Dairy Lane',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
      country: 'India'
    },
    paymentTerms: '7 days',
    deliveryTime: 1,
    minimumOrderQuantity: 20,
    rating: 4.8,
    isPreferred: true,
    isActive: true,
    contracts: []
  },
  {
    id: 'supplier-4',
    name: 'Organic Essentials',
    contactPerson: 'Priya Nair',
    email: 'priya@organicessentials.com',
    phone: '+91-9876543213',
    address: {
      line1: '101 Organic Plaza',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      country: 'India'
    },
    paymentTerms: '21 days',
    deliveryTime: 3,
    minimumOrderQuantity: 75,
    rating: 4.9,
    isPreferred: true,
    isActive: true,
    contracts: []
  },
  {
    id: 'supplier-5',
    name: 'Tech Hardware Solutions',
    contactPerson: 'Vikram Sharma',
    email: 'vikram@techhardware.com',
    phone: '+91-9876543214',
    address: {
      line1: '202 Tech Hub',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500001',
      country: 'India'
    },
    paymentTerms: '10 days',
    deliveryTime: 2,
    minimumOrderQuantity: 25,
    rating: 4.6,
    isPreferred: false,
    isActive: true,
    contracts: []
  },
  {
    id: 'supplier-6',
    name: 'Bakery Supply Co.',
    contactPerson: 'Sunita Desai',
    email: 'sunita@bakerysupply.com',
    phone: '+91-9876543215',
    address: {
      line1: '303 Bakery Street',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600001',
      country: 'India'
    },
    paymentTerms: '14 days',
    deliveryTime: 1,
    minimumOrderQuantity: 30,
    rating: 4.4,
    isPreferred: true,
    isActive: true,
    contracts: []
  }
]

// Mock Inventory Items
export const mockInventoryItems: InventoryItem[] = [
  {
    id: 'inv-1',
    productId: 'prod-1',
    vendorId: 'vendor-1',
    sku: 'VEG-TOM-001',
    name: 'Fresh Tomatoes',
    category: 'Vegetables',
    currentStock: 45,
    reservedStock: 15,
    availableStock: 30,
    minStockLevel: 20,
    maxStockLevel: 200,
    reorderPoint: 25,
    reorderQuantity: 100,
    autoReorderEnabled: true,
    unit: 'kg',
    costPrice: 35,
    sellingPrice: 50,
    margin: 42.8,
    expiryDate: '2024-12-30',
    batchNumber: 'BTH-001',
    location: 'A1-R1-S1',
    supplier: mockSuppliers[0],
    status: 'active',
    lastUpdated: '2024-12-26T10:30:00Z',
    createdAt: '2024-12-20T09:00:00Z'
  },
  {
    id: 'inv-2',
    productId: 'prod-2',
    vendorId: 'vendor-1',
    sku: 'SPI-TUR-001',
    name: 'Turmeric Powder',
    category: 'Spices',
    currentStock: 5,
    reservedStock: 2,
    availableStock: 3,
    minStockLevel: 10,
    maxStockLevel: 100,
    reorderPoint: 15,
    reorderQuantity: 50,
    autoReorderEnabled: true,
    unit: 'packets',
    costPrice: 25,
    sellingPrice: 40,
    margin: 37.5,
    expiryDate: '2025-06-30',
    batchNumber: 'SP-002',
    location: 'B2-R2-S3',
    supplier: mockSuppliers[1],
    status: 'active',
    lastUpdated: '2024-12-25T14:20:00Z',
    createdAt: '2024-12-15T11:00:00Z'
  },
  {
    id: 'inv-3',
    productId: 'prod-3',
    vendorId: 'vendor-1',
    sku: 'DAI-MIL-001',
    name: 'Fresh Milk',
    category: 'Dairy',
    currentStock: 0,
    reservedStock: 0,
    availableStock: 0,
    minStockLevel: 10,
    maxStockLevel: 50,
    reorderPoint: 5,
    reorderQuantity: 30,
    autoReorderEnabled: true,
    unit: 'liters',
    costPrice: 45,
    sellingPrice: 60,
    margin: 25,
    expiryDate: '2024-12-28',
    batchNumber: 'MLK-003',
    location: 'C1-R1-S2',
    supplier: mockSuppliers[2],
    status: 'active',
    lastUpdated: '2024-12-26T08:00:00Z',
    createdAt: '2024-12-18T07:30:00Z'
  },
  {
    id: 'inv-4',
    productId: 'prod-4',
    vendorId: 'vendor-1',
    sku: 'GRA-RIC-001',
    name: 'Basmati Rice',
    category: 'Grains',
    currentStock: 250,
    reservedStock: 30,
    availableStock: 220,
    minStockLevel: 50,
    maxStockLevel: 500,
    reorderPoint: 75,
    reorderQuantity: 200,
    autoReorderEnabled: false,
    unit: 'kg',
    costPrice: 80,
    sellingPrice: 120,
    margin: 33.3,
    location: 'D1-R3-S1',
    supplier: mockSuppliers[0],
    status: 'active',
    lastUpdated: '2024-12-24T16:45:00Z',
    createdAt: '2024-12-10T10:00:00Z'
  },
  {
    id: 'inv-5',
    productId: 'prod-5',
    vendorId: 'vendor-1',
    sku: 'ORG-APP-001',
    name: 'Organic Apples',
    category: 'Fruits',
    currentStock: 60,
    reservedStock: 5,
    availableStock: 55,
    minStockLevel: 25,
    maxStockLevel: 150,
    reorderPoint: 30,
    reorderQuantity: 100,
    autoReorderEnabled: true,
    unit: 'kg',
    costPrice: 120,
    sellingPrice: 180,
    margin: 33.3,
    expiryDate: '2024-12-31',
    batchNumber: 'APP-001',
    location: 'A2-R1-S2',
    supplier: mockSuppliers[3],
    status: 'active',
    lastUpdated: '2024-12-26T12:15:00Z',
    createdAt: '2024-12-22T10:00:00Z'
  },
  {
    id: 'inv-6',
    productId: 'prod-6',
    vendorId: 'vendor-2',
    sku: 'ELE-PHO-001',
    name: 'Wireless Headphones',
    category: 'Electronics',
    currentStock: 15,
    reservedStock: 3,
    availableStock: 12,
    minStockLevel: 5,
    maxStockLevel: 50,
    reorderPoint: 8,
    reorderQuantity: 20,
    autoReorderEnabled: true,
    unit: 'pieces',
    costPrice: 1500,
    sellingPrice: 2200,
    margin: 31.8,
    location: 'E1-R2-S1',
    supplier: mockSuppliers[4],
    status: 'active',
    lastUpdated: '2024-12-26T11:45:00Z',
    createdAt: '2024-12-15T09:00:00Z'
  },
  {
    id: 'inv-7',
    productId: 'prod-7',
    vendorId: 'vendor-2',
    sku: 'BAK-BRD-001',
    name: 'Whole Wheat Bread',
    category: 'Bakery',
    currentStock: 40,
    reservedStock: 8,
    availableStock: 32,
    minStockLevel: 15,
    maxStockLevel: 100,
    reorderPoint: 20,
    reorderQuantity: 50,
    autoReorderEnabled: true,
    unit: 'packets',
    costPrice: 35,
    sellingPrice: 45,
    margin: 22.2,
    expiryDate: '2024-12-29',
    batchNumber: 'BRD-001',
    location: 'F1-R1-S3',
    supplier: mockSuppliers[5],
    status: 'active',
    lastUpdated: '2024-12-26T09:30:00Z',
    createdAt: '2024-12-20T08:00:00Z'
  },
  {
    id: 'inv-8',
    productId: 'prod-8',
    vendorId: 'vendor-3',
    sku: 'MED-ASP-001',
    name: 'Aspirin 100mg',
    category: 'Medicines',
    currentStock: 120,
    reservedStock: 10,
    availableStock: 110,
    minStockLevel: 30,
    maxStockLevel: 300,
    reorderPoint: 40,
    reorderQuantity: 100,
    autoReorderEnabled: false,
    unit: 'packets',
    costPrice: 15,
    sellingPrice: 25,
    margin: 40,
    expiryDate: '2025-06-15',
    batchNumber: 'ASP-001',
    location: 'G1-R3-S1',
    supplier: mockSuppliers[0],
    status: 'active',
    lastUpdated: '2024-12-26T14:20:00Z',
    createdAt: '2024-12-01T11:00:00Z'
  },
  {
    id: 'inv-9',
    productId: 'prod-9',
    vendorId: 'vendor-1',
    sku: 'VEG-CUC-001',
    name: 'Fresh Cucumber',
    category: 'Vegetables',
    currentStock: 75,
    reservedStock: 12,
    availableStock: 63,
    minStockLevel: 20,
    maxStockLevel: 200,
    reorderPoint: 25,
    reorderQuantity: 100,
    autoReorderEnabled: true,
    unit: 'kg',
    costPrice: 25,
    sellingPrice: 40,
    margin: 37.5,
    expiryDate: '2024-12-28',
    batchNumber: 'CUC-001',
    location: 'A1-R2-S1',
    supplier: mockSuppliers[0],
    status: 'active',
    lastUpdated: '2024-12-26T13:10:00Z',
    createdAt: '2024-12-23T10:30:00Z'
  },
  {
    id: 'inv-10',
    productId: 'prod-10',
    vendorId: 'vendor-1',
    sku: 'FRT-MAN-001',
    name: 'Mangoes (Alphonso)',
    category: 'Fruits',
    currentStock: 25,
    reservedStock: 5,
    availableStock: 20,
    minStockLevel: 10,
    maxStockLevel: 100,
    reorderPoint: 15,
    reorderQuantity: 50,
    autoReorderEnabled: true,
    unit: 'kg',
    costPrice: 200,
    sellingPrice: 300,
    margin: 33.3,
    expiryDate: '2024-12-30',
    batchNumber: 'MAN-001',
    location: 'A3-R1-S1',
    supplier: mockSuppliers[3],
    status: 'active',
    lastUpdated: '2024-12-26T15:45:00Z',
    createdAt: '2024-12-21T09:15:00Z'
  }
]

// Mock Purchase Orders
export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-1',
    vendorId: 'vendor-1',
    supplierId: 'supplier-1',
    orderNumber: 'PO-2024-001',
    status: 'confirmed',
    items: [
      {
        productId: 'prod-1',
        sku: 'VEG-TOM-001',
        name: 'Fresh Tomatoes',
        quantity: 100,
        unitPrice: 35,
        totalPrice: 3500
      }
    ],
    totalAmount: 3500,
    taxAmount: 630,
    grandTotal: 4130,
    orderDate: '2024-12-25T10:00:00Z',
    expectedDeliveryDate: '2024-12-27T10:00:00Z',
    notes: 'Urgent order for weekend stock',
    createdBy: 'vendor-1',
    approvedBy: 'vendor-1',
    approvedAt: '2024-12-25T11:00:00Z'
  },
  {
    id: 'po-2',
    vendorId: 'vendor-1',
    supplierId: 'supplier-2',
    orderNumber: 'PO-2024-002',
    status: 'sent',
    items: [
      {
        productId: 'prod-2',
        sku: 'SPI-TUR-001',
        name: 'Turmeric Powder',
        quantity: 50,
        unitPrice: 25,
        totalPrice: 1250
      }
    ],
    totalAmount: 1250,
    taxAmount: 225,
    grandTotal: 1475,
    orderDate: '2024-12-26T09:00:00Z',
    expectedDeliveryDate: '2024-12-27T09:00:00Z',
    notes: 'Reorder for low stock item',
    createdBy: 'vendor-1'
  },
  {
    id: 'po-3',
    vendorId: 'vendor-1',
    supplierId: 'supplier-3',
    orderNumber: 'PO-2024-003',
    status: 'delivered',
    items: [
      {
        productId: 'prod-3',
        sku: 'DAI-MIL-001',
        name: 'Fresh Milk',
        quantity: 100,
        unitPrice: 42,
        totalPrice: 4200
      }
    ],
    totalAmount: 4200,
    taxAmount: 756,
    grandTotal: 4956,
    orderDate: '2024-12-20T08:00:00Z',
    expectedDeliveryDate: '2024-12-21T08:00:00Z',
    actualDeliveryDate: '2024-12-21T09:30:00Z',
    notes: 'Weekly milk supply',
    createdBy: 'vendor-1',
    approvedBy: 'vendor-1',
    approvedAt: '2024-12-20T08:15:00Z'
  },
  {
    id: 'po-4',
    vendorId: 'vendor-2',
    supplierId: 'supplier-4',
    orderNumber: 'PO-2024-004',
    status: 'shipped',
    items: [
      {
        productId: 'prod-5',
        sku: 'ORG-APP-001',
        name: 'Organic Apples',
        quantity: 50,
        unitPrice: 110,
        totalPrice: 5500
      }
    ],
    totalAmount: 5500,
    taxAmount: 990,
    grandTotal: 6490,
    orderDate: '2024-12-26T14:00:00Z',
    expectedDeliveryDate: '2024-12-29T10:00:00Z',
    notes: 'Organic fruits restocking',
    createdBy: 'vendor-2'
  },
  {
    id: 'po-5',
    vendorId: 'vendor-2',
    supplierId: 'supplier-5',
    orderNumber: 'PO-2024-005',
    status: 'draft',
    items: [
      {
        productId: 'prod-6',
        sku: 'ELE-PHO-001',
        name: 'Wireless Headphones',
        quantity: 20,
        unitPrice: 1450,
        totalPrice: 29000
      }
    ],
    totalAmount: 29000,
    taxAmount: 5220,
    grandTotal: 34220,
    orderDate: '2024-12-26T15:00:00Z',
    expectedDeliveryDate: '2024-12-30T10:00:00Z',
    notes: 'Electronics inventory expansion',
    createdBy: 'vendor-2'
  },
  {
    id: 'po-6',
    vendorId: 'vendor-1',
    supplierId: 'supplier-6',
    orderNumber: 'PO-2024-006',
    status: 'confirmed',
    items: [
      {
        productId: 'prod-7',
        sku: 'BAK-BRD-001',
        name: 'Whole Wheat Bread',
        quantity: 80,
        unitPrice: 32,
        totalPrice: 2560
      }
    ],
    totalAmount: 2560,
    taxAmount: 460.8,
    grandTotal: 3020.8,
    orderDate: '2024-12-26T16:00:00Z',
    expectedDeliveryDate: '2024-12-28T09:00:00Z',
    notes: 'Bakery items weekly order',
    createdBy: 'vendor-1',
    approvedBy: 'vendor-1',
    approvedAt: '2024-12-26T16:15:00Z'
  }
]

// Mock Stock Movements
export const mockStockMovements: StockMovement[] = [
  {
    id: 'mov-1',
    inventoryItemId: 'inv-1',
    type: 'out',
    quantity: -10,
    reason: 'Sale',
    reference: 'ORD-001',
    performedBy: 'system',
    timestamp: '2024-12-26T10:30:00Z',
    notes: 'Customer order fulfilled'
  },
  {
    id: 'mov-2',
    inventoryItemId: 'inv-2',
    type: 'reserved',
    quantity: -2,
    reason: 'Order Reserved',
    reference: 'ORD-002',
    performedBy: 'system',
    timestamp: '2024-12-26T11:00:00Z'
  },
  {
    id: 'mov-3',
    inventoryItemId: 'inv-3',
    type: 'out',
    quantity: -15,
    reason: 'Sale',
    reference: 'ORD-003',
    performedBy: 'system',
    timestamp: '2024-12-26T09:00:00Z',
    notes: 'Last stock sold'
  },
  {
    id: 'mov-4',
    inventoryItemId: 'inv-1',
    type: 'in',
    quantity: 100,
    reason: 'Purchase Order Received',
    reference: 'PO-2024-001',
    performedBy: 'vendor-1',
    timestamp: '2024-12-25T14:00:00Z',
    batchNumber: 'BTH-001',
    expiryDate: '2024-12-30'
  },
  {
    id: 'mov-5',
    inventoryItemId: 'inv-5',
    type: 'out',
    quantity: -5,
    reason: 'Sale',
    reference: 'ORD-004',
    performedBy: 'system',
    timestamp: '2024-12-26T12:15:00Z',
    notes: 'Organic apples sold'
  },
  {
    id: 'mov-6',
    inventoryItemId: 'inv-6',
    type: 'out',
    quantity: -1,
    reason: 'Sale',
    reference: 'ORD-005',
    performedBy: 'system',
    timestamp: '2024-12-26T11:45:00Z',
    notes: 'Headphones sold'
  },
  {
    id: 'mov-7',
    inventoryItemId: 'inv-7',
    type: 'out',
    quantity: -2,
    reason: 'Sale',
    reference: 'ORD-006',
    performedBy: 'system',
    timestamp: '2024-12-26T13:20:00Z',
    notes: 'Bread sold'
  },
  {
    id: 'mov-8',
    inventoryItemId: 'inv-8',
    type: 'out',
    quantity: -5,
    reason: 'Sale',
    reference: 'ORD-007',
    performedBy: 'system',
    timestamp: '2024-12-26T14:30:00Z',
    notes: 'Aspirin strip sold'
  },
  {
    id: 'mov-9',
    inventoryItemId: 'inv-9',
    type: 'out',
    quantity: -3,
    reason: 'Sale',
    reference: 'ORD-008',
    performedBy: 'system',
    timestamp: '2024-12-26T15:00:00Z',
    notes: 'Cucumbers sold'
  },
  {
    id: 'mov-10',
    inventoryItemId: 'inv-10',
    type: 'out',
    quantity: -2,
    reason: 'Sale',
    reference: 'ORD-009',
    performedBy: 'system',
    timestamp: '2024-12-26T16:00:00Z',
    notes: 'Alphonso mangoes sold'
  },
  {
    id: 'mov-11',
    inventoryItemId: 'inv-4',
    type: 'out',
    quantity: -2,
    reason: 'Sale',
    reference: 'ORD-010',
    performedBy: 'system',
    timestamp: '2024-12-25T18:00:00Z',
    notes: 'Basmati rice sold'
  },
  {
    id: 'mov-12',
    inventoryItemId: 'inv-1',
    type: 'adjustment',
    quantity: -1,
    reason: 'Spoilage',
    reference: 'ADJ-001',
    performedBy: 'vendor-1',
    timestamp: '2024-12-26T08:00:00Z',
    notes: 'Damaged tomatoes removed'
  },
  {
    id: 'mov-13',
    inventoryItemId: 'inv-3',
    type: 'in',
    quantity: 100,
    reason: 'Purchase Order Received',
    reference: 'PO-2024-003',
    performedBy: 'vendor-1',
    timestamp: '2024-12-21T10:00:00Z',
    batchNumber: 'MLK-004',
    expiryDate: '2024-12-29'
  }
]

// Mock Inventory Alerts
export const mockInventoryAlerts: InventoryAlert[] = [
  {
    id: 'alert-1',
    type: 'low_stock',
    severity: 'high',
    inventoryItemId: 'inv-2',
    message: 'Turmeric Powder stock is below minimum level',
    actionRequired: 'Reorder immediately',
    isRead: false,
    isResolved: false,
    createdAt: '2024-12-26T08:00:00Z'
  },
  {
    id: 'alert-2',
    type: 'out_of_stock',
    severity: 'critical',
    inventoryItemId: 'inv-3',
    message: 'Fresh Milk is out of stock',
    actionRequired: 'Emergency procurement needed',
    isRead: false,
    isResolved: false,
    createdAt: '2024-12-26T09:30:00Z'
  },
  {
    id: 'alert-3',
    type: 'expiry_warning',
    severity: 'medium',
    inventoryItemId: 'inv-1',
    message: 'Fresh Tomatoes expiring in 4 days',
    actionRequired: 'Promote or discount to clear stock',
    isRead: true,
    isResolved: false,
    createdAt: '2024-12-26T07:00:00Z'
  },
  {
    id: 'alert-4',
    type: 'reorder_suggestion',
    severity: 'low',
    inventoryItemId: 'inv-1',
    message: 'Fresh Tomatoes approaching reorder point',
    actionRequired: 'Consider placing order in 2-3 days',
    isRead: true,
    isResolved: true,
    createdAt: '2024-12-25T10:00:00Z',
    resolvedAt: '2024-12-25T11:00:00Z',
    resolvedBy: 'vendor-1'
  },
  {
    id: 'alert-5',
    type: 'low_stock',
    severity: 'high',
    inventoryItemId: 'inv-10',
    message: 'Alphonso Mangoes stock is running low',
    actionRequired: 'Seasonal product - check availability',
    isRead: false,
    isResolved: false,
    createdAt: '2024-12-26T10:00:00Z'
  },
  {
    id: 'alert-6',
    type: 'expiry_warning',
    severity: 'medium',
    inventoryItemId: 'inv-7',
    message: 'Whole Wheat Bread expiring tomorrow',
    actionRequired: 'Discount or donate remaining stock',
    isRead: true,
    isResolved: false,
    createdAt: '2024-12-26T09:00:00Z'
  },
  {
    id: 'alert-7',
    type: 'overstock',
    severity: 'low',
    inventoryItemId: 'inv-4',
    message: 'Basmati Rice stock is above optimal level',
    actionRequired: 'Plan promotions to reduce stock',
    isRead: true,
    isResolved: false,
    createdAt: '2024-12-26T08:30:00Z'
  },
  {
    id: 'alert-8',
    type: 'low_stock',
    severity: 'medium',
    inventoryItemId: 'inv-8',
    message: 'Aspirin stock approaching minimum level',
    actionRequired: 'Schedule reorder soon',
    isRead: false,
    isResolved: false,
    createdAt: '2024-12-26T11:00:00Z'
  },
  {
    id: 'alert-9',
    type: 'expiry_warning',
    severity: 'high',
    inventoryItemId: 'inv-9',
    message: 'Fresh Cucumber expiring in 2 days',
    actionRequired: 'Urgent promotion needed',
    isRead: false,
    isResolved: false,
    createdAt: '2024-12-26T10:30:00Z'
  }
]

// Mock Inventory Forecasts
export const mockInventoryForecasts: InventoryForecast[] = [
  {
    productId: 'prod-1',
    period: 'weekly',
    startDate: '2024-12-30',
    endDate: '2025-01-06',
    predictedDemand: 75,
    currentStock: 45,
    suggestedOrderQuantity: 100,
    confidence: 0.85,
    factors: [
      {
        type: 'seasonal',
        impact: 0.2,
        description: 'Winter season increases demand for fresh vegetables'
      },
      {
        type: 'historical',
        impact: 0.6,
        description: 'Based on last 3 months average demand'
      },
      {
        type: 'trend',
        impact: 0.15,
        description: 'Increasing health consciousness trend'
      }
    ]
  },
  {
    productId: 'prod-2',
    period: 'monthly',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    predictedDemand: 200,
    currentStock: 5,
    suggestedOrderQuantity: 250,
    confidence: 0.78,
    factors: [
      {
        type: 'seasonal',
        impact: 0.3,
        description: 'Festival season increases spice demand'
      },
      {
        type: 'historical',
        impact: 0.5,
        description: 'Based on previous year January sales'
      }
    ]
  }
]

// Mock Auto-Reorder Rules
export const mockAutoReorderRules: AutoReorderRule[] = [
  {
    id: 'rule-1',
    vendorId: 'vendor-1',
    productId: 'prod-1',
    isActive: true,
    triggerType: 'stock_level',
    triggerValue: 25,
    orderQuantity: 100,
    preferredSupplierId: 'supplier-1',
    conditions: [
      {
        type: 'day_of_week',
        value: 'Monday',
        operator: 'equals'
      }
    ],
    createdAt: '2024-12-01T10:00:00Z',
    lastTriggered: '2024-12-25T10:00:00Z'
  },
  {
    id: 'rule-2',
    vendorId: 'vendor-1',
    productId: 'prod-2',
    isActive: true,
    triggerType: 'stock_level',
    triggerValue: 15,
    orderQuantity: 50,
    preferredSupplierId: 'supplier-2',
    conditions: [],
    createdAt: '2024-12-01T10:00:00Z'
  },
  {
    id: 'rule-3',
    vendorId: 'vendor-1',
    productId: 'prod-3',
    isActive: true,
    triggerType: 'stock_level',
    triggerValue: 5,
    orderQuantity: 100,
    preferredSupplierId: 'supplier-3',
    conditions: [
      {
        type: 'day_of_week',
        value: 'Tuesday',
        operator: 'equals'
      }
    ],
    createdAt: '2024-12-01T10:00:00Z'
  },
  {
    id: 'rule-4',
    vendorId: 'vendor-2',
    productId: 'prod-5',
    isActive: true,
    triggerType: 'stock_level',
    triggerValue: 20,
    orderQuantity: 50,
    preferredSupplierId: 'supplier-4',
    conditions: [],
    createdAt: '2024-12-05T14:00:00Z'
  },
  {
    id: 'rule-5',
    vendorId: 'vendor-2',
    productId: 'prod-6',
    isActive: false,
    triggerType: 'demand_forecast',
    triggerValue: 10,
    orderQuantity: 15,
    preferredSupplierId: 'supplier-5',
    conditions: [
      {
        type: 'day_of_week',
        value: 'Friday',
        operator: 'equals'
      }
    ],
    createdAt: '2024-12-10T11:00:00Z'
  },
  {
    id: 'rule-6',
    vendorId: 'vendor-1',
    productId: 'prod-7',
    isActive: true,
    triggerType: 'stock_level',
    triggerValue: 10,
    orderQuantity: 30,
    preferredSupplierId: 'supplier-6',
    conditions: [],
    createdAt: '2024-12-15T09:00:00Z'
  }
]

// Utility Functions
export const getInventoryAlerts = (vendorId: string) => {
  return mockInventoryAlerts.filter(alert => !alert.isResolved)
}

export const getInventoryByVendor = (vendorId: string) => {
  return mockInventoryItems.filter(item => item.vendorId === vendorId)
}

export const getLowStockItems = (vendorId: string) => {
  return mockInventoryItems.filter(item => 
    item.vendorId === vendorId && 
    item.availableStock <= item.minStockLevel
  )
}

export const getOutOfStockItems = (vendorId: string) => {
  return mockInventoryItems.filter(item => 
    item.vendorId === vendorId && 
    item.availableStock === 0
  )
}

export const getExpiringItems = (vendorId: string, days: number = 7) => {
  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + days)
  
  return mockInventoryItems.filter(item => 
    item.vendorId === vendorId && 
    item.expiryDate &&
    new Date(item.expiryDate) <= futureDate
  )
}

export const calculateInventoryValue = (vendorId: string) => {
  const items = getInventoryByVendor(vendorId)
  return items.reduce((total, item) => total + (item.currentStock * item.costPrice), 0)
}

export const getInventoryTurnoverRate = (productId: string, days: number = 30) => {
  const movements = mockStockMovements.filter(mov => 
    mov.inventoryItemId.includes(productId) && 
    mov.type === 'out' &&
    new Date(mov.timestamp) >= new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  )
  
  const totalSold = movements.reduce((sum, mov) => sum + Math.abs(mov.quantity), 0)
  const item = mockInventoryItems.find(inv => inv.productId === productId)
  const avgStock = item ? item.currentStock : 0
  
  return avgStock > 0 ? totalSold / avgStock : 0
}

export const generateReorderSuggestions = (vendorId: string) => {
  const items = getInventoryByVendor(vendorId)
  return items.filter(item => 
    item.availableStock <= item.reorderPoint &&
    item.autoReorderEnabled
  ).map(item => ({
    item,
    suggestedQuantity: item.reorderQuantity,
    urgency: item.availableStock === 0 ? 'critical' : 
             item.availableStock <= item.minStockLevel ? 'high' : 'medium'
  }))
}