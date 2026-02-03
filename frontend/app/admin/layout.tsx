'use client'

import React from "react"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { LoadingState } from '@/components/auth/loading-state'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (!loading && user && !user.role?.includes('admin')) {
      router.push('/unauthorized')
    }
  }, [user, loading, router])

  if (loading) {
    return <LoadingState message="Loading..." />
  }

  if (!user || !user.role?.includes('admin')) {
    return null
  }

  return <>{children}</>
}
