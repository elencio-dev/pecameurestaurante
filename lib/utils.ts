import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { OrderStatus, RestaurantStatus } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(dateStr))
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'agora'
  if (mins < 60) return `${mins}min atrás`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h atrás`
  return `${Math.floor(hours / 24)}d atrás`
}

export function generateOrderNumber(): string {
  const num = Math.floor(Math.random() * 90000 + 10000)
  return `#PMR-${num}`
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending:    'Aguardando',
  accepted:   'Aceito',
  preparing:  'Preparando',
  ready:      'Pronto',
  picked_up:  'Coletado',
  on_the_way: 'A caminho',
  delivered:  'Entregue',
  cancelled:  'Cancelado',
  refunded:   'Reembolsado',
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending:    'bg-amber-100 text-amber-800',
  accepted:   'bg-blue-100 text-blue-800',
  preparing:  'bg-orange-100 text-orange-800',
  ready:      'bg-purple-100 text-purple-800',
  picked_up:  'bg-indigo-100 text-indigo-800',
  on_the_way: 'bg-cyan-100 text-cyan-800',
  delivered:  'bg-green-100 text-green-800',
  cancelled:  'bg-red-100 text-red-800',
  refunded:   'bg-gray-100 text-gray-800',
}

export const RESTAURANT_STATUS_LABELS: Record<RestaurantStatus, string> = {
  open:             'Aberto',
  closed:           'Fechado',
  paused:           'Pausado',
  pending_approval: 'Aguardando aprovação',
}

export const RESTAURANT_CATEGORIES = [
  { value: 'Pizza',        emoji: '🍕' },
  { value: 'Hambúrguer',   emoji: '🍔' },
  { value: 'Japonês',      emoji: '🍣' },
  { value: 'Árabe',        emoji: '🥙' },
  { value: 'Brasileiro',   emoji: '🍖' },
  { value: 'Italiano',     emoji: '🍝' },
  { value: 'Mexicano',     emoji: '🌮' },
  { value: 'Saudável',     emoji: '🥗' },
  { value: 'Doces',        emoji: '🍰' },
  { value: 'Frutos do Mar',emoji: '🦞' },
]
