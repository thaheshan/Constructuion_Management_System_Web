export interface OnboardingStepConfig {
  id: number;
  key: string;
  title: string;
  headerTitle: string;
  shortTitle: string;
}

export const ONBOARDING_STEPS: OnboardingStepConfig[] = [
  {
    id: 1,
    key: 'your-details',
    title: 'YOUR DETAILS',
    headerTitle: 'Your Details',
    shortTitle: 'Details',
  },
  {
    id: 2,
    key: 'company-details',
    title: 'COMPANY DETAILS',
    headerTitle: 'Company Details',
    shortTitle: 'Company',
  },
  {
    id: 3,
    key: 'verify',
    title: 'VERIFY',
    headerTitle: 'Verification',
    shortTitle: 'Verify',
  },
  {
    id: 4,
    key: 'plan-selection',
    title: 'PLAN SELECTION',
    headerTitle: 'Review & Plan',
    shortTitle: 'Review',
  },
  {
    id: 5,
    key: 'confirmation',
    title: 'DONE',
    headerTitle: 'Company Ready',
    shortTitle: 'Done',
  },
];

export const TOTAL_STEPS = ONBOARDING_STEPS.length;

export function getStepConfig(step: number): OnboardingStepConfig {
  return ONBOARDING_STEPS.find((s) => s.id === step) || ONBOARDING_STEPS[0];
}
