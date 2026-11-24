/**
 * Authentication Service for Construction Management System (CMS)
 * Replaces simulated mock auth with real backend REST endpoints.
 */

import { apiRequest } from './apiClient';
import { UserProfile, isValidUserProfile } from '@/types/auth';

export interface LoginPayload {
  identifier: string; // Email or Mobile Number
  password: string;
}

export interface AuthResponse {
  user: UserProfile;
  token?: string;
  message?: string;
}

export interface SendOtpPayload {
  phone: string;
}

export interface VerifyOtpPayload {
  phone: string;
  code: string;
}

export interface ForgotPasswordPayload {
  identifier: string;
}

export interface ApiResponseStatus {
  success: boolean;
  message?: string;
}

export const authService = {
  /**
   * Password-based sign in via email or mobile number
   * POST /api/v1/auth/login
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const isEmail = payload.identifier.includes('@');
    const requestBody = isEmail
      ? { email: payload.identifier.trim().toLowerCase(), password: payload.password }
      : { phone: payload.identifier.trim(), password: payload.password, identifier: payload.identifier.trim() };

    const rawResponse = await apiRequest<any>('/auth/login', {
      method: 'POST',
      body: requestBody,
    });

    const user: UserProfile = rawResponse?.user || rawResponse?.data?.user || rawResponse?.data;
    const token: string | undefined =
      rawResponse?.token || rawResponse?.data?.token || rawResponse?.accessToken;

    if (!isValidUserProfile(user)) {
      throw new Error('Authentication succeeded but received an invalid user profile format from the server.');
    }

    if (token && typeof window !== 'undefined' && typeof window.localStorage !== 'undefined' && typeof window.localStorage.setItem === 'function') {
      window.localStorage.setItem('cms_auth_token', token);
    }

    return {
      user,
      token,
      message: rawResponse?.message,
    };
  },

  /**
   * Dispatch 6-digit OTP code to mobile number
   * POST /api/v1/auth/otp/send
   */
  async sendOtp(payload: SendOtpPayload): Promise<ApiResponseStatus> {
    const cleanPhone = payload.phone.replace(/\s+/g, '');
    const rawResponse = await apiRequest<any>('/auth/otp/send', {
      method: 'POST',
      body: { phone: cleanPhone },
    });

    return {
      success: rawResponse?.success !== false,
      message: rawResponse?.message || 'Verification code dispatched successfully.',
    };
  },

  /**
   * Verify mobile OTP code and authenticate
   * POST /api/v1/auth/otp/verify
   */
  async verifyOtp(payload: VerifyOtpPayload): Promise<AuthResponse> {
    const cleanPhone = payload.phone.replace(/\s+/g, '');
    const cleanCode = payload.code.trim();

    const rawResponse = await apiRequest<any>('/auth/otp/verify', {
      method: 'POST',
      body: { phone: cleanPhone, code: cleanCode },
    });

    const user: UserProfile = rawResponse?.user || rawResponse?.data?.user || rawResponse?.data;
    const token: string | undefined =
      rawResponse?.token || rawResponse?.data?.token || rawResponse?.accessToken;

    if (!isValidUserProfile(user)) {
      throw new Error('OTP verification succeeded but received an invalid user profile format.');
    }

    if (token && typeof window !== 'undefined' && typeof window.localStorage !== 'undefined' && typeof window.localStorage.setItem === 'function') {
      window.localStorage.setItem('cms_auth_token', token);
    }

    return {
      user,
      token,
      message: rawResponse?.message,
    };
  },

  /**
   * Request password recovery link/code
   * POST /api/v1/auth/forgot-password
   */
  async forgotPassword(payload: ForgotPasswordPayload): Promise<ApiResponseStatus> {
    const rawResponse = await apiRequest<any>('/auth/forgot-password', {
      method: 'POST',
      body: { identifier: payload.identifier.trim() },
    });

    return {
      success: rawResponse?.success !== false,
      message: rawResponse?.message || 'Password reset instructions have been sent.',
    };
  },

  /**
   * Retrieve active session user
   * GET /api/v1/auth/session
   */
  async getSession(): Promise<UserProfile | null> {
    try {
      const sessionUrl =
        process.env.NEXT_PUBLIC_AUTH_SESSION_URL || '/auth/session';
      const rawResponse = await apiRequest<any>(sessionUrl, {
        method: 'GET',
      });

      const user: UserProfile = rawResponse?.user || rawResponse?.data?.user || rawResponse?.data;
      if (isValidUserProfile(user)) {
        return user;
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Logout user and clear tokens
   * POST /api/v1/auth/logout
   */
  async logout(): Promise<void> {
    try {
      await apiRequest<any>('/auth/logout', {
        method: 'POST',
      });
    } catch {
      // Best-effort logout: ignore network failures during logout
    } finally {
      if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined' && typeof window.localStorage.removeItem === 'function') {
        window.localStorage.removeItem('cms_auth_token');
      }
    }
  },
};
