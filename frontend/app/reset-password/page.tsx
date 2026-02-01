'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { AuthForm } from '@/components/auth/auth-form'
import { LoadingState } from '@/components/auth/loading-state'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { resetPassword } = useAuth()
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [tokenInvalid, setTokenInvalid] = useState(false)

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setTokenInvalid(true)
    }
  }, [searchParams])

  const handleResetPassword = async (data: Record<string, string>) => {
    if (data.password !== data.confirmPassword) {
      setFormError('Passwords do not match')
      return
    }

    const token = searchParams.get('token')
    if (!token) {
      setFormError('Invalid reset link')
      return
    }

    setFormError(null)
    setFormLoading(true)
    try {
      await resetPassword(token, data.password)
      setSuccess(true)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Password reset failed')
    } finally {
      setFormLoading(false)
    }
  }

  if (tokenInvalid) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-8 bg-background">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-lg p-8 space-y-6">
            <div className="space-y-4 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Invalid Link</h1>
              <p className="text-destructive">
                The password reset link is invalid or has expired.
              </p>
              <Link
                href="/forgot-password"
                className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium"
              >
                Request New Link
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-8 bg-background">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-lg p-8 space-y-6">
            <div className="space-y-4 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Password Reset</h1>
              <p className="text-muted-foreground">
                Your password has been reset successfully. You can now sign in with your new password.
              </p>
              <Link
                href="/login"
                className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8 bg-background">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8 space-y-6">
          <AuthForm
            title="Set New Password"
            fields={[
              {
                name: 'password',
                label: 'New Password',
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
            onSubmit={handleResetPassword}
            submitLabel="Reset Password"
            loading={formLoading}
            error={formError}
            onErrorDismiss={() => setFormError(null)}
          />

          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              <Link href="/login" className="text-primary hover:underline font-medium">
                Return to sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
