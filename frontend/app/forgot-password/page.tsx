'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { AuthForm } from '@/components/auth/auth-form'
import { LoadingState } from '@/components/auth/loading-state'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { user, loading, forgotPassword } = useAuth()
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return <LoadingState message="Loading..." />
  }

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-8 bg-background">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-lg p-8 space-y-6">
            <div className="space-y-4 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Check Your Email</h1>
              <p className="text-muted-foreground">
                We sent a password reset link to your email address. Click the link to reset your password.
              </p>
            </div>

            <div className="text-center text-sm">
              <p className="text-muted-foreground">
                Remember your password?{' '}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const handleForgotPassword = async (data: Record<string, string>) => {
    setFormError(null)
    setFormLoading(true)
    try {
      await forgotPassword(data.email)
      setSubmitted(true)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8 bg-background">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8 space-y-6">
          <AuthForm
            title="Reset Password"
            fields={[
              {
                name: 'email',
                label: 'Email',
                type: 'email',
                required: true,
                validate: (value) => {
                  if (!value.includes('@')) return 'Enter a valid email address'
                  return null
                },
              },
            ]}
            onSubmit={handleForgotPassword}
            submitLabel="Send Reset Link"
            loading={formLoading}
            error={formError}
            onErrorDismiss={() => setFormError(null)}
          />

          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Remember your password?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
