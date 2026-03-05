'use client'
import { useEffect, useState } from 'react'
import { DynamicIcon } from "@/components/ui/icon";
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Star, Phone, MapPin } from 'lucide-react'
import { formatCurrency, ORDER_STATUS_LABELS } from '@/lib/utils'
import { OrderStatusBadge } from '@/components/ui'
import type { OrderStatus, Order, OrderItem } from '@/types'

const STATUS_STEPS: OrderStatus[] = ['pending', 'accepted', 'preparing', 'ready', 'picked_up', 'on_the_way', 'delivered']

const STATUS_INFO: Record<OrderStatus, { icon: string; label: string; desc: string }> = {
  pending: { icon: '⏳', label: 'Aguardando confirmação', desc: 'O restaurante está verificando seu pedido' },
  accepted: { icon: '✅', label: 'Pedido aceito', desc: 'Ótimo! O restaurante confirmou seu pedido' },
  preparing: { icon: '👨‍🍳', label: 'Preparando', desc: 'Seu pedido está sendo preparado com carinho' },
  ready: { icon: '📦', label: 'Pronto', desc: 'Pedido pronto! Aguardando entregador' },
  picked_up: { icon: '🛵', label: 'Coletado', desc: 'O entregador pegou seu pedido' },
  on_the_way: { icon: '🚀', label: 'A caminho', desc: 'Seu pedido está a caminho!' },
  delivered: { icon: '🎉', label: 'Entregue!', desc: 'Aproveite sua refeição!' },
  cancelled: { icon: '❌', label: 'Cancelado', desc: 'Pedido cancelado' },
  refunded: { icon: '💰', label: 'Reembolsado', desc: 'Valor devolvido em até 3 dias úteis' },
}

