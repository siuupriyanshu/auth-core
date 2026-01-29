'use client';

import { useAuth } from './auth-context';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
  requiredPermissions?: string[];
  fallback?: ReactNode;
}

export const ProtectedRoute = ({
  children,
  requiredRole,
  requiredPermissions = [],
  fallback,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user, hasRole, hasPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return fallback || <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  // Check role-based access
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">
            You do not have the required role to access this page.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Check permission-based access
  const hasAllPermissions = requiredPermissions.every(perm => hasPermission(perm));
  if (requiredPermissions.length > 0 && !hasAllPermissions) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Insufficient Permissions</h1>
          <p className="text-muted-foreground mb-4">
            You do not have the required permissions to access this page.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);
