'use client'
import Link from 'next/link'
import { ArrowRight, Star, Clock, Zap, Shield, ChefHat, Bike } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-brown text-brand-cream overflow-hidden">
      {/* ── HEADER ── */}
      <header className="flex items-center justify-between px-6 py-5 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-brand-red rounded-xl flex items-center justify-center text-lg">🍽️</div>
          <span className="font-display text-xl font-bold text-brand-cream">
            Peça<em className="text-brand-red not-italic">Meu</em>Restaurante
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-brand-cream/70 hover:text-brand-cream transition-colors">
            Entrar
          </Link>
          <Link href="/register" className="bg-brand-red text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-brand-red-dark transition-colors">
            Começar grátis
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative px-6 pt-16 pb-24 text-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(#FFF8F0 1px, transparent 1px), linear-gradient(90deg, #FFF8F0 1px, transparent 1px)', backgroundSize: '64px 64px' }}
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-cream/5 border border-brand-gold/20 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-brand-red rounded-full animate-pulse-dot" />
            <span className="text-brand-gold text-xs font-semibold tracking-widest uppercase">Disponível em São Paulo</span>
          </div>

          <h1 className="font-display text-6xl md:text-8xl font-black leading-[0.9] tracking-tight mb-4">
            Delivery<br />
            <em className="text-brand-red not-italic">transparente</em><br />
            de verdade
          </h1>
          <p className="text-brand-cream/60 text-lg md:text-xl font-light max-w-xl mx-auto mb-10 leading-relaxed">
            Só <strong className="text-brand-gold font-semibold">R$1,00 por pedido</strong>. Sem comissões abusivas.
            Sem surpresas. Conectamos restaurantes e clientes de forma justa.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-brand-red text-white font-bold text-base px-8 py-4 rounded-2xl hover:bg-brand-red-dark transition-all hover:-translate-y-0.5 shadow-brand"
            >
              Pedir agora <ArrowRight size={18} />
            </Link>
            <Link
              href="/register?role=restaurant"
              className="inline-flex items-center justify-center gap-2 border border-brand-cream/20 text-brand-cream font-medium text-base px-8 py-4 rounded-2xl hover:border-brand-cream/50 hover:bg-brand-cream/5 transition-all"
            >
              Cadastrar meu restaurante
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-y border-brand-cream/8 py-10">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { num: 'R$1', label: 'Por pedido', sub: 'taxa fixa transparente' },
            { num: '4.8★', label: 'Avaliação', sub: 'média dos restaurantes' },
            { num: '30min', label: 'Entrega', sub: 'tempo médio' },
            { num: '100%', label: 'Transparente', sub: 'sem comissão oculta' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-brand-gold mb-1">{s.num}</div>
              <div className="text-brand-cream font-semibold text-sm">{s.label}</div>
              <div className="text-brand-cream/40 text-xs mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-brand-red text-xs font-bold tracking-widest uppercase mb-3">Como funciona</p>
            <h2 className="font-display text-4xl md:text-5xl font-black">
              Simples para todos
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <ChefHat size={28} />,
                role: 'Restaurante',
                color: 'bg-orange-950/40 border-orange-800/30',
                accent: 'text-orange-400',
                steps: ['Cadastre seu restaurante', 'Monte seu cardápio', 'Receba pedidos em tempo real', 'Pague apenas R$1,00/pedido'],
              },
              {
                icon: '🛍️',
                role: 'Cliente',
                color: 'bg-red-950/40 border-red-800/30',
                accent: 'text-red-400',
                steps: ['Busque restaurantes próximos', 'Monte seu pedido', 'Pague com Pix ou cartão', 'Acompanhe em tempo real'],
              },
              {
                icon: <Bike size={28} />,
                role: 'Entregador',
                color: 'bg-amber-950/40 border-amber-800/30',
                accent: 'text-amber-400',
                steps: ['Cadastre-se na plataforma', 'Aceite entregas próximas', 'Entregue e avalie', 'Receba semanalmente'],
              },
            ].map((entity) => (
              <div key={entity.role} className={`rounded-3xl border p-6 ${entity.color}`}>
                <div className={`text-3xl mb-3 ${entity.accent}`}>
                  {typeof entity.icon === 'string' ? entity.icon : entity.icon}
                </div>
                <h3 className={`font-display text-xl font-bold mb-4 ${entity.accent}`}>{entity.role}</h3>
                <ul className="space-y-2">
                  {entity.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-brand-cream/70 text-sm">
                      <span className="font-bold text-brand-cream/30 w-4 flex-shrink-0">{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BUSINESS MODEL ── */}
      <section className="py-20 px-6 border-t border-brand-cream/8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-brand-gold text-xs font-bold tracking-widest uppercase mb-3">Modelo de negócio</p>
            <h2 className="font-display text-4xl md:text-5xl font-black">A matemática honesta</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-brand-red/10 border border-brand-red/20 rounded-3xl p-8">
              <Zap className="text-brand-red mb-4" size={32} />
              <h3 className="font-display text-2xl font-bold mb-3">Para o restaurante</h3>
              <div className="space-y-3 text-brand-cream/80 text-sm">
                <div className="flex justify-between border-b border-brand-cream/10 pb-2">
                  <span>Valor do pedido</span><span className="font-semibold text-brand-cream">R$ 80,00</span>
                </div>
                <div className="flex justify-between border-b border-brand-cream/10 pb-2">
                  <span>Taxa da plataforma</span><span className="text-brand-red font-semibold">- R$ 1,00</span>
                </div>
                <div className="flex justify-between border-b border-brand-cream/10 pb-2">
                  <span>Taxa de entrega</span><span className="text-brand-cream/60">do cliente</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="font-bold">Restaurante recebe</span>
                  <span className="font-display text-xl font-bold text-green-400">R$ 79,00</span>
                </div>
              </div>
              <p className="text-xs text-brand-cream/40 mt-4">vs. concorrentes que cobram 25-35% de comissão</p>
            </div>

            <div className="bg-brand-gold/10 border border-brand-gold/20 rounded-3xl p-8">
              <Shield className="text-brand-gold mb-4" size={32} />
              <h3 className="font-display text-2xl font-bold mb-3">Nossa receita</h3>
              <div className="space-y-3 text-brand-cream/80 text-sm">
                <div className="flex justify-between border-b border-brand-cream/10 pb-2">
                  <span>Por pedido processado</span><span className="font-semibold text-brand-gold">R$ 1,00</span>
                </div>
                <div className="flex justify-between border-b border-brand-cream/10 pb-2">
                  <span>Plano Destaque (opcional)</span><span className="font-semibold text-brand-gold">R$ 99/mês</span>
                </div>
                <div className="flex justify-between border-b border-brand-cream/10 pb-2">
                  <span>1.000 pedidos/dia</span><span className="font-semibold text-brand-cream">R$ 1.000/dia</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="font-bold">100% previsível</span>
                  <span className="font-display text-xl font-bold text-brand-gold">Escalável</span>
                </div>
              </div>
              <p className="text-xs text-brand-cream/40 mt-4">Crescemos quando os restaurantes crescem — alinhamento total</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-5xl md:text-6xl font-black mb-4">
            Pronto para <em className="text-brand-red not-italic">pedir?</em>
          </h2>
          <p className="text-brand-cream/60 text-lg mb-8">Junte-se a milhares de clientes e centenas de restaurantes.</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-brand-red text-white font-bold text-lg px-10 py-5 rounded-2xl hover:bg-brand-red-dark transition-all hover:-translate-y-1 shadow-brand"
          >
            Criar conta grátis <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-brand-cream/8 py-8 px-6 text-center text-brand-cream/30 text-sm">
        <p className="font-display text-base font-bold text-brand-cream/60 mb-2">
          Peça<em className="text-brand-red not-italic">Meu</em>Restaurante
        </p>
        <p>© 2024 · Delivery transparente · R$1,00/pedido · São Paulo, Brasil</p>
      </footer>
    </div>
  )
}
