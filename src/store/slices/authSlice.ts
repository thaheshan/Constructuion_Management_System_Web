/**
 * ARCHITECTURAL NOTICE - STATE MANAGEMENT & SECURITY BOUNDARIES:
 * Tokens and roles stored in Redux memory are lost upon browser refresh and provide UX-level state only.
 * For production, session management must be backed by an httpOnly, Secure cookie managed by the backend
 * and verified in server-side Next.js middleware (middleware.ts).
 * Never persist sensitive auth tokens to unencrypted browser localStorage.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, UserProfile, UserRole } from '../../types/auth';

const initialState: AuthState = {
  user: null,
  role: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User | UserProfile; token: string }>
    ) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.role = (action.payload.user.role as UserRole) || null;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: User | UserProfile; token: string }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.role = (action.payload.user.role as UserRole) || null;
      state.token = action.payload.token;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    /**
     * @deprecated TEMPORARY_MOCK_AUTH:
     * This action is strictly for local scaffold verification and testing before real API integration.
     * Do NOT ship to production or connect to real login endpoints.
     */
    mockLogin: (state, action: PayloadAction<{ email: string; role?: UserRole; name?: string }>) => {
      const assignedRole = action.payload.role || 'STAFF';
      state.isLoading = false;
      state.isAuthenticated = true;
      state.role = assignedRole;
      state.user = {
        id: 'cms_usr_' + Math.random().toString(36).substring(2, 9),
        email: action.payload.email,
        name: action.payload.name || action.payload.email.split('@')[0],
        role: assignedRole,
      };
      state.token = 'cms_mock_jwt_token_' + Date.now();
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  setCredentials,
  setLoading,
  setError,
  clearError,
  logout,
  mockLogin,
} = authSlice.actions;

export default authSlice.reducer;
