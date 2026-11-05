import { OwnerDetails, CompanyDetails } from '@/types/onboarding';

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const SRI_LANKA_MOBILE_REGEX = /^7[0-9]{8}$/;
export const COMPANY_PHONE_REGEX = /^[0-9]{8,10}$/;
export const PERSON_NAME_REGEX = /^[A-Za-z\s.'-]+$/;
export const BUSINESS_REG_REGEX = /^[A-Za-z0-9\-/]+$/;
export const VAT_TIN_REGEX = /^[A-Za-z0-9\-]+$/;
export const SHOP_ID_REGEX = /^FUT-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
export const NIC_REGEX = /^([0-9]{9}[vVxX]|[0-9]{12})$/;

export type PasswordStrengthLevel = 'NONE' | 'WEAK' | 'FAIR' | 'GOOD' | 'STRONG';

export interface PasswordStrengthResult {
  score: number;
  level: PasswordStrengthLevel;
  label: string;
  colorClass: string;
}

/**
 * Calculates password strength across 5 distinct tiers.
 * - Empty: NONE (score 0)
 * - Length < 8: WEAK (score 1)
 * - Length 8-11 with variety: FAIR (score 2) or GOOD (score 3)
 * - Length 12+ with mixed-case, numbers, and symbols: STRONG (score 4)
 */
export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return { score: 0, level: 'NONE', label: '', colorClass: 'bg-slate-200' };
  }

  if (password.length < 8) {
    return { score: 1, level: 'WEAK', label: 'WEAK', colorClass: 'bg-red-500' };
  }

  let criteriaPassed = 1; // 1 for length >= 8
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) criteriaPassed++;
  if (/[0-9]/.test(password)) criteriaPassed++;
  if (/[^A-Za-z0-9]/.test(password)) criteriaPassed++;

  if (password.length >= 12 && criteriaPassed >= 4) {
    return { score: 4, level: 'STRONG', label: 'STRONG', colorClass: 'bg-emerald-500' };
  }

  switch (criteriaPassed) {
    case 1:
      return { score: 1, level: 'WEAK', label: 'WEAK', colorClass: 'bg-red-500' };
    case 2:
      return { score: 2, level: 'FAIR', label: 'FAIR', colorClass: 'bg-amber-500' };
    case 3:
      return { score: 3, level: 'GOOD', label: 'GOOD', colorClass: 'bg-blue-500' };
    case 4:
    default:
      return { score: 3, level: 'GOOD', label: 'GOOD', colorClass: 'bg-blue-500' };
  }
}

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function isValidSriLankaMobile(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-]/g, '');
  const normalized = cleaned.startsWith('+94')
    ? cleaned.slice(3)
    : cleaned.startsWith('0')
    ? cleaned.slice(1)
    : cleaned;
  return SRI_LANKA_MOBILE_REGEX.test(normalized);
}

export function isValidCompanyPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-]/g, '');
  return COMPANY_PHONE_REGEX.test(cleaned);
}

export function isValidShopId(id: string): boolean {
  return SHOP_ID_REGEX.test(id.trim());
}

export function isValidNIC(nic: string): boolean {
  return NIC_REGEX.test(nic.trim());
}

/**
 * Validates a single field in Step 1 (Owner Personal Details).
 * Returns an error string or null if valid.
 */
export function validateOwnerStep1Field(
  field: keyof OwnerDetails,
  value: any,
  context?: Partial<OwnerDetails>
): string | null {
  switch (field) {
    case 'fullName': {
      const clean = String(value || '').trim();
      if (!clean) return 'Full Name as on your National Identity Card (NIC) is required';
      if (clean.length < 3) return 'Full Name must be at least 3 characters';
      if (!PERSON_NAME_REGEX.test(clean)) return 'Full Name can only contain letters, spaces, and periods';
      return null;
    }
    case 'email': {
      const clean = String(value || '').trim();
      if (!clean) return 'Email address is required';
      if (!isValidEmail(clean)) return 'Please enter a valid email address';
      return null;
    }
    case 'phone': {
      const clean = String(value || '').replace(/\s+/g, '');
      if (!clean) return 'Mobile number is required for SMS verification';
      if (!isValidSriLankaMobile(clean)) return 'Enter a valid 9-digit Sri Lankan mobile number (e.g. 77 123 4567)';
      return null;
    }
    case 'password': {
      const str = String(value || '');
      if (!str) return 'Password is required';
      if (str.length < 8) return 'Password must be at least 8 characters long';
      const strength = calculatePasswordStrength(str);
      if (strength.score < 2) return 'Password is too weak. Include uppercase, numbers, or symbols.';
      return null;
    }
    case 'confirmPassword': {
      const str = String(value || '');
      if (!str) return 'Confirm your password';
      if (context?.password && str !== context.password) return 'Passwords do not match';
      return null;
    }
    case 'agreedToTerms': {
      if (!value) return 'You must agree to the Terms of Service and Master Owner responsibilities';
      return null;
    }
    default:
      return null;
  }
}

/**
 * Validates all fields in Step 1.
 */
export function validateOwnerStep1(data: Partial<OwnerDetails>): Record<string, string> {
  const errors: Record<string, string> = {};
  const fields: (keyof OwnerDetails)[] = [
    'fullName',
    'email',
    'phone',
    'password',
    'confirmPassword',
    'agreedToTerms',
  ];

  fields.forEach((field) => {
    const err = validateOwnerStep1Field(field, data[field], data);
    if (err) {
      errors[field] = err;
    }
  });

  return errors;
}

/**
 * Validates a single field in Step 2 (Company Details).
 */
export function validateOwnerStep2Field(
  field: keyof CompanyDetails,
  value: any
): string | null {
  switch (field) {
    case 'companyName': {
      const clean = String(value || '').trim();
      if (!clean) return 'Company name is required';
      if (clean.length < 2) return 'Company name must be at least 2 characters';
      return null;
    }
    case 'businessType': {
      const clean = String(value || '').trim();
      if (!clean) return 'Business type is required';
      return null;
    }
    case 'companyPhone': {
      const clean = String(value || '').replace(/\s+/g, '');
      if (!clean) return 'Company phone number is required';
      if (!isValidCompanyPhone(clean)) return 'Enter a valid landline or mobile number (e.g. 11 234 5678)';
      return null;
    }
    case 'companyEmail': {
      const clean = String(value || '').trim();
      if (clean && !isValidEmail(clean)) return 'Please enter a valid company email address';
      return null;
    }
    case 'addressLine': {
      const clean = String(value || '').trim();
      if (!clean) return 'Office street address is required';
      return null;
    }
    case 'city': {
      const clean = String(value || '').trim();
      if (!clean) return 'City is required';
      return null;
    }
    case 'district': {
      if (!value) return 'Please select a district';
      return null;
    }
    case 'businessRegNo': {
      const clean = String(value || '').trim();
      if (clean && !BUSINESS_REG_REGEX.test(clean)) {
        return 'Business Registration Number contains invalid characters';
      }
      return null;
    }
    case 'vatTinNumber': {
      const clean = String(value || '').trim();
      if (clean && !VAT_TIN_REGEX.test(clean)) {
        return 'VAT/TIN format is invalid (e.g. 123456789-8000)';
      }
      return null;
    }
    default:
      return null;
  }
}

/**
 * Validates all fields in Step 2.
 */
export function validateOwnerStep2(data: Partial<CompanyDetails>): Record<string, string> {
  const errors: Record<string, string> = {};
  const fields: (keyof CompanyDetails)[] = [
    'companyName',
    'businessType',
    'businessRegNo',
    'companyPhone',
    'companyEmail',
    'addressLine',
    'city',
    'district',
    'vatTinNumber',
  ];

  fields.forEach((field) => {
    const err = validateOwnerStep2Field(field, data[field]);
    if (err) {
      errors[field] = err;
    }
  });

  return errors;
}
