'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, hasPurchasedProduct, hasPurchasedBundle } from '@/lib/auth';

export function OwnershipGuard({ 
  children, 
  productId,
  bundleId,
  redirectTo = '/tests',
  fallback = <div className="flex items-center justify-center min-h-screen"><div className="text-lg">Checking access...</div></div>
}) {
  const [user, setUser] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkOwnership = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        if (!currentUser) {
          // In development, show a helpful message instead of redirecting
          if (process.env.NODE_ENV === 'development') {
            setIsLoading(false);
            return;
          }
          router.push('/login');
          return;
        }

        // If no product or bundle ID is specified, just require authentication
        if (!productId && !bundleId) {
          setHasAccess(true);
          return;
        }

        // Check ownership of specific product or bundle
        let access = false;
        if (productId) {
          access = await hasPurchasedProduct(currentUser, productId);
        }
        if (bundleId && !access) {
          access = await hasPurchasedBundle(currentUser, bundleId);
        }
        
        setHasAccess(access);
        
        // If user doesn't have access, redirect to tests page
        if (!access) {
          router.push(redirectTo);
        }
      } catch (error) {
        console.error('Ownership check failed:', error);
        if (process.env.NODE_ENV !== 'development') {
          router.push(redirectTo);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkOwnership();
  }, [productId, bundleId, redirectTo, router]);

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
            <strong>Required product:</strong> {productId || 'None'}<br />
            <strong>Required bundle:</strong> {bundleId || 'None'}
          </div>
        </div>
      </div>
    );
  }

  // If user doesn't have access to the specific product/bundle
  if (user && !hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You need to purchase this {productId ? 'product' : 'bundle'} to access this content.
          </p>
          <button 
            onClick={() => router.push(redirectTo)}
            className="mt-4 bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded"
          >
            Browse Tests
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}