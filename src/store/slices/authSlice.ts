import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, UserProfile } from '../../types/auth';

const initialState: AuthState = {
  user: null,
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
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    // Mock login helper for testing and initial prototype verification
    mockLogin: (state, action: PayloadAction<{ email: string; role?: string; name?: string }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        email: action.payload.email,
        name: action.payload.name || action.payload.email.split('@')[0],
        role: action.payload.role || 'STAFF',
      };
      state.token = 'qs_mock_token_' + Date.now();
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
