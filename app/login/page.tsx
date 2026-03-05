'use client'
import { useState } from 'react'
import { DynamicIcon } from "@/components/ui/icon";
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store'
import type { User, UserRole } from '@/types'

const DEMO_USERS: { label: string; icon: string; user: User }[] = [
  {
    label: 'Cliente', icon: 'ShoppingBag',
    user: { id: 'u1', name: 'Ana Beatriz', email: 'ana@email.com', phone: '11999991111', role: 'customer', createdAt: '2024-01-10', isActive: true },
  },
  {
    label: 'Restaurante', icon: 'Utensils',
    user: { id: 'u2', name: 'Carlos Mendes', email: 'carlos@pizzaroma.com', phone: '11999992222', role: 'restaurant_owner', createdAt: '2024-01-05', isActive: true },
  },
  {
    label: 'Entregador', icon: 'Bike',
    user: { id: 'u3', name: 'Diego Lima', email: 'diego@email.com', phone: '11999993333', role: 'driver', createdAt: '2024-01-08', isActive: true },
  },
  {
    label: 'Admin', icon: 'Settings',
    user: { id: 'u0', name: 'Admin PMR', email: 'admin@pmr.com.br', phone: '11999990000', role: 'admin', createdAt: '2024-01-01', isActive: true },
  },
]

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore(s => s.login)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDemoLogin = (user: User) => {
    setLoading(true)
    setTimeout(() => {
      login(user)
      toast.success(`Bem-vindo(a), ${user.name.split(' ')[0]}! 👋`)
      const routes: Record<UserRole, string> = {
        customer: '/client',
        restaurant_owner: '/restaurant',
        driver: '/driver',
        admin: '/admin',
      }
      router.push(routes[user.role])
      setLoading(false)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col">
      <header className="px-6 py-5">
        <Link href="/" className="inline-flex items-center gap-2 text-brand-gray hover:text-brand-brown transition-colors text-sm">
          <ArrowLeft size={16} /> Voltar
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center text-xl">🍽️</div>
              <span className="font-display text-2xl font-black text-brand-brown">
                Peça<em className="text-brand-red not-italic">Meu</em>
              </span>
            </div>
            <h1 className="font-display text-3xl font-black text-brand-brown">Entrar na conta</h1>
            <p className="text-brand-gray text-sm mt-1">Não tem conta? <Link href="/register" className="text-brand-red font-semibold hover:underline">Cadastre-se</Link></p>
          </div>

          {/* Demo login cards */}
          <div className="bg-brand-brown/5 rounded-2xl p-4 mb-6">
            <p className="text-xs font-bold text-brand-gray uppercase tracking-wider mb-3">Acesso rápido (demo)</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_USERS.map((d) => (
                <button
                  key={d.user.role}
                  onClick={() => handleDemoLogin(d.user)}
                  disabled={loading}
                  className="bg-white rounded-xl p-3 text-left hover:border-brand-red border-2 border-transparent transition-all hover:shadow-card disabled:opacity-50"
                >
                  <div className="text-2xl mb-1"><DynamicIcon name={d.icon} size="lg" /></div>
                  <div className="font-semibold text-sm text-brand-brown">{d.label}</div>
                  <div className="text-xs text-brand-gray truncate">{d.user.email}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-gray uppercase tracking-wide mb-1.5">E-mail</label>
              <input
                type="email"
                placeholder="seu@email.com"
                className="w-full bg-white border-2 border-brand-cream-dark rounded-xl px-4 py-3 text-brand-brown placeholder-brand-gray/50 focus:outline-none focus:border-brand-red transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-gray uppercase tracking-wide mb-1.5">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-white border-2 border-brand-cream-dark rounded-xl px-4 py-3 pr-10 text-brand-brown placeholder-brand-gray/50 focus:outline-none focus:border-brand-red transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-brown"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              onClick={() => toast('Use um dos acessos demo acima! 👆')}
              className="w-full bg-brand-red text-white font-bold py-4 rounded-2xl hover:bg-brand-red-dark transition-all shadow-brand hover:-translate-y-0.5"
            >
              Entrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
