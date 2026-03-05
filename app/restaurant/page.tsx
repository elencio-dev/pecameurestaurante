'use client'
import { useState, useEffect } from 'react'
import { DynamicIcon } from "@/components/ui/icon";
import { TrendingUp, Package, Star, Clock, DollarSign, Bell, Share2, Power } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store'
import { formatCurrency, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils'
import { Card, StatCard, OrderStatusBadge, PulseDot, Button } from '@/components/ui'
import type { OrderStatus, Order, OrderItem, Restaurant } from '@/types'
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
  const [profile, setProfile] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [ordersRes, profileRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/restaurant/my')
      ])

      if (ordersRes.ok) {
        const data = await ordersRes.json()
        if (Array.isArray(data)) setRestaurantOrders(data)
      }

      if (profileRes.ok) {
        const pData = await profileRes.json()
        setProfile(pData)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000) // Poll a cada 10s
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
        fetchData()
      } else {
        toast.error("Erro ao atualizar status.")
      }
    } catch (err) {
      toast.error("Erro na comunicação com o servidor.")
    }
  }

  const toggleRestaurantStatus = async () => {
    if (!profile) return;
    const newStatus = profile.status === 'open' ? 'closed' : 'open';
    const toastId = toast.loading('Atualizando status...')
    try {
      const res = await fetch(`/api/restaurant/my/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        toast.success(newStatus === 'open' ? 'Seu delivery agora está ABERTO! 🟢' : 'Delivery FECHADO temporariamente 🔴', { id: toastId });
        setProfile(prev => prev ? { ...prev, status: newStatus as any } : null);
      } else {
        toast.error('Erro ao mudar o status', { id: toastId })
      }
    } catch (e) {
      toast.error('Erro de conexão', { id: toastId })
    }
  }

  const copyToClipboard = () => {
    if (profile?.id) {
      const url = `${window.location.origin}/client/restaurants/${profile.id}`;
      navigator.clipboard.writeText(url);
      toast.success("Link copiado! Cole no WhatsApp ou Instagram.");
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

  const restaurantName = profile?.name || user?.name

  if (loading && restaurantOrders.length === 0 && !profile) {
    return <div className="min-h-screen bg-brand-cream flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
    </div>
  }

  const isOpen = profile?.status === 'open';

  return (
    <div className="min-h-screen bg-brand-cream pb-24">
      {/* Header */}
      <div className={cn("px-5 pt-5 pb-6 relative overflow-hidden transition-colors", isOpen ? "bg-brand-brown" : "bg-gray-800")}>
        <div className={cn("absolute -right-12 -top-12 w-48 h-48 rounded-full", isOpen ? "bg-brand-red/10" : "bg-gray-700/50")} />
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-base", isOpen ? "bg-brand-red" : "bg-gray-700")}>🍽️</div>
            <span className="font-display text-lg font-black text-brand-cream">Painel PMR</span>
          </div>
          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <div className="bg-brand-red text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-brand animate-pulse">
                <PulseDot color="bg-white" />
                {pendingCount} novo{pendingCount > 1 ? 's' : ''}
              </div>
            )}
            <button className="w-9 h-9 bg-brand-cream/10 rounded-xl flex items-center justify-center text-brand-cream/70">
              <Bell size={17} />
            </button>
            <button onClick={toggleRestaurantStatus} className={cn("ml-1 px-3 h-9 rounded-xl flex items-center justify-center gap-1 text-xs font-bold transition-all shadow-sm", isOpen ? "bg-red-500/20 text-red-100 hover:bg-red-500/30" : "bg-green-500 text-white hover:bg-green-600")} title={isOpen ? "Fechar Restaurante" : "Abrir Restaurante"}>
              <Power size={14} /> {isOpen ? 'Fechar' : 'Abrir'}
            </button>
          </div>
        </div>
        <div className="relative z-10">
          <p className="text-brand-cream/50 text-sm">Olá,</p>
          <h1 className="font-display text-2xl font-black text-brand-cream">{restaurantName} 👋</h1>
          <div className="flex items-center gap-1.5 mt-1">
            <PulseDot color={isOpen ? "bg-green-400" : "bg-gray-500"} />
            <span className={cn("text-xs font-medium", isOpen ? "text-green-400" : "text-gray-400")}>
              {isOpen ? 'Restaurante aberto e recebendo pedidos' : 'Restaurante fechado no momento'}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-5">

        {/* Share Link Card */}
        {profile && (
          <Card className="p-4 bg-brand-red text-white border-0 shadow-brand overflow-hidden relative">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg mb-0.5">Atraia clientes!</h3>
                <p className="text-white/80 text-xs">Divulgue o seu cardápio nas redes sociais.</p>
              </div>
              <Button variant="secondary" size="sm" onClick={copyToClipboard} className="bg-white text-brand-red hover:bg-white/90 shadow-sm flex gap-1.5 shrink-0">
                <Share2 size={14} /> Copiar Link
              </Button>
            </div>
          </Card>
        )}

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
