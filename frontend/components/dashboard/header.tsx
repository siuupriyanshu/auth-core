'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, User } from 'lucide-react';
import Link from 'next/link';

export const DashboardHeader = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold text-foreground">
              Workspace
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/settings/profile"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Settings
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm">
              <p className="font-medium text-foreground">{user?.email}</p>
              <p className="text-muted-foreground capitalize">{user?.role}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/settings/profile">
                <Button variant="ghost" size="sm">
                  <User className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
