'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { saveDraftSuccess } from '@/store/slices/ownerOnboardingSlice';
import { useStepNavigation } from '@/hooks/useStepNavigation';
import {
  validateOwnerStep2,
  validateOwnerStep2Field,
} from '@/utils/validators';
import { BusinessInfoSection } from './step2/BusinessInfoSection';
import { CompanyAddressSection } from './step2/CompanyAddressSection';
import { TaxStatutorySection } from './step2/TaxStatutorySection';
import { PreferencesBrandingSection } from './step2/PreferencesBrandingSection';
import { SaveDraftModal } from './SaveDraftModal';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, ArrowRight, Bookmark, HelpCircle } from 'lucide-react';
import { CompanyDetails } from '@/types/onboarding';

interface OwnerStep2CompanyDetailsProps {
  onOpenHelp?: () => void;
}

export const OwnerStep2CompanyDetails: React.FC<OwnerStep2CompanyDetailsProps> = ({
  onOpenHelp,
}) => {
  const dispatch = useAppDispatch();
  const { goToStep } = useStepNavigation();
  const companyDetails = useAppSelector(
    (state) => state.ownerOnboarding.companyDetails
  );
  const ownerDetails = useAppSelector(
    (state) => state.ownerOnboarding.ownerDetails
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [savedTimestamp, setSavedTimestamp] = useState<string | null>(null);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldError = validateOwnerStep2Field(
      field as keyof CompanyDetails,
      companyDetails[field as keyof CompanyDetails]
    );
    setErrors((prev) => {
      const next = { ...prev };
      if (fieldError) {
        next[field] = fieldError;
      } else {
        delete next[field];
      }
      return next;
    });
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateOwnerStep2(companyDetails);
    setErrors(validationErrors);

    // Mark ALL fields as touched on submit so errors stay visible
    setTouched({
      companyName: true,
      businessType: true,
      businessRegNo: true,
      companyPhone: true,
      companyEmail: true,
      addressLine: true,
      city: true,
      district: true,
      vatTinNumber: true,
    });

    if (Object.keys(validationErrors).length === 0) {
      goToStep(3);
    }
  };

  const handleSaveDraft = () => {
    if (typeof window !== 'undefined') {
      try {
        const draftPayload = {
          ownerDetails: {
            fullName: ownerDetails.fullName,
            email: ownerDetails.email,
            phonePrefix: ownerDetails.phonePrefix,
            phone: ownerDetails.phone,
            agreedToTerms: ownerDetails.agreedToTerms,
          },
          companyDetails,
          currentStep: 2,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem(
          'futura_owner_onboarding_draft',
          JSON.stringify(draftPayload)
        );
        dispatch(saveDraftSuccess());
        setSavedTimestamp(
          new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        );
        setShowDraftModal(true);
      } catch (err) {
        console.error('Failed to save draft to localStorage', err);
      }
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/90 p-7 sm:p-9">
        {/* ── Header ── */}
        <div className="mb-6">
          <span className="text-[11px] font-bold text-futura-600 tracking-wider uppercase mb-1 block">
            Step 2 of 5
          </span>
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight">
            Company Details
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            Enter your construction firm or business details to set up your organization workspace.
          </p>
        </div>

        {/* ── Form Sections ── */}
        <form onSubmit={handleContinue} className="space-y-6" noValidate>
          <BusinessInfoSection
            errors={errors}
            touched={touched}
            onBlur={handleBlur}
          />

          <CompanyAddressSection
            errors={errors}
            touched={touched}
            onBlur={handleBlur}
          />

          <TaxStatutorySection
            errors={errors}
            touched={touched}
            onBlur={handleBlur}
          />

          <PreferencesBrandingSection />

          {/* ── Actions ── */}
          <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-futura-500 hover:bg-futura-600 active:bg-futura-700 text-white font-bold py-3.5 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue to Verification</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <div className="flex items-center justify-between gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => goToStep(1)}
                className="text-xs font-semibold text-slate-600 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </Button>

              <button
                type="button"
                onClick={handleSaveDraft}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition py-2 px-3 rounded-lg hover:bg-slate-100/80 cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                <span>Save and finish later</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Assistance Footer */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onOpenHelp}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Need help setting up your company profile?</span>
        </button>
      </div>

      {/* Save Draft Modal */}
      <SaveDraftModal
        isOpen={showDraftModal}
        savedTime={savedTimestamp}
        onClose={() => setShowDraftModal(false)}
      />
    </div>
  );
};
