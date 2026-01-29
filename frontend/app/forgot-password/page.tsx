import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export const metadata = {
  title: 'Forgot Password | Multi-Tenant Auth',
  description: 'Reset your password',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Forgot Password?</h1>
          <p className="text-muted-foreground">
            No problem. We'll help you reset it.
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
