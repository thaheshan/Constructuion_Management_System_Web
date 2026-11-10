export type StrengthLevel = 'NONE' | 'WEAK' | 'FAIR' | 'GOOD' | 'STRONG';

export interface PasswordStrengthResult {
  score: number; // 0 to 4
  level: StrengthLevel;
  label: string;
  colorClass: string;
}

/**
 * Calculates password strength across 5 distinct tiers.
 * - Empty: NONE (score 0)
 * - Length < 8: WEAK (score 1)
 * - Length 8-11 with all checks: capped at GOOD (score 3) max.
 * - Length 12+ with all checks (length 8+, mixed case, number, symbol): STRONG (score 4).
 *
 * This ensures passwords like "Abcdef1@" (8 chars) do NOT give false confidence as STRONG.
 */
export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return {
      score: 0,
      level: 'NONE',
      label: '',
      colorClass: 'bg-slate-200',
    };
  }

  // Strict length requirement: less than 8 characters is automatically WEAK
  if (password.length < 8) {
    return {
      score: 1,
      level: 'WEAK',
      label: 'WEAK',
      colorClass: 'bg-red-500',
    };
  }

  let criteriaPassed = 1; // 1 for length >= 8
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) criteriaPassed++;
  if (/[0-9]/.test(password)) criteriaPassed++;
  if (/[^A-Za-z0-9]/.test(password)) criteriaPassed++;

  // Top tier (STRONG) strictly requires 12 or more characters AND all checks passed
  if (password.length >= 12 && criteriaPassed >= 4) {
    return {
      score: 4,
      level: 'STRONG',
      label: 'STRONG',
      colorClass: 'bg-emerald-500',
    };
  }

  switch (criteriaPassed) {
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
      // Length < 12 but passes all 4 criteria: capped at GOOD
      return {
        score: 3,
        level: 'GOOD',
        label: 'GOOD',
        colorClass: 'bg-blue-500',
      };
  }
}

/**
 * Validates Sri Lankan mobile phone numbers.
 * Format: 9 digits starting with 7 (e.g., 771234567, 712345678).
 * Supports spaces or hyphens.
 * If provided with a leading 0 or +94, strips it before validation.
 */
export function validateSriLankaPhone(phone: string): boolean {
  if (!phone) return false;
  let cleaned = phone.replace(/[\s\-]/g, '');

  if (cleaned.startsWith('+94')) {
    cleaned = cleaned.slice(3);
  } else if (cleaned.startsWith('0094')) {
    cleaned = cleaned.slice(4);
  } else if (cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1);
  }

  return /^7[0-9]{8}$/.test(cleaned);
}

/**
 * Validates Sri Lankan National Identity Card (NIC) numbers.
 * - Old format: 9 digits followed by 'V' or 'X' (case insensitive)
 * - New format: 12 numeric digits
 */
export function validateSriLankaNIC(nic: string): boolean {
  if (!nic) return false;
  const cleaned = nic.trim();
  // Old NIC format: 9 digits + V/X
  const oldNicRegex = /^[0-9]{9}[vVxX]$/;
  // New NIC format: 12 digits
  const newNicRegex = /^[0-9]{12}$/;

  return oldNicRegex.test(cleaned) || newNicRegex.test(cleaned);
}
