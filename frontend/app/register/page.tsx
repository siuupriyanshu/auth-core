'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { AuthForm } from '@/components/auth/auth-form'
import { LoadingState } from '@/components/auth/loading-state'

export default function RegisterPage() {
  const router = useRouter()
  const { user, loading, register } = useAuth()
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
                We sent a verification link to your email address. Click the link to complete your registration.
              </p>
            </div>

            <div className="text-center text-sm">
              <p className="text-muted-foreground">
                Already verified?{' '}
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

  const handleRegister = async (data: Record<string, string>) => {
    if (data.password !== data.confirmPassword) {
      setFormError('Passwords do not match')
      return
    }

    setFormError(null)
    setFormLoading(true)
    try {
      await register(data.email, data.password)
      setSubmitted(true)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8 bg-background">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8 space-y-6">
          <AuthForm
            title="Create Account"
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
              {
                name: 'password',
                label: 'Password',
                type: 'password',
                required: true,
                validate: (value) => {
                  if (value.length < 8) return 'Password must be at least 8 characters'
                  return null
                },
              },
              {
                name: 'confirmPassword',
                label: 'Confirm Password',
                type: 'password',
                required: true,
              },
            ]}
            onSubmit={handleRegister}
            submitLabel="Create Account"
            loading={formLoading}
            error={formError}
            onErrorDismiss={() => setFormError(null)}
          />

          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{' '}
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
