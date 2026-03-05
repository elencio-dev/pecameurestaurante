'use client'
import { useState, useEffect } from 'react'
import { DynamicIcon } from "@/components/ui/icon";
import { useRouter } from 'next/navigation'
import { Search, Bell, MapPin, ChevronRight, Star, Clock } from 'lucide-react'
import { useAuthStore, useCartStore } from '@/store'
import { RESTAURANT_CATEGORIES, formatCurrency, cn } from '@/lib/utils'
import type { Restaurant, RestaurantCategory } from '@/types'
import { AppHeader } from '@/components/layout/navigation'
import { Badge, PulseDot } from '@/components/ui'
import Image from 'next/image'

export default function ClientHomePage() {
  const { user } = useAuthStore()
  const itemCount = useCartStore(s => s.itemCount)
  const router = useRouter()

  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<'Todos' | RestaurantCategory>('Todos')

  useEffect(() => {
    fetch('/api/restaurants')
      .then(res => res.json())
      .then(data => {
        setRestaurants(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const firstName = user?.name.split(' ')[0] ?? 'você'

  const filtered = restaurants.filter(r => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.category.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategory === 'Todos' || r.categories.includes(activeCategory as RestaurantCategory)
    return matchSearch && matchCat
  })

  return (
    <div className="min-h-screen bg-brand-cream pb-24">
      {/* Hero section */}
      <div className="bg-brand-brown px-5 pt-5 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-brand-red/10 rounded-full" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-gold/10 rounded-full blur-2xl" />
        </div>

        {/* Top row */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-1.5 text-brand-cream/60 text-sm">
            <MapPin size={13} />
            <span>São Paulo, SP</span>
          </div>
          <div className="flex items-center gap-2">
            {itemCount > 0 && (
              <button onClick={() => router.push('/client/cart')} className="relative bg-brand-red rounded-xl px-3 py-2 flex items-center gap-1.5 text-white text-sm font-bold shadow-brand hover:scale-105 transition-transform">
                🛒
                <span className="w-5 h-5 bg-white text-brand-red text-xs font-black rounded-full flex items-center justify-center">{itemCount}</span>
              </button>
            )}
            <button className="w-10 h-10 bg-brand-cream/10 rounded-xl flex items-center justify-center text-brand-cream/70 hover:bg-brand-cream/20 transition-colors">
              <Bell size={18} />
            </button>
          </div>
        </div>

        {/* Greeting */}
        <div className="relative z-10 mb-5">
          <p className="text-brand-cream/50 text-sm mb-0.5">Boa tarde,</p>
          <h1 className="font-display text-3xl font-black text-brand-cream">
            {firstName}! <span className="text-brand-red">O que vai ser?</span>
          </h1>
        </div>

        {/* Search */}
        <div className="relative z-10 bg-white rounded-2xl flex items-center gap-3 px-4 py-3 shadow-soft">
          <Search size={18} className="text-brand-gray flex-shrink-0" />
          <input
            type="text"
            placeholder="Pizza, hambúrguer, sushi..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-brand-brown placeholder-brand-gray/60 text-sm focus:outline-none"
          />
        </div>
      </div>

      <div className="px-5 py-5 space-y-6">
        {/* Categories */}
        <div>
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {[{ value: 'Todos', icon: 'Utensils' }, ...RESTAURANT_CATEGORIES].map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value as any)}
                className={cn(
                  'flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium transition-all',
                  activeCategory === cat.value
                    ? 'bg-brand-red text-white shadow-brand'
                    : 'bg-white text-brand-brown border border-brand-cream-dark hover:border-brand-red/40'
                )}
              >
                <span><DynamicIcon name={cat.icon} size="md" /></span>
                <span>{cat.value}</span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-brand-gray mt-4">Buscando restaurantes reais...</p>
          </div>
        ) : (
          <>
            {/* Promoted */}
            {activeCategory === 'Todos' && !search && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-display text-lg font-bold text-brand-brown">⭐ Destaques</h2>
                </div>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                  {restaurants.filter(r => r.isPromoted).map(r => (
                    <RestaurantCardSmall key={r.id} restaurant={r} onClick={() => router.push(`/client/restaurants/${r.id}`)} />
                  ))}
                </div>
              </section>
            )}

            {/* All restaurants */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display text-lg font-bold text-brand-brown">
                  {activeCategory === 'Todos' ? '🗺️ Perto de você' : `${activeCategory}`}
                </h2>
                <span className="text-xs text-brand-gray">{filtered.length} estabelecimentos</span>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-3">😕</div>
                  <p className="text-brand-gray">Nenhum restaurante encontrado</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.map(r => (
                    <RestaurantCardFull key={r.id} restaurant={r} onClick={() => router.push(`/client/restaurants/${r.id}`)} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  )
}

function RestaurantLogo({ logo, name }: { logo: string, name: string }) {
  if (logo.startsWith('/')) {
    return <img src={logo} alt={name} className="w-full h-full object-cover" />;
  }
  return <span>{logo}</span>;
}

function RestaurantCardSmall({ restaurant: r, onClick }: { restaurant: Restaurant; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 w-44 bg-white rounded-2xl overflow-hidden border border-brand-cream-dark hover:shadow-soft hover:-translate-y-0.5 transition-all text-left"
    >
      <div className="h-28 bg-brand-cream-dark flex items-center justify-center text-5xl relative overflow-hidden">
        <RestaurantLogo logo={r.logo} name={r.name} />
        <span className="absolute top-2 right-2 bg-white/90 text-brand-red text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10">
          {r.status === 'open' ? '● Aberto' : '○ Fechado'}
        </span>
      </div>
      <div className="p-3">
        <div className="font-semibold text-sm text-brand-brown truncate">{r.name}</div>
        <div className="flex items-center gap-2 mt-1 text-xs text-brand-gray">
          <span className="font-medium text-amber-500">⭐ {Number(r.rating || 0).toFixed(1)}</span>
          <span>·</span>
          <span>{r.estimatedDeliveryTime}min</span>
        </div>
      </div>
    </button>
  )
}

function RestaurantCardFull({ restaurant: r, onClick }: { restaurant: Restaurant; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl overflow-hidden border border-brand-cream-dark hover:shadow-soft hover:-translate-y-0.5 transition-all text-left flex"
    >
      <div className="w-28 flex-shrink-0 bg-brand-cream-dark flex items-center justify-center text-5xl overflow-hidden">
        <RestaurantLogo logo={r.logo} name={r.name} />
      </div>
      <div className="flex-1 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-display font-bold text-brand-brown">{r.name}</div>
            <div className="text-xs text-brand-gray mt-0.5">{r.category}</div>
          </div>
          {r.isPromoted && <Badge variant="brand" className="text-[10px]">Destaque</Badge>}
        </div>

        <div className="flex items-center gap-3 mt-3 text-xs text-brand-gray">
          <span className="flex items-center gap-1 font-medium text-amber-500"><Star size={11} className="text-amber-400 fill-amber-400" /> {Number(r.rating || 0).toFixed(1)} ({r.totalRatings || 0})</span>
          <span className="flex items-center gap-1"><Clock size={11} /> {r.estimatedDeliveryTime}min</span>
          <span>🛵 {formatCurrency(r.deliveryFee)}</span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-brand-gray">Pedido mín. {formatCurrency(r.minimumOrder)}</span>
          <div className="flex items-center gap-1">
            <PulseDot color={r.status === 'open' ? 'bg-green-500' : 'bg-gray-400'} />
            <span className={cn('text-xs font-medium', r.status === 'open' ? 'text-green-600' : 'text-gray-500')}>
              {r.status === 'open' ? 'Aberto' : 'Fechado'}
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}
