'use client';

import React from 'react';

interface OnboardingProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

const STEP_TITLES: Record<number, string> = {
  1: 'YOUR DETAILS',
  2: 'COMPANY DETAILS',
  3: 'VERIFY',
  4: 'PLAN SELECTION',
  5: 'CONFIRMATION',
};

export const OnboardingProgressBar: React.FC<OnboardingProgressBarProps> = ({
  currentStep,
  totalSteps = 5,
}) => {
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
