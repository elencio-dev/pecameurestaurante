'use client'
import { useState, useEffect } from 'react'
import { Navigation, Package, DollarSign, Star, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store'
import { formatCurrency, ORDER_STATUS_LABELS } from '@/lib/utils'
import { Card, StatCard, OrderStatusBadge, Button, PulseDot } from '@/components/ui'
import type { Order, OrderItem } from '@/types'

type PopulatedOrder = Order & { deliveryAddress: any }

export default function DriverDashboard() {
  const { user } = useAuthStore()
  const [isOnline, setIsOnline] = useState(true)
  const [availableDeliveries, setAvailableDeliveries] = useState<PopulatedOrder[]>([])
  const [myDeliveries, setMyDeliveries] = useState<PopulatedOrder[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/driver/orders')
      if (res.ok) {
        const data = await res.json()
        setAvailableDeliveries(data.availableDeliveries || [])
        setMyDeliveries(data.myDeliveries || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 10000)
    return () => clearInterval(interval)
  }, [])

  const acceptDelivery = async (orderId: string) => {
    const toastId = toast.loading('Aceitando corrida...')
    try {
      const res = await fetch(`/api/driver/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acceptDelivery: true })
      })
      if (res.ok) {
        toast.success('Entrega aceita! 🛵', { id: toastId })
        fetchOrders()
      } else toast.error('Erro ao aceitar.', { id: toastId })
    } catch (err) {
      toast.error('Erro de conexão.', { id: toastId })
    }
  }

  const changeStatus = async (orderId: string, status: string, msg: string) => {
    const toastId = toast.loading('Atualizando...')
    try {
      const res = await fetch(`/api/driver/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        toast.success(msg, { id: toastId })
        fetchOrders()
      } else toast.error('Erro', { id: toastId })
    } catch (err) {
      toast.error('Erro', { id: toastId })
    }
  }

  const activeDeliveries = myDeliveries.filter(o => o.status !== 'delivered' && o.status !== 'cancelled')
  const completedToday = myDeliveries.filter(o => o.status === 'delivered')
  const earningsToday = completedToday.reduce((s, o) => s + Number(o.deliveryFee), 0)

  if (loading && availableDeliveries.length === 0) {
    return <div className="min-h-screen bg-brand-cream flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
    </div>
  }

  const driverName = user?.name?.split(' ')[0] || "Motorista"

  return (
    <div className="min-h-screen bg-brand-cream pb-24">
      {/* Header */}
      <div className={`px-5 pt-5 pb-6 transition-colors ${isOnline ? 'bg-brand-brown' : 'bg-gray-700'}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/50 text-sm">Olá,</p>
            <h1 className="font-display text-2xl font-black text-white">{driverName} 🛵</h1>
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
          <StatCard label="Ganhos hoje" value={formatCurrency(earningsToday)} accent sub={`${completedToday.length} entregas`} />
          <StatCard label="Esta semana" value={formatCurrency(earningsToday * 2.5)} />
          <StatCard label="Avaliação" value="4.9★" />
          <StatCard label="Total entregas" value={`${myDeliveries.length}`} />
        </div>

        {/* My active deliveries */}
        {activeDeliveries.length > 0 && (
          <div>
            <h2 className="font-display text-lg font-bold text-brand-brown mb-3">Minhas entregas ativas ({activeDeliveries.length})</h2>
            {activeDeliveries.map(order => (
              <Card key={order.id} className="p-4 border-brand-red/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-brand-brown">{order.customerName}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="flex items-center gap-2 text-xs text-brand-gray mb-3 bg-brand-cream/40 p-2 rounded">
                  <MapPin size={11} className="text-brand-red" />
                  <span>{order.deliveryAddress?.street}, {order.deliveryAddress?.number} — {order.deliveryAddress?.neighborhood}</span>
                </div>

                <div className="flex gap-2">
                  {order.status === 'picked_up' && (
                    <Button size="sm" className="flex-1" onClick={() => changeStatus(order.id, 'on_the_way', 'Saiu para entrega! 🚀')}>
                      Saiu para Entrega
                    </Button>
                  )}
                  {order.status === 'on_the_way' && (
                    <Button size="sm" className="flex-1 bg-green-500 hover:bg-green-600 border-green-500" onClick={() => changeStatus(order.id, 'delivered', 'Pedido Entregue! 🎉')}>
                      Marcar como Entregue
                    </Button>
                  )}
                  <Button size="sm" variant="secondary" onClick={() => toast('Navegação em breve! 🗺️')} title="Navegar">
                    <Navigation size={15} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Available deliveries */}
        {isOnline && activeDeliveries.length === 0 && (
          <div>
            <h2 className="font-display text-lg font-bold text-brand-brown mb-3">
              📦 Disponíveis na Região ({availableDeliveries.length})
            </h2>
            {availableDeliveries.length === 0 ? (
              <Card className="p-8 text-center border-dashed">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-brand-gray">Aguardando pedidos na região...</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {availableDeliveries.map(order => (
                  <Card key={order.id} className="p-4 hover:-translate-y-1 transition-transform">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <PulseDot />
                          <span className="font-semibold text-brand-brown">{order.restaurantName}</span>
                        </div>
                        <p className="text-xs text-brand-gray mt-0.5">Pedido: {order.orderNumber}</p>
                      </div>
                      <span className="font-display font-bold text-brand-red text-lg">{formatCurrency(order.deliveryFee)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-brand-gray mb-3 bg-brand-cream/30 p-2 rounded">
                      <MapPin size={11} />
                      <span>{order.deliveryAddress?.neighborhood}, {order.deliveryAddress?.city}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => acceptDelivery(order.id)}
                      >
                        Aceitar por {formatCurrency(order.deliveryFee)}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Earnings info */}
        <Card className="p-4 bg-brand-cream-dark border-brand-gold/20">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💰</span>
            <div>
              <p className="font-semibold text-brand-brown text-sm mb-1">Pagamento Transparente PMR</p>
              <p className="text-xs text-brand-gray leading-relaxed">
                Você recebe <strong className="text-brand-gold">100% da taxa de entrega</strong> de cada pedido.
                Acreditamos na valorização do seu trabalho. Sem descontos ocultos.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
