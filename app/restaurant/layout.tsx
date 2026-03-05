'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store'
import { RestaurantBottomNav } from '@/components/layout/navigation'

export default function RestaurantLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) router.push('/login')
    else if (user?.role !== 'restaurant_owner') router.push('/login')
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== 'restaurant_owner') return null

  return (
    <div className="min-h-screen bg-brand-cream pb-20">
      {children}
      <RestaurantBottomNav />
    </div>
  )
}
