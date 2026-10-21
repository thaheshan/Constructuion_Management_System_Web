'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
import { Sparkles, ArrowLeft, RefreshCw, X } from 'lucide-react';

function OwnerOnboardingWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const currentStep = useAppSelector((state) => state.ownerOnboarding.currentStep);

  const [draftBannerVisible, setDraftBannerVisible] = useState(false);
  const [savedDraftData, setSavedDraftData] = useState<any>(null);

  // Synchronize step with searchParams if present
  useEffect(() => {
    const stepParam = searchParams.get('step');
    if (stepParam) {
      const parsed = parseInt(stepParam, 10);
      if (parsed >= 1 && parsed <= 5 && parsed !== currentStep) {
        dispatch(setStep(parsed));
      }
    }
  }, [searchParams, dispatch, currentStep]);

  // Sync back to URL when Redux step changes
  useEffect(() => {
    const currentParam = searchParams.get('step');
    if (String(currentStep) !== currentParam) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('step', String(currentStep));
      router.replace(`/register/owner?${params.toString()}`);
    }
  }, [currentStep, router, searchParams]);

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
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      {/* Top Navbar */}
      <OwnerOnboardingHeader />

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Saved Draft Detected Banner */}
        {draftBannerVisible && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 shadow-sm flex items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                  Saved Draft Found
                </p>
                <p className="text-xs text-amber-800">
                  You have an unfinished onboarding session from{' '}
                  <span className="font-semibold">
                    {savedDraftData?.lastSavedAt
                      ? new Date(savedDraftData.lastSavedAt).toLocaleDateString()
                      : 'earlier'}
                  </span>
                  . Would you like to resume?
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleApplyDraft}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Restore
              </button>
              <button
                type="button"
                onClick={handleDismissDraft}
                className="p-1.5 rounded-lg text-amber-700 hover:text-amber-900 transition cursor-pointer"
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
        {currentStep === 1 && <OwnerStep1YourDetails />}
        {currentStep === 2 && <OwnerStep2CompanyDetails />}
        {currentStep === 3 && <OwnerStep3VerifyOtp />}

        {/* Step 4 & 5 Placeholders for subsequent stories */}
        {currentStep > 3 && (
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 p-8 sm:p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-futura-50 border border-futura-100 flex items-center justify-center text-futura-600 mx-auto shadow-sm">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {currentStep === 4 ? 'Review & Plan Selection' : 'Setup Complete'}
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Step 1 (Personal Details), Step 2 (Company Details), and Step 3 (Identity Verification) have been completed successfully. Subsequent onboarding phases (FE-09 / FE-10) will continue from here.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => dispatch(setStep(3))}
                className="py-2.5 px-5 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold transition flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Step 3 (Verify)</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-200/60 bg-white">
        <p>
          &copy; {new Date().getFullYear()} Futura Constructions (Pvt) Ltd. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default function OwnerOnboardingWizardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-futura-500" />
        </div>
      }
    >
      <OwnerOnboardingWizardContent />
    </Suspense>
  );
}
