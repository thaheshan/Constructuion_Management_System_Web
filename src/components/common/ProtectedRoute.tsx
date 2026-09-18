'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { Loader2, ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackUrl?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallbackUrl = '/login',
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !isLoading && !isAuthenticated) {
      // Store attempted destination in redirect query
      const target = pathname && pathname !== '/' ? `?redirect=${encodeURIComponent(pathname)}` : '';
      router.replace(`${fallbackUrl}${target}`);
    }
  }, [isClient, isLoading, isAuthenticated, router, fallbackUrl, pathname]);

  // SSR or initial hydration loading state
  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-600">
        <div className="flex flex-col items-center gap-3 p-8 rounded-xl bg-white border border-slate-200 shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          <p className="text-sm font-medium text-slate-700">Verifying session security...</p>
        </div>
      </div>
    );
  }

  // Not authenticated: render fallback while router replaces page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-600">
        <div className="flex flex-col items-center gap-3 p-8 rounded-xl bg-white border border-slate-200 shadow-sm">
          <ShieldAlert className="w-8 h-8 text-amber-500" />
          <p className="text-sm font-medium text-slate-700">Redirecting to login portal...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
