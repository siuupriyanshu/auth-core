import { LoginForm } from '@/components/auth/login-form';

export const metadata = {
  title: 'Sign In | Multi-Tenant Auth',
  description: 'Sign in to your multi-tenant workspace',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">
            Sign in to your workspace
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
