# 🍽️ PeçaMeuRestaurante

**Delivery transparente — R$1,00 por pedido, sem comissões abusivas.**

> _Peça. Receba. Aproveite._

---

## 📐 Arquitetura

```
peca-meu-restaurante/
├── app/
│   ├── page.tsx                    # Landing page pública
│   ├── login/page.tsx              # Login (4 perfis demo)
│   ├── register/page.tsx           # Cadastro em 2 etapas
│   │
│   ├── client/                     # Portal do CLIENTE
│   │   ├── layout.tsx              # Auth guard + bottom nav
│   │   ├── page.tsx                # Home: busca + restaurantes
│   │   ├── restaurants/[id]/page.tsx  # Cardápio do restaurante
│   │   ├── cart/page.tsx           # Carrinho + checkout
│   │   ├── orders/page.tsx         # Lista de pedidos
│   │   ├── orders/[id]/page.tsx    # Rastreamento em tempo real
│   │   └── profile/page.tsx        # Perfil do cliente
│   │
│   ├── restaurant/                 # Portal do RESTAURANTE
│   │   ├── layout.tsx              # Auth guard + bottom nav
│   │   ├── page.tsx                # Dashboard + pedidos ao vivo
│   │   ├── orders/page.tsx         # Gerenciar pedidos
│   │   ├── menu/page.tsx           # Gerenciar cardápio
│   │   └── settings/page.tsx       # Configurações
│   │
│   ├── driver/                     # Portal do ENTREGADOR
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Dashboard + entregas disponíveis
│   │   ├── deliveries/page.tsx     # Histórico de entregas
│   │   ├── earnings/page.tsx       # Ganhos e pagamentos
│   │   └── profile/page.tsx
│   │
│   └── admin/                      # Painel ADMIN (plataforma)
│       ├── layout.tsx
│       └── page.tsx                # KPIs + receita + pedidos ao vivo
│
├── components/
│   ├── ui/index.tsx                # Badge, Card, Button, Input, etc.
│   └── layout/navigation.tsx       # BottomNav, AppHeader
│
├── lib/
│   ├── data.ts                     # Mock data (restaurantes, cardápio, pedidos)
│   └── utils.ts                    # formatCurrency, cn, constants
│
├── store/
│   └── index.ts                    # Zustand: auth + cart + orders
│
└── types/
    └── index.ts                    # Todos os tipos TypeScript
```

---

## 👥 Entidades da plataforma

### 1. Cliente (`customer`)
- Navega por restaurantes e categorias
- Adiciona itens ao carrinho
- Faz checkout (Pix, cartão, dinheiro)
- Rastreia pedido em tempo real
- Avalia restaurante e entregador
- Histórico de pedidos

### 2. Restaurante (`restaurant_owner`)
- Dashboard com faturamento e métricas
- Gestão de pedidos em tempo real (aceitar → preparar → pronto)
- Gestão de cardápio (categorias + itens)
- Toggle aberto/fechado
- Visibilidade da taxa da plataforma por pedido

### 3. Entregador (`driver`)
- Status online/offline
- Aceita/recusa entregas disponíveis
- Navegação até restaurante e cliente
- Dashboard de ganhos
- Pagamento semanal via Pix

### 4. Admin (`admin`)
- KPIs da plataforma em tempo real
- Receita total (R$1,00 × pedidos)
- Gestão de restaurantes
- Pedidos ao vivo de toda a plataforma

---

## 💰 Modelo de negócio

| Fonte de receita | Valor |
|---|---|
| **Taxa por pedido** (principal) | **R$1,00** por pedido processado |
| Plano Destaque (opcional) | R$99/mês por restaurante |

### Por que R$1,00 funciona?

- iFood cobra **25-35%** de comissão → restaurante perde R$20-28 em pedido de R$80
- PMR cobra **R$1,00 fixo** → restaurante perde apenas R$1,00
- Para o restaurante: **mais margem → mais fidelidade → mais volume**
- Para o cliente: **preços menores** (restaurante não precisa repassar comissão)
- Para a PMR: **escalabilidade** — 1.000 pedidos/dia = R$1.000/dia = R$30.000/mês

### Break-even estimado
```
Custo operacional mensal (infra + suporte): ~R$5.000
Pedidos necessários: 5.000/mês (~167/dia)
Meta de 1 ano: 50.000 pedidos/mês = R$50.000/mês
```

---

## 🚀 Como rodar localmente

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

Acesse: `http://localhost:3000`

### Contas de demo

| Perfil | E-mail | Rota após login |
|---|---|---|
| Cliente | ana@email.com | `/client` |
| Restaurante | carlos@pizzaroma.com | `/restaurant` |
| Entregador | diego@email.com | `/driver` |
| Admin | admin@pmr.com.br | `/admin` |

---

## 🔧 Stack tecnológica

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS |
| Estado global | Zustand (persist) |
| Gráficos | Recharts |
| Ícones | Lucide React |
| Notificações | React Hot Toast |
| Fontes | Fraunces + DM Sans |

---

## 📈 Roadmap pós-MVP

### Fase 2 — Backend real
- [ ] Supabase / PostgreSQL (banco de dados)
- [ ] NextAuth.js (autenticação real)
- [ ] Stripe / Pagar.me (pagamentos)
- [ ] WebSockets (pedidos em tempo real)
- [ ] Push notifications (Firebase)

### Fase 3 — Crescimento
- [ ] App mobile (React Native / Expo)
- [ ] Sistema de avaliações
- [ ] Cupons e promoções
- [ ] Analytics avançado
- [ ] Integração com Google Maps
- [ ] Sistema de fidelidade

### Fase 4 — Expansão
- [ ] Multi-tenant (múltiplas cidades)
- [ ] Programa de afiliados
- [ ] API pública para integrações
- [ ] White-label para outras plataformas

---

## 🎨 Branding

| Elemento | Valor |
|---|---|
| Cor principal | `#E8340A` (vermelho) |
| Cor de destaque | `#D4A853` (dourado) |
| Fundo | `#FFF8F0` (creme) |
| Texto | `#2C1A0E` (marrom) |
| Fonte display | Fraunces (serif) |
| Fonte corpo | DM Sans (sans-serif) |
| Slogan | _"Peça. Receba. Aproveite."_ |

---

© 2024 PeçaMeuRestaurante · Feito com ♥ para conectar pessoas e restaurantes
