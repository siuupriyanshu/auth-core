'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { Shield, Lock, Users, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-foreground">AuthHub</h1>
            <div className="flex gap-4">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button>Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline">Sign In</Button>
                  </Link>
                  <Link href="/register">
                    <Button>Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Enterprise-Grade Authentication
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A comprehensive multi-tenant authentication system with JWT tokens, two-factor authentication, OAuth integration, and role-based access control.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg">
                Get Started <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Shield,
              title: 'Multi-Tenant Architecture',
              description: 'Secure isolation of user data across multiple tenants with subdomain routing',
            },
            {
              icon: Lock,
              title: 'Two-Factor Authentication',
              description: 'TOTP-based 2FA with QR codes and backup codes for enhanced security',
            },
            {
              icon: Users,
              title: 'OAuth 2.0 Integration',
              description: 'Social login with Google and GitHub for seamless user onboarding',
            },
            {
              icon: Zap,
              title: 'JWT-Based Sessions',
              description: 'Secure token-based authentication with automatic refresh and expiration',
            },
            {
              icon: Shield,
              title: 'Role-Based Access Control',
              description: 'Fine-grained permission management with role hierarchies',
            },
            {
              icon: Lock,
              title: 'Email Verification',
              description: 'Secure email verification with time-limited tokens',
            },
          ].map((feature, i) => (
            <Card key={i} className="border border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Authentication Flow */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-foreground mb-8">Authentication Flow</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { number: '1', title: 'Registration', desc: 'Create account with email & tenant ID' },
              { number: '2', title: 'Email Verification', desc: 'Verify email with secure link' },
              { number: '3', title: 'Login', desc: 'Authenticate with credentials or OAuth' },
              { number: '4', title: '2FA Verification', desc: 'Confirm identity with authenticator' },
            ].map((step, i) => (
              <div key={i} className="relative">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4">
                        {step.number}
                      </div>
                      <h4 className="font-semibold text-foreground mb-2">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                    </div>
                  </CardContent>
                </Card>
                {i < 3 && (
                  <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-[calc(100%+8px)]">
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* API Documentation */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-foreground mb-8">API Integration Points</h3>
          <Card>
            <CardHeader>
              <CardTitle>Backend API Requirements</CardTitle>
              <CardDescription>
                This frontend connects to a Node.js/Express backend exposing these endpoints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { method: 'POST', endpoint: '/api/register', desc: 'User registration' },
                  { method: 'POST', endpoint: '/api/login', desc: 'User login' },
                  { method: 'POST', endpoint: '/api/verify-email', desc: 'Verify email address' },
                  { method: 'POST', endpoint: '/api/forgot-password', desc: 'Request password reset' },
                  { method: 'POST', endpoint: '/api/reset-password', desc: 'Reset password with token' },
                  { method: 'POST', endpoint: '/api/2fa/setup', desc: 'Setup two-factor authentication' },
                  { method: 'POST', endpoint: '/api/2fa/verify', desc: 'Verify 2FA code' },
                  { method: 'POST', endpoint: '/api/oauth/google/auth-url', desc: 'Get Google OAuth URL' },
                  { method: 'POST', endpoint: '/api/oauth/google/callback', desc: 'Handle Google callback' },
                  { method: 'POST', endpoint: '/api/oauth/github/auth-url', desc: 'Get GitHub OAuth URL' },
                  { method: 'POST', endpoint: '/api/oauth/github/callback', desc: 'Handle GitHub callback' },
                  { method: 'POST', endpoint: '/api/refresh-token', desc: 'Refresh JWT token' },
                ].map((api, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 bg-muted rounded-lg">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {api.method}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-mono font-medium text-foreground">{api.endpoint}</p>
                      <p className="text-xs text-muted-foreground">{api.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Getting Started */}
        <section>
          <h3 className="text-2xl font-bold text-foreground mb-8">Getting Started</h3>
          <Card>
            <CardContent className="pt-6">
              <ol className="space-y-4">
                {[
                  'Install dependencies: npm install',
                  'Set NEXT_PUBLIC_API_URL environment variable to your backend API',
                  'Run the development server: npm run dev',
                  'Visit http://localhost:3000 and create an account',
                  'Verify your email and complete 2FA setup',
                  'Access the dashboard and admin features',
                ].map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                    </div>
                    <span className="text-sm text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </section>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-sm text-muted-foreground">
            <p>Multi-Tenant Authentication System - Built with Next.js and React</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
