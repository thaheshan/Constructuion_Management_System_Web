'use client';

import React, { useState, Suspense } from 'react';
import { GuestRoute } from '@/components/common/GuestRoute';
import { HeroPanel } from '@/components/auth/HeroPanel';
import { TopUtilityBar } from '@/components/auth/TopUtilityBar';
import { SignInForm } from '@/components/auth/SignInForm';
import { SmsOtpFlow } from '@/components/auth/SmsOtpFlow';
import { KioskTerminalView } from '@/components/auth/KioskTerminalView';
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal';
import { SupportModal, SupportModalType } from '@/components/auth/SupportModal';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [viewMode, setViewMode] = useState<'signin' | 'sms-otp' | 'kiosk'>('signin');
  const [prefilledIdentifier, setPrefilledIdentifier] = useState<string>('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [supportModal, setSupportModal] = useState<SupportModalType | null>(null);

  const handleSwitchToSmsOtp = (identifier?: string) => {
    if (identifier) setPrefilledIdentifier(identifier);
    setViewMode('sms-otp');
  };

  const handleForgotPassword = (identifier?: string) => {
    if (identifier) setPrefilledIdentifier(identifier);
    setForgotPasswordOpen(true);
  };

  return (
    <GuestRoute redirectTo="/">
      {/* If Kiosk Terminal mode is active, render the dedicated terminal experience */}
      {viewMode === 'kiosk' && (
        <KioskTerminalView onExit={() => setViewMode('signin')} redirectPath="/" />
      )}

      {/* Main Authentication Screen (Desktop 2-column + Mobile responsive) */}
      <main className="min-h-screen w-full flex flex-col lg:flex-row bg-[#121927] lg:bg-slate-50 font-sans">
        {/* Left Hero Panel: Desktop permanent half-screen, Mobile top banner */}
        <HeroPanel
          className="w-full lg:w-[48%] xl:w-1/2 flex-shrink-0"
          onOpenHelp={() => setSupportModal('help')}
        />

        {/* Right Section: Form Container */}
        <section className="w-full lg:w-[52%] xl:w-1/2 flex-1 flex flex-col justify-between bg-white lg:bg-slate-50 rounded-t-[32px] lg:rounded-none shadow-2xl lg:shadow-none -mt-4 lg:mt-0 relative z-20">
          {/* Desktop Top Utility Bar: Placed at the top right of the light area */}
          <div className="hidden lg:flex justify-end items-center p-6 xl:px-12">
            <TopUtilityBar
              variant="desktop"
              onOpenHelp={() => setSupportModal('help')}
            />
          </div>

          {/* Form Card Container */}
          <div className="my-auto w-full max-w-md mx-auto px-6 sm:px-8 py-8 lg:py-4">
            {/* Mobile Card Top: Online status + Language pill inside white container */}
            <div className="lg:hidden mb-6 pt-1">
              <TopUtilityBar variant="mobile-card" />
            </div>

            {/* Auth Form Box */}
            <div className="bg-white lg:rounded-2xl lg:shadow-xl lg:shadow-slate-200/60 lg:border lg:border-slate-100 lg:p-10 transition-all">
              <Suspense
                fallback={
                  <div className="flex justify-center items-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-futura-500" />
                  </div>
                }
              >
                {viewMode === 'signin' && (
                  <SignInForm
                    redirectPath="/"
                    onSwitchToSmsOtp={handleSwitchToSmsOtp}
                    onSwitchToKiosk={() => setViewMode('kiosk')}
                    onForgotPassword={handleForgotPassword}
                    onOpenHelp={() => setSupportModal('help')}
                    onOpenPrivacy={() => setSupportModal('privacy')}
                    onOpenLegal={() => setSupportModal('legal')}
                  />
                )}

                {viewMode === 'sms-otp' && (
                  <SmsOtpFlow
                    initialPhone={prefilledIdentifier}
                    onBackToPassword={() => setViewMode('signin')}
                    redirectPath="/"
                  />
                )}
              </Suspense>
            </div>
          </div>

          {/* Desktop Subtle Footer Spacer */}
          <div className="hidden lg:block py-3 text-center text-[10px] text-slate-400">
            Futura Construction Management System • Enterprise Security Layer v2.1
          </div>
        </section>

        {/* Modals for Forgot Password and Support */}
        <ForgotPasswordModal
          isOpen={forgotPasswordOpen}
          onClose={() => setForgotPasswordOpen(false)}
          initialIdentifier={prefilledIdentifier}
        />

        <SupportModal
          type={supportModal}
          onClose={() => setSupportModal(null)}
        />
      </main>
    </GuestRoute>
  );
}
