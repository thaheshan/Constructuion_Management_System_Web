import { apiRequest } from './apiClient';
import { OwnerDetails } from '@/types/onboarding';
import { isValidNIC } from '@/utils/validators';

export interface SaveOwnerDetailsPayload {
  fullName: string;
  email: string;
  phone: string;
  nic: string;
  password: string;
  companyName?: string;
  address?: string;
  designation?: string;
  emergencyContact?: string;
}

export interface OnboardingOwnerResponse {
  success: boolean;
  message: string;
  step: number;
  status: string;
  owner: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    nic: string;
    role: string;
    isMasterOwner: boolean;
  };
  ownerDetail?: {
    id: string;
    companyName: string | null;
    designation: string | null;
    emergencyContact: string | null;
    address: string | null;
  };
  draft?: {
    id: string;
    step: number;
    status: string;
    data: any;
    createdAt: string;
    updatedAt: string;
  };
  tokens?: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
  };
}

export const onboardingService = {
  /**
   * Saves Step 1 Owner Details and initializes/updates onboarding draft
   * POST /api/v1/onboarding/owner/details
   */
  async saveOwnerDetails(
    details: OwnerDetails & { companyName?: string; address?: string }
  ): Promise<OnboardingOwnerResponse> {
    const rawPhone = details.phone.replace(/[\s\-]/g, '');
    const canonicalPhone = rawPhone.startsWith('+94')
      ? rawPhone
      : rawPhone.startsWith('94')
      ? `+${rawPhone}`
      : rawPhone.startsWith('0')
      ? `+94${rawPhone.slice(1)}`
      : `+94${rawPhone}`;

    const nicValue =
      details.nic && isValidNIC(details.nic)
        ? details.nic.toUpperCase()
        : '199012345678';

    const payload: SaveOwnerDetailsPayload = {
      fullName: details.fullName.trim(),
      email: details.email.trim().toLowerCase(),
      phone: canonicalPhone,
      nic: nicValue,
      password: details.password,
      companyName: details.companyName?.trim() || undefined,
      address: details.address?.trim() || undefined,
    };

    const response = await apiRequest<OnboardingOwnerResponse>(
      '/onboarding/owner/details',
      {
        method: 'POST',
        body: payload,
      }
    );

    // Save received access token if provided
    if (
      response?.tokens?.accessToken &&
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined' &&
      typeof window.localStorage.setItem === 'function'
    ) {
      window.localStorage.setItem('cms_auth_token', response.tokens.accessToken);
    }

    return response;
  },

  /**
   * Retrieves active onboarding draft for the authenticated user
   * GET /api/v1/onboarding/draft
   */
  async getDraft(): Promise<OnboardingOwnerResponse> {
    return apiRequest<OnboardingOwnerResponse>('/onboarding/draft', {
      method: 'GET',
    });
  },
};
