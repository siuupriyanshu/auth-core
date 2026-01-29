'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, ChangePasswordFormData } from '@/lib/validation';
import { authAPI, APIError } from '@/lib/api-client';
import { ProtectedRoute } from '@/lib/protected-route';
import { DashboardHeader } from '@/components/dashboard/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function PasswordSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await authAPI.changePassword(data.currentPassword, data.newPassword);
      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('Failed to change password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Change Password</h1>
            <p className="text-muted-foreground">
              Update your password to keep your account secure
            </p>
          </div>

          <div className="max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Password Settings</CardTitle>
                <CardDescription>
                  Enter your current password and choose a new one
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className="flex items-center gap-2 p-3 rounded-md bg-green-500/10 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">Password changed successfully</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="currentPassword" className="block text-sm font-medium">
                      Current Password
                    </label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="••••••••"
                      {...register('currentPassword')}
                      disabled={isLoading}
                    />
                    {errors.currentPassword && (
                      <p className="text-xs text-destructive">{errors.currentPassword.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="newPassword" className="block text-sm font-medium">
                      New Password
                    </label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      {...register('newPassword')}
                      disabled={isLoading}
                    />
                    {errors.newPassword && (
                      <p className="text-xs text-destructive">{errors.newPassword.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium">
                      Confirm New Password
                    </label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      {...register('confirmPassword')}
                      disabled={isLoading}
                    />
                    {errors.confirmPassword && (
                      <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-xs font-medium text-foreground mb-2">Password Requirements:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• At least 8 characters long</li>
                      <li>• At least one uppercase letter</li>
                      <li>• At least one number</li>
                      <li>• At least one special character (!@#$%^&*)</li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Updating...' : 'Change Password'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
