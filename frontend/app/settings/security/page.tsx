import { TwoFactorSetup } from '@/components/auth/two-factor-setup';
import { ProtectedRoute } from '@/lib/protected-route';

export const metadata = {
  title: 'Security Settings | Multi-Tenant Auth',
  description: 'Manage your security settings and two-factor authentication',
};

export default function SecuritySettingsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Security Settings</h1>
            <p className="text-muted-foreground">
              Manage your account security and authentication methods
            </p>
          </div>
          <TwoFactorSetup />
        </div>
      </div>
    </ProtectedRoute>
  );
}
