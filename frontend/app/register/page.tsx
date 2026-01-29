import { RegisterForm } from '@/components/auth/register-form';

export const metadata = {
  title: 'Sign Up | Multi-Tenant Auth',
  description: 'Create a new account for our multi-tenant application',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome</h1>
          <p className="text-muted-foreground">
            Start your multi-tenant journey today
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
