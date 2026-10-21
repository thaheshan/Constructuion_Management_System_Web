'use client';

import React from 'react';

interface PasswordStrengthMeterProps {
  password: string;
}

export type StrengthLevel = 'WEAK' | 'FAIR' | 'GOOD' | 'STRONG';

export function calculatePasswordStrength(password: string): {
  score: number; // 0 to 4
  level: StrengthLevel | 'NONE';
  label: string;
  colorClass: string;
} {
  if (!password) {
    return {
      score: 0,
      level: 'NONE',
      label: '',
      colorClass: 'bg-slate-200',
    };
  }

  let checksPassed = 0;

  if (password.length >= 8) checksPassed++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) checksPassed++;
  if (/[0-9]/.test(password)) checksPassed++;
  if (/[^A-Za-z0-9]/.test(password)) checksPassed++;

  // Penalty if too short
  if (password.length < 8) {
    return {
      score: 1,
      level: 'WEAK',
      label: 'WEAK',
      colorClass: 'bg-red-500',
    };
  }

  switch (checksPassed) {
    case 1:
      return {
        score: 1,
        level: 'WEAK',
        label: 'WEAK',
        colorClass: 'bg-red-500',
      };
    case 2:
      return {
        score: 2,
        level: 'FAIR',
        label: 'FAIR',
        colorClass: 'bg-amber-500',
      };
    case 3:
      return {
        score: 3,
        level: 'GOOD',
        label: 'GOOD',
        colorClass: 'bg-blue-500',
      };
    case 4:
    default:
      return {
        score: 4,
        level: 'STRONG',
        label: 'STRONG',
        colorClass: 'bg-emerald-500',
      };
  }
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

      {/* Label */}
      {password && (
        <div className="flex items-center justify-between text-[11px] font-bold tracking-wider">
          <span className="text-slate-500">PASSWORD STRENGTH:</span>
          <span
            className={
              label === 'WEAK'
                ? 'text-red-600'
                : label === 'FAIR'
                ? 'text-amber-600'
                : label === 'GOOD'
                ? 'text-blue-600'
                : 'text-emerald-600'
            }
          >
            {label}
          </span>
        </div>
      )}
    </div>
  );
};
