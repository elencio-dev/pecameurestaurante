import { useState, useEffect } from 'react'
import { DynamicIcon } from "@/components/ui/icon";
import { TrendingUp, Package, Star, Clock, DollarSign, Bell } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store'
import { MOCK_REVENUE_MONTHLY } from '@/lib/data'
import { formatCurrency, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils'
import { Card, StatCard, OrderStatusBadge, PulseDot, Button } from '@/components/ui'
import type { OrderStatus, Order, OrderItem } from '@/types'
import { cn } from '@/lib/utils'

const STATUS_ACTIONS: Partial<Record<OrderStatus, { label: string; next: OrderStatus }>> = {
  pending: { label: 'Aceitar pedido', next: 'accepted' },
  accepted: { label: 'Iniciar preparo', next: 'preparing' },
  preparing: { label: 'Marcar como pronto', next: 'ready' },
  ready: { label: 'Entregador coletou', next: 'picked_up' },
}

export default function RestaurantDashboard() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active')
  const [restaurantOrders, setRestaurantOrders] = useState<(Order & { items: OrderItem[] })[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders')
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) setRestaurantOrders(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 10000) // Poll a cada 10s
    return () => clearInterval(interval)
  }, [])

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        toast.success(`Pedido atualizado: ${ORDER_STATUS_LABELS[status]}`)
        fetchOrders()
      } else {
        toast.error("Erro ao atualizar status.")
      }
    } catch (err) {
      toast.error("Erro na comunicação com o servidor.")
    }
  }

  const activeOrders = restaurantOrders.filter(o =>
    !['delivered', 'cancelled', 'refunded'].includes(o.status)
  )
  const historyOrders = restaurantOrders.filter(o =>
    ['delivered', 'cancelled'].includes(o.status)
  )

  const todayRevenue = restaurantOrders
    .filter(o => o.status === 'delivered')
    .reduce((s, o) => s + Number(o.subtotal), 0)

  const todayOrders = restaurantOrders.filter(o => o.status === 'delivered').length
  const todayPlatformFees = todayOrders * 1.00
  const pendingCount = activeOrders.filter(o => o.status === 'pending').length

  const restaurantName = restaurantOrders.length > 0 ? restaurantOrders[0].restaurantName : user?.name

  if (loading && restaurantOrders.length === 0) {
    return <div className="min-h-screen bg-brand-cream flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
    </div>
  }

  return (
    <div className="min-h-screen bg-brand-cream pb-24">
      {/* Header */}
      <div className="bg-brand-brown px-5 pt-5 pb-6 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-brand-red/10 rounded-full" />
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center text-base">🍽️</div>
            <span className="font-display text-lg font-black text-brand-cream">Painel PMR</span>
          </div>
          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <div className="bg-brand-red text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-brand">
                <PulseDot color="bg-white" />
                {pendingCount} novo{pendingCount > 1 ? 's' : ''}
              </div>
            )}
            <button className="w-9 h-9 bg-brand-cream/10 rounded-xl flex items-center justify-center text-brand-cream/70">
              <Bell size={17} />
            </button>
          </div>
        </div>
        <div className="relative z-10">
          <p className="text-brand-cream/50 text-sm">Olá,</p>
          <h1 className="font-display text-2xl font-black text-brand-cream">{restaurantName} 👋</h1>
          <div className="flex items-center gap-1.5 mt-1">
            <PulseDot color="bg-green-400" />
            <span className="text-green-400 text-xs font-medium">Restaurante aberto e recebendo pedidos</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Faturamento (Hoje)"
            value={formatCurrency(todayRevenue)}
            sub="Baseado nas entregas"
            accent
          />
          <StatCard label="Pedidos Hoje" value={`${todayOrders}`} sub={`${pendingCount} em andamento`} />
          <StatCard label="Receita Líquida" value={formatCurrency(todayRevenue - todayPlatformFees)} />
          <StatCard label="Taxa PMR" value={formatCurrency(todayPlatformFees)} sub={`${todayOrders} × R$1,00`} />
        </div>

        {/* Orders tabs */}
        <div>
          <div className="flex gap-1 bg-white rounded-xl p-1 border border-brand-cream-dark mb-3">
            {(['active', 'history'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'flex-1 py-2 text-sm font-medium rounded-lg transition-all',
                  activeTab === tab ? 'bg-brand-red text-white shadow-sm' : 'text-brand-gray hover:text-brand-brown'
                )}
              >
                {tab === 'active' ? `Ativos (${activeOrders.length})` : `Histórico (${historyOrders.length})`}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {(activeTab === 'active' ? activeOrders : historyOrders).map(order => {
              const action = STATUS_ACTIONS[order.status]
              return (
                <Card key={order.id} className="p-4 border-brand-cream-dark shadow-sm">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        {order.status === 'pending' && <PulseDot />}
                        <span className="font-semibold text-brand-brown text-sm">{order.customerName}</span>
                      </div>
                      <span className="text-xs text-brand-gray">{order.orderNumber}</span>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  <div className="flex flex-col gap-1.5 mb-3 bg-brand-cream/30 p-2 rounded-lg">
                    {order.items.map(item => (
                      <span key={item.id} className="text-xs font-medium text-brand-brown flex items-center gap-1.5">
                        <span className="bg-brand-cream-dark px-1.5 py-0.5 rounded text-[10px]">{item.quantity}x</span>
                        {item.menuItemName}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-display text-lg font-bold text-brand-red">{formatCurrency(order.total)}</span>
                    {action && activeTab === 'active' && (
                      <Button
                        size="sm"
                        className="shadow-brand hover:scale-105 transition-transform"
                        onClick={() => {
                          updateOrderStatus(order.id, action.next)
                        }}
                      >
                        {action.label}
                      </Button>
                    )}
                  </div>

                  {/* Platform fee transparency */}
                  <div className="mt-3 pt-2 border-t border-brand-cream-dark flex items-center justify-between text-xs text-brand-gray">
                    <span>Taxa da plataforma PMR</span>
                    <span className="font-semibold text-brand-brown">{formatCurrency(order.platformFee)}</span>
                  </div>
                </Card>
              )
            })}

            {((activeTab === 'active' && activeOrders.length === 0) ||
              (activeTab === 'history' && historyOrders.length === 0)) && (
                <div className="text-center py-12 text-brand-gray bg-white rounded-2xl border border-brand-cream-dark border-dashed">
                  <div className="text-4xl mb-3">{activeTab === 'active' ? '😴' : '📋'}</div>
                  <p className="font-medium text-brand-brown mb-1">{activeTab === 'active' ? 'Nenhum pedido ativo' : 'Histórico vazio'}</p>
                  <p className="text-xs">{activeTab === 'active' ? 'Aguardando novos clientes...' : 'Os pedidos finalizados aparecerão aqui.'}</p>
                </div>
              )}
          </div>
        </div>

        {/* Business model transparency */}
        <Card className="p-4 bg-brand-cream-dark border-brand-gold/20">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <p className="font-semibold text-brand-brown text-sm mb-1">Modelo Inovador PMR</p>
              <p className="text-xs text-brand-gray leading-relaxed">
                Você paga apenas <strong className="text-brand-gold">R$1,00 por pedido</strong> concluído.
                Sem os tradicionais 27% sobre suas vendas, você lucra mais em cada entrega!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
