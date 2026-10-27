import { CompanyDetails } from '../types/onboarding';

export const DRAFT_STORAGE_KEY = 'futura_owner_onboarding_draft';
export const DRAFT_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface OwnerDraftOwnerDetails {
  fullName: string;
  email: string;
  phonePrefix: string;
  phone: string;
  agreedToTerms: boolean;
}

export interface OwnerOnboardingDraft {
  version: number;
  currentStep: number;
  furthestStepCompleted: number;
  ownerDetails: OwnerDraftOwnerDetails;
  companyDetails: Partial<CompanyDetails>;
  savedAt: number; // Unix timestamp in ms
}

/**
 * Validates that an unverified object conforms strictly to the OwnerOnboardingDraft schema
 * and has not passed its 7-day expiration window.
 * Strictly guarantees that passwords or OTP verification secrets are not present.
 */
export function isValidDraft(parsed: unknown): parsed is OwnerOnboardingDraft {
  if (!parsed || typeof parsed !== 'object') return false;

  const draft = parsed as Record<string, unknown>;

  // Check timestamp and expiration
  if (typeof draft.savedAt !== 'number' || isNaN(draft.savedAt) || draft.savedAt <= 0) {
    return false;
  }
  if (Date.now() - draft.savedAt > DRAFT_EXPIRY_MS) {
    return false;
  }

  // Validate ownerDetails shape
  if (!draft.ownerDetails || typeof draft.ownerDetails !== 'object') {
    return false;
  }
  const owner = draft.ownerDetails as Record<string, unknown>;
  // Password or OTP fields must NEVER exist in the draft
  if ('password' in owner || 'confirmPassword' in owner) {
    return false;
  }
  if (typeof owner.fullName !== 'string' || typeof owner.email !== 'string') {
    return false;
  }

  // Validate companyDetails shape
  if (!draft.companyDetails || typeof draft.companyDetails !== 'object') {
    return false;
  }

  // Validate step numbers if provided
  if (draft.currentStep !== undefined && (typeof draft.currentStep !== 'number' || isNaN(draft.currentStep))) {
    return false;
  }
  if (
    draft.furthestStepCompleted !== undefined &&
    (typeof draft.furthestStepCompleted !== 'number' || isNaN(draft.furthestStepCompleted))
  ) {
    return false;
  }

  return true;
}

/**
 * Safely loads and validates the draft from localStorage.
 * If expired or malformed, the stored item is purged immediately to protect privacy.
 */
export function loadValidDraft(): OwnerOnboardingDraft | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!isValidDraft(parsed)) {
      // Malformed, corrupted or expired draft -> immediately purge key
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // Ignore storage cleanup failures
    }
    return null;
  }
}

/**
 * Safely saves a draft to localStorage, automatically attaching timestamp and version
 * while strictly stripping any secrets.
 */
export function saveOnboardingDraft(
  draft: Omit<OwnerOnboardingDraft, 'savedAt' | 'version'>
): void {
  if (typeof window === 'undefined') return;

  const payload: OwnerOnboardingDraft = {
    version: 1,
    savedAt: Date.now(),
    currentStep: Math.min(draft.currentStep || 2, 2), // Cap draft resumption at company details
    furthestStepCompleted: Math.min(draft.furthestStepCompleted ?? 1, 2),
    ownerDetails: {
      fullName: draft.ownerDetails.fullName || '',
      email: draft.ownerDetails.email || '',
      phonePrefix: draft.ownerDetails.phonePrefix || '+94',
      phone: draft.ownerDetails.phone || '',
      agreedToTerms: Boolean(draft.ownerDetails.agreedToTerms),
    },
    companyDetails: { ...draft.companyDetails },
  };

  try {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error('Failed to write onboarding draft to localStorage', err);
  }
}

/**
 * Purges the onboarding draft from localStorage.
 */
export function clearOnboardingDraft(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // Ignore storage cleanup failures
  }
}
