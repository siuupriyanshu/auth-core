'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout } = useAuth()


  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-foreground font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">User ID</p>
                <p className="text-foreground font-medium">{user?.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="text-foreground font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email Verified</p>
                <p className="text-foreground font-medium">
                  {user?.isEmailVerified ? 'Yes' : 'No'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Roles</p>
                <div className="flex flex-wrap gap-2">
                  {user?.role && user.role.length > 0 ? (
                    user.role.map((role) => (
                      <span
                        key={role}
                        className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full font-medium"
                      >
                        {role}
                      </span>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No roles assigned</p>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Permissions</p>
                <div className="flex flex-wrap gap-2">
                  {user?.permissions && user.permissions.length > 0 ? (
                    user.permissions.map((permission) => (
                      <span
                        key={permission}
                        className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full font-medium"
                      >
                        {permission}
                      </span>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No permissions assigned</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {user?.role?.includes('admin') && (
            <div className="flex">
              <Button onClick={() => router.push('/admin')} variant="default">
                Go to Admin Panel
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
