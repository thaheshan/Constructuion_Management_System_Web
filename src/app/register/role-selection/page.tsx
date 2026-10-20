'use client';

import React, { useState } from 'react';
import { GuestRoute } from '@/components/common/GuestRoute';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { RoleSelectionScreen } from '@/components/auth/RoleSelectionScreen';
import { SupportModal, SupportModalType } from '@/components/auth/SupportModal';

export default function RoleSelectionPage() {
  const [supportModal, setSupportModal] = useState<SupportModalType | null>(null);

  return (
    <GuestRoute redirectTo="/">
      <div className="min-h-screen flex flex-col bg-[#f8f8f8]">
        {/* Common Auth Header */}
        <AuthHeader onOpenHelp={() => setSupportModal('help')} />

        {/* Role Selection Content */}
        <RoleSelectionScreen />

        {/* Support Modal */}
        <SupportModal
          type={supportModal}
          onClose={() => setSupportModal(null)}
        />
      </div>
    </GuestRoute>
  );
}