export default function OrderTrackingPage() {
  const params = useParams()
  const router = useRouter()

  const [order, setOrder] = useState<(Order & { items: OrderItem[] }) | null>(null)
  const [loading, setLoading] = useState(true)

  // Polling para checar status a cada 5 segundos
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
    // Atualiza a cada 5 segundos caso o restaurante mude o status
    interval = setInterval(fetchOrder, 5000);

    return () => clearInterval(interval);
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center py-10">
        <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-brand-gray mt-4">Carregando pedido...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <p className="text-brand-gray">Pedido não encontrado</p>
          <button onClick={() => router.push('/client')} className="mt-4 text-brand-red font-semibold">Ir ao início</button>
        </div>
      </div>
    )
  }

  const statusIdx = STATUS_STEPS.indexOf(order.status)
  const info = STATUS_INFO[order.status]
  const isDelivered = order.status === 'delivered'

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <div className={`px-4 pt-5 pb-8 relative overflow-hidden ${isDelivered ? 'bg-green-700' : 'bg-brand-brown'}`}>
        <div className="absolute inset-0 opacity-10 text-[200px] flex items-center justify-center pointer-events-none">
          {info.icon}
        </div>
        <button onClick={() => router.push('/client/orders')} className="relative z-10 mb-5 w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center text-white">
          <ArrowLeft size={18} />
        </button>
        <div className="relative z-10 text-center">
          <div className="text-6xl mb-3">{info.icon}</div>
          <h1 className="font-display text-3xl font-black text-white mb-1">{info.label}</h1>
          <p className="text-white/70 text-sm">{info.desc}</p>
          <div className="mt-3">
            <span className="bg-white/20 text-white text-sm font-bold px-4 py-1.5 rounded-full">
              {order.orderNumber}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-4 pb-10">
        {/* Progress steps */}
        {order.status !== 'cancelled' && order.status !== 'refunded' && (
          <div className="bg-white rounded-2xl p-4 border border-brand-cream-dark">
            <p className="text-xs text-brand-gray uppercase tracking-wide font-bold mb-4">Acompanhamento</p>
            <div className="space-y-0">
              {STATUS_STEPS.slice(0, -1).map((step, idx) => {
                const stepInfo = STATUS_INFO[step]
                const isDone = idx < statusIdx
                const isActive = idx === statusIdx
                const isPending = idx > statusIdx
                return (
                  <div key={step} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${isDone ? 'bg-green-100 text-green-700' :
                          isActive ? 'bg-brand-red/10 text-brand-red' :
                            'bg-brand-cream-dark text-brand-gray/50'
                        }`}>
                        {isDone ? '✓' : stepInfo.icon}
                      </div>
                      {idx < STATUS_STEPS.length - 2 && (
                        <div className={`w-0.5 h-5 my-0.5 ${isDone ? 'bg-green-200' : 'bg-brand-cream-dark'}`} />
                      )}
                    </div>
                    <div className="pb-4">
                      <div className={`text-sm font-medium ${isActive ? 'text-brand-brown' : isDone ? 'text-brand-gray' : 'text-brand-gray/50'}`}>
                        {ORDER_STATUS_LABELS[step]}
                      </div>
                      {isActive && (
                        <div className="text-xs text-brand-red mt-0.5 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-brand-red rounded-full animate-ping" />
                          Em andamento...
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Restaurant info */}
        <div className="bg-white rounded-2xl border border-brand-cream-dark p-4 flex items-center gap-3">
          <div className="w-12 h-12 bg-brand-cream-dark rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
            🍽️
          </div>
          <div className="flex-1">
            <p className="font-semibold text-brand-brown">{order.restaurantName}</p>
            <p className="text-xs text-brand-gray mt-0.5">Tempo estimado: {order.estimatedDeliveryTime}min</p>
          </div>
          <button className="w-9 h-9 bg-brand-cream-dark rounded-xl flex items-center justify-center text-brand-brown hover:bg-brand-cream">
            <Phone size={15} />
          </button>
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl border border-brand-cream-dark overflow-hidden">
          <div className="px-4 py-3 border-b border-brand-cream-dark">
            <p className="text-xs text-brand-gray uppercase tracking-wide font-bold">Itens do pedido</p>
          </div>
          <div className="divide-y divide-brand-cream-dark">
            {order.items.map(item => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                <span className="text-2xl"><DynamicIcon name={item.icon} size="md" /></span>
                <div className="flex-1">
                  <span className="text-sm font-medium text-brand-brown">{item.menuItemName}</span>
                  <span className="text-xs text-brand-gray ml-2">×{item.quantity}</span>
                </div>
                <span className="text-sm font-bold text-brand-red">{formatCurrency(item.totalPrice)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-brand-cream-dark p-4 space-y-2">
          <div className="flex justify-between text-sm text-brand-gray">
            <span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-brand-gray">
            <span>Entrega</span><span>{formatCurrency(order.deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-sm text-brand-gray">
            <span>Taxa PMR</span><span>{formatCurrency(order.platformFee)}</span>
          </div>
          <div className="flex justify-between font-bold pt-2 border-t border-brand-cream-dark">
            <span className="text-brand-brown">Total</span>
            <span className="font-display text-lg text-brand-red">{formatCurrency(order.total)}</span>
          </div>
          <div className="text-xs text-center text-brand-gray pt-1">
            Pago via <strong className="capitalize">{order.paymentMethod}</strong>
          </div>
        </div>

        {/* Rating (if delivered) */}
        {isDelivered && !order.customerRating && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
            <div className="text-3xl mb-2">⭐</div>
            <p className="font-semibold text-brand-brown mb-3">Como foi a experiência?</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} className="w-10 h-10 text-2xl hover:scale-110 transition-transform">
                  {n <= 3 ? '☆' : '⭐'}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => router.push('/client')}
          className="w-full bg-brand-red text-white font-bold py-4 rounded-2xl hover:bg-brand-red-dark transition-all shadow-brand"
        >
          Fazer novo pedido
        </button>
      </div>
    </div>
  )
}
