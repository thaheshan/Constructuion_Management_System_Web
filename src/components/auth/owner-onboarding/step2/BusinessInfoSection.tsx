'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateCompanyDetails } from '@/store/slices/ownerOnboardingSlice';
import { Input } from '@/components/ui/Input';
import { Briefcase } from 'lucide-react';

interface BusinessInfoSectionProps {
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  onBlur: (field: string) => void;
}

export const BusinessInfoSection: React.FC<BusinessInfoSectionProps> = ({
  errors,
  touched,
  onBlur,
}) => {
  const dispatch = useAppDispatch();
  const companyDetails = useAppSelector(
    (state) => state.ownerOnboarding.companyDetails
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
        <Briefcase className="w-4 h-4 text-futura-600" />
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Business Information
        </h2>
      </div>

      {/* ── Company Name ── */}
      <Input
        label="Company Name *"
        placeholder="e.g. Futura Construction Pvt Ltd"
        value={companyDetails.companyName}
        onChange={(e) => dispatch(updateCompanyDetails({ companyName: e.target.value }))}
        onBlur={() => onBlur('companyName')}
        error={touched.companyName ? errors.companyName : undefined}
      />

      {/* ── Business Type ── */}
      <Input
        label="Business Entity Type *"
        placeholder="e.g. Private Limited Company (Pvt Ltd)"
        value={companyDetails.businessType}
        onChange={(e) => dispatch(updateCompanyDetails({ businessType: e.target.value }))}
        onBlur={() => onBlur('businessType')}
        error={touched.businessType ? errors.businessType : undefined}
        helperText="Entity classification registered with ROC (Sri Lanka)"
      />

      {/* ── Business Registration Number (Optional) ── */}
      <Input
        label="Business Registration Number (Optional)"
        placeholder="e.g. PV-12345 or W/COL/6789"
        value={companyDetails.businessRegNo || ''}
        onChange={(e) => dispatch(updateCompanyDetails({ businessRegNo: e.target.value }))}
        onBlur={() => onBlur('businessRegNo')}
        error={touched.businessRegNo ? errors.businessRegNo : undefined}
      />

      {/* ── Company Phone & Email ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Company Phone Number *
          </label>
          <div className="flex items-center rounded-lg shadow-sm border border-slate-300 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100 bg-white overflow-hidden">
            <span className="px-3 py-2.5 text-xs sm:text-sm font-bold text-slate-500 bg-slate-50 border-r border-slate-200 select-none">
              {companyDetails.companyPhonePrefix || '+94'}
            </span>
            <input
              type="tel"
              placeholder="11 234 5678"
              value={companyDetails.companyPhone}
              onChange={(e) =>
                dispatch(updateCompanyDetails({ companyPhone: e.target.value }))
              }
              onBlur={() => onBlur('companyPhone')}
              className="w-full px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          {touched.companyPhone && errors.companyPhone && (
            <p className="mt-1.5 text-xs text-red-600 font-medium animate-fadeIn">
              {errors.companyPhone}
            </p>
          )}
        </div>

        <Input
          label="Company Email (Optional)"
          type="email"
          placeholder="info@futurabuilders.lk"
          value={companyDetails.companyEmail || ''}
          onChange={(e) =>
            dispatch(updateCompanyDetails({ companyEmail: e.target.value }))
          }
          onBlur={() => onBlur('companyEmail')}
          error={touched.companyEmail ? errors.companyEmail : undefined}
        />
      </div>
    </div>
  );
};
