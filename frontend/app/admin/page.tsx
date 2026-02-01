'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminPage() {
  const router = useRouter()
  const { user } = useAuth()

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Administrator Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Admin Email</p>
                <p className="text-foreground font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Admin ID</p>
                <p className="text-foreground font-medium">{user?.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <span className="inline-block px-3 py-1 bg-destructive text-destructive-foreground text-sm rounded-full font-medium">
                  Admin
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin Capabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ User management</li>
                <li>✓ Role and permission management</li>
                <li>✓ System configuration</li>
                <li>✓ Security policies</li>
                <li>✓ Audit logs</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-3">
                  Admin-only features would be implemented here
                </p>
                <Button variant="outline" className="w-full text-left bg-transparent">
                  Manage Users
                </Button>
                <Button variant="outline" className="w-full text-left bg-transparent">
                  System Settings
                </Button>
                <Button variant="outline" className="w-full text-left bg-transparent">
                  View Audit Log
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
