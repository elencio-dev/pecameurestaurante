'use client'
import { useRouter, useParams } from 'next/navigation'
import { useEffect } from 'react'

export default function RestaurantsPage() {
  const router = useRouter()
  useEffect(() => { router.push('/client') }, [])
  return null
}
