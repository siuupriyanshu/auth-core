'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { LoadingState } from '@/components/auth/loading-state'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { verifyEmail } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setError('No verification token provided')
      setLoading(false)
      return
    }

    const verify = async () => {
      try {
        const email = searchParams.get('email')
        if (!email) {
          throw new Error('No email provided for verification')
        }
        await verifyEmail(token, email)
        setSuccess(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Verification failed')
      } finally {
        setLoading(false)
      }
    }

    verify()
  }, [searchParams, verifyEmail])

  if (loading) {
    return <LoadingState message="Verifying email..." />
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8 bg-background">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8 space-y-6">
          {success ? (
            <div className="space-y-4 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Email Verified</h1>
              <p className="text-muted-foreground">
                Your email has been verified successfully. You can now sign in to your account.
              </p>
              <Link
                href="/login"
                className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium"
              >
                Continue to Sign In
              </Link>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Verification Failed</h1>
              <p className="text-destructive">{error}</p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/register"
                  className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium"
                >
                  Try Again
                </Link>
                <Link
                  href="/login"
                  className="inline-block px-4 py-2 border border-border text-foreground rounded-md hover:bg-muted font-medium"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
