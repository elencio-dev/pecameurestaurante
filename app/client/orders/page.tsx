'use client'
import { useRouter } from 'next/navigation'
import { DynamicIcon } from "@/components/ui/icon";
import { useAuthStore, useOrdersStore } from '@/store'
import { formatCurrency, formatDate } from '@/lib/utils'
import { OrderStatusBadge, EmptyState, Button } from '@/components/ui'
import { AppHeader } from '@/components/layout/navigation'

export default function OrdersPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { getCustomerOrders } = useOrdersStore()

  const orders = user ? getCustomerOrders(user.id) : []

  return (
    <div className="min-h-screen bg-brand-cream">
      <AppHeader title={<span className="font-display text-xl font-black text-brand-brown">Meus Pedidos</span>} />

      <div className="px-4 py-5 pb-24">
        {orders.length === 0 ? (
          <EmptyState
            emoji="📦"
            title="Nenhum pedido ainda"
            description="Faça seu primeiro pedido e ele aparecerá aqui"
            action={<Button onClick={() => router.push('/client')}>Explorar restaurantes</Button>}
          />
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <button
                key={order.id}
                onClick={() => router.push(`/client/orders/${order.id}`)}
                className="w-full bg-white rounded-2xl border border-brand-cream-dark p-4 text-left hover:shadow-soft hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="font-display font-bold text-brand-brown">{order.restaurantName}</p>
                    <p className="text-xs text-brand-gray mt-0.5">{order.orderNumber}</p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="flex items-center gap-2 text-xs text-brand-gray mb-3 flex-wrap">
                  {order.items.slice(0, 3).map(item => (
                    <span key={item.id}><DynamicIcon name={item.icon} size="md" /> {item.menuItemName}</span>
                  ))}
                  {order.items.length > 3 && <span>+{order.items.length - 3} mais</span>}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-brand-gray">{formatDate(order.createdAt)}</span>
                  <span className="font-display font-bold text-brand-red">{formatCurrency(order.total)}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
