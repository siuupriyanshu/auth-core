'use client';

import { ProtectedRoute } from '@/lib/protected-route';
import { DashboardHeader } from '@/components/dashboard/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Smartphone, AlertCircle } from 'lucide-react';

export default function SessionsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Active Sessions</h1>
            <p className="text-muted-foreground">
              Manage your active sessions across devices
            </p>
          </div>

          <div className="max-w-2xl space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-md">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Chrome on macOS</CardTitle>
                      <CardDescription>
                        Last active: Just now
                      </CardDescription>
                    </div>
                  </div>
                  <span className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-1 rounded">
                    Current Session
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <p>IP Address: 192.168.1.1</p>
                  <p>Location: San Francisco, CA</p>
                  <p>Device: MacBook Pro</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-md">
                      <Smartphone className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Safari on iPhone</CardTitle>
                      <CardDescription>
                        Last active: 2 days ago
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <p>IP Address: 203.0.113.42</p>
                  <p>Location: San Francisco, CA</p>
                  <p>Device: iPhone 15</p>
                </div>
                <Button variant="outline" size="sm">
                  Sign Out This Device
                </Button>
              </CardContent>
            </Card>

            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <CardTitle className="text-base">Sign Out All Other Sessions</CardTitle>
                    <CardDescription>
                      This will sign you out of all devices except this one
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/5 bg-transparent">
                  Sign Out All Devices
                </Button>
              </CardContent>
            </Card>

            <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-2">Note:</p>
              <p>
                Session management data is handled through your backend API. The current interface
                is for demonstration. Implement real session tracking with API endpoints:
              </p>
              <ul className="mt-2 space-y-1 text-xs">
                <li>• GET /api/sessions - List active sessions</li>
                <li>• POST /api/sessions/:id/revoke - Revoke specific session</li>
                <li>• POST /api/sessions/revoke-all - Sign out all devices</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
