'use client'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store'
import { AppHeader } from '@/components/layout/navigation'
import { Button } from '@/components/ui'
import toast from 'react-hot-toast'

export default function DriverProfilePage() {
  const { user, logout } = useAuthStore()
  const router = useRouter()
  return (
    <div className="min-h-screen bg-brand-cream">
      <AppHeader title={<span className="font-display text-xl font-black text-brand-brown">Perfil</span>} />
      <div className="px-4 py-5 pb-24">
        <div className="bg-brand-brown rounded-2xl p-5 mb-5 flex items-center gap-4">
          <div className="w-16 h-16 bg-brand-red rounded-2xl flex items-center justify-center text-3xl">🛵</div>
          <div>
            <p className="font-display text-xl font-black text-brand-cream">{user?.name}</p>
            <p className="text-brand-cream/60 text-sm">{user?.email}</p>
          </div>
        </div>
        <div className="space-y-2">
          {['Dados do veículo', 'Documentos', 'Banco e Pix', 'Suporte'].map(item => (
            <button key={item} onClick={() => toast('Em breve! 🚧')}
              className="w-full bg-white rounded-xl p-4 text-left font-medium text-brand-brown flex items-center justify-between border border-brand-cream-dark">
              {item}<span className="text-brand-gray">›</span>
            </button>
          ))}
          <Button variant="danger" className="w-full mt-4" onClick={() => { logout(); router.push('/') }}>Sair</Button>
        </div>
      </div>
    </div>
  )
}
