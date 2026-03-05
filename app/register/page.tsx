'use client'
import { useState } from 'react'
import { DynamicIcon } from "@/components/ui/icon";
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store'
import type { UserRole } from '@/types'
import { cn } from '@/lib/utils'

const ROLES = [
  { value: 'customer' as UserRole, label: 'Cliente', icon: 'ShoppingBag', desc: 'Quero pedir comida' },
  { value: 'restaurant_owner' as UserRole, label: 'Restaurante', icon: 'Utensils', desc: 'Quero receber pedidos' },
  { value: 'driver' as UserRole, label: 'Entregador', icon: 'Bike', desc: 'Quero fazer entregas' },
]

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const login = useAuthStore(s => s.login)

  const defaultRole = searchParams.get('role') === 'restaurant' ? 'restaurant_owner' : 'customer'
  const [role, setRole] = useState<UserRole>(defaultRole)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    if (!form.name || !form.email) { toast.error('Preencha nome e e-mail'); return }
    setLoading(true)
    setTimeout(() => {
      const user = {
        id: `u${Date.now()}`,
        name: form.name,
        email: form.email,
        phone: form.phone || '11999990000',
        role,
        createdAt: new Date().toISOString(),
        isActive: true,
      }
      login(user)
      toast.success('Conta criada! Bem-vindo(a) 🎉')
      const routes: Record<UserRole, string> = {
        customer: '/client',
        restaurant_owner: '/restaurant',
        driver: '/driver',
        admin: '/admin',
      }
      router.push(routes[role])
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col">
      <header className="px-6 py-5 flex items-center justify-between">
        <button onClick={() => step > 1 ? setStep(1) : router.back()} className="inline-flex items-center gap-2 text-brand-gray hover:text-brand-brown transition-colors text-sm">
          <ArrowLeft size={16} /> Voltar
        </button>
        <span className="text-xs text-brand-gray">Passo {step} de 2</span>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center text-xl">🍽️</div>
            </div>
            {step === 1 ? (
              <>
                <h1 className="font-display text-3xl font-black text-brand-brown">Como vai usar?</h1>
                <p className="text-brand-gray text-sm mt-1">Já tem conta? <Link href="/login" className="text-brand-red font-semibold hover:underline">Entrar</Link></p>
              </>
            ) : (
              <>
                <h1 className="font-display text-3xl font-black text-brand-brown">Seus dados</h1>
                <p className="text-brand-gray text-sm mt-1">Seguro e privado</p>
              </>
            )}
          </div>

          {step === 1 && (
            <div className="space-y-3 mb-6">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  className={cn(
                    'w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left',
                    role === r.value
                      ? 'border-brand-red bg-brand-red/5'
                      : 'border-brand-cream-dark bg-white hover:border-brand-red/40'
                  )}
                >
                  <span className="text-3xl"><DynamicIcon name={r.icon} size="xl" /></span>
                  <div className="flex-1">
                    <div className="font-semibold text-brand-brown">{r.label}</div>
                    <div className="text-sm text-brand-gray">{r.desc}</div>
                  </div>
                  {role === r.value && (
                    <div className="w-6 h-6 bg-brand-red rounded-full flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 mb-6">
              {[
                { key: 'name', label: 'Nome completo', placeholder: 'João da Silva', type: 'text' },
                { key: 'email', label: 'E-mail', placeholder: 'joao@email.com', type: 'email' },
                { key: 'phone', label: 'Telefone (WhatsApp)', placeholder: '(11) 99999-9999', type: 'tel' },
                { key: 'city', label: 'Cidade', placeholder: 'São Paulo, SP', type: 'text' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-bold text-brand-gray uppercase tracking-wide mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.key as keyof typeof form]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full bg-white border-2 border-brand-cream-dark rounded-xl px-4 py-3 text-brand-brown placeholder-brand-gray/50 focus:outline-none focus:border-brand-red transition-colors text-sm"
                  />
                </div>
              ))}
            </div>
          )}

          <button
            onClick={step === 1 ? () => setStep(2) : handleSubmit}
            disabled={loading}
            className="w-full bg-brand-red text-white font-bold py-4 rounded-2xl hover:bg-brand-red-dark transition-all shadow-brand hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? 'Criando conta...' : step === 1 ? (<>Continuar <ArrowRight size={18} /></>) : 'Criar conta 🎉'}
          </button>
        </div>
      </div>
    </div>
  )
}
