'use client'

import React from "react"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { LoadingState } from '@/components/auth/loading-state'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { InputOTP } from '@/components/ui/input-otp'
import { ErrorBanner } from '@/components/auth/error-banner'
import { Spinner } from '@/components/ui/spinner'

export default function TwoFactorPage() {
  const router = useRouter()
  const { user, loading, submitOtp } = useAuth()
  const [otp, setOtp] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect if not authenticated or already verified
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (!loading && user?.emailVerified) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return <LoadingState message="Loading..." />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (otp.length !== 6) {
      setError('Please enter a 6-digit code')
      return
    }

    setError(null)
    setFormLoading(true)
    try {
      await submitOtp(otp)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : '2FA verification failed')
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8 bg-background">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Two-Factor Authentication</h1>
            <p className="text-muted-foreground text-sm">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>

          <ErrorBanner message={error} onDismiss={() => setError(null)} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Authentication Code</Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  disabled={formLoading}
                  render={({ slots }) => (
                    <div className="flex gap-2">
                      {slots.map((slot, index) => (
                        <div key={index} className="w-10 h-10">
                          {slot}
                        </div>
                      ))}
                    </div>
                  )}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={formLoading || otp.length !== 6}>
              {formLoading ? <Spinner className="w-4 h-4 mr-2" /> : null}
              Verify
            </Button>
          </form>

          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Don't have your code?{' '}
              <button
                onClick={() => router.push('/forgot-password')}
                className="text-primary hover:underline font-medium"
              >
                Contact support
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
