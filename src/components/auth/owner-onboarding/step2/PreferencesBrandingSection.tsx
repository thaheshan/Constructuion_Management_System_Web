'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateCompanyDetails } from '@/store/slices/ownerOnboardingSlice';
import { LogoUploadZone } from '../LogoUploadZone';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

export const PreferencesBrandingSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const companyDetails = useAppSelector(
    (state) => state.ownerOnboarding.companyDetails
  );

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
        <SlidersHorizontal className="w-4 h-4 text-futura-600" />
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Preferences & Brand Assets
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Currency Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Operating Currency
          </label>
          <div className="relative">
            <select
              value={companyDetails.currency || 'LKR Rs. (Sri Lankan Rupee)'}
              onChange={(e) =>
                dispatch(updateCompanyDetails({ currency: e.target.value }))
              }
              className="w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-white border border-slate-200 text-slate-800 appearance-none transition focus:outline-none focus:ring-2 focus:ring-futura-500 cursor-pointer hover:border-slate-300"
            >
              <option value="LKR Rs. (Sri Lankan Rupee)">LKR Rs. (Sri Lankan Rupee)</option>
              <option value="USD $ (United States Dollar)">USD $ (United States Dollar)</option>
              <option value="EUR € (Euro)">EUR € (Euro)</option>
              <option value="GBP £ (British Pound)">GBP £ (British Pound)</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Financial Year Start */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Financial Year Start
          </label>
          <div className="relative">
            <select
              value={companyDetails.financialYearStart || '1 April'}
              onChange={(e) =>
                dispatch(updateCompanyDetails({ financialYearStart: e.target.value }))
              }
              className="w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-white border border-slate-200 text-slate-800 appearance-none transition focus:outline-none focus:ring-2 focus:ring-futura-500 cursor-pointer hover:border-slate-300"
            >
              <option value="1 April">1 April (Standard Sri Lanka FY)</option>
              <option value="1 January">1 January (Calendar Year)</option>
              <option value="1 July">1 July</option>
              <option value="1 October">1 October</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Logo Upload */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Company Logo (Optional)
        </label>
        <LogoUploadZone
          logoBase64={companyDetails.logoBase64}
          logoFileName={companyDetails.logoFileName}
          onFileSelect={(base64: string, fileName: string) =>
            dispatch(
              updateCompanyDetails({
                logoBase64: base64,
                logoFileName: fileName,
              })
            )
          }
          onFileRemove={() =>
            dispatch(
              updateCompanyDetails({
                logoBase64: undefined,
                logoFileName: undefined,
              })
            )
          }
        />
      </div>
    </div>
  );
};
