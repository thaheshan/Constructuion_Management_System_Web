'use client';

import React from 'react';
import {
  calculatePasswordStrength,
  PasswordStrengthLevel,
} from '@/utils/validators';

export { calculatePasswordStrength };
export type { PasswordStrengthLevel };
export type StrengthLevel = PasswordStrengthLevel;

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
}) => {
  const { score, level, colorClass } = calculatePasswordStrength(password);

  if (!password) {
    return null;
  }

  return (
    <div className="mt-2 space-y-1.5 animate-fadeIn">
      {/* 4-segment visual strength meter */}
      <div className="grid grid-cols-4 gap-1.5">
        {[1, 2, 3, 4].map((step) => {
          const isActive = score >= step;
          return (
            <div
              key={step}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isActive ? colorClass : 'bg-slate-200'
              }`}
            />
          );
        })}
      </div>

      {/* Strength indicator text */}
      <div className="flex items-center justify-between text-[11px] font-semibold">
        <span className="text-slate-500 uppercase tracking-wider">
          PASSWORD STRENGTH
        </span>
        <span
          className={`font-bold transition-colors duration-200 ${
            level === 'WEAK'
              ? 'text-red-500'
              : level === 'FAIR'
              ? 'text-amber-500'
              : level === 'GOOD'
              ? 'text-blue-500'
              : level === 'STRONG'
              ? 'text-emerald-500'
              : 'text-slate-400'
          }`}
        >
          {level}
        </span>
      </div>
    </div>
  );
};
