'use client'
import { useOrdersStore } from '@/store'
import { formatCurrency, formatDate } from '@/lib/utils'
import { OrderStatusBadge } from '@/components/ui'
import { AppHeader } from '@/components/layout/navigation'

export default function DriverDeliveriesPage() {
  const { orders } = useOrdersStore()
  const myOrders = orders.filter(o => o.driverId === 'u3')

  return (
    <div className="min-h-screen bg-brand-cream">
      <AppHeader title={<span className="font-display text-xl font-black text-brand-brown">Minhas Entregas</span>} />
      <div className="px-4 py-5 pb-24 space-y-3">
        {myOrders.length === 0 ? (
          <div className="text-center py-16 text-brand-gray">
            <div className="text-5xl mb-3">🛵</div>
            <p>Nenhuma entrega ainda</p>
          </div>
        ) : (
          myOrders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl border border-brand-cream-dark p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-brand-brown">{order.restaurantName} → {order.customerName}</p>
                  <p className="text-xs text-brand-gray mt-0.5">{order.orderNumber}</p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-xs text-brand-gray mb-2">
                📍 {order.deliveryAddress.street}, {order.deliveryAddress.number} — {order.deliveryAddress.neighborhood}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-brand-gray">{formatDate(order.createdAt)}</span>
                <span className="font-display font-bold text-brand-red">{formatCurrency(order.deliveryFee)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
