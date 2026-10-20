'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GuestRoute } from '@/components/common/GuestRoute';
import { CreateAccountHeroPanel } from '@/components/auth/CreateAccountHeroPanel';
import { CreateAccountForm } from '@/components/auth/CreateAccountForm';
import { TopUtilityBar } from '@/components/auth/TopUtilityBar';
import { SupportModal, SupportModalType } from '@/components/auth/SupportModal';
import { Loader2 } from 'lucide-react';

export default function CreateAccountPage() {
  const [supportModal, setSupportModal] = useState<SupportModalType | null>(null);

  return (
    <GuestRoute redirectTo="/">
      <main className="min-h-screen w-full flex flex-col lg:flex-row bg-[#121927] lg:bg-slate-50 font-sans">
        {/* ── Left Hero Panel (Desktop) ── */}
        <CreateAccountHeroPanel className="hidden lg:flex w-full lg:w-[48%] xl:w-1/2 flex-shrink-0" />

        {/* ── Mobile Top Section (Header + Titles) ── */}
        <div className="lg:hidden bg-[#121927] text-white px-6 pt-6 pb-12 flex flex-col justify-between">
          {/* Mobile Top Header: Logo + Utilities */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/login" className="flex items-center gap-3 select-none">
              <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 shadow-md shadow-orange-500/20">
                <Image
                  src="/images/Background.png"
                  alt="Futura Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[15px] font-black tracking-wider uppercase text-white">
                  FUTURA
                </span>
                <span className="text-[9px] font-bold tracking-[0.22em] text-futura-500 uppercase mt-0.5">
                  CONSTRUCTIONS
                </span>
              </div>
            </Link>

            <TopUtilityBar
              variant="mobile-top"
              onOpenHelp={() => setSupportModal('help')}
            />
          </div>

          {/* Mobile Title & Subtitle */}
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Create Account
            </h1>
            <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">
              Join Futura to manage your job sites and labor.
            </p>
          </div>
        </div>

        {/* ── Right Form Container (Desktop & Mobile Card) ── */}
        <section className="w-full lg:w-[52%] xl:w-1/2 flex-1 flex flex-col justify-between bg-white lg:bg-slate-50 rounded-t-[32px] lg:rounded-none shadow-2xl lg:shadow-none -mt-6 lg:mt-0 relative z-20">
          {/* Desktop Top Right: System Status & Language Bar */}
          <div className="hidden lg:flex justify-end items-center p-6 xl:px-12">
            <TopUtilityBar
              variant="desktop"
              onOpenHelp={() => setSupportModal('help')}
            />
          </div>

          {/* Form Card Container */}
          <div className="my-auto w-full max-w-md mx-auto px-6 sm:px-8 py-8 lg:py-6">
            <div className="bg-white lg:rounded-3xl lg:shadow-xl lg:shadow-slate-200/60 lg:border lg:border-slate-100 lg:p-10 transition-all">
              <Suspense
                fallback={
                  <div className="flex justify-center items-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-futura-500" />
                  </div>
                }
              >
                <CreateAccountForm redirectPath="/" />
              </Suspense>
            </div>
          </div>

          {/* Desktop Footer Space */}
          <div className="hidden lg:block py-3 text-center text-[10px] text-slate-400">
            Futura Construction Management System • Enterprise Security Layer v2.1
          </div>
        </section>

        {/* Support Modal */}
        <SupportModal
          type={supportModal}
          onClose={() => setSupportModal(null)}
        />
      </main>
    </GuestRoute>
  );
}
