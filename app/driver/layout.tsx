'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store'
import { DriverBottomNav } from '@/components/layout/navigation'

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) router.push('/login')
    else if (user?.role !== 'driver') router.push('/login')
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== 'driver') return null

  return (
    <div className="min-h-screen bg-brand-cream pb-20">
      {children}
      <DriverBottomNav />
    </div>
  )
}
