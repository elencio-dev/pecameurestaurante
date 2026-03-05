'use client'
import { useState, useEffect } from 'react'
import { DynamicIcon } from "@/components/ui/icon";
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Star, Clock, MapPin, ShoppingCart, Plus, Minus, Info } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCartStore, useAuthStore } from '@/store'
import { formatCurrency, cn } from '@/lib/utils'
import { Button, Badge, Price } from '@/components/ui'
import type { Restaurant, MenuItem, MenuCategory } from '@/types'

function RestaurantLogo({ logo, name }: { logo: string, name: string }) {
  if (logo.startsWith('/')) {
    return <img src={logo} alt={name} className="w-full h-full object-cover" />;
  }
  return <span>{logo}</span>;
}

export default function RestaurantPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const { cart, addItem, updateQuantity, itemCount, subtotal, total } = useCartStore()

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('')

  useEffect(() => {
    fetch(`/api/restaurants/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.restaurant) {
          setRestaurant(data.restaurant)
          setCategories(data.categories)
          setMenuItems(data.menuItems)
          if (data.categories.length > 0) {
            setActiveCategory(data.categories[0].id)
          }
        }
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center py-10">
        <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-brand-gray mt-4">Carregando cardápio...</p>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <p className="text-brand-gray">Restaurante não encontrado</p>
          <button onClick={() => router.back()} className="mt-4 text-brand-red font-semibold">Voltar</button>
        </div>
      </div>
    )
  }

  const getItemQty = (itemId: string) => {
    if (!cart) return 0
    return cart.items.find(i => i.menuItem.id === itemId)?.quantity ?? 0
  }

  const handleAdd = (item: MenuItem) => {
    if (cart && cart.restaurantId !== restaurant.id) {
      if (!confirm('Seu carrinho atual será substituído. Continuar?')) return
    }
    addItem(item, restaurant.id, restaurant.name, restaurant.deliveryFee)
    toast.success(`${item.name} adicionado! 🛒`)
  }

  const itemsByCategory = (categoryId: string) =>
    menuItems.filter(item => item.categoryId === categoryId && item.isAvailable)

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Hero */}
      <div className="relative bg-brand-brown h-52 flex items-end overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-[120px] opacity-20 overflow-hidden">
          <RestaurantLogo logo={restaurant.logo} name={restaurant.name} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/95 via-brand-brown/30 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-white/25 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="relative z-10 px-5 pb-5 w-full">
          <h1 className="font-display text-3xl font-black text-white mb-1">{restaurant.name}</h1>
          <p className="text-white/70 text-sm">{restaurant.category}</p>
          <div className="flex items-center gap-3 mt-2 text-sm text-white/70">
            <span className="flex items-center gap-1"><Star size={12} className="text-amber-400 fill-amber-400" /> {restaurant.rating} ({restaurant.totalRatings})</span>
            <span className="flex items-center gap-1"><Clock size={12} /> {restaurant.estimatedDeliveryTime}min</span>
            <span>🛵 {formatCurrency(restaurant.deliveryFee)}</span>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="bg-white border-b border-brand-cream-dark sticky top-0 z-30">
        <div className="flex gap-0 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'flex-shrink-0 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors',
                activeCategory === cat.id
                  ? 'border-brand-red text-brand-red'
                  : 'border-transparent text-brand-gray hover:text-brand-brown'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="px-5 py-5 pb-32 space-y-8">
        {categories.map(cat => {
          const items = itemsByCategory(cat.id)
          if (items.length === 0) return null
          return (
            <section key={cat.id} id={`cat-${cat.id}`}>
              <h2 className="font-display text-lg font-bold text-brand-brown mb-3">{cat.name}</h2>
              <div className="space-y-3">
                {items.map(item => {
                  const qty = getItemQty(item.id)
                  return (
                    <div key={item.id} className="bg-white rounded-2xl border border-brand-cream-dark p-4 flex gap-3">
                      <div className="w-20 h-20 flex-shrink-0 bg-brand-cream-dark rounded-xl flex items-center justify-center text-4xl">
                        <DynamicIcon name={item.icon} size="md" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-semibold text-brand-brown text-sm">{item.name}</div>
                            {item.isHighlighted && <Badge variant="brand" className="text-[10px] mt-0.5">Destaque</Badge>}
                          </div>
                        </div>
                        <p className="text-xs text-brand-gray mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                        {item.tags.length > 0 && (
                          <div className="flex gap-1 mt-1.5 flex-wrap">
                            {item.tags.map(tag => (
                              <span key={tag} className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{tag}</span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-2.5">
                          <Price value={item.price} />
                          {qty === 0 ? (
                            <button
                              onClick={() => handleAdd(item)}
                              className="w-8 h-8 bg-brand-red rounded-xl flex items-center justify-center text-white hover:bg-brand-red-dark transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, qty - 1)}
                                className="w-7 h-7 rounded-lg border border-brand-cream-dark flex items-center justify-center hover:border-brand-red text-brand-brown transition-colors"
                              >
                                <Minus size={13} />
                              </button>
                              <span className="font-bold text-sm text-brand-brown w-4 text-center">{qty}</span>
                              <button
                                onClick={() => handleAdd(item)}
                                className="w-7 h-7 bg-brand-red rounded-lg flex items-center justify-center text-white hover:bg-brand-red-dark transition-colors"
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>

      {/* Sticky cart bar */}
      {itemCount > 0 && (
        <div className="fixed bottom-20 left-0 right-0 px-5 z-40">
          <button
            onClick={() => router.push('/client/cart')}
            className="w-full bg-brand-red text-white rounded-2xl px-5 py-4 flex items-center justify-between shadow-brand"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold">{itemCount}</span>
              </div>
              <span className="font-semibold">Ver carrinho</span>
            </div>
            <span className="font-display font-bold text-lg">{formatCurrency(total)}</span>
          </button>
        </div>
      )}
    </div>
  )
}
