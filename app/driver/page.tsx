'use client'
import { useState } from 'react'
import { Navigation, Package, DollarSign, Star, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore, useOrdersStore } from '@/store'
import { formatCurrency } from '@/lib/utils'
import { Card, StatCard, OrderStatusBadge, Button, PulseDot } from '@/components/ui'

export default function DriverDashboard() {
  const { user } = useAuthStore()
  const { orders } = useOrdersStore()
  const [isOnline, setIsOnline] = useState(true)

  const availableDeliveries = orders.filter(o => o.status === 'ready')
  const myDeliveries = orders.filter(o => o.driverId === 'u3' && !['delivered'].includes(o.status))
  const completedToday = orders.filter(o => o.driverId === 'u3' && o.status === 'delivered')
  const earningsToday = completedToday.reduce((s, o) => s + o.deliveryFee, 0)

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <div className={`px-5 pt-5 pb-6 transition-colors ${isOnline ? 'bg-brand-brown' : 'bg-gray-700'}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/50 text-sm">Olá,</p>
            <h1 className="font-display text-2xl font-black text-white">{user?.name?.split(' ')[0]} 🛵</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/70 text-sm">{isOnline ? 'Online' : 'Offline'}</span>
            <button
              onClick={() => {
                setIsOnline(!isOnline)
                toast(isOnline ? 'Você está offline' : 'Você está online! 🟢')
              }}
              className={`relative w-14 h-7 rounded-full transition-colors ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`}
            >
              <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${isOnline ? 'left-7' : 'left-0.5'}`} />
            </button>
          </div>
        </div>
        {isOnline && (
          <div className="flex items-center gap-1.5">
            <PulseDot color="bg-green-400" />
            <span className="text-green-400 text-xs font-medium">Disponível para entregas</span>
          </div>
        )}
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Ganhos hoje" value={earningsToday} accent sub={`${completedToday.length} entregas`} />
          <StatCard label="Esta semana" value={earningsToday * 4.2} />
          <StatCard label="Avaliação" value="4.9★" />
          <StatCard label="Total entregas" value="147" />
        </div>

        {/* Available deliveries */}
        {isOnline && (
          <div>
            <h2 className="font-display text-lg font-bold text-brand-brown mb-3">
              📦 Disponíveis ({availableDeliveries.length})
            </h2>
            {availableDeliveries.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-brand-gray">Aguardando pedidos na região...</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {availableDeliveries.map(order => (
                  <Card key={order.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <PulseDot />
                          <span className="font-semibold text-brand-brown">{order.restaurantName}</span>
                        </div>
                        <p className="text-xs text-brand-gray mt-0.5">{order.orderNumber}</p>
                      </div>
                      <span className="font-display font-bold text-brand-red text-lg">{formatCurrency(order.deliveryFee)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-brand-gray mb-3">
                      <MapPin size={11} />
                      <span>{order.deliveryAddress.neighborhood}, {order.deliveryAddress.city}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => toast.success('Entrega aceita! 🛵')}
                      >
                        Aceitar entrega
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => toast('Entrega recusada')}
                      >
                        Recusar
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My active deliveries */}
        {myDeliveries.length > 0 && (
          <div>
            <h2 className="font-display text-lg font-bold text-brand-brown mb-3">Minhas entregas ativas</h2>
            {myDeliveries.map(order => (
              <Card key={order.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-brand-brown">{order.customerName}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="flex items-center gap-2 text-xs text-brand-gray mb-3">
                  <MapPin size={11} />
                  <span>{order.deliveryAddress.street}, {order.deliveryAddress.number} — {order.deliveryAddress.neighborhood}</span>
                </div>
                <Button size="sm" className="w-full" onClick={() => toast('Navegação em breve! 🗺️')}>
                  <Navigation size={14} /> Navegar até o endereço
                </Button>
              </Card>
            ))}
          </div>
        )}

        {/* Earnings info */}
        <Card className="p-4 bg-brand-cream-dark border-brand-gold/20">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💰</span>
            <div>
              <p className="font-semibold text-brand-brown text-sm mb-1">Como funciona seu pagamento</p>
              <p className="text-xs text-brand-gray leading-relaxed">
                Você recebe <strong className="text-brand-gold">100% da taxa de entrega</strong> de cada pedido.
                Pagamentos semanais via Pix. Sem descontos da plataforma sobre suas entregas.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
