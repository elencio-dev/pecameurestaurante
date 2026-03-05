'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Cart, CartItem, MenuItem, Order, OrderStatus } from '@/types'
import { generateOrderNumber, formatCurrency } from '@/lib/utils'
import { MOCK_ORDERS, MOCK_RESTAURANTS } from '@/lib/data'

// ─── AUTH STORE ───────────────────────────────

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'pmr-auth' }
  )
)

// ─── CART STORE ───────────────────────────────

interface CartState {
  cart: Cart | null
  addItem: (item: MenuItem, restaurantId: string, restaurantName: string, deliveryFee: number) => void
  removeItem: (menuItemId: string) => void
  updateQuantity: (menuItemId: string, quantity: number) => void
  clearCart: () => void
  get subtotal(): number
  get total(): number
  get itemCount(): number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,

      addItem: (item, restaurantId, restaurantName, deliveryFee) => {
        set((state) => {
          const currentCart = state.cart

          // Different restaurant = new cart
          if (currentCart && currentCart.restaurantId !== restaurantId) {
            return {
              cart: {
                restaurantId, restaurantName, deliveryFee,
                items: [{ menuItem: item, quantity: 1 }],
              },
            }
          }

          if (!currentCart) {
            return {
              cart: {
                restaurantId, restaurantName, deliveryFee,
                items: [{ menuItem: item, quantity: 1 }],
              },
            }
          }

          const existing = currentCart.items.find(i => i.menuItem.id === item.id)
          if (existing) {
            return {
              cart: {
                ...currentCart,
                items: currentCart.items.map(i =>
                  i.menuItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                ),
              },
            }
          }

          return {
            cart: {
              ...currentCart,
              items: [...currentCart.items, { menuItem: item, quantity: 1 }],
            },
          }
        })
      },

      removeItem: (menuItemId) => {
        set((state) => {
          if (!state.cart) return {}
          const items = state.cart.items.filter(i => i.menuItem.id !== menuItemId)
          return { cart: items.length ? { ...state.cart, items } : null }
        })
      },

      updateQuantity: (menuItemId, quantity) => {
        set((state) => {
          if (!state.cart) return {}
          if (quantity <= 0) {
            const items = state.cart.items.filter(i => i.menuItem.id !== menuItemId)
            return { cart: items.length ? { ...state.cart, items } : null }
          }
          return {
            cart: {
              ...state.cart,
              items: state.cart.items.map(i =>
                i.menuItem.id === menuItemId ? { ...i, quantity } : i
              ),
            },
          }
        })
      },

      clearCart: () => set({ cart: null }),

      get subtotal() {
        const cart = get().cart
        if (!cart) return 0
        return cart.items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0)
      },

      get total() {
        const cart = get().cart
        if (!cart) return 0
        return get().subtotal + cart.deliveryFee + 1.00 // platform fee
      },

      get itemCount() {
        const cart = get().cart
        if (!cart) return 0
        return cart.items.reduce((sum, i) => sum + i.quantity, 0)
      },
    }),
    { name: 'pmr-cart' }
  )
)

// ─── ORDERS STORE ─────────────────────────────

interface OrdersState {
  orders: Order[]
  placeOrder: (cart: Cart, user: User, paymentMethod: string) => Order
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  getRestaurantOrders: (restaurantId: string) => Order[]
  getCustomerOrders: (customerId: string) => Order[]
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: MOCK_ORDERS,

      placeOrder: (cart, user, paymentMethod) => {
        const restaurant = MOCK_RESTAURANTS.find(r => r.id === cart.restaurantId)!
        const subtotal = cart.items.reduce((s, i) => s + i.menuItem.price * i.quantity, 0)
        const total = subtotal + cart.deliveryFee + 1.00

        const order: Order = {
          id: `o${Date.now()}`,
          orderNumber: generateOrderNumber(),
          customerId: user.id,
          customerName: user.name,
          customerPhone: user.phone,
          restaurantId: cart.restaurantId,
          restaurantName: cart.restaurantName,
          items: cart.items.map((ci, idx) => ({
            id: `oi${Date.now()}${idx}`,
            menuItemId: ci.menuItem.id,
            menuItemName: ci.menuItem.name,
            emoji: ci.menuItem.emoji,
            quantity: ci.quantity,
            unitPrice: ci.menuItem.price,
            totalPrice: ci.menuItem.price * ci.quantity,
          })),
          deliveryAddress: {
            id: 'da-new',
            label: 'Endereço',
            street: 'Rua Exemplo',
            number: '100',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01310-000',
          },
          subtotal,
          deliveryFee: cart.deliveryFee,
          discount: 0,
          platformFee: 1.00,
          total,
          paymentMethod: paymentMethod as any,
          paymentStatus: 'paid',
          status: 'pending',
          statusHistory: [{ status: 'pending', timestamp: new Date().toISOString() }],
          estimatedDeliveryTime: restaurant?.estimatedDeliveryTime ?? 40,
          createdAt: new Date().toISOString(),
        }

        set(state => ({ orders: [order, ...state.orders] }))
        return order
      },

      updateOrderStatus: (orderId, status) => {
        set(state => ({
          orders: state.orders.map(o =>
            o.id === orderId
              ? {
                  ...o,
                  status,
                  statusHistory: [
                    ...o.statusHistory,
                    { status, timestamp: new Date().toISOString() },
                  ],
                }
              : o
          ),
        }))
      },

      getRestaurantOrders: (restaurantId) => {
        return get().orders.filter(o => o.restaurantId === restaurantId)
      },

      getCustomerOrders: (customerId) => {
        return get().orders.filter(o => o.customerId === customerId)
      },
    }),
    { name: 'pmr-orders' }
  )
)
