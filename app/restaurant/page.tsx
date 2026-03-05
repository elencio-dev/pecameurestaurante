'use client'
import { useState } from 'react'
import { DynamicIcon } from "@/components/ui/icon";
import { TrendingUp, Package, Star, Clock, DollarSign, Bell } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import toast from 'react-hot-toast'
import { useAuthStore, useOrdersStore } from '@/store'
import { MOCK_RESTAURANTS, MOCK_REVENUE_MONTHLY } from '@/lib/data'
import { formatCurrency, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils'
import { Card, StatCard, OrderStatusBadge, PulseDot, Button } from '@/components/ui'
import type { OrderStatus } from '@/types'
import { cn } from '@/lib/utils'

const RESTAURANT_ID = 'r1'

const STATUS_ACTIONS: Partial<Record<OrderStatus, { label: string; next: OrderStatus }>> = {
  pending:  { label: 'Aceitar pedido', next: 'accepted' },
  accepted: { label: 'Iniciar preparo', next: 'preparing' },
  preparing:{ label: 'Marcar como pronto', next: 'ready' },
  ready:    { label: 'Entregador coletou', next: 'picked_up' },
}

export default function RestaurantDashboard() {
  const { user } = useAuthStore()
  const { orders, updateOrderStatus, getRestaurantOrders } = useOrdersStore()
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active')

  const restaurantOrders = getRestaurantOrders(RESTAURANT_ID)
  const restaurant = MOCK_RESTAURANTS.find(r => r.id === RESTAURANT_ID)!

  const activeOrders = restaurantOrders.filter(o =>
    !['delivered', 'cancelled', 'refunded'].includes(o.status)
  )
  const historyOrders = restaurantOrders.filter(o =>
    ['delivered', 'cancelled'].includes(o.status)
  )

  const todayRevenue = restaurantOrders
    .filter(o => o.status === 'delivered')
    .reduce((s, o) => s + o.subtotal, 0)

  const todayOrders = restaurantOrders.filter(o => o.status === 'delivered').length
  const todayPlatformFees = todayOrders * 1.00
  const pendingCount = activeOrders.filter(o => o.status === 'pending').length

  return (
    <div className="min-h-screen bg-brand-cream">
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
              <div className="bg-brand-red text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
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
          <h1 className="font-display text-2xl font-black text-brand-cream">{restaurant.name} 👋</h1>
          <div className="flex items-center gap-1.5 mt-1">
            <PulseDot color="bg-green-400" />
            <span className="text-green-400 text-xs font-medium">Restaurante aberto</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Faturamento hoje"
            value={todayRevenue}
            sub="↑ +23% vs ontem"
            accent
          />
          <StatCard label="Pedidos hoje" value={`${todayOrders}`} sub="↑ +4 novos" />
          <StatCard label="Avaliação" value={`${restaurant.rating}★`} />
          <StatCard label="Taxa plataforma" value={`R$${todayPlatformFees.toFixed(0)}`} sub={`${todayOrders} × R$1,00`} />
        </div>

        {/* Revenue chart */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-brand-brown">Receita mensal</h2>
            <span className="text-xs text-brand-gray">Últimos 6 meses</span>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={MOCK_REVENUE_MONTHLY}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E8340A" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#E8340A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#8A7A70' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                formatter={(v: number) => [`R$${v}`, 'Taxa PMR']}
                contentStyle={{ background: '#2C1A0E', border: 'none', borderRadius: 8, color: '#FFF8F0', fontSize: 12 }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#E8340A" strokeWidth={2} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

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
                <Card key={order.id} className="p-4">
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

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {order.items.map(item => (
                      <span key={item.id} className="text-xs bg-brand-cream-dark text-brand-brown px-2.5 py-1 rounded-full">
                        <DynamicIcon name={item.icon} size="md" /> {item.quantity}× {item.menuItemName}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-display text-lg font-bold text-brand-red">{formatCurrency(order.subtotal)}</span>
                    {action && (
                      <Button
                        size="sm"
                        onClick={() => {
                          updateOrderStatus(order.id, action.next)
                          toast.success(`Pedido atualizado: ${ORDER_STATUS_LABELS[action.next]}`)
                        }}
                      >
                        {action.label}
                      </Button>
                    )}
                  </div>

                  {/* Platform fee transparency */}
                  <div className="mt-2 pt-2 border-t border-brand-cream-dark flex items-center justify-between text-xs text-brand-gray">
                    <span>Taxa plataforma</span>
                    <span className="font-semibold text-brand-brown">{formatCurrency(order.platformFee)}</span>
                  </div>
                </Card>
              )
            })}

            {((activeTab === 'active' && activeOrders.length === 0) ||
              (activeTab === 'history' && historyOrders.length === 0)) && (
              <div className="text-center py-12 text-brand-gray">
                <div className="text-4xl mb-3">{activeTab === 'active' ? '✅' : '📋'}</div>
                <p>{activeTab === 'active' ? 'Nenhum pedido ativo' : 'Histórico vazio'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Business model transparency */}
        <Card className="p-4 bg-brand-cream-dark border-brand-gold/20">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💰</div>
            <div>
              <p className="font-semibold text-brand-brown text-sm mb-1">Modelo PeçaMeuRestaurante</p>
              <p className="text-xs text-brand-gray leading-relaxed">
                Você paga apenas <strong className="text-brand-gold">R$1,00 por pedido processado</strong>.
                Sem comissões sobre o valor do pedido. Sem taxas mensais obrigatórias.
                O restaurante fica com tudo o mais.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
