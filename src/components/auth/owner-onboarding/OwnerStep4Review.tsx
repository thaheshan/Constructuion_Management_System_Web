'use client';

import React from 'react';
import { useAppSelector } from '@/store/hooks';
import { useStepNavigation } from '@/hooks/useStepNavigation';
import { Sparkles, ArrowLeft, ArrowRight, User, Building2, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface OwnerStep4ReviewProps {
  onOpenHelp?: () => void;
}

export const OwnerStep4Review: React.FC<OwnerStep4ReviewProps> = () => {
  const { goToStep } = useStepNavigation();
  const { ownerDetails, companyDetails } = useAppSelector(
    (state) => state.ownerOnboarding
  );

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* ── Summary & Review Header ── */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/90 p-7 sm:p-9 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-futura-50 border border-futura-100 flex items-center justify-center text-futura-600 mx-auto shadow-sm">
          <Sparkles className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight">
          Review & Plan Selection
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Please review your details before completing setup. Identity verification (OTP) has been confirmed.
        </p>

        {/* ── Review Details Grid ── */}
        <div className="text-left pt-4 space-y-4">
          {/* Owner Identity Summary */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <User className="w-4 h-4 text-futura-600" />
              <span>Owner Account</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600">
              <div>
                <span className="font-semibold text-slate-700">Full Name:</span>{' '}
                {ownerDetails.fullName || 'Not provided'}
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{ownerDetails.email || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>+94 {ownerDetails.phone || 'Not provided'}</span>
              </div>
            </div>
          </div>

          {/* Company Details Summary */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-futura-600" />
              <span>Company Information</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600">
              <div>
                <span className="font-semibold text-slate-700">Company Name:</span>{' '}
                {companyDetails.companyName || 'Not provided'}
              </div>
              <div>
                <span className="font-semibold text-slate-700">Entity Type:</span>{' '}
                {companyDetails.businessType || 'Not provided'}
              </div>
              <div className="flex items-center gap-1.5 sm:col-span-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>
                  {[companyDetails.addressLine, companyDetails.city, companyDetails.district]
                    .filter(Boolean)
                    .join(', ') || 'No address provided'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Navigation Actions ── */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => goToStep(3)}
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Step 3 (Verify)</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => goToStep(5)}
            className="w-full sm:w-auto bg-futura-500 hover:bg-futura-600 text-white flex items-center justify-center gap-2 shadow-md"
          >
            <span>Confirm & Complete Setup (Step 5)</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
