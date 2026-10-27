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
import {
  loadValidDraft,
  clearOnboardingDraft,
  OwnerOnboardingDraft,
} from '@/utils/draftStorage';
import { Sparkles, ArrowLeft, RefreshCw, X } from 'lucide-react';

/**
 * Clamps requested steps against the furthest reachable completed step.
 * Non-numeric, zero or negative values fall back to step 1.
 */
function clampStep(rawStep: string | number | null | undefined, maxAllowed: number): number {
  if (rawStep === null || rawStep === undefined) return 1;
  const parsed = typeof rawStep === 'number' ? rawStep : parseInt(String(rawStep), 10);
  if (isNaN(parsed) || parsed < 1) return 1;
  return Math.min(parsed, maxAllowed);
}

function OwnerOnboardingWizardContent() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { currentStep, furthestStepCompleted } = useAppSelector(
    (state) => state.ownerOnboarding
  );

  const [draftBannerVisible, setDraftBannerVisible] = useState(false);
  const [savedDraftData, setSavedDraftData] = useState<OwnerOnboardingDraft | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Maximum step index the user is allowed to navigate to based on actual completions
  const maxAllowedStep = Math.min(5, Math.max(1, furthestStepCompleted + 1));

  // Guard flag to prevent URL-sync effect from running before initial param dispatch is applied
  const isInitialized = useRef(false);

  // 1. Dedicated one-time mount effect: initialize step from URL
  useEffect(() => {
    const rawParam = searchParams.get('step');
    const clampedTarget = clampStep(rawParam, maxAllowedStep);
    if (clampedTarget > 1) {
      dispatch(setStep(clampedTarget));
    }
    isInitialized.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Handle browser back / forward navigation cleanly with clamping
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const rawParam = params.get('step');
      const targetStep = clampStep(rawParam, maxAllowedStep);
      dispatch(setStep(targetStep));

      // Correct URL immediately if user attempted to jump beyond allowed step via forward history
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        if (url.searchParams.get('step') !== String(targetStep)) {
          url.searchParams.set('step', String(targetStep));
          window.history.replaceState(null, '', url.toString());
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [dispatch, maxAllowedStep]);

  // 3. Keep browser URL in sync with Redux currentStep without flickering on first render
  useEffect(() => {
    if (!isInitialized.current) return;
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.get('step') !== String(currentStep)) {
        url.searchParams.set('step', String(currentStep));
        window.history.replaceState(null, '', url.toString());
      }
    }
  }, [currentStep]);

  // 4. Check for validated, unexpired saved draft on mount
  useEffect(() => {
    const draft = loadValidDraft();
    if (draft) {
      setSavedDraftData(draft);
      setDraftBannerVisible(true);
    }
  }, []);

  const handleApplyDraft = () => {
    if (savedDraftData) {
      dispatch(restoreDraft(savedDraftData));
      setDraftBannerVisible(false);
      setSavedDraftData(null);
    }
  };

  const handleDismissDraft = () => {
    // Purge draft from storage when user dismisses banner to start fresh
    clearOnboardingDraft();
    setDraftBannerVisible(false);
    setSavedDraftData(null);
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

        {/* Step 4 & 5 Placeholders for subsequent stories */}
        {currentStep > 3 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-futura-50 border border-futura-100 flex items-center justify-center text-futura-600 mx-auto shadow-sm">
              <Sparkles className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {currentStep === 4 ? 'Review & Plan Selection' : 'Setup Complete'}
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Remaining onboarding steps will be available in an upcoming release.
            </p>
            <div className="pt-3 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => dispatch(setStep(3))}
                className="py-2 px-4 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Step 3 (Verify)</span>
              </button>
            </div>
          </div>
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
