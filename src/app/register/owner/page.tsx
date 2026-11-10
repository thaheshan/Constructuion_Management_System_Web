'use client';

import React, { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setStep,
  restoreDraft,
} from '@/store/slices/ownerOnboardingSlice';
import { GuestRoute } from '@/components/common/GuestRoute';
import { OwnerOnboardingHeader } from '@/components/auth/owner-onboarding/OwnerOnboardingHeader';
import { OnboardingProgressBar } from '@/components/auth/owner-onboarding/OnboardingProgressBar';
import { OwnerStep1YourDetails } from '@/components/auth/owner-onboarding/OwnerStep1YourDetails';
import { OwnerStep2CompanyDetails } from '@/components/auth/owner-onboarding/OwnerStep2CompanyDetails';
import { OwnerStep3VerifyOtp } from '@/components/auth/owner-onboarding/OwnerStep3VerifyOtp';
import { OwnerStep4Review } from '@/components/auth/owner-onboarding/OwnerStep4Review';
import { OwnerStep5CompanyReady } from '@/components/auth/owner-onboarding/OwnerStep5CompanyReady';
import { TOTAL_STEPS } from '@/config/onboardingSteps';
import {
  loadValidDraft,
  clearOnboardingDraft,
  OwnerOnboardingDraft,
} from '@/utils/draftStorage';
import { RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

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
  const maxAllowedStep = Math.min(TOTAL_STEPS, Math.max(1, furthestStepCompleted + 1));

  // Initialize step from URL on initial mount once
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      const rawParam = searchParams.get('step');
      const clampedTarget = clampStep(rawParam, maxAllowedStep);
      if (clampedTarget > 1) {
        dispatch(setStep(clampedTarget));
      }
    }
  }, [searchParams, dispatch, maxAllowedStep]);

  // Handle browser back and forward button events smoothly
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const rawParam = params.get('step');
      const targetStep = clampStep(rawParam, maxAllowedStep);
      dispatch(setStep(targetStep));

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

  // Check for saved draft on initial mount
  useEffect(() => {
    const draft = loadValidDraft();
    if (draft) {
      setSavedDraftData(draft);
      setDraftBannerVisible(true);
    }
  }, []);

  const handleApplyDraft = () => {
    if (savedDraftData) {
      dispatch(
        restoreDraft({
          currentStep: savedDraftData.currentStep,
          furthestStepCompleted: savedDraftData.furthestStepCompleted ?? 1,
          ownerDetails: savedDraftData.ownerDetails,
          companyDetails: savedDraftData.companyDetails,
        })
      );
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <OwnerOnboardingHeader
        isHelpOpen={isHelpOpen}
        onOpenHelp={() => setIsHelpOpen(true)}
        onCloseHelp={() => setIsHelpOpen(false)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 pt-6 pb-16">
        {/* Unfinished Draft Resume Banner */}
        {draftBannerVisible && savedDraftData && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4 animate-fadeIn shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-amber-900">
                  You have an unfinished onboarding session
                </p>
                <p className="text-[11px] text-amber-700">
                  Resume from step {savedDraftData.currentStep} with your saved details.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleApplyDraft}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold"
              >
                Resume
              </Button>
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
        <OnboardingProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

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
        {currentStep === 4 && (
          <OwnerStep4Review onOpenHelp={() => setIsHelpOpen(true)} />
        )}
        {currentStep === 5 && (
          <OwnerStep5CompanyReady onOpenHelp={() => setIsHelpOpen(true)} />
        )}
      </main>
    </div>
  );
}

export default function OwnerOnboardingWizardPage() {
  return (
    <GuestRoute redirectTo="/">
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-futura-500" />
          </div>
        }
      >
        <OwnerOnboardingWizardContent />
      </Suspense>
    </GuestRoute>
  );
}
