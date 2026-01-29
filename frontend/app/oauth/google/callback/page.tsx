import { OAuthCallbackHandler } from '@/components/auth/oauth-callback-handler';

export const metadata = {
  title: 'Google Sign In | Multi-Tenant Auth',
  description: 'Processing your Google authentication',
};

export default function GoogleCallbackPage() {
  return <OAuthCallbackHandler provider="google" />;
}
