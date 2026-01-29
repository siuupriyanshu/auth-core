'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authAPI, APIError } from '@/lib/api-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertCircle, CheckCircle, Mail, Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (token) {
        try {
          await authAPI.verifyEmail(token);
          setStatus('success');
          setMessage('Your email has been verified successfully!');
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        } catch (err) {
          setStatus('error');
          if (err instanceof APIError) {
            setMessage(err.message);
          } else {
            setMessage('Failed to verify email. The link may have expired.');
          }
        }
      } else {
        setStatus('loading');
        setMessage('Check your email for a verification link');
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              {status === 'loading' && (
                <>
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <h2 className="text-xl font-bold text-center">Verifying Email</h2>
                </>
              )}
              {status === 'success' && (
                <>
                  <CheckCircle className="w-12 h-12 text-green-500" />
                  <h2 className="text-xl font-bold text-center">Email Verified</h2>
                </>
              )}
              {status === 'error' && (
                <>
                  <AlertCircle className="w-12 h-12 text-destructive" />
                  <h2 className="text-xl font-bold text-center">Verification Failed</h2>
                </>
              )}
              <p className="text-sm text-muted-foreground text-center">{message}</p>
              {status === 'error' && (
                <div className="w-full flex flex-col gap-2">
                  <Button
                    onClick={() => router.push('/login')}
                    className="w-full"
                  >
                    Back to Sign In
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/register')}
                    className="w-full"
                  >
                    Create New Account
                  </Button>
                </div>
              )}
              {status === 'loading' && !token && (
                <div className="w-full space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    Check your email inbox
                  </div>
                  <Link href="/login" className="block text-center text-sm text-primary hover:underline">
                    Back to Sign In
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
