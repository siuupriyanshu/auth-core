import { ProtectedRoute } from '@/lib/protected-route';
import { DashboardHeader } from '@/components/dashboard/header';
import { DashboardContent } from '@/components/dashboard/dashboard-content';

export const metadata = {
  title: 'Dashboard | Multi-Tenant Auth',
  description: 'Your personal dashboard and account overview',
};

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DashboardContent />
        </main>
      </div>
    </ProtectedRoute>
  );
}
