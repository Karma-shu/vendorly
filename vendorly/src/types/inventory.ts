// Inventory Management Types
export interface InventoryItem {
  id: string
  productId: string
  vendorId: string
  sku: string
  name: string
  category: string
  currentStock: number
  reservedStock: number
  availableStock: number
  minStockLevel: number
  maxStockLevel: number
  reorderPoint: number
  reorderQuantity: number
  autoReorderEnabled: boolean
  unit: 'pieces' | 'kg' | 'liters' | 'grams' | 'packets'
  costPrice: number
  sellingPrice: number
  margin: number
  expiryDate?: string
  batchNumber?: string
  location: string
  supplier: Supplier
  status: 'active' | 'inactive' | 'discontinued'
  lastUpdated: string
  createdAt: string
}

export interface Supplier {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  address: Address
  paymentTerms: string
  deliveryTime: number // in days
  minimumOrderQuantity: number
  rating: number
  isPreferred: boolean
  isActive: boolean
  contracts: SupplierContract[]
}

export interface SupplierContract {
  id: string
  supplierId: string
  startDate: string
  endDate: string
  products: ContractProduct[]
  terms: string[]
  isActive: boolean
}

export interface ContractProduct {
  productId: string
  unitPrice: number
  minOrderQuantity: number
  discount?: number
  currency: string
}

export interface Address {
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  country: string
}

export interface PurchaseOrder {
  id: string
  vendorId: string
  supplierId: string
  orderNumber: string
  status: 'draft' | 'sent' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  items: PurchaseOrderItem[]
  totalAmount: number
  taxAmount: number
  grandTotal: number
  orderDate: string
  expectedDeliveryDate: string
  actualDeliveryDate?: string
  notes?: string
  createdBy: string
  approvedBy?: string
  approvedAt?: string
}

export interface PurchaseOrderItem {
  productId: string
  sku: string
  name: string
  quantity: number
  unitPrice: number
  totalPrice: number
  receivedQuantity?: number
  rejectedQuantity?: number
  acceptedQuantity?: number
}

export interface StockMovement {
  id: string
  inventoryItemId: string
  type: 'in' | 'out' | 'adjustment' | 'transfer' | 'reserved' | 'unreserved'
  quantity: number
  reason: string
  reference?: string // order ID, PO ID, etc.
  performedBy: string
  timestamp: string
  batchNumber?: string
  expiryDate?: string
  notes?: string
}

export interface InventoryAlert {
  id: string
  type: 'low_stock' | 'out_of_stock' | 'expiry_warning' | 'overstock' | 'reorder_suggestion'
  severity: 'low' | 'medium' | 'high' | 'critical'
  inventoryItemId: string
  message: string
  actionRequired: string
  isRead: boolean
  isResolved: boolean
  createdAt: string
  resolvedAt?: string
  resolvedBy?: string
}

export interface InventoryForecast {
  productId: string
  period: 'daily' | 'weekly' | 'monthly'
  startDate: string
  endDate: string
  predictedDemand: number
  currentStock: number
  suggestedOrderQuantity: number
  confidence: number
  factors: ForecastFactor[]
}

export interface ForecastFactor {
  type: 'seasonal' | 'trend' | 'promotion' | 'external' | 'historical'
  impact: number
  description: string
}

export interface InventoryReport {
  id: string
  type: 'stock_valuation' | 'movement_summary' | 'abc_analysis' | 'dead_stock' | 'turnover'
  generatedAt: string
  generatedBy: string
  parameters: Record<string, unknown>
  data: Record<string, unknown>
  summary: InventoryReportSummary
}

export interface InventoryReportSummary {
  totalItems: number
  totalValue: number
  lowStockItems: number
  outOfStockItems: number
  expiringItems: number
  deadStockItems: number
  fastMovingItems: number
  slowMovingItems: number
}

export interface AutoReorderRule {
  id: string
  vendorId: string
  productId: string
  isActive: boolean
  triggerType: 'stock_level' | 'time_based' | 'demand_forecast'
  triggerValue: number
  orderQuantity: number
  preferredSupplierId: string
  conditions: ReorderCondition[]
  createdAt: string
  lastTriggered?: string
}

export interface ReorderCondition {
  type: 'day_of_week' | 'month' | 'season' | 'supplier_availability' | 'budget_limit'
  value: string | number
  operator: 'equals' | 'greater_than' | 'less_than' | 'between'
}