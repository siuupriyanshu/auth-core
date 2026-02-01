'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">Multi-Tenant Auth Service</h1>
          <div className="flex gap-2">
            {user ? (
              <>
                <Button onClick={() => router.push('/dashboard')} variant="default">
                  Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => router.push('/login')} variant="outline">
                  Sign In
                </Button>
                <Button onClick={() => router.push('/register')} variant="default">
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="text-4xl font-bold tracking-tight">Authentication Service</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Secure, scalable, multi-tenant authentication built with modern security practices.
            </p>
          </div>

          {!user ? (
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>New User?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Create a new account to get started with our authentication service.
                  </p>
                  <Link href="/register" className="block">
                    <Button className="w-full">Create Account</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Existing User?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Sign in to your account to access your dashboard.
                  </p>
                  <Link href="/login" className="block">
                    <Button className="w-full bg-transparent" variant="outline">
                      Sign In
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back, {user.email}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  You are authenticated and ready to access your dashboard.
                </p>
                <Button onClick={() => router.push('/dashboard')} className="w-full">
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Secure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  JWT tokens, RBAC, and HTTP-only cookies ensure your data is protected.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Multi-Tenant</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Support for multiple tenants with isolated data and configurable policies.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">OAuth Ready</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Integration with Google, GitHub, and other OAuth providers out of the box.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
