'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authAPI, APIError } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';

interface OAuthCallbackHandlerProps {
  provider: 'google' | 'github';
}

export const OAuthCallbackHandler = ({ provider }: OAuthCallbackHandlerProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing your login...');

  const code = searchParams.get('code');
  const state = searchParams.get('state');

  useEffect(() => {
    const handleCallback = async () => {
      if (!code) {
        setStatus('error');
        setError('No authorization code received');
        return;
      }

      try {
        let response;
        if (provider === 'google') {
          response = await authAPI.handleGoogleCallback(code);
        } else {
          response = await authAPI.handleGithubCallback(code);
        }

        login(response.token);
        setStatus('success');
        setMessage('Login successful! Redirecting...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } catch (err) {
        setStatus('error');
        if (err instanceof APIError) {
          setError(err.message);
        } else {
          setError(`Failed to complete ${provider} login. Please try again.`);
        }
      }
    };

    if (code) {
      handleCallback();
    }
  }, [code, provider, login, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            {status === 'loading' && (
              <>
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <h2 className="text-xl font-bold text-center">Signing you in</h2>
              </>
            )}
            {status === 'success' && (
              <>
                <CheckCircle className="w-12 h-12 text-green-500" />
                <h2 className="text-xl font-bold text-center">Welcome!</h2>
              </>
            )}
            {status === 'error' && (
              <>
                <AlertCircle className="w-12 h-12 text-destructive" />
                <h2 className="text-xl font-bold text-center">Login Failed</h2>
              </>
            )}
            <p className="text-sm text-muted-foreground text-center">{message || error}</p>
            {status === 'error' && (
              <div className="w-full space-y-2">
                <button
                  onClick={() => router.push('/login')}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
                >
                  Back to Sign In
                </button>
                <button
                  onClick={() => router.push('/register')}
                  className="w-full px-4 py-2 border border-border rounded-md hover:bg-muted"
                >
                  Create New Account
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
