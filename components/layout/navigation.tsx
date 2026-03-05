'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/store'

interface NavItem {
  href: string
  label: string
  icon: string
  badge?: number | null
}

interface BottomNavProps {
  items: NavItem[]
}

export function BottomNav({ items }: BottomNavProps) {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-brand-cream-dark z-50 safe-bottom">
      <div className="flex max-w-lg mx-auto">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex-1 flex flex-col items-center gap-0.5 py-3 px-2 transition-colors relative',
                isActive ? 'text-brand-red' : 'text-brand-gray hover:text-brand-brown'
              )}
            >
              <span className={cn('text-2xl transition-transform', isActive && 'scale-110')}>
                {item.icon}
              </span>
              <span className={cn('text-[10px] font-medium', isActive && 'font-bold')}>
                {item.label}
              </span>
              {item.badge != null && item.badge > 0 && (
                <span className="absolute top-2 right-1/2 translate-x-3 w-4 h-4 bg-brand-red text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export function ClientBottomNav() {
  const itemCount = useCartStore(s => s.itemCount)
  return (
    <BottomNav items={[
      { href: '/client', label: 'Início', icon: '🏠' },
      { href: '/client/orders', label: 'Pedidos', icon: '📦' },
      { href: '/client/cart', label: 'Carrinho', icon: '🛒', badge: itemCount },
      { href: '/client/profile', label: 'Perfil', icon: '👤' },
    ]} />
  )
}

export function RestaurantBottomNav() {
  return (
    <BottomNav items={[
      { href: '/restaurant', label: 'Painel', icon: '📊' },
      { href: '/restaurant/orders', label: 'Pedidos', icon: '📋' },
      { href: '/restaurant/menu', label: 'Cardápio', icon: '🍽️' },
      { href: '/restaurant/settings', label: 'Config', icon: '⚙️' },
    ]} />
  )
}

export function DriverBottomNav() {
  return (
    <BottomNav items={[
      { href: '/driver', label: 'Início', icon: '🏠' },
      { href: '/driver/deliveries', label: 'Entregas', icon: '📦' },
      { href: '/driver/earnings', label: 'Ganhos', icon: '💰' },
      { href: '/driver/profile', label: 'Perfil', icon: '👤' },
    ]} />
  )
}

// ── Top Header ────────────────────────────────

interface AppHeaderProps {
  title?: React.ReactNode
  right?: React.ReactNode
  transparent?: boolean
}

export function AppHeader({ title, right, transparent }: AppHeaderProps) {
  return (
    <header className={cn(
      'sticky top-0 z-40 h-16 flex items-center justify-between px-4',
      transparent ? 'bg-transparent' : 'bg-white border-b border-brand-cream-dark shadow-card'
    )}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center text-base">🍽️</div>
        {title ?? (
          <span className="font-display text-lg font-black text-brand-brown">
            Peça<em className="text-brand-red not-italic">Meu</em>
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">{right}</div>
    </header>
  )
}
