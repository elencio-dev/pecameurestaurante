// ─────────────────────────────────────────────
//  ENTITIES
// ─────────────────────────────────────────────

export type UserRole = 'customer' | 'restaurant_owner' | 'driver' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  avatar?: string
  createdAt: string
  isActive: boolean
}

export interface Address {
  id: string
  label: string           // "Casa", "Trabalho"
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  lat?: number
  lng?: number
}

// ─────────────────────────────────────────────
//  RESTAURANT
// ─────────────────────────────────────────────

export type RestaurantStatus = 'open' | 'closed' | 'paused' | 'pending_approval'
export type RestaurantCategory =
  | 'Pizza' | 'Hambúrguer' | 'Japonês' | 'Árabe' | 'Brasileiro'
  | 'Italiano' | 'Mexicano' | 'Saudável' | 'Doces' | 'Frutos do Mar'

export interface Restaurant {
  id: string
  ownerId: string
  name: string
  slug: string
  description: string
  category: RestaurantCategory
  categories: RestaurantCategory[]
  logo: string              // emoji or URL
  coverImage?: string
  address: Address
  phone: string
  email: string
  cnpj: string
  // Operations
  status: RestaurantStatus
  openingHours: OpeningHours[]
  estimatedDeliveryTime: number   // minutes
  minimumOrder: number            // BRL
  deliveryFee: number             // BRL
  deliveryRadiusKm: number
  // Financial
  bankAccount?: BankAccount
  platformFeePerOrder: number     // always 1.00
  // Ratings
  rating: number
  totalRatings: number
  totalOrders: number
  // Settings
  acceptsOnlinePayment: boolean
  acceptsCash: boolean
  acceptsPix: boolean
  isPromoted: boolean
  createdAt: string
}

export interface OpeningHours {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6  // 0=Sun
  open: string    // "11:00"
  close: string   // "23:00"
  isOpen: boolean
}

export interface BankAccount {
  bank: string
  agency: string
  account: string
  type: 'corrente' | 'poupanca'
  pixKey?: string
}

// ─────────────────────────────────────────────
//  MENU / PRODUCTS
// ─────────────────────────────────────────────

export interface MenuCategory {
  id: string
  restaurantId: string
  name: string
  description?: string
  position: number
  isActive: boolean
}

export interface MenuItem {
  id: string
  restaurantId: string
  categoryId: string
  name: string
  description: string
  price: number
  originalPrice?: number      // for promotions
  icon: string
  imageUrl?: string
  isAvailable: boolean
  isHighlighted: boolean
  tags: string[]              // "vegetariano", "sem glúten", "picante"
  prepTimeMinutes: number
  calories?: number
  allergens?: string[]
  customizations?: MenuCustomization[]
}

export interface MenuCustomization {
  id: string
  title: string               // "Tamanho", "Molho extra"
  required: boolean
  maxSelections: number
  options: CustomizationOption[]
}

export interface CustomizationOption {
  id: string
  label: string
  additionalPrice: number
}

// ─────────────────────────────────────────────
//  ORDERS
// ─────────────────────────────────────────────

export type OrderStatus =
  | 'pending'           // aguardando restaurante aceitar
  | 'accepted'          // restaurante aceitou
  | 'preparing'         // em preparo
  | 'ready'             // pronto, aguardando entregador
  | 'picked_up'         // entregador coletou
  | 'on_the_way'        // a caminho
  | 'delivered'         // entregue
  | 'cancelled'         // cancelado
  | 'refunded'          // reembolsado

export type PaymentMethod = 'pix' | 'credit_card' | 'debit_card' | 'cash'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface OrderItem {
  id: string
  menuItemId: string
  menuItemName: string
  icon: string
  quantity: number
  unitPrice: number
  totalPrice: number
  selectedCustomizations?: SelectedCustomization[]
  notes?: string
}

export interface SelectedCustomization {
  customizationId: string
  title: string
  optionId: string
  optionLabel: string
  additionalPrice: number
}

export interface Order {
  id: string
  orderNumber: string         // "#PMR-0001"
  customerId: string
  customerName: string
  customerPhone: string
  restaurantId: string
  restaurantName: string
  driverId?: string
  driverName?: string
  // Items
  items: OrderItem[]
  // Address
  deliveryAddress: Address
  // Financials
  subtotal: number
  deliveryFee: number
  discount: number
  platformFee: number         // always 1.00 — our revenue
  total: number
  // Payment
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  // Status
  status: OrderStatus
  statusHistory: OrderStatusHistory[]
  estimatedDeliveryTime: number
  // Timestamps
  createdAt: string
  acceptedAt?: string
  readyAt?: string
  pickedUpAt?: string
  deliveredAt?: string
  cancelledAt?: string
  // Rating
  customerRating?: number
  customerReview?: string
  driverRating?: number
}

export interface OrderStatusHistory {
  status: OrderStatus
  timestamp: string
  note?: string
}

// ─────────────────────────────────────────────
//  DRIVER
// ─────────────────────────────────────────────

export type DriverStatus = 'offline' | 'available' | 'busy'

export interface Driver extends User {
  driverProfile: {
    cpf: string
    vehicleType: 'moto' | 'bicicleta' | 'carro'
    vehiclePlate?: string
    status: DriverStatus
    isApproved: boolean
    currentLocation?: { lat: number; lng: number }
    totalDeliveries: number
    rating: number
    earnings: {
      today: number
      week: number
      month: number
    }
    bankAccount: BankAccount
  }
}

// ─────────────────────────────────────────────
//  FINANCIALS / REVENUE MODEL
// ─────────────────────────────────────────────

export interface PlatformRevenue {
  date: string
  totalOrders: number
  platformFees: number        // R$1.00 × orders = revenue
  restaurantPayouts: number   // subtotal + delivery fee − platform fee
  driverPayouts: number       // delivery fee portion
  netRevenue: number
}

export interface RestaurantPayout {
  id: string
  restaurantId: string
  restaurantName: string
  period: string              // "2024-01"
  totalOrders: number
  grossRevenue: number
  platformFees: number
  netPayout: number           // what restaurant receives
  status: 'pending' | 'processing' | 'paid'
  paidAt?: string
}

// ─────────────────────────────────────────────
//  PROMOTIONS
// ─────────────────────────────────────────────

export interface Coupon {
  id: string
  code: string
  description: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minimumOrder: number
  maxUses: number
  usedCount: number
  validUntil: string
  isActive: boolean
  applicableTo: 'all' | string[]   // restaurant IDs
}

// ─────────────────────────────────────────────
//  CART (client-side only)
// ─────────────────────────────────────────────

export interface CartItem {
  menuItem: MenuItem
  quantity: number
  selectedCustomizations?: SelectedCustomization[]
  notes?: string
}

export interface Cart {
  restaurantId: string
  restaurantName: string
  deliveryFee: number
  items: CartItem[]
}

// ─────────────────────────────────────────────
//  NOTIFICATIONS
// ─────────────────────────────────────────────

export interface Notification {
  id: string
  userId: string
  title: string
  body: string
  type: 'order_update' | 'promo' | 'system'
  isRead: boolean
  orderId?: string
  createdAt: string
}

// ─────────────────────────────────────────────
//  API RESPONSES
// ─────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
