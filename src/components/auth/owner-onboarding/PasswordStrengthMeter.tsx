'use client';

import React from 'react';
import {
  calculatePasswordStrength,
  StrengthLevel,
} from '@/utils/validation';

export { calculatePasswordStrength };
export type { StrengthLevel };

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
}) => {
  const { score, label, colorClass } = calculatePasswordStrength(password);

  return (
    <div className="mt-2 space-y-1.5">
      {/* 4 segments */}
      <div className="grid grid-cols-4 gap-1.5 h-1.5">
        {[1, 2, 3, 4].map((step) => {
          const isFilled = score >= step;
          return (
            <div
              key={step}
              className={`h-full rounded-full transition-colors duration-300 ${
                isFilled ? colorClass : 'bg-slate-200'
              }`}
            />
          );
        })}
      </div>

      {/* Label: left-aligned single line matching reference image */}
      {password && (
        <p className="text-[11px] font-bold text-slate-700 tracking-wider">
          {label}
        </p>
      )}
    </div>
  );
};
