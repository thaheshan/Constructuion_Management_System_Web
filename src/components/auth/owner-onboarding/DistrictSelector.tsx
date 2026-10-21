'use client';

import React from 'react';
import { SRI_LANKAN_DISTRICTS, SriLankanDistrict } from '@/types/onboarding';
import { ChevronDown, MapPin } from 'lucide-react';

interface DistrictSelectorProps {
  value: string;
  onChange: (district: SriLankanDistrict) => void;
  error?: string;
  disabled?: boolean;
}

export const DistrictSelector: React.FC<DistrictSelectorProps> = ({
  value,
  onChange,
  error,
  disabled = false,
}) => {
  return (
    <div className="w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <MapPin className="w-4 h-4" />
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as SriLankanDistrict)}
          disabled={disabled}
          className={`w-full pl-10 pr-10 py-3 rounded-xl text-sm font-medium bg-white border appearance-none transition focus:outline-none focus:ring-2 focus:ring-futura-500 focus:border-transparent ${
            error
              ? 'border-red-400 bg-red-50/20 text-red-900 focus:ring-red-400'
              : 'border-slate-300 text-slate-800 hover:border-slate-400'
          } ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-50' : 'cursor-pointer'}`}
        >
          <option value="" disabled>
            Select District...
          </option>
          {SRI_LANKAN_DISTRICTS.map((group) => (
            <optgroup key={group.province} label={group.province}>
              {group.districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};
