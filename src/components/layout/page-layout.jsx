'use client';

import { usePathname } from 'next/navigation';
import { LandingHeader } from '@/components/landing/header';
import { DashboardHeader } from '@/components/dashboard/header';
import { Footer } from '@/components/layout/footer';

export function PageLayout({ children }) {
  const pathname = usePathname();

  // Determine which layout to use
  const isAdminPath = pathname.startsWith('/admin');
  const isDashboardPath = pathname.startsWith('/dashboard') || pathname.startsWith('/profile');
  const isAuthPath = ['/login', '/signup', '/forgot-password', '/reset-password'].includes(pathname);
  const isExamPath = pathname.startsWith('/exam') || pathname.startsWith('/practice');
  
  const isFullScreen = isAuthPath || isExamPath;
  const isPublicPath = !isAdminPath && !isDashboardPath && !isFullScreen;

  // The Admin section handles its own layout entirely
  if (isAdminPath) {
    return <>{children}</>;
  }

  // Full-screen layouts have no shell
  if (isFullScreen) {
    return <main>{children}</main>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {isPublicPath && <LandingHeader />}
      {isDashboardPath && <DashboardHeader />}
      <main className="flex-grow">
        {children}
      </main>
      {isPublicPath && <Footer />}
    </div>
  );
}