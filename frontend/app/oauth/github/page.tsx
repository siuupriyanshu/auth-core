'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, APIError } from '@/lib/api-client';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function GitHubOAuthPage() {
  const router = useRouter();

  useEffect(() => {
    const initiateGitHubAuth = async () => {
      try {
        const response = await authAPI.getGithubAuthUrl();
        // Redirect to GitHub's OAuth consent screen
        window.location.href = response.authUrl;
      } catch (err) {
        console.error('Failed to initiate GitHub OAuth:', err);
        router.push('/login?error=oauth_failed');
      }
    };

    initiateGitHubAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <h2 className="text-xl font-bold text-center">Redirecting to GitHub</h2>
            <p className="text-sm text-muted-foreground text-center">
              You will be redirected to sign in with your GitHub account...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
