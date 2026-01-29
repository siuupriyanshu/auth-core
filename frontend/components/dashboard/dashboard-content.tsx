'use client';

import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Shield, Lock, Key } from 'lucide-react';

export const DashboardContent = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, {user?.email?.split('@')[0]}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your account and security status.
        </p>
      </section>

      {/* Account Overview */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Email Verified</span>
                <span className="text-sm font-medium">
                  {user?.verified ? '✓ Yes' : '✗ No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Two-Factor Auth</span>
                <span className="text-sm font-medium">
                  {user?.mfaEnabled ? '✓ Enabled' : '✗ Disabled'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Account Role</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold capitalize text-primary">{user?.role}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Tenant: {user?.tenantId}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {user?.permissions && user.permissions.length > 0 ? (
                user.permissions.slice(0, 3).map((perm) => (
                  <p key={perm} className="text-xs text-muted-foreground">
                    • {perm}
                  </p>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No permissions granted</p>
              )}
              {user?.permissions && user.permissions.length > 3 && (
                <p className="text-xs text-primary font-medium">
                  + {user.permissions.length - 3} more
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Security Actions */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">Security</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <CardTitle>Two-Factor Authentication</CardTitle>
              </div>
              <CardDescription>
                {user?.mfaEnabled
                  ? 'Your account is protected with 2FA'
                  : 'Add an extra layer of security to your account'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/settings/security">
                <Button variant="outline" className="w-full bg-transparent">
                  {user?.mfaEnabled ? 'Manage' : 'Enable'} 2FA
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                <CardTitle>Password</CardTitle>
              </div>
              <CardDescription>
                Manage your password and account security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/settings/password">
                <Button variant="outline" className="w-full bg-transparent">
                  Change Password
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" />
                <CardTitle>Sessions</CardTitle>
              </div>
              <CardDescription>
                View and manage your active sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/settings/sessions">
                <Button variant="outline" className="w-full bg-transparent">
                  View Sessions
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};
