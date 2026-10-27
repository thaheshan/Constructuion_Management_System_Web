'use client';

import React, { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setStep,
  restoreDraft,
} from '@/store/slices/ownerOnboardingSlice';
import { OwnerOnboardingHeader } from '@/components/auth/owner-onboarding/OwnerOnboardingHeader';
import { OnboardingProgressBar } from '@/components/auth/owner-onboarding/OnboardingProgressBar';
import { OwnerStep1YourDetails } from '@/components/auth/owner-onboarding/OwnerStep1YourDetails';
import { OwnerStep2CompanyDetails } from '@/components/auth/owner-onboarding/OwnerStep2CompanyDetails';
import { OwnerStep3VerifyOtp } from '@/components/auth/owner-onboarding/OwnerStep3VerifyOtp';
import { OwnerStep5CompanyReady } from '@/components/auth/owner-onboarding/OwnerStep5CompanyReady';
import { Sparkles, ArrowLeft, ArrowRight, RefreshCw, X } from 'lucide-react';

function OwnerOnboardingWizardContent() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const currentStep = useAppSelector((state) => state.ownerOnboarding.currentStep);

  const [draftBannerVisible, setDraftBannerVisible] = useState(false);
  const [savedDraftData, setSavedDraftData] = useState<any>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Initialize step from URL on initial mount only
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      const stepParam = searchParams.get('step');
      if (stepParam) {
        const parsed = parseInt(stepParam, 10);
        if (parsed >= 1 && parsed <= 5 && parsed !== currentStep) {
          dispatch(setStep(parsed));
        }
      }
    }
  }, [searchParams, dispatch, currentStep]);

  // Handle browser back and forward button events smoothly
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const step = parseInt(params.get('step') || '1', 10);
      if (step >= 1 && step <= 5) {
        dispatch(setStep(step));
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [dispatch]);

  // Keep browser URL cleanly in sync with currentStep without triggering App Router remount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.get('step') !== String(currentStep)) {
        url.searchParams.set('step', String(currentStep));
        window.history.replaceState(null, '', url.toString());
      }
    }
  }, [currentStep]);

  // Check for saved draft on initial mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const rawDraft = localStorage.getItem('futura_owner_onboarding_draft');
        if (rawDraft) {
          const parsed = JSON.parse(rawDraft);
          if (parsed && (parsed.ownerDetails?.fullName || parsed.companyDetails?.companyName)) {
            setSavedDraftData(parsed);
            setDraftBannerVisible(true);
          }
        }
      } catch (e) {
        console.error('Failed to parse draft from localStorage', e);
      }
    }
  }, []);

  const handleApplyDraft = () => {
    if (savedDraftData) {
      dispatch(restoreDraft(savedDraftData));
      setDraftBannerVisible(false);
    }
  };

  const handleDismissDraft = () => {
    setDraftBannerVisible(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      {/* Top Navbar */}
      <OwnerOnboardingHeader
        isHelpOpen={isHelpOpen}
        onOpenHelp={() => setIsHelpOpen(true)}
        onCloseHelp={() => setIsHelpOpen(false)}
      />

      {/* Main Container */}
      <main className="flex-1 w-full mx-auto px-4 py-8 sm:py-10 max-w-2xl transition-all duration-150">
        {/* Saved Draft Detected Banner */}
        {draftBannerVisible && (
          <div className="mb-5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 shadow-sm flex items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                  Saved Draft Found
                </p>
                <p className="text-xs text-amber-800">
                  You have an unfinished onboarding session. Would you like to resume?
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleApplyDraft}
                className="px-3 py-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Restore
              </button>
              <button
                type="button"
                onClick={handleDismissDraft}
                className="p-1 rounded-lg text-amber-700 hover:text-amber-900 transition cursor-pointer"
                aria-label="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Horizontal Progress Bar */}
        <OnboardingProgressBar currentStep={currentStep} totalSteps={5} />

        {/* Step Views */}
        {currentStep === 1 && (
          <OwnerStep1YourDetails onOpenHelp={() => setIsHelpOpen(true)} />
        )}
        {currentStep === 2 && (
          <OwnerStep2CompanyDetails onOpenHelp={() => setIsHelpOpen(true)} />
        )}
        {currentStep === 3 && (
          <OwnerStep3VerifyOtp onOpenHelp={() => setIsHelpOpen(true)} />
        )}

        {/* Step 4 Review & Plan Selection placeholder */}
        {currentStep === 4 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-futura-50 border border-futura-100 flex items-center justify-center text-futura-600 mx-auto shadow-sm">
              <Sparkles className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Review & Plan Selection
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Step 1 (Personal Details), Step 2 (Company Details), and Step 3 (Identity Verification) have been completed successfully. Confirm and proceed to complete your company setup.
            </p>
            <div className="pt-3 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  dispatch(setStep(3));
                  if (typeof window !== 'undefined') {
                    const url = new URL(window.location.href);
                    url.searchParams.set('step', '3');
                    window.history.pushState({}, '', url.toString());
                  }
                }}
                className="py-2.5 px-4 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Step 3 (Verify)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  dispatch(setStep(5));
                  if (typeof window !== 'undefined') {
                    const url = new URL(window.location.href);
                    url.searchParams.set('step', '5');
                    window.history.pushState({}, '', url.toString());
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="py-2.5 px-5 rounded-xl bg-futura-500 hover:bg-futura-600 active:bg-futura-700 text-white text-xs font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <span>Confirm & Complete Setup (Step 5)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Company Ready (FE-10) */}
        {currentStep === 5 && (
          <OwnerStep5CompanyReady onOpenHelp={() => setIsHelpOpen(true)} />
        )}
      </main>
    </div>
  );
}

export default function OwnerOnboardingWizardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-futura-500" />
        </div>
      }
    >
      <OwnerOnboardingWizardContent />
    </Suspense>
  );
}
