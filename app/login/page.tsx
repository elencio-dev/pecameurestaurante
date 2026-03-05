'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store'
import type { UserRole } from '@/types'

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore(s => s.login)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Preencha os campos de e-mail e senha.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erro ao realizar login');
      }

      // Atualiza o Zustand com os dados vindo do Prisma
      login(data.user);
      toast.success(`Bem-vindo(a), ${data.user.name.split(' ')[0]}! 👋`);

      const routes: Record<UserRole, string> = {
        customer: '/client',
        restaurant_owner: '/restaurant',
        driver: '/driver',
        admin: '/admin',
      };

      router.push(routes[data.user.role as UserRole]);
    } catch (err: any) {
      toast.error(err.message || "Falha ao entrar na conta.");
    } finally {
      setLoading(false);
    }
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

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-gray uppercase tracking-wide mb-1.5">E-mail</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white border-2 border-brand-cream-dark rounded-xl px-4 py-3 text-brand-brown placeholder-brand-gray/50 focus:outline-none focus:border-brand-red transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-gray uppercase tracking-wide mb-1.5">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
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
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-brand-red text-white font-bold py-4 rounded-2xl hover:bg-brand-red-dark transition-all shadow-brand hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:-translate-y-0"
            >
              {loading ? 'Acessando...' : 'Entrar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
