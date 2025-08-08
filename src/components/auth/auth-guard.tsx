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
  fallback = <div>Loading...</div>
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
          router.push(redirectTo);
          return;
        }

        if (!hasRole(currentUser, allowedRoles)) {
          router.push('/unauthorized');
          return;
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push(redirectTo);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [allowedRoles, redirectTo, router]);

  if (isLoading) {
    return fallback;
  }

  if (!user || !hasRole(user, allowedRoles)) {
    return null;
  }

  return <>{children}</>;
}