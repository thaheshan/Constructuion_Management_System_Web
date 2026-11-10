'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateCompanyDetails } from '@/store/slices/ownerOnboardingSlice';
import { Input } from '@/components/ui/Input';
import { FileText, ChevronDown } from 'lucide-react';

interface TaxStatutorySectionProps {
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  onBlur: (field: string) => void;
}

export const TaxStatutorySection: React.FC<TaxStatutorySectionProps> = ({
  errors,
  touched,
  onBlur,
}) => {
  const dispatch = useAppDispatch();
  const companyDetails = useAppSelector(
    (state) => state.ownerOnboarding.companyDetails
  );
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="pt-2">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between pb-2 border-b border-slate-200 text-left cursor-pointer group"
      >
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-futura-600" />
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider group-hover:text-futura-600 transition">
            Tax & Statutory Numbers (Optional)
          </h2>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            isExpanded ? 'rotate-180 text-futura-600' : ''
          }`}
        />
      </button>

      {isExpanded && (
        <div className="space-y-4 pt-4 animate-fadeIn">
          {/* VAT Registration Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <p className="text-xs font-semibold text-slate-800">
                VAT Registered Entity
              </p>
              <p className="text-[11px] text-slate-500">
                Enable if company is registered for VAT with the Inland Revenue Department (IRD)
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={companyDetails.isVatRegistered}
                onChange={(e) =>
                  dispatch(updateCompanyDetails({ isVatRegistered: e.target.checked }))
                }
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-futura-500" />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="TIN / VAT Number"
              placeholder="e.g. 123456789-8000"
              value={companyDetails.vatTinNumber || ''}
              onChange={(e) =>
                dispatch(updateCompanyDetails({ vatTinNumber: e.target.value }))
              }
              onBlur={() => onBlur('vatTinNumber')}
              error={touched.vatTinNumber ? errors.vatTinNumber : undefined}
            />

            <Input
              label="EPF Employer No."
              placeholder="e.g. E/12345"
              value={companyDetails.epfEmployerNo || ''}
              onChange={(e) =>
                dispatch(updateCompanyDetails({ epfEmployerNo: e.target.value }))
              }
              onBlur={() => onBlur('epfEmployerNo')}
            />

            <Input
              label="ETF Employer No."
              placeholder="e.g. ETF/98765"
              value={companyDetails.etfEmployerNo || ''}
              onChange={(e) =>
                dispatch(updateCompanyDetails({ etfEmployerNo: e.target.value }))
              }
              onBlur={() => onBlur('etfEmployerNo')}
            />
          </div>
        </div>
      )}
    </div>
  );
};
