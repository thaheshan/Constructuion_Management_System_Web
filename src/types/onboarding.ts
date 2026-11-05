export type SriLankanDistrict =
  // Western Province
  | 'Colombo'
  | 'Gampaha'
  | 'Kalutara'
  // Central Province
  | 'Kandy'
  | 'Matale'
  | 'Nuwara Eliya'
  // Southern Province
  | 'Galle'
  | 'Matara'
  | 'Hambantota'
  // Northern Province
  | 'Jaffna'
  | 'Kilinochchi'
  | 'Mannar'
  | 'Vavuniya'
  | 'Mullaitivu'
  // Eastern Province
  | 'Batticaloa'
  | 'Ampara'
  | 'Trincomalee'
  // North Western Province
  | 'Kurunegala'
  | 'Puttalam'
  // North Central Province
  | 'Anuradhapura'
  | 'Polonnaruwa'
  // Uva Province
  | 'Badulla'
  | 'Monaragala'
  // Sabaragamuwa Province
  | 'Ratnapura'
  | 'Kegalle';

export const SRI_LANKAN_DISTRICTS: { province: string; districts: SriLankanDistrict[] }[] = [
  {
    province: 'Western Province',
    districts: ['Colombo', 'Gampaha', 'Kalutara'],
  },
  {
    province: 'Central Province',
    districts: ['Kandy', 'Matale', 'Nuwara Eliya'],
  },
  {
    province: 'Southern Province',
    districts: ['Galle', 'Matara', 'Hambantota'],
  },
  {
    province: 'Northern Province',
    districts: ['Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu'],
  },
  {
    province: 'Eastern Province',
    districts: ['Batticaloa', 'Ampara', 'Trincomalee'],
  },
  {
    province: 'North Western Province',
    districts: ['Kurunegala', 'Puttalam'],
  },
  {
    province: 'North Central Province',
    districts: ['Anuradhapura', 'Polonnaruwa'],
  },
  {
    province: 'Uva Province',
    districts: ['Badulla', 'Monaragala'],
  },
  {
    province: 'Sabaragamuwa Province',
    districts: ['Ratnapura', 'Kegalle'],
  },
];

export const ALL_DISTRICTS: SriLankanDistrict[] = SRI_LANKAN_DISTRICTS.flatMap(
  (group) => group.districts
);

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
  ownerDetails: OwnerDetails;
  companyDetails: CompanyDetails;
  verification: VerificationState;
  shopId: string;
  isDraftSaved: boolean;
  lastSavedAt: string | null;
}
