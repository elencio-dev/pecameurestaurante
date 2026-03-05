'use client'
import { useState } from 'react'
import { DynamicIcon } from "@/components/ui/icon";
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Minus, Trash2, CreditCard, Smartphone, Banknote, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCartStore, useOrdersStore, useAuthStore } from '@/store'
import { formatCurrency } from '@/lib/utils'
import { Button, EmptyState } from '@/components/ui'
import type { PaymentMethod } from '@/types'

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; icon: React.ReactNode }[] = [
  { value: 'pix', label: 'Pix (instantâneo)', icon: <Smartphone size={18} /> },
  { value: 'credit_card', label: 'Cartão de crédito', icon: <CreditCard size={18} /> },
  { value: 'debit_card', label: 'Cartão de débito', icon: <CreditCard size={18} /> },
  { value: 'cash', label: 'Dinheiro', icon: <Banknote size={18} /> },
]

export default function CartPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { cart, updateQuantity, removeItem, clearCart, subtotal, total } = useCartStore()
  const { placeOrder } = useOrdersStore()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix')
  const [placing, setPlacing] = useState(false)

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <header className="bg-white border-b border-brand-cream-dark px-4 py-4 flex items-center gap-3">
          <button onClick={() => router.back()}><ArrowLeft size={20} className="text-brand-brown" /></button>
          <h1 className="font-display text-xl font-bold text-brand-brown">Carrinho</h1>
        </header>
        <EmptyState
          emoji="🛒"
          title="Carrinho vazio"
          description="Adicione itens de um restaurante para continuar"
          action={<Button onClick={() => router.push('/client')}>Explorar restaurantes</Button>}
        />
      </div>
    )
  }

  const deliveryFee = cart.deliveryFee
  const platformFee = 1.00

  const handleCheckout = async () => {
    if (!user) return
    setPlacing(true)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, paymentMethod })
      })

      if (!res.ok) {
        throw new Error('Falha ao registrar pedido.');
      }

      const order = await res.json()

      clearCart()
      toast.success('Pedido realizado! 🎉')
      router.push(`/client/orders/${order.id}`)
    } catch (err) {
      toast.error('Erro ao fazer seu pedido. Tente novamente.')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <header className="bg-white border-b border-brand-cream-dark px-4 h-14 flex items-center gap-3 sticky top-0 z-40">
        <button onClick={() => router.back()}><ArrowLeft size={20} className="text-brand-brown" /></button>
        <h1 className="font-display text-xl font-bold text-brand-brown flex-1">Carrinho</h1>
        <button onClick={() => { clearCart(); toast('Carrinho limpo') }} className="text-xs text-brand-red font-semibold">
          Limpar
        </button>
      </header>

      <div className="px-4 py-5 space-y-4 pb-36">
        {/* Restaurant */}
        <div className="bg-white rounded-2xl p-4 border border-brand-cream-dark">
          <p className="text-xs text-brand-gray mb-1 uppercase tracking-wide font-bold">Restaurante</p>
          <p className="font-display font-bold text-brand-brown">{cart.restaurantName}</p>
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl border border-brand-cream-dark overflow-hidden">
          <div className="px-4 py-3 border-b border-brand-cream-dark">
            <p className="text-xs text-brand-gray uppercase tracking-wide font-bold">Itens</p>
          </div>
          <div className="divide-y divide-brand-cream-dark">
            {cart.items.map(({ menuItem: item, quantity }) => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                <div className="w-12 h-12 bg-brand-cream-dark rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  <DynamicIcon name={item.icon} size="md" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-brand-brown truncate">{item.name}</div>
                  <div className="text-xs text-brand-red font-bold mt-0.5">{formatCurrency(item.price * quantity)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, quantity - 1)}
                    className="w-7 h-7 rounded-lg border border-brand-cream-dark flex items-center justify-center hover:border-brand-red text-brand-brown"
                  >
                    {quantity === 1 ? <Trash2 size={12} className="text-red-500" /> : <Minus size={12} />}
                  </button>
                  <span className="w-5 text-center font-bold text-sm">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, quantity + 1)}
                    className="w-7 h-7 bg-brand-red rounded-lg flex items-center justify-center text-white"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery address */}
        <div className="bg-white rounded-2xl p-4 border border-brand-cream-dark flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-cream-dark rounded-xl flex items-center justify-center text-lg">📍</div>
          <div className="flex-1">
            <p className="text-xs text-brand-gray uppercase tracking-wide font-bold mb-0.5">Entregar em</p>
            <p className="text-sm font-medium text-brand-brown">Rua das Palmeiras, 42 — Pinheiros</p>
          </div>
          <ChevronRight size={16} className="text-brand-gray" />
        </div>

        {/* Payment */}
        <div className="bg-white rounded-2xl border border-brand-cream-dark overflow-hidden">
          <div className="px-4 py-3 border-b border-brand-cream-dark">
            <p className="text-xs text-brand-gray uppercase tracking-wide font-bold">Pagamento</p>
          </div>
          <div className="p-2 space-y-1">
            {PAYMENT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setPaymentMethod(opt.value)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${paymentMethod === opt.value
                    ? 'bg-brand-red/5 border border-brand-red text-brand-red'
                    : 'hover:bg-brand-cream-dark text-brand-brown border border-transparent'
                  }`}
              >
                {opt.icon}
                <span className="text-sm font-medium flex-1 text-left">{opt.label}</span>
                {paymentMethod === opt.value && <span className="text-xs font-bold">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-brand-cream-dark p-4 space-y-2.5">
          <p className="text-xs text-brand-gray uppercase tracking-wide font-bold mb-3">Resumo</p>
          <div className="flex justify-between text-sm text-brand-gray">
            <span>Subtotal</span><span className="text-brand-brown">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-brand-gray">
            <span>Taxa de entrega</span><span className="text-brand-brown">{formatCurrency(deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-sm items-center">
            <div className="flex items-center gap-1.5">
              <span className="text-brand-gray">Taxa da plataforma</span>
              <span className="text-[10px] bg-brand-cream-dark text-brand-brown px-1.5 py-0.5 rounded-full font-bold">R$1,00</span>
            </div>
            <span className="text-brand-brown">{formatCurrency(platformFee)}</span>
          </div>
          <div className="border-t border-brand-cream-dark pt-2.5 flex justify-between">
            <span className="font-bold text-brand-brown">Total</span>
            <span className="font-display text-xl font-black text-brand-red">{formatCurrency(total)}</span>
          </div>
        </div>

        <p className="text-xs text-brand-gray text-center">
          Taxa da plataforma de <strong className="text-brand-gold">R$1,00</strong> por pedido — modelo transparente
        </p>
      </div>

      {/* Sticky checkout */}
      <div className="fixed bottom-20 left-0 right-0 px-4 z-40">
        <Button
          onClick={handleCheckout}
          loading={placing}
          size="lg"
          className="w-full shadow-brand"
        >
          {placing ? 'Processando...' : `Confirmar pedido · ${formatCurrency(total)}`}
        </Button>
      </div>
    </div>
  )
}
