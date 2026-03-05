'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { useAuthStore, useOrdersStore } from '@/store'
import { MOCK_RESTAURANTS, MOCK_REVENUE_MONTHLY } from '@/lib/data'
import { formatCurrency, ORDER_STATUS_LABELS } from '@/lib/utils'
import { Card, StatCard, OrderStatusBadge, Badge, PulseDot } from '@/components/ui'

export default function AdminDashboard() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const router = useRouter()
  const { orders } = useOrdersStore()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') router.push('/login')
  }, [isAuthenticated, user])

  if (!isAuthenticated || user?.role !== 'admin') return null

  const totalRevenue = orders.filter(o => o.status === 'delivered').length * 1.00
  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status))
  const deliveredOrders = orders.filter(o => o.status === 'delivered')

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <div className="bg-brand-brown px-5 pt-5 pb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center text-base">🍽️</div>
            <span className="font-display text-xl font-black text-brand-cream">PMR Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <PulseDot color="bg-green-400" />
              <span className="text-green-400 text-xs">Live</span>
            </div>
            <button
              onClick={() => { logout(); router.push('/') }}
              className="text-brand-cream/50 text-xs hover:text-brand-cream/80"
            >
              Sair
            </button>
          </div>
        </div>
        <h1 className="font-display text-2xl font-black text-brand-cream">Painel de Controle</h1>
        <p className="text-brand-cream/50 text-sm mt-0.5">Visão geral da plataforma</p>
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* Platform KPIs */}
        <div>
          <p className="text-xs text-brand-gray font-bold uppercase tracking-wider mb-2 px-1">Métricas da Plataforma</p>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Receita total (taxa)" value={totalRevenue} accent sub={`${deliveredOrders.length} × R$1,00`} />
            <StatCard label="Pedidos hoje" value={`${orders.length}`} sub="↑ crescimento" />
            <StatCard label="Restaurantes" value={`${MOCK_RESTAURANTS.length}`} sub="4 ativos" />
            <StatCard label="Ticket médio" value={orders.reduce((s, o) => s + o.total, 0) / Math.max(orders.length, 1)} />
          </div>
        </div>

        {/* Revenue chart */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-brand-brown">Receita da plataforma</h2>
            <Badge variant="success">R$1,00/pedido</Badge>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={MOCK_REVENUE_MONTHLY}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#8A7A70' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                formatter={(v: number) => [`R$${v}`, 'Receita PMR']}
                contentStyle={{ background: '#2C1A0E', border: 'none', borderRadius: 8, color: '#FFF8F0', fontSize: 12 }}
              />
              <Bar dataKey="revenue" fill="#E8340A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-center text-brand-gray mt-2">Cada barra = R$1,00 × número de pedidos do mês</p>
        </Card>

        {/* Business model explanation */}
        <Card className="p-4">
          <h3 className="font-display font-bold text-brand-brown mb-3">Modelo de negócio</h3>
          <div className="space-y-2">
            {[
              { label: 'Fonte principal', value: 'R$1,00 por pedido', color: 'text-brand-red' },
              { label: 'Plano Destaque (opt.)', value: 'R$99/mês por restaurante', color: 'text-brand-gold' },
              { label: 'Break-even', value: '~500 pedidos/mês', color: 'text-green-600' },
              { label: 'Meta 6 meses', value: '10.000 pedidos/dia', color: 'text-blue-600' },
            ].map(item => (
              <div key={item.label} className="flex justify-between text-sm">
                <span className="text-brand-gray">{item.label}</span>
                <span className={`font-semibold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Active orders */}
        <div>
          <p className="text-xs text-brand-gray font-bold uppercase tracking-wider mb-2 px-1">
            Pedidos em tempo real ({activeOrders.length})
          </p>
          <div className="space-y-2">
            {activeOrders.map(order => (
              <Card key={order.id} className="p-3 flex items-center gap-3">
                {order.status === 'pending' && <PulseDot />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-brand-brown truncate">{order.restaurantName}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <span className="text-xs text-brand-gray">{order.orderNumber} · {order.customerName}</span>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-display font-bold text-brand-red">{formatCurrency(order.total)}</div>
                  <div className="text-xs text-brand-gray">+R$1 taxa</div>
                </div>
              </Card>
            ))}
            {activeOrders.length === 0 && (
              <div className="text-center py-8 text-brand-gray">
                <div className="text-4xl mb-2">✅</div>
                <p>Sem pedidos ativos agora</p>
              </div>
            )}
          </div>
        </div>

        {/* Restaurants overview */}
        <div>
          <p className="text-xs text-brand-gray font-bold uppercase tracking-wider mb-2 px-1">Restaurantes cadastrados</p>
          <div className="space-y-2">
            {MOCK_RESTAURANTS.map(r => (
              <Card key={r.id} className="p-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-cream-dark rounded-xl flex items-center justify-center text-2xl flex-shrink-0">{r.logo}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-brand-brown truncate">{r.name}</div>
                  <div className="text-xs text-brand-gray">{r.category} · ⭐{r.rating} · {r.totalOrders} pedidos</div>
                </div>
                <Badge variant={r.status === 'open' ? 'success' : 'default'}>
                  {r.status === 'open' ? 'Aberto' : 'Fechado'}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
