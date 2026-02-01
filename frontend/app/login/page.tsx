'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { AuthForm } from '@/components/auth/auth-form'
import { OAuthButton } from '@/components/auth/oauth-button'
import { LoadingState } from '@/components/auth/loading-state'
import { Separator } from '@/components/ui/separator'

export default function LoginPage() {
  const router = useRouter()
  const { user, loading, login, oauthLogin } = useAuth()
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null) // Declare the error variable

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return <LoadingState message="Loading..." />
  }

  const handleLogin = async (data: Record<string, string>) => {
    setFormError(null)
    setFormLoading(true)
    try {
      await login(data.email, data.password)
      router.push('/dashboard')
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setFormLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    try {
      await oauthLogin(provider)
    } catch (err) {
      setError(err instanceof Error ? err.message : `${provider} login failed`) // Use setError to update the error state
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8 bg-background">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8 space-y-6">
          <AuthForm
            title="Sign In"
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
              },
            ]}
            onSubmit={handleLogin}
            submitLabel="Sign In"
            loading={formLoading}
            error={formError}
            onErrorDismiss={() => {
              setFormError(null)
            }}
          />

          <div className="space-y-4">
            <Separator />
            <OAuthButton provider="google" onClick={() => handleOAuthLogin('google')} />
            <OAuthButton provider="github" onClick={() => handleOAuthLogin('github')} />
          </div>

          <div className="space-y-2 text-center text-sm">
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Create one
              </Link>
            </p>
            <p className="text-muted-foreground">
              <Link href="/forgot-password" className="text-primary hover:underline font-medium">
                Forgot your password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
