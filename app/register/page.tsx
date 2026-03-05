'use client'

import { useState, Suspense } from 'react'
import { DynamicIcon } from "@/components/ui/icon";
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store'
import type { UserRole } from '@/types'
import { cn } from '@/lib/utils'

const ROLES = [
  { value: 'customer' as UserRole, label: 'Cliente', icon: 'ShoppingBag', desc: 'Quero pedir comida' },
  { value: 'restaurant_owner' as UserRole, label: 'Restaurante', icon: 'Utensils', desc: 'Quero receber pedidos' },
  { value: 'driver' as UserRole, label: 'Entregador', icon: 'Bike', desc: 'Quero fazer entregas' },
];

const CATEGORIES = ['Brasileiro', 'Pizza', 'Hambúrguer', 'Japonês', 'Italiano', 'Árabe', 'Saudável', 'Doces'];

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const login = useAuthStore(s => s.login)

  const defaultRole = searchParams.get('role') === 'restaurant' ? 'restaurant_owner' : 'customer'
  const [role, setRole] = useState<UserRole>(defaultRole)
  const [step, setStep] = useState(1)

  // User Data
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })

  // Restaurant Data
  const [restaurantForm, setRestaurantForm] = useState({
    restaurantName: '', cnpj: '', category: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zipCode: '', lat: undefined as number | undefined, lng: undefined as number | undefined
  })

  const [loading, setLoading] = useState(false)
  const [gettingLocation, setGettingLocation] = useState(false)

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Seu navegador não suporta geolocalização.');
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setRestaurantForm(prev => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }));
        setGettingLocation(false);
        toast.success("Localização capturada!");
      },
      (error) => {
        console.error("Erro ao pegar GPS", error);
        toast.error('Permissão negada ou erro ao pegar localização.');
        setGettingLocation(false);
      }
    );
  }

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!form.name || !form.email || !form.password) {
        toast.error('Preencha os dados obrigatórios');
        return;
      }
      if (role === 'restaurant_owner') {
        setStep(3); // Vai para o passo de restaurante
      } else {
        handleSubmit(); // Se for cliente/entregador, finaliza e envia
      }
    }
  }

  const handleSubmit = async () => {
    // Validar form do restaurante (se aplicável)
    if (role === 'restaurant_owner') {
      if (!restaurantForm.restaurantName || !restaurantForm.cnpj) {
        toast.error('Preencha o nome do restaurante e CNPJ.');
        return;
      }

      if (!restaurantForm.street && !restaurantForm.lat) {
        toast.error('Informe o Nome da Rua ou use o botão para Pegar GPS.');
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        role,
        restaurantData: role === 'restaurant_owner' ? restaurantForm : undefined
      };

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erro ao criar conta');
      }

      // Sucesso na criação! Atualiza o Zustand (simulação de sessão).
      const mockSessionUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: form.phone || '11999990000',
        role: data.user.role,
        createdAt: new Date().toISOString(),
        isActive: true,
      };
      login(mockSessionUser);

      toast.success('Conta criada! Bem-vindo(a) 🎉')
      const routes: Record<UserRole, string> = {
        customer: '/client',
        restaurant_owner: '/restaurant',
        driver: '/driver',
        admin: '/admin',
      }
      router.push(routes[role])

    } catch (err: any) {
      toast.error(err.message || "Falha ao registrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const totalSteps = role === 'restaurant_owner' ? 3 : 2;

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
    else router.back()
  };

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col">
      <header className="px-6 py-5 flex items-center justify-between">
        <button onClick={handleBack} className="inline-flex items-center gap-2 text-brand-gray hover:text-brand-brown transition-colors text-sm">
          <ArrowLeft size={16} /> Voltar
        </button>
        <span className="text-xs text-brand-gray">Passo {step} de {totalSteps}</span>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center text-xl">🍽️</div>
            </div>
            {step === 1 && (
              <>
                <h1 className="font-display text-3xl font-black text-brand-brown">Como vai usar?</h1>
                <p className="text-brand-gray text-sm mt-1">Já tem conta? <Link href="/login" className="text-brand-red font-semibold hover:underline">Entrar</Link></p>
              </>
            )}
            {step === 2 && (
              <>
                <h1 className="font-display text-3xl font-black text-brand-brown">Seus dados</h1>
                <p className="text-brand-gray text-sm mt-1">Informações do responsável da conta</p>
              </>
            )}
            {step === 3 && (
              <>
                <h1 className="font-display text-3xl font-black text-brand-brown">O Restaurante</h1>
                <p className="text-brand-gray text-sm mt-1">Detalhes essenciais para receber pedidos</p>
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
                { key: 'password', label: 'Senha', placeholder: '••••••••', type: 'password' },
                { key: 'phone', label: 'Telefone (WhatsApp)', placeholder: '11999999999', type: 'tel' },
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

          {step === 3 && role === 'restaurant_owner' && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-brand-gray uppercase tracking-wide mb-1.5">Nome do Restaurante</label>
                <input type="text" placeholder="Pizzaria do João" value={restaurantForm.restaurantName} onChange={e => setRestaurantForm(prev => ({ ...prev, restaurantName: e.target.value }))} className="w-full bg-white border-2 border-brand-cream-dark rounded-xl px-4 py-3 text-brand-brown focus:border-brand-red transition-colors text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-gray uppercase tracking-wide mb-1.5">CNPJ</label>
                <input type="text" placeholder="00.000.000/0000-00" value={restaurantForm.cnpj} onChange={e => setRestaurantForm(prev => ({ ...prev, cnpj: e.target.value }))} className="w-full bg-white border-2 border-brand-cream-dark rounded-xl px-4 py-3 text-brand-brown focus:border-brand-red transition-colors text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-gray uppercase tracking-wide mb-1.5">Categoria Principal</label>
                <select value={restaurantForm.category} onChange={e => setRestaurantForm(prev => ({ ...prev, category: e.target.value }))} className="w-full bg-white border-2 border-brand-cream-dark rounded-xl px-4 py-3 text-brand-brown focus:border-brand-red transition-colors text-sm">
                  <option value="" disabled>Selecione...</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="pt-4 border-t border-brand-cream-dark">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-brand-brown">Endereço</h3>
                  <button onClick={handleGetLocation} type="button" disabled={gettingLocation} className="text-xs bg-brand-red/10 text-brand-red font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-brand-red/20 transition-colors">
                    <MapPin size={14} /> {gettingLocation ? 'Buscando...' : 'Pegar GPS'}
                  </button>
                </div>
                {restaurantForm.lat && restaurantForm.lng && (
                  <p className="text-xs text-green-600 font-medium mb-3">✓ Localização GPS capturada!</p>
                )}

                <div className="grid grid-cols-4 gap-3">
                  <div className="col-span-3">
                    <input type="text" placeholder="Rua / Avenida" value={restaurantForm.street} onChange={e => setRestaurantForm(prev => ({ ...prev, street: e.target.value }))} className="w-full bg-white border-2 border-brand-cream-dark rounded-xl px-3 py-2.5 text-brand-brown text-sm" />
                  </div>
                  <div className="col-span-1">
                    <input type="text" placeholder="Nº" value={restaurantForm.number} onChange={e => setRestaurantForm(prev => ({ ...prev, number: e.target.value }))} className="w-full bg-white border-2 border-brand-cream-dark rounded-xl px-3 py-2.5 text-brand-brown text-sm" />
                  </div>
                  <div className="col-span-4">
                    <input type="text" placeholder="Bairro" value={restaurantForm.neighborhood} onChange={e => setRestaurantForm(prev => ({ ...prev, neighborhood: e.target.value }))} className="w-full bg-white border-2 border-brand-cream-dark rounded-xl px-3 py-2.5 text-brand-brown text-sm" />
                  </div>
                  <div className="col-span-3">
                    <input type="text" placeholder="Cidade" value={restaurantForm.city} onChange={e => setRestaurantForm(prev => ({ ...prev, city: e.target.value }))} className="w-full bg-white border-2 border-brand-cream-dark rounded-xl px-3 py-2.5 text-brand-brown text-sm" />
                  </div>
                  <div className="col-span-1">
                    <input type="text" placeholder="UF" maxLength={2} value={restaurantForm.state} onChange={e => setRestaurantForm(prev => ({ ...prev, state: e.target.value }))} className="w-full bg-white border-2 border-brand-cream-dark rounded-xl px-3 py-2.5 text-brand-brown text-sm uppercase" />
                  </div>
                </div>
              </div>

            </div>
          )}

          <button
            onClick={step < totalSteps ? handleNextStep : handleSubmit}
            disabled={loading}
            className="w-full bg-brand-red text-white font-bold py-4 rounded-2xl hover:bg-brand-red-dark transition-all shadow-brand hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 mt-6"
          >
            {loading ? 'Processando...' : step < totalSteps ? (<>Continuar <ArrowRight size={18} /></>) : 'Criar conta 🎉'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  )
}
