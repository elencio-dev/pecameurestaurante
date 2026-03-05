'use client'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'
import type { OrderStatus } from '@/types'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils'

// ── Badge ──────────────────────────────────────

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'brand'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
      {
        'bg-brand-cream-dark text-brand-brown':   variant === 'default',
        'bg-green-100 text-green-800':            variant === 'success',
        'bg-amber-100 text-amber-800':            variant === 'warning',
        'bg-red-100 text-red-800':                variant === 'error',
        'bg-brand-red text-white':                variant === 'brand',
      },
      className
    )}>
      {children}
    </span>
  )
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', ORDER_STATUS_COLORS[status])}>
      {ORDER_STATUS_LABELS[status]}
    </span>
  )
}

// ── Card ──────────────────────────────────────

export function Card({ children, className, onClick }: {
  children: React.ReactNode; className?: string; onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl border border-brand-cream-dark/50',
        onClick && 'cursor-pointer hover:-translate-y-0.5 hover:shadow-soft transition-all',
        className
      )}
    >
      {children}
    </div>
  )
}

// ── Stat Card ────────────────────────────────

export function StatCard({ label, value, sub, icon, accent }: {
  label: string; value: string | number; sub?: string; icon?: React.ReactNode; accent?: boolean
}) {
  return (
    <Card className={cn('p-5', accent && 'bg-gradient-to-br from-brand-red to-brand-orange border-none text-white')}>
      {icon && <div className={cn('mb-3', accent ? 'text-white/80' : 'text-brand-red')}>{icon}</div>}
      <div className={cn('font-display text-3xl font-black mb-0.5', accent ? 'text-white' : 'text-brand-brown')}>
        {typeof value === 'number' && !isNaN(value) ? formatCurrency(value) : value}
      </div>
      <div className={cn('text-sm font-medium', accent ? 'text-white/80' : 'text-brand-gray')}>{label}</div>
      {sub && <div className={cn('text-xs mt-1', accent ? 'text-white/60' : 'text-green-600 font-semibold')}>{sub}</div>}
    </Card>
  )
}

// ── Button ───────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export function Button({ children, variant = 'primary', size = 'md', loading, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all disabled:opacity-60',
        {
          'bg-brand-red text-white hover:bg-brand-red-dark shadow-brand hover:-translate-y-0.5': variant === 'primary',
          'bg-brand-cream-dark text-brand-brown hover:bg-brand-cream border border-brand-cream-dark': variant === 'secondary',
          'hover:bg-brand-cream-dark text-brand-brown': variant === 'ghost',
          'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
          'text-xs px-3 py-1.5': size === 'sm',
          'text-sm px-4 py-2.5': size === 'md',
          'text-base px-6 py-3.5': size === 'lg',
        },
        className
      )}
    >
      {loading ? <span className="animate-spin">⏳</span> : children}
    </button>
  )
}

// ── Input ─────────────────────────────────────

export function Input({ label, className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-xs font-bold text-brand-gray uppercase tracking-wide">{label}</label>}
      <input
        {...props}
        className={cn(
          'w-full bg-white border-2 border-brand-cream-dark rounded-xl px-4 py-3 text-brand-brown placeholder-brand-gray/50 focus:outline-none focus:border-brand-red transition-colors text-sm',
          className
        )}
      />
    </div>
  )
}

// ── Empty State ───────────────────────────────

export function EmptyState({ emoji, title, description, action }: {
  emoji: string; title: string; description?: string; action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <div className="text-6xl mb-4">{emoji}</div>
      <h3 className="font-display text-xl font-bold text-brand-brown mb-2">{title}</h3>
      {description && <p className="text-brand-gray text-sm mb-6 max-w-xs">{description}</p>}
      {action}
    </div>
  )
}

// ── Pulse Dot ─────────────────────────────────

export function PulseDot({ color = 'bg-brand-red' }: { color?: string }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', color)} />
      <span className={cn('relative inline-flex rounded-full h-2.5 w-2.5', color)} />
    </span>
  )
}

// ── Price Display ─────────────────────────────

export function Price({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn('font-display font-bold text-brand-red', className)}>
      {formatCurrency(value)}
    </span>
  )
}
