'use client';

import React from 'react';
import Link from 'next/link';
import { GuestRoute } from '@/components/common/GuestRoute';
import { AuthCard } from '@/components/auth/AuthCard';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useAppSelector } from '@/store/hooks';

export default function RegisterPage() {
  const { error } = useAppSelector((state) => state.auth);

  return (
    <GuestRoute redirectTo="/">
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md">
          <AuthCard
            title="Create Account"
            subtitle="Register an employee profile on the Quick Stop platform"
            badge="Quick Stop • Registration"
            error={error}
            footer={
              <div className="space-y-2">
                <p className="text-xs text-slate-500">
                  Already have an authorized account?{' '}
                  <Link href="/login" className="text-primary-600 font-medium hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            }
          >
            <RegisterForm redirectPath="/" />
          </AuthCard>
        </div>
      </main>
    </GuestRoute>
  );
}
