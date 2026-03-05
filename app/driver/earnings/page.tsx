'use client'
import { useOrdersStore } from '@/store'
import { formatCurrency } from '@/lib/utils'
import { AppHeader } from '@/components/layout/navigation'
import { Card, StatCard } from '@/components/ui'

export default function DriverEarningsPage() {
  const { orders } = useOrdersStore()
  const myDelivered = orders.filter(o => o.driverId === 'u3' && o.status === 'delivered')
  const total = myDelivered.reduce((s, o) => s + o.deliveryFee, 0)

  return (
    <div className="min-h-screen bg-brand-cream">
      <AppHeader title={<span className="font-display text-xl font-black text-brand-brown">Meus Ganhos</span>} />
      <div className="px-4 py-5 pb-24 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Hoje" value={total} accent />
          <StatCard label="Esta semana" value={total * 4.2} />
          <StatCard label="Entregas totais" value={`${myDelivered.length}`} />
          <StatCard label="Média/entrega" value={myDelivered.length > 0 ? total / myDelivered.length : 0} />
        </div>

        <Card className="p-4 bg-brand-cream-dark border-brand-gold/20">
          <p className="font-semibold text-brand-brown mb-2">💰 Próximo pagamento</p>
          <p className="text-3xl font-display font-black text-brand-gold">{formatCurrency(total * 4.2)}</p>
          <p className="text-xs text-brand-gray mt-1">Pagamento toda segunda-feira via Pix</p>
        </Card>
      </div>
    </div>
  )
}
