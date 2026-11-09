'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { TOTAL_STEPS, getStepConfig } from '@/config/onboardingSteps';

interface OnboardingProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

export const OnboardingProgressBar: React.FC<OnboardingProgressBarProps> = ({
  currentStep,
  totalSteps = TOTAL_STEPS,
}) => {
  const stepConfig = getStepConfig(currentStep);
  const isFinalStep = currentStep === totalSteps;

  if (isFinalStep) {
    return (
      <div className="w-full mb-6 select-none">
        <div className="flex items-center justify-between text-xs sm:text-[14px] font-semibold mb-2">
          <span className="text-[#1B2430] tracking-wider uppercase font-bold">
            STEP {currentStep} OF {totalSteps}: {stepConfig.title}
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

  return (
    <div className="w-full mb-6 select-none">
      <div className="flex items-center justify-between text-xs sm:text-[13px] font-bold mb-2">
        <span className="text-slate-800 tracking-wider uppercase">
          STEP {currentStep} OF {totalSteps}: {stepConfig.title}
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
