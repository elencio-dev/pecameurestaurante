'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store'
import { useRouter } from 'next/navigation'
import { MOCK_RESTAURANTS } from '@/lib/data'
import { AppHeader } from '@/components/layout/navigation'
import { Card, Button } from '@/components/ui'
import { LogOut, ChevronRight, Clock, MapPin, CreditCard, Bell, User, Building } from 'lucide-react'

const RESTAURANT_ID = 'r1'

export default function RestaurantSettingsPage() {
  const { logout } = useAuthStore()
  const router = useRouter()
  const restaurant = MOCK_RESTAURANTS.find(r => r.id === RESTAURANT_ID)!
  const [isOpen, setIsOpen] = useState(restaurant.status === 'open')

  const sections = [
    {
      title: 'Operação',
      items: [
        { icon: <Clock size={17} />, label: 'Horários de funcionamento', onClick: () => toast('Em breve! 🚧') },
        { icon: <MapPin size={17} />, label: 'Área de entrega', onClick: () => toast('Em breve! 🚧') },
      ]
    },
    {
      title: 'Financeiro',
      items: [
        { icon: <CreditCard size={17} />, label: 'Dados bancários / Pix', onClick: () => toast('Em breve! 🚧') },
        { icon: <Building size={17} />, label: 'Dados fiscais (CNPJ)', onClick: () => toast('Em breve! 🚧') },
      ]
    },
    {
      title: 'Conta',
      items: [
        { icon: <User size={17} />, label: 'Dados do estabelecimento', onClick: () => toast('Em breve! 🚧') },
        { icon: <Bell size={17} />, label: 'Notificações', onClick: () => toast('Em breve! 🚧') },
      ]
    },
  ]

  return (
    <div className="min-h-screen bg-brand-cream">
      <AppHeader title={<span className="font-display text-xl font-black text-brand-brown">Configurações</span>} />

      <div className="px-4 py-5 pb-24 space-y-5">
        {/* Restaurant status toggle */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-brand-brown">Status do restaurante</p>
              <p className={`text-sm mt-0.5 ${isOpen ? 'text-green-600' : 'text-brand-gray'}`}>
                {isOpen ? '● Aberto para pedidos' : '○ Fechado'}
              </p>
            </div>
            <button
              onClick={() => {
                setIsOpen(!isOpen)
                toast(isOpen ? 'Restaurante fechado 🔒' : 'Restaurante aberto! 🟢')
              }}
              className={`relative w-14 h-7 rounded-full transition-colors ${isOpen ? 'bg-green-500' : 'bg-brand-gray/30'}`}
            >
              <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${isOpen ? 'left-7' : 'left-0.5'}`} />
            </button>
          </div>
        </Card>

        {/* Restaurant info */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-brand-cream-dark rounded-2xl flex items-center justify-center text-4xl">
              {restaurant.logo}
            </div>
            <div>
              <p className="font-display font-bold text-xl text-brand-brown">{restaurant.name}</p>
              <p className="text-sm text-brand-gray">{restaurant.category}</p>
              <p className="text-xs text-brand-gray mt-0.5">⭐ {restaurant.rating} · {restaurant.totalOrders} pedidos</p>
            </div>
          </div>
        </Card>

        {/* Menu sections */}
        {sections.map(section => (
          <div key={section.title}>
            <p className="text-xs text-brand-gray font-bold uppercase tracking-wider mb-2 px-1">{section.title}</p>
            <Card className="overflow-hidden">
              {section.items.map((item, i) => (
                <button
                  key={i}
                  onClick={item.onClick}
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-brand-cream-dark/40 transition-colors border-b border-brand-cream-dark last:border-0 text-left"
                >
                  <div className="w-8 h-8 bg-brand-cream-dark rounded-lg flex items-center justify-center text-brand-brown">
                    {item.icon}
                  </div>
                  <span className="flex-1 text-sm font-medium text-brand-brown">{item.label}</span>
                  <ChevronRight size={14} className="text-brand-gray" />
                </button>
              ))}
            </Card>
          </div>
        ))}

        {/* Platform info */}
        <Card className="p-4 bg-brand-gold/10 border-brand-gold/20">
          <p className="font-semibold text-brand-brown text-sm mb-2">Seu plano · PeçaMeuRestaurante</p>
          <div className="space-y-1 text-xs text-brand-gray">
            <div className="flex justify-between"><span>Taxa por pedido</span><span className="font-bold text-brand-gold">R$1,00</span></div>
            <div className="flex justify-between"><span>Comissão sobre vendas</span><span className="font-bold text-green-600">0%</span></div>
            <div className="flex justify-between"><span>Taxa mensal</span><span className="font-bold text-green-600">Gratuito</span></div>
          </div>
        </Card>

        {/* Logout */}
        <Button
          variant="danger"
          className="w-full"
          onClick={() => { logout(); router.push('/') }}
        >
          <LogOut size={16} /> Sair da conta
        </Button>
      </div>
    </div>
  )
}
