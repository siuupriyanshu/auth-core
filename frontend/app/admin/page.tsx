import { ProtectedRoute } from '@/lib/protected-route';
import { DashboardHeader } from '@/components/dashboard/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'Admin Dashboard | Multi-Tenant Auth',
  description: 'Administration panel for managing users and permissions',
};

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <section className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your tenant's users, roles, and permissions
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">-</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Managed through API
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">-</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Real-time data
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Tenant ID</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-mono text-primary">-</p>
                <p className="text-xs text-muted-foreground mt-2">
                  From JWT claims
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                User management and role assignment are handled through your backend API.
                This dashboard displays information from your JWT claims.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium text-foreground mb-2">
                    API Endpoints Needed:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• GET /api/admin/users - List all users</li>
                    <li>• POST /api/admin/users/roles - Assign roles</li>
                    <li>• POST /api/admin/users/permissions - Manage permissions</li>
                    <li>• DELETE /api/admin/users/:id - Remove users</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}
