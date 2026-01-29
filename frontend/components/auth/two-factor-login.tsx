'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { twoFactorSchema, TwoFactorFormData } from '@/lib/validation';
import { authAPI, APIError } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { AlertCircle, Loader2 } from 'lucide-react';

interface TwoFactorLoginProps {
  tempToken: string;
}

export const TwoFactorLogin = ({ tempToken }: TwoFactorLoginProps) => {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCount, setResendCount] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TwoFactorFormData>({
    resolver: zodResolver(twoFactorSchema),
  });

  const onSubmit = async (data: TwoFactorFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, you would send the tempToken along with the code
      const response = await authAPI.verifyTwoFactor(data.code);
      if (response.verified) {
        // Assuming the backend returns the full token after 2FA verification
        login(tempToken);
        router.push('/dashboard');
      }
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('Invalid 2FA code. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>
          Enter the 6-digit code from your authenticator app
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

          <div className="space-y-2">
            <label htmlFor="code" className="block text-sm font-medium">
              Enter 6-digit Code
            </label>
            <Input
              id="code"
              type="text"
              placeholder="000000"
              maxLength={6}
              inputMode="numeric"
              {...register('code')}
              disabled={isLoading}
            />
            {errors.code && (
              <p className="text-xs text-destructive">{errors.code.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Code'
            )}
          </Button>

          <div className="space-y-2 text-sm text-center">
            <p className="text-muted-foreground">
              Don't have your authenticator app?
            </p>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0"
              onClick={() => setResendCount(resendCount + 1)}
            >
              Use a backup code instead
            </Button>
          </div>

          <div className="text-center text-sm">
            <Link href="/login" className="text-primary hover:underline">
              Back to Sign In
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
