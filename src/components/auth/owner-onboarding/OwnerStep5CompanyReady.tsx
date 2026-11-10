'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check,
  Copy,
  Share2,
  Info,
  KeyRound,
  CircleGauge,
  Plus,
  Shield,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';

interface OwnerStep5CompanyReadyProps {
  onOpenHelp?: () => void;
}

export const OwnerStep5CompanyReady: React.FC<OwnerStep5CompanyReadyProps> = ({
  onOpenHelp,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { ownerDetails, companyDetails, shopId } = useAppSelector(
    (state) => state.ownerOnboarding
  );

  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const displayShopId = shopId || 'FUT-7K4M-9Q2X';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayShopId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${companyDetails.companyName || 'Futura'} - Shop Access ID`,
      text: `Here is the Shop ID to join ${companyDetails.companyName || 'our company'} on Futura Constructions: ${displayShopId}`,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback if dismissed or unsupported
      }
    }

    try {
      await navigator.clipboard.writeText(
        `Futura Constructions Shop ID: ${displayShopId}`
      );
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    } catch {
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    }
  };

  const syncAuthState = () => {
    dispatch(
      setCredentials({
        user: {
          id: `usr_owner_${Date.now()}`,
          fullName: ownerDetails.fullName || 'Company Owner',
          email: ownerDetails.email || 'owner@futura.lk',
          role: 'OWNER',
          phone: ownerDetails.phone ? `+94${ownerDetails.phone}` : undefined,
          createdAt: new Date().toISOString(),
        },
        token: `cms_owner_token_${Date.now()}`,
      })
    );
  };

  const handleGoToDashboard = () => {
    syncAuthState();
    router.push('/');
  };

  const handleCreateFirstProject = () => {
    syncAuthState();
    router.push('/projects');
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 font-sans">
      {/* ── Card 1: Success Message Card ── */}
      <div className="bg-white rounded-lg border border-slate-200/90 shadow-sm p-8 sm:p-10 text-center flex flex-col items-center">
        {/* Figma Centered Green Badge with Rounded Light-Green Container & Box Shadow */}
        <div className="relative mb-5 flex items-center justify-center">
          <div className="w-20 h-20 rounded-[20px] bg-[#F0FDF4] flex items-center justify-center shadow-lg shadow-emerald-600/15">
            <div className="w-12 h-12 rounded-full bg-[#1E8E5A] flex items-center justify-center shadow-sm">
              <Check className="w-7 h-7 text-white stroke-[3]" />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-[30px] font-bold text-[#1B2430] tracking-tight mb-2">
          Your company is ready
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-[18px] text-[#475569] leading-relaxed max-w-lg">
          Share your Shop ID with your team so they can request access.
        </p>
      </div>

      {/* ── Card 2: Dark Navy Shop ID Card ── */}
      <div className="relative overflow-hidden bg-[#1B2430] rounded-lg shadow-lg p-6 sm:p-8 text-left">
        {/* Key Watermark in top-right */}
        <div className="absolute -top-3 -right-3 pointer-events-none select-none text-white/10 overflow-hidden">
          <KeyRound className="w-28 h-28 stroke-[1.5]" />
        </div>

        {/* "YOUR SHOP ID" Label */}
        <div className="text-[10px] sm:text-[11px] font-bold text-[#8B93A1] tracking-wider uppercase mb-3">
          YOUR SHOP ID
        </div>

        {/* Inner Box with Shop ID and Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:px-6 sm:py-5 rounded-lg bg-black/20 border border-white/10 mb-4">
          <div className="font-mono text-2xl sm:text-[34px] font-bold text-[#F5851F] tracking-[0.16em] select-all">
            {displayShopId}
          </div>

          <div className="flex items-center gap-3">
            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className="w-10 h-10 rounded bg-white/10 hover:bg-white/15 active:bg-white/20 transition cursor-pointer flex items-center justify-center relative group"
              title="Copy Shop ID"
              aria-label="Copy Shop ID"
            >
              {copied ? (
                <Check className="w-5 h-5 text-emerald-400 stroke-[2.5]" />
              ) : (
                <Copy className="w-5 h-5 text-white" />
              )}
              {copied && (
                <span className="absolute -top-8 px-2 py-0.5 rounded text-[11px] bg-emerald-600 text-white font-medium shadow-md whitespace-nowrap animate-fadeIn">
                  Copied!
                </span>
              )}
            </button>

            {/* Share Button */}
            <button
              type="button"
              onClick={handleShare}
              className="w-10 h-10 rounded bg-white/10 hover:bg-white/15 active:bg-white/20 transition cursor-pointer flex items-center justify-center relative group"
              title="Share Shop ID"
              aria-label="Share Shop ID"
            >
              {shared ? (
                <Check className="w-5 h-5 text-emerald-400 stroke-[2.5]" />
              ) : (
                <Share2 className="w-5 h-5 text-white" />
              )}
              {shared && (
                <span className="absolute -top-8 px-2 py-0.5 rounded text-[11px] bg-blue-600 text-white font-medium shadow-md whitespace-nowrap animate-fadeIn">
                  Link copied!
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Info Icon and Note */}
        <div className="flex items-start gap-2.5 text-xs sm:text-[14px] text-[#8B93A1] leading-relaxed">
          <Info className="w-4 h-4 text-[#8B93A1] flex-shrink-0 mt-0.5" />
          <p>
            Anyone with this ID can request access. Nobody gets access until you or a
            designated approver approves.
          </p>
        </div>
      </div>

      {/* ── Card 3: Next Steps Card ── */}
      <div className="bg-white rounded-lg border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-[#F8FAFC] border-b border-slate-200/90 px-6 sm:px-8 py-3.5 sm:py-4">
          <h3 className="text-xs sm:text-sm font-bold text-[#1B2430] uppercase tracking-wider">
            NEXT STEPS
          </h3>
        </div>

        {/* 4 Steps List */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Step 1 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[#F1F5F9] text-[#1B2430] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              1
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1B2430] leading-snug">
                Share Shop ID
              </h4>
              <p className="text-xs sm:text-[13px] text-[#64748B] mt-0.5 leading-normal">
                Send the ID to your engineers, storekeepers and project managers.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[#F1F5F9] text-[#1B2430] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              2
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1B2430] leading-snug">
                Approve requests
              </h4>
              <p className="text-xs sm:text-[13px] text-[#64748B] mt-0.5 leading-normal">
                Check your notifications to grant access to your team members.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[#F1F5F9] text-[#1B2430] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              3
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1B2430] leading-snug">
                Create first project
              </h4>
              <p className="text-xs sm:text-[13px] text-[#64748B] mt-0.5 leading-normal">
                Add a site location and assign project managers to get started.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[#F1F5F9] text-[#1B2430] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              4
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1B2430] leading-snug">
                Review settings
              </h4>
              <p className="text-xs sm:text-[13px] text-[#64748B] mt-0.5 leading-normal">
                Configure workflows, approval limits, and tax preferences.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Action Buttons (Stacked) ── */}
      <div className="pt-2 space-y-3.5">
        {/* Primary: Go to Owner Dashboard with Dashboard Gauge Icon */}
        <button
          type="button"
          onClick={handleGoToDashboard}
          className="w-full py-4 px-6 rounded-lg bg-[#F5851F] hover:bg-[#e07516] active:bg-[#c96510] text-[#1B2430] font-bold text-base transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Go to Owner Dashboard</span>
          <CircleGauge className="w-5 h-5 text-[#1B2430] flex-shrink-0" />
        </button>

        {/* Secondary: Create first project with Plus Icon */}
        <button
          type="button"
          onClick={handleCreateFirstProject}
          className="w-full py-3.5 px-6 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-[#1B2430] font-semibold text-base transition flex items-center justify-center gap-2 cursor-pointer bg-white"
        >
          <Plus className="w-4 h-4 text-[#1B2430] flex-shrink-0" />
          <span>Create first project</span>
        </button>
      </div>

      {/* ── Security Protocol Footer with Shield Icon ── */}
      <div className="mt-8 mb-4 flex items-center justify-center gap-2 text-xs font-medium text-[#94A3B8] tracking-wider uppercase select-none">
        <Shield
          className="w-3.5 h-4 text-[#94A3B8] cursor-pointer flex-shrink-0"
          onClick={onOpenHelp}
        />
        <span>ENTERPRISE-GRADE SECURITY PROTOCOL</span>
      </div>
    </div>
  );
};
