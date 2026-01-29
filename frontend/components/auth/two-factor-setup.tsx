'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { twoFactorSchema, TwoFactorFormData } from '@/lib/validation';
import { authAPI, APIError } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Loader2, Copy } from 'lucide-react';
import Image from 'next/image';

export const TwoFactorSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [setupData, setSetupData] = useState<{ qrCode: string; secret: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<'initial' | 'verify'>('initial');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TwoFactorFormData>({
    resolver: zodResolver(twoFactorSchema),
  });

  const handleSetup = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await authAPI.setupTwoFactor();
      setSetupData(data);
      setStep('verify');
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('Failed to setup 2FA. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: TwoFactorFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.verifyTwoFactor(data.code);
      if (response.verified) {
        setVerified(true);
        setTimeout(() => {
          window.location.href = '/settings/security';
        }, 2000);
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

  const copyToClipboard = async () => {
    if (setupData?.secret) {
      await navigator.clipboard.writeText(setupData.secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (verified) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
            <h2 className="text-xl font-bold text-center">Two-Factor Authentication Enabled</h2>
            <p className="text-sm text-muted-foreground text-center">
              Your account is now protected with 2FA. Redirecting...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'verify' && setupData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Verify 2FA Setup</CardTitle>
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

            <div className="space-y-3">
              <p className="text-sm font-medium">Enter your backup key (keep it safe):</p>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md font-mono text-sm break-all">
                <span>{setupData.secret}</span>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="ml-auto flex-shrink-0"
                >
                  <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
              {copied && (
                <p className="text-xs text-green-600 dark:text-green-400">Copied to clipboard!</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="code" className="block text-sm font-medium">
                Enter 6-digit Code
              </label>
              <Input
                id="code"
                placeholder="000000"
                maxLength={6}
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
                'Verify & Enable 2FA'
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => setStep('initial')}
              disabled={isLoading}
            >
              Start Over
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Up Two-Factor Authentication</CardTitle>
        <CardDescription>
          Add an extra layer of security to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {setupData?.qrCode ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Scan this QR code with your authenticator app (Google Authenticator, Authy, Microsoft Authenticator, etc.)
              </p>
              <div className="flex justify-center">
                <div className="w-40 h-40 bg-white p-2 rounded-lg">
                  <Image
                    src={setupData.qrCode || "/placeholder.svg"}
                    alt="2FA QR Code"
                    width={160}
                    height={160}
                    className="w-full h-full"
                  />
                </div>
              </div>
              <Button
                onClick={() => setStep('verify')}
                className="w-full"
              >
                I've Scanned the Code
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You'll need an authenticator app such as Google Authenticator, Authy, or Microsoft Authenticator.
              </p>
              <Button
                onClick={handleSetup}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Set Up Authenticator'
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
