'use client';

import React, { Suspense } from 'react';
import { GuestRoute } from '@/components/common/GuestRoute';
import { AuthCard } from '@/components/auth/AuthCard';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAppSelector } from '@/store/hooks';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { error } = useAppSelector((state) => state.auth);

  return (
    <GuestRoute redirectTo="/">
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md">
          <AuthCard
            title="CMS Portal"
            subtitle="Enter your authorized credentials to access management modules"
            badge="CMS • Security Layer"
            error={error}
            footer={
              <div className="space-y-2">
                <p className="text-xs text-slate-500">
                  Don&apos;t have an account?{' '}
                  <a href="/register" className="text-primary-600 font-medium hover:underline">
                    Register employee profile
                  </a>
                </p>
                <div className="flex justify-center gap-4 text-xs font-medium text-slate-500 pt-1">
                  <span>CMS Web v1.0</span>
                  <span>•</span>
                  <a
                    href="#support"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('IT Support Contact: support@cms.local');
                    }}
                    className="text-slate-600 hover:text-slate-800 hover:underline"
                  >
                    IT Help Desk
                  </a>
                </div>
              </div>
            }
          >
            <Suspense fallback={<div className="flex justify-center p-6"><Loader2 className="w-6 h-6 animate-spin text-primary-600" /></div>}>
              <LoginForm redirectPath="/" />
            </Suspense>
          </AuthCard>
        </div>
      </main>
    </GuestRoute>
  );
}
