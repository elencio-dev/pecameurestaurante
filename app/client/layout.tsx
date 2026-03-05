'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store'
import { ClientBottomNav } from '@/components/layout/navigation'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) router.push('/login')
    else if (user?.role !== 'customer') router.push('/login')
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== 'customer') return null

  return (
    <div className="min-h-screen bg-brand-cream pb-20">
      {children}
      <ClientBottomNav />
    </div>
  )
}
