'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GuestRoute } from '@/components/common/GuestRoute';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/register/role-selection');
  }, [router]);

  return (
    <GuestRoute redirectTo="/">
      {/* Redirecting to role selection... */}
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8]" />
    </GuestRoute>
  );
}
