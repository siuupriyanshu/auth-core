'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, APIError } from '@/lib/api-client';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function GoogleOAuthPage() {
  const router = useRouter();

  useEffect(() => {
    const initiateGoogleAuth = async () => {
      try {
        const response = await authAPI.getGoogleAuthUrl();
        // Redirect to Google's OAuth consent screen
        window.location.href = response.authUrl;
      } catch (err) {
        console.error('Failed to initiate Google OAuth:', err);
        router.push('/login?error=oauth_failed');
      }
    };

    initiateGoogleAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <h2 className="text-xl font-bold text-center">Redirecting to Google</h2>
            <p className="text-sm text-muted-foreground text-center">
              You will be redirected to sign in with your Google account...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
