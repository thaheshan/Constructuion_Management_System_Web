'use client';

import React, { useState } from 'react';
import {
  User,
  Briefcase,
  Key,
  Settings,
  Check,
  ArrowRight,
  Shield,
  Loader2,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setStep,
  completeStep,
  setShopId,
} from '@/store/slices/ownerOnboardingSlice';
import { clearOnboardingDraft } from '@/utils/draftStorage';

interface OwnerStep4ReviewConfirmProps {
  onOpenHelp?: () => void;
}

export const OwnerStep4ReviewConfirm: React.FC<OwnerStep4ReviewConfirmProps> = ({
  onOpenHelp,
}) => {
  const dispatch = useAppDispatch();
  const { ownerDetails, companyDetails, shopId } = useAppSelector(
    (state) => state.ownerOnboarding
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format mobile phone with country code
  const formatPhone = (prefix?: string, phoneNum?: string) => {
    if (!phoneNum || !phoneNum.trim()) {
      return '+94 7X XXX 1234';
    }
    const clean = phoneNum.replace(/\s+/g, '');
    const pfx = prefix || '+94';
    if (clean.length === 9) {
      return `${pfx} ${clean.slice(0, 2)} ${clean.slice(2, 5)} ${clean.slice(5)}`;
    }
    return `${pfx} ${clean}`;
  };

  // Format full combined company address & district
  const formatAddress = () => {
    const parts = [
      companyDetails.addressLine?.trim(),
      companyDetails.city?.trim(),
      companyDetails.district?.trim(),
    ].filter(Boolean);

    if (parts.length > 0) {
      return parts.join(', ');
    }
    return '45/A High Level Rd, Colombo 05';
  };

  // Format currency
  const formatCurrency = (curr?: string) => {
    if (!curr || !curr.trim()) return 'Sri Lankan Rupee (LKR)';
    if (curr.includes('LKR') || curr.includes('Sri Lankan Rupee')) {
      return 'Sri Lankan Rupee (LKR)';
    }
    return curr;
  };

  // Format financial year start
  const formatFinancialYear = (fy?: string) => {
    if (!fy || !fy.trim()) return '1st April';
    if (fy === '1 April' || fy === '1st April') return '1st April';
    return fy;
  };

  // Format VAT number
  const formatVatNumber = () => {
    if (companyDetails.isVatRegistered) {
      if (companyDetails.vatTinNumber?.trim()) {
        const raw = companyDetails.vatTinNumber.trim();
        return raw.toUpperCase().startsWith('VAT-')
          ? raw
          : `VAT-${raw.replace(/^TIN-?/i, '')}`;
      }
      return 'VAT-11223344';
    }
    return companyDetails.vatTinNumber?.trim()
      ? companyDetails.vatTinNumber
      : 'VAT-11223344';
  };

  // Navigation handlers
  const handleEditOwnerAccount = () => {
    dispatch(setStep(1));
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleEditCompanyDetails = () => {
    dispatch(setStep(2));
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    dispatch(setStep(3));
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCreateCompany = async () => {
    setIsSubmitting(true);
    try {
      // Simulate company creation / provisioning call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Generate and persist Shop ID if not already defined
      if (!shopId) {
        const generatedShopId = `FUT-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        dispatch(setShopId(generatedShopId));
      }

      // Purge onboarding draft from localStorage upon successful company creation
      clearOnboardingDraft();

      // Complete Step 4 and advance to Step 5 (Company Ready)
      dispatch(completeStep(4));
      dispatch(setStep(5));
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 font-sans">
      {/* ── Title & Subtitle ── */}
      <div className="text-center pt-1 pb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1B2430] tracking-tight">
          Review and confirm
        </h1>
        <p className="text-sm sm:text-base text-slate-500 mt-2 font-normal">
          Check your details before creating your company.
        </p>
      </div>

      {/* ── Card 1: Owner Account Summary ── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-5">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            <h2 className="text-xs sm:text-[13px] font-bold text-[#1B2430] uppercase tracking-wider">
              OWNER ACCOUNT
            </h2>
          </div>
          <button
            type="button"
            onClick={handleEditOwnerAccount}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition cursor-pointer"
            aria-label="Edit Owner Account"
          >
            Edit
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
          {/* Full Name */}
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              FULL NAME
            </span>
            <span className="block text-sm font-semibold text-[#1B2430]">
              {ownerDetails.fullName?.trim() || 'John Alexander Perera'}
            </span>
          </div>

          {/* Role Badge */}
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              ROLE
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide bg-blue-100 text-blue-700">
              OWNER
            </span>
          </div>

          {/* Email */}
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              EMAIL
            </span>
            <span className="block text-sm font-medium text-slate-800 break-all">
              {ownerDetails.email?.trim() || 'j.perera@futuraconst.com'}
            </span>
          </div>

          {/* Mobile */}
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              MOBILE
            </span>
            <span className="block text-sm font-medium text-slate-800 font-mono">
              {formatPhone(ownerDetails.phonePrefix, ownerDetails.phone)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Card 2: Company Details Summary ── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-5">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <h2 className="text-xs sm:text-[13px] font-bold text-[#1B2430] uppercase tracking-wider">
              COMPANY DETAILS
            </h2>
          </div>
          <button
            type="button"
            onClick={handleEditCompanyDetails}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition cursor-pointer"
            aria-label="Edit Company Details"
          >
            Edit
          </button>
        </div>

        <div className="space-y-4">
          {/* Company Name (Full Width) */}
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              COMPANY NAME
            </span>
            <span className="block text-sm font-semibold text-[#1B2430]">
              {companyDetails.companyName?.trim() || 'Futura Constructions (Pvt) Ltd'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
            {/* Business Type */}
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                BUSINESS TYPE
              </span>
              <span className="block text-sm font-medium text-slate-800">
                {companyDetails.businessType?.trim() || 'Civil Engineering & Contracting'}
              </span>
            </div>

            {/* Address & District */}
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                ADDRESS & DISTRICT
              </span>
              <span className="block text-sm font-medium text-slate-800">
                {formatAddress()}
              </span>
            </div>

            {/* Tax Identification (TIN) */}
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                TAX IDENTIFICATION (TIN)
              </span>
              <span className="block text-sm font-medium font-mono text-slate-800">
                {companyDetails.vatTinNumber?.trim() || 'TIN-992834-001'}
              </span>
            </div>

            {/* VAT Number */}
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                VAT NUMBER
              </span>
              <span className="block text-sm font-medium font-mono text-slate-800">
                {formatVatNumber()}
              </span>
            </div>

            {/* Currency */}
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                CURRENCY
              </span>
              <span className="block text-sm font-medium text-slate-800">
                {formatCurrency(companyDetails.currency)}
              </span>
            </div>

            {/* Financial Year Start */}
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                FINANCIAL YEAR START
              </span>
              <span className="block text-sm font-medium text-slate-800">
                {formatFinancialYear(companyDetails.financialYearStart)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Card 3: Informational Shop ID Callout ── */}
      <div className="bg-[#FFF8F2] border border-[#FED7AA]/90 rounded-2xl p-4 sm:p-5 flex items-start gap-4 shadow-xs">
        <div className="w-9 h-9 rounded-xl bg-[#F5851F] flex items-center justify-center text-white flex-shrink-0 shadow-sm mt-0.5">
          <Key className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-[#1B2430]">
            Your Shop ID
          </h3>
          <p className="text-xs sm:text-[13px] text-slate-600 mt-1 leading-relaxed">
            After you confirm, we generate a unique <span className="font-semibold text-slate-800">Shop ID</span>. Share it with your team so they can request access to this company profile.
          </p>
        </div>
      </div>

      {/* ── Card 4: Starting Defaults Card ── */}
      <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-3.5 shadow-xs">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-slate-500" />
          <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase">
            STARTING DEFAULTS (EDITABLE IN SETTINGS)
          </h3>
        </div>
        <ul className="space-y-2.5 pt-1">
          <li className="flex items-center gap-2.5 text-xs sm:text-[13px] text-slate-700">
            <Check className="w-4 h-4 text-emerald-600 stroke-[3] flex-shrink-0" />
            <span>PO approval limits set to auto-approve below LKR 50,000</span>
          </li>
          <li className="flex items-center gap-2.5 text-xs sm:text-[13px] text-slate-700">
            <Check className="w-4 h-4 text-emerald-600 stroke-[3] flex-shrink-0" />
            <span>Weekly operational digest sent every Monday at 8:00 AM</span>
          </li>
          <li className="flex items-center gap-2.5 text-xs sm:text-[13px] text-slate-700">
            <Check className="w-4 h-4 text-emerald-600 stroke-[3] flex-shrink-0" />
            <span>Standard inventory valuation (FIFO) enabled</span>
          </li>
        </ul>
      </div>

      {/* ── Action Buttons ── */}
      <div className="pt-2 space-y-3">
        {/* Primary Action Button */}
        <button
          type="button"
          onClick={handleCreateCompany}
          disabled={isSubmitting}
          className="w-full py-3.5 sm:py-4 px-6 rounded-xl bg-[#F5851F] hover:bg-[#E07516] active:bg-[#C96510] text-[#1B2430] font-bold text-base transition shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-[#1B2430]" />
              <span>Creating company...</span>
            </>
          ) : (
            <>
              <span>Create company</span>
              <ArrowRight className="w-5 h-5 text-[#1B2430]" />
            </>
          )}
        </button>

        {/* Secondary Back Button */}
        <button
          type="button"
          onClick={handleBack}
          disabled={isSubmitting}
          className="w-full py-3 sm:py-3.5 px-6 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-bold text-sm sm:text-base transition cursor-pointer disabled:opacity-60"
        >
          Back
        </button>
      </div>

      {/* ── Enterprise Security Protocol Footer ── */}
      <div className="mt-8 mb-4 flex items-center justify-center gap-2 text-xs font-medium text-slate-400 tracking-wider uppercase select-none">
        <Shield
          className="w-3.5 h-4 text-slate-400 cursor-pointer flex-shrink-0"
          onClick={onOpenHelp}
        />
        <span>ENTERPRISE-GRADE SECURITY PROTOCOL</span>
      </div>
    </div>
  );
};

export default OwnerStep4ReviewConfirm;

