'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, hasRole, type User, type UserRole } from '@/lib/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function AuthGuard({ 
  children, 
  allowedRoles = ['student', 'content_manager', 'admin', 'super_admin'],
  redirectTo = '/login',
  fallback = <div className="flex items-center justify-center min-h-screen"><div className="text-lg">Loading...</div></div>
}: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        if (!currentUser) {
          // In development, show a helpful message instead of redirecting
          if (process.env.NODE_ENV === 'development') {
            setIsLoading(false);
            return;
          }
          router.push(redirectTo);
          return;
        }

        if (!hasRole(currentUser, allowedRoles)) {
          router.push('/unauthorized');
          return;
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        if (process.env.NODE_ENV !== 'development') {
          router.push(redirectTo);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [allowedRoles, redirectTo, router]);

  if (isLoading) {
    return fallback;
  }

  // In development, show a helpful message if not authenticated
  if (!user && process.env.NODE_ENV === 'development') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">
            This page requires authentication. Use the development panel in the bottom-right corner to log in as different user types.
          </p>
          <div className="text-sm text-gray-500">
            <strong>Required roles:</strong> {allowedRoles.join(', ')}
          </div>
        </div>
      </div>
    );
  }

  if (!user || !hasRole(user, allowedRoles)) {
    return null;
  }

  return <>{children}</>;
}