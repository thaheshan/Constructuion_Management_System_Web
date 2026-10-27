'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface OnboardingProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

const STEP_TITLES: Record<number, string> = {
  1: 'YOUR DETAILS',
  2: 'COMPANY DETAILS',
  3: 'VERIFY',
  4: 'PLAN SELECTION',
  5: 'DONE',
};

export const OnboardingProgressBar: React.FC<OnboardingProgressBarProps> = ({
  currentStep,
  totalSteps = 5,
}) => {
  if (currentStep === 5) {
    return (
      <div className="w-full mb-6 select-none">
        <div className="flex items-center justify-between text-xs sm:text-[14px] font-semibold mb-2">
          <span className="text-[#1B2430] tracking-wider uppercase font-bold">
            STEP 5 OF 5: DONE
          </span>
          <span className="text-[#1E8E5A] font-bold flex items-center gap-1.5 text-xs sm:text-sm">
            <CheckCircle2 className="w-4 h-4 text-[#1E8E5A] flex-shrink-0" />
            <span>Registration Complete</span>
          </span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1E8E5A] rounded-full transition-all duration-500 ease-out w-full"
            role="progressbar"
            aria-valuenow={100}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>
    );
  }

  const percentage = Math.min(100, Math.round((currentStep / totalSteps) * 100));
  const stepTitle = STEP_TITLES[currentStep] || 'ONBOARDING';

  return (
    <div className="w-full mb-6 select-none">
      <div className="flex items-center justify-between text-xs sm:text-[13px] font-bold mb-2">
        <span className="text-slate-800 tracking-wider uppercase">
          STEP {currentStep} OF {totalSteps}: {stepTitle}
        </span>
        <span className="text-slate-400 font-semibold">{percentage}% Complete</span>
      </div>
      <div className="w-full h-1.5 sm:h-2 bg-slate-200/90 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-futura-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};
