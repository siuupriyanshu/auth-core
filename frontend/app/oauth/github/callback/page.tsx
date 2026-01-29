import { OAuthCallbackHandler } from '@/components/auth/oauth-callback-handler';

export const metadata = {
  title: 'GitHub Sign In | Multi-Tenant Auth',
  description: 'Processing your GitHub authentication',
};

export default function GitHubCallbackPage() {
  return <OAuthCallbackHandler provider="github" />;
}
