import {
  SriLankanDistrict,
  ProvinceDistricts,
  SRI_LANKAN_DISTRICTS,
  ALL_DISTRICTS,
  isValidSriLankanDistrict,
} from '@/constants/locations';

export type { SriLankanDistrict, ProvinceDistricts };
export { SRI_LANKAN_DISTRICTS, ALL_DISTRICTS, isValidSriLankanDistrict };

export type {
  OwnerOnboardingDraft,
  OwnerDraftOwnerDetails,
} from '@/utils/draftStorage';

export type BusinessType =
  | 'Private Limited Company (Pvt Ltd)'
  | 'Sole Proprietorship'
  | 'Partnership'
  | 'Public Limited Company (PLC)'
  | 'Joint Venture';

export const BUSINESS_TYPES: BusinessType[] = [
  'Private Limited Company (Pvt Ltd)',
  'Sole Proprietorship',
  'Partnership',
  'Public Limited Company (PLC)',
  'Joint Venture',
];

export interface OwnerDetails {
  fullName: string;
  email: string;
  phonePrefix: string;
  phone: string;
  password: string;
  confirmPassword?: string;
  agreedToTerms: boolean;
}

export interface CompanyDetails {
  companyName: string;
  businessType: string;
  businessRegNo?: string;
  companyPhonePrefix: string;
  companyPhone: string;
  companyEmail?: string;
  addressLine: string;
  city: string;
  district: SriLankanDistrict | '';
  // Tax and Statutory
  vatTinNumber?: string;
  epfEmployerNo?: string;
  etfEmployerNo?: string;
  isVatRegistered: boolean;
  // Preferences & Assets
  currency: string;
  financialYearStart: string;
  logoBase64?: string;
  logoFileName?: string;
}

export type VerificationChannel = 'SMS' | 'EMAIL';

export interface VerificationState {
  code: string[];
  channel: VerificationChannel;
  destination: string;
  resendCountdown: number;
  isVerified: boolean;
  attemptsRemaining: number;
  lockedUntil: number | null;
  error: string | null;
}

export interface OwnerOnboardingState {
  currentStep: number; // 1, 2, 3, 4, 5
  furthestStepCompleted: number; // 0 = none, 1 = Step 1 validated, 2 = Step 2 validated, etc.
  ownerDetails: OwnerDetails;
  companyDetails: CompanyDetails;
  verification: VerificationState;
  isDraftSaved: boolean;
  lastSavedAt: string | null;
}

export interface RestoreDraftPayload {
  version?: number;
  currentStep?: number;
  furthestStepCompleted?: number;
  ownerDetails?: Partial<OwnerDetails> | import('@/utils/draftStorage').OwnerDraftOwnerDetails;
  companyDetails?: Partial<CompanyDetails>;
  savedAt?: number | string;
  lastSavedAt?: string | null;
}
