'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setStep } from '@/store/slices/ownerOnboardingSlice';
import { TOTAL_STEPS } from '@/config/onboardingSteps';

export function useStepNavigation() {
  const dispatch = useAppDispatch();
  const currentStep = useAppSelector((state) => state.ownerOnboarding.currentStep);

  const goToStep = useCallback(
    (targetStep: number) => {
      const validStep = Math.min(Math.max(1, targetStep), TOTAL_STEPS);
      dispatch(setStep(validStep));

      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        if (url.searchParams.get('step') !== String(validStep)) {
          url.searchParams.set('step', String(validStep));
          window.history.pushState({}, '', url.toString());
        }

        // Defer scroll to next tick so new step has rendered
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    },
    [dispatch]
  );

  const nextStep = useCallback(() => {
    goToStep(currentStep + 1);
  }, [currentStep, goToStep]);

  const prevStep = useCallback(() => {
    goToStep(currentStep - 1);
  }, [currentStep, goToStep]);

  return {
    currentStep,
    totalSteps: TOTAL_STEPS,
    goToStep,
    nextStep,
    prevStep,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === TOTAL_STEPS,
  };
}
