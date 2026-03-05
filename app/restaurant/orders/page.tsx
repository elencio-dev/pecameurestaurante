'use client'
import { useState } from 'react'
import { useOrdersStore } from '@/store'
import { formatCurrency, ORDER_STATUS_LABELS } from '@/lib/utils'
import { OrderStatusBadge, Card, Button, PulseDot } from '@/components/ui'
import { AppHeader } from '@/components/layout/navigation'
import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/types'
import toast from 'react-hot-toast'

const RESTAURANT_ID = 'r1'

const STATUS_ACTIONS: Partial<Record<OrderStatus, { label: string; next: OrderStatus }>> = {
  pending:  { label: 'Aceitar', next: 'accepted' },
  accepted: { label: 'Preparar', next: 'preparing' },
  preparing:{ label: 'Pronto', next: 'ready' },
  ready:    { label: 'Coletado', next: 'picked_up' },
}

type TabType = 'all' | 'active' | 'pending' | 'delivered'

export default function RestaurantOrdersPage() {
  const [tab, setTab] = useState<TabType>('active')
  const { orders, updateOrderStatus, getRestaurantOrders } = useOrdersStore()
  const restaurantOrders = getRestaurantOrders(RESTAURANT_ID)

  const filtered = restaurantOrders.filter(o => {
    if (tab === 'all') return true
    if (tab === 'active') return !['delivered', 'cancelled'].includes(o.status)
    if (tab === 'pending') return o.status === 'pending'
    if (tab === 'delivered') return o.status === 'delivered'
    return true
  })

  const tabs: { value: TabType; label: string }[] = [
    { value: 'active', label: `Ativos (${restaurantOrders.filter(o => !['delivered','cancelled'].includes(o.status)).length})` },
    { value: 'pending', label: `Novos (${restaurantOrders.filter(o => o.status === 'pending').length})` },
    { value: 'delivered', label: `Entregues (${restaurantOrders.filter(o => o.status === 'delivered').length})` },
    { value: 'all', label: 'Todos' },
  ]

  return (
    <div className="min-h-screen bg-brand-cream">
      <AppHeader title={<span className="font-display text-xl font-black text-brand-brown">Pedidos</span>} />

      {/* Tab bar */}
      <div className="bg-white border-b border-brand-cream-dark px-4">
        <div className="flex gap-0 overflow-x-auto no-scrollbar">
          {tabs.map(t => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={cn(
                'flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                tab === t.value ? 'border-brand-red text-brand-red' : 'border-transparent text-brand-gray'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 pb-24 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📋</div>
            <p className="text-brand-gray">Nenhum pedido neste filtro</p>
          </div>
        ) : (
          filtered.map(order => {
            const action = STATUS_ACTIONS[order.status]
            return (
              <Card key={order.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {order.status === 'pending' && <PulseDot />}
                    <span className="font-semibold text-brand-brown">{order.customerName}</span>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
                <p className="text-xs text-brand-gray mb-3">{order.orderNumber}</p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {order.items.map(item => (
                    <span key={item.id} className="text-xs bg-brand-cream-dark text-brand-brown px-2.5 py-1 rounded-full">
                      {item.emoji} {item.quantity}× {item.menuItemName}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-display text-lg font-bold text-brand-red">{formatCurrency(order.subtotal)}</span>
                    <span className="text-xs text-brand-gray ml-2">(-R$1,00 taxa PMR)</span>
                  </div>
                  {action && (
                    <Button size="sm" onClick={() => {
                      updateOrderStatus(order.id, action.next)
                      toast.success(`${ORDER_STATUS_LABELS[action.next]}`)
                    }}>
                      {action.label}
                    </Button>
                  )}
                  {order.status === 'pending' && (
                    <Button size="sm" variant="danger" onClick={() => {
                      updateOrderStatus(order.id, 'cancelled')
                      toast('Pedido recusado')
                    }}>
                      Recusar
                    </Button>
                  )}
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
