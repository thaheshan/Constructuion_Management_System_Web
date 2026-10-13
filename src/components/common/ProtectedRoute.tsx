'use client';

/**
 * ARCHITECTURAL NOTICE - CLIENT-SIDE UX GUARD ONLY:
 * ProtectedRoute and GuestRoute are client-side UX guards designed to provide seamless
 * visual transitions and user feedback. They are NOT a substitute for server-side security.
 * Production enforcement must be implemented via Next.js middleware (middleware.ts) validating
 * an httpOnly session cookie, and backed by Spring Boot / server API authorization filters.
 * Tokens held only in Redux memory reset on page reload and must not be placed in localStorage.
 */

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { UserRole } from '@/types/auth';
import { Loader2, ShieldAlert, AlertTriangle } from 'lucide-react';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackUrl?: string;
  allowedRoles?: UserRole[];
  unauthorizedUrl?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallbackUrl = '/login',
  allowedRoles,
  unauthorizedUrl,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, role, user } = useAppSelector((state) => state.auth);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const userRole = role || (user?.role as UserRole | undefined);
  const isRoleAllowed = !allowedRoles || (userRole && allowedRoles.includes(userRole));

  useEffect(() => {
    if (isClient && !isLoading) {
      if (!isAuthenticated) {
        const target = pathname && pathname !== '/' ? `?redirect=${encodeURIComponent(pathname)}` : '';
        router.replace(`${fallbackUrl}${target}`);
      } else if (!isRoleAllowed && unauthorizedUrl) {
        router.replace(unauthorizedUrl);
      }
    }
  }, [isClient, isLoading, isAuthenticated, isRoleAllowed, router, fallbackUrl, unauthorizedUrl, pathname]);

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

  // Authenticated but role not allowed: display clear RBAC access denied message
  if (!isRoleAllowed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-600 p-4">
        <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white border border-red-200 shadow-sm max-w-md text-center">
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Access Restricted</h3>
            <p className="text-xs text-slate-500 mt-1">
              Your account role <span className="font-semibold text-slate-800">({userRole || 'UNKNOWN'})</span> does not have permission to view this module.
            </p>
            {allowedRoles && (
              <p className="text-[11px] text-slate-400 mt-2">
                Allowed roles: {allowedRoles.join(', ')}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="px-4 py-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
