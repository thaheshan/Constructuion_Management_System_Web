'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateCompanyDetails } from '@/store/slices/ownerOnboardingSlice';
import { DistrictSelector } from '../DistrictSelector';
import { Input } from '@/components/ui/Input';
import { MapPin } from 'lucide-react';
import { SriLankanDistrict } from '@/types/onboarding';

interface CompanyAddressSectionProps {
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  onBlur: (field: string) => void;
}

export const CompanyAddressSection: React.FC<CompanyAddressSectionProps> = ({
  errors,
  touched,
  onBlur,
}) => {
  const dispatch = useAppDispatch();
  const companyDetails = useAppSelector(
    (state) => state.ownerOnboarding.companyDetails
  );

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
        <MapPin className="w-4 h-4 text-futura-600" />
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Office Location & Address
        </h2>
      </div>

      <Input
        label="Office Street Address *"
        placeholder="e.g. Level 4, 120 Galle Road"
        value={companyDetails.addressLine}
        onChange={(e) => dispatch(updateCompanyDetails({ addressLine: e.target.value }))}
        onBlur={() => onBlur('addressLine')}
        error={touched.addressLine ? errors.addressLine : undefined}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="City *"
          placeholder="e.g. Colombo 03"
          value={companyDetails.city}
          onChange={(e) => dispatch(updateCompanyDetails({ city: e.target.value }))}
          onBlur={() => onBlur('city')}
          error={touched.city ? errors.city : undefined}
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Administrative District *
          </label>
          <DistrictSelector
            value={companyDetails.district}
            onChange={(district: SriLankanDistrict) => {
              dispatch(updateCompanyDetails({ district }));
              onBlur('district');
            }}
            error={touched.district ? errors.district : undefined}
          />
        </div>
      </div>
    </div>
  );
};
