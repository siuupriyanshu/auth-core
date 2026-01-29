'use client';

import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/lib/protected-route';
import { DashboardHeader } from '@/components/dashboard/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ProfileSettingsPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
            <p className="text-muted-foreground">
              Manage your profile information
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    <button className="block w-full text-left px-3 py-2 text-sm font-medium bg-muted rounded-md text-foreground">
                      Profile
                    </button>
                    <button className="block w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md">
                      Password
                    </button>
                    <button className="block w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md">
                      Sessions
                    </button>
                    <button className="block w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md">
                      Security
                    </button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your profile details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Email Address</label>
                    <Input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="opacity-70"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed. Contact support to update.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Tenant ID</label>
                    <Input
                      value={user?.tenantId || ''}
                      disabled
                      className="opacity-70"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your tenant identifier in the system
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Account Role</label>
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                      <span className="text-sm capitalize font-medium">{user?.role}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Contact your admin to change your role
                    </p>
                  </div>

                  <div className="pt-4">
                    <Button disabled>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <span className="text-sm">Email Verified</span>
                    <span className={`text-sm font-medium ${user?.verified ? 'text-green-600' : 'text-amber-600'}`}>
                      {user?.verified ? '✓ Verified' : '✗ Unverified'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <span className="text-sm">Two-Factor Authentication</span>
                    <span className={`text-sm font-medium ${user?.mfaEnabled ? 'text-green-600' : 'text-amber-600'}`}>
                      {user?.mfaEnabled ? '✓ Enabled' : '✗ Disabled'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
