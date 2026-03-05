'use client'
import { useRouter } from 'next/navigation'
import { LogOut, Package, MapPin, CreditCard, Gift, Settings, HelpCircle, ChevronRight } from 'lucide-react'
import { useAuthStore, useOrdersStore } from '@/store'
import { AppHeader } from '@/components/layout/navigation'
import toast from 'react-hot-toast'

export default function ClientProfilePage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { getCustomerOrders } = useOrdersStore()
  const orders = user ? getCustomerOrders(user.id) : []

  const handleLogout = () => {
    logout()
    toast('Até logo! 👋')
    router.push('/')
  }

  const menuItems = [
    { icon: <Package size={18} />, label: 'Meus pedidos', count: orders.length, onClick: () => router.push('/client/orders') },
    { icon: <MapPin size={18} />, label: 'Meus endereços', onClick: () => toast('Em breve! 🚧') },
    { icon: <CreditCard size={18} />, label: 'Pagamentos', tag: 'Novo', onClick: () => toast('Em breve! 🚧') },
    { icon: <Gift size={18} />, label: 'Cupons e promoções', onClick: () => toast('Em breve! 🚧') },
    { icon: <Settings size={18} />, label: 'Configurações', onClick: () => toast('Em breve! 🚧') },
    { icon: <HelpCircle size={18} />, label: 'Ajuda e suporte', onClick: () => toast('Em breve! 🚧') },
  ]

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Profile header */}
      <div className="bg-brand-brown px-5 pt-5 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-brand-red rounded-2xl flex items-center justify-center text-3xl border-2 border-brand-red/30">
            👤
          </div>
          <div>
            <h1 className="font-display text-2xl font-black text-brand-cream">{user?.name}</h1>
            <p className="text-brand-cream/50 text-sm">{user?.email}</p>
            <p className="text-brand-cream/30 text-xs mt-0.5">{orders.length} pedidos realizados</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 pb-28 space-y-2">
        {menuItems.map((item, i) => (
          <button
            key={i}
            onClick={item.onClick}
            className="w-full bg-white rounded-2xl p-4 flex items-center gap-3 hover:shadow-card hover:-translate-y-0.5 transition-all border border-transparent hover:border-brand-cream-dark text-left"
          >
            <div className="w-10 h-10 bg-brand-cream-dark rounded-xl flex items-center justify-center text-brand-brown">{item.icon}</div>
            <span className="flex-1 font-medium text-brand-brown">{item.label}</span>
            {item.count != null && item.count > 0 && (
              <span className="bg-brand-red text-white text-xs font-bold px-2 py-0.5 rounded-full">{item.count}</span>
            )}
            {item.tag && (
              <span className="bg-brand-red text-white text-xs font-bold px-2 py-0.5 rounded-full">{item.tag}</span>
            )}
            <ChevronRight size={16} className="text-brand-gray" />
          </button>
        ))}

        <button
          onClick={handleLogout}
          className="w-full bg-white rounded-2xl p-4 flex items-center gap-3 hover:shadow-card transition-all border border-red-100 text-left mt-4"
        >
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500"><LogOut size={18} /></div>
          <span className="font-medium text-red-600">Sair da conta</span>
        </button>

        {/* Branding */}
        <div className="text-center pt-4 pb-2">
          <p className="font-display text-lg font-black text-brand-brown">
            Peça<em className="text-brand-red not-italic">Meu</em>Restaurante
          </p>
          <p className="text-xs text-brand-gray mt-1">Versão 1.0.0 · Taxa transparente: R$1,00/pedido</p>
          <p className="text-xs text-brand-gold mt-1">♥ Feito para conectar pessoas e restaurantes</p>
        </div>
      </div>
    </div>
  )
}
