import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  OwnerOnboardingState,
  OwnerDetails,
  CompanyDetails,
  VerificationChannel,
} from '@/types/onboarding';

const initialOwnerDetails: OwnerDetails = {
  fullName: '',
  email: '',
  phonePrefix: '+94',
  phone: '',
  password: '',
  confirmPassword: '',
  agreedToTerms: false,
};

const initialCompanyDetails: CompanyDetails = {
  companyName: '',
  businessType: 'Private Limited Company (Pvt Ltd)',
  businessRegNo: '',
  companyPhonePrefix: '+94',
  companyPhone: '',
  companyEmail: '',
  addressLine: '',
  city: '',
  district: 'Colombo',
  vatTinNumber: '',
  epfEmployerNo: '',
  etfEmployerNo: '',
  isVatRegistered: false,
  currency: 'LKR Rs. (Sri Lankan Rupee)',
  financialYearStart: '1 April',
  logoBase64: undefined,
  logoFileName: undefined,
};

const initialState: OwnerOnboardingState = {
  currentStep: 1,
  ownerDetails: initialOwnerDetails,
  companyDetails: initialCompanyDetails,
  verification: {
    code: ['', '', '', '', '', ''],
    channel: 'SMS',
    destination: '',
    resendCountdown: 59,
    isVerified: false,
    attemptsRemaining: 5,
    lockedUntil: null,
    error: null,
  },
  shopId: 'FUT-7K4M-9Q2X',
  isDraftSaved: false,
  lastSavedAt: null,
};

export const ownerOnboardingSlice = createSlice({
  name: 'ownerOnboarding',
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    updateOwnerDetails: (
      state,
      action: PayloadAction<Partial<OwnerDetails>>
    ) => {
      state.ownerDetails = { ...state.ownerDetails, ...action.payload };
      state.isDraftSaved = false;
    },
    updateCompanyDetails: (
      state,
      action: PayloadAction<Partial<CompanyDetails>>
    ) => {
      state.companyDetails = { ...state.companyDetails, ...action.payload };
      state.isDraftSaved = false;
    },
    setVerificationDigit: (
      state,
      action: PayloadAction<{ index: number; digit: string }>
    ) => {
      const { index, digit } = action.payload;
      if (index >= 0 && index < 6) {
        state.verification.code[index] = digit;
        state.verification.error = null;
      }
    },
    setVerificationCode: (state, action: PayloadAction<string[]>) => {
      state.verification.code = action.payload.slice(0, 6);
      state.verification.error = null;
    },
    setVerificationChannel: (
      state,
      action: PayloadAction<VerificationChannel>
    ) => {
      state.verification.channel = action.payload;
      state.verification.resendCountdown = 59;
      state.verification.code = ['', '', '', '', '', ''];
      state.verification.error = null;
    },
    setVerificationDestination: (state, action: PayloadAction<string>) => {
      state.verification.destination = action.payload;
    },
    decrementCountdown: (state) => {
      if (state.verification.resendCountdown > 0) {
        state.verification.resendCountdown -= 1;
      }
    },
    resetCountdown: (state, action: PayloadAction<number | undefined>) => {
      state.verification.resendCountdown = action.payload ?? 59;
    },
    verifyOtp: (state, action: PayloadAction<string>) => {
      const enteredCode = action.payload;
      const now = Date.now();

      // Check lockout status
      if (state.verification.lockedUntil && now < state.verification.lockedUntil) {
        const minutesLeft = Math.ceil(
          (state.verification.lockedUntil - now) / (60 * 1000)
        );
        state.verification.error = `Too many failed attempts. Verification is locked for ${minutesLeft} more minute(s).`;
        return;
      }

      // Reset lockout if expired
      if (state.verification.lockedUntil && now >= state.verification.lockedUntil) {
        state.verification.lockedUntil = null;
        state.verification.attemptsRemaining = 5;
      }

      // Validate 6-digit numeric OTP code
      if (/^[0-9]{6}$/.test(enteredCode)) {
        state.verification.isVerified = true;
        state.verification.error = null;
        state.verification.attemptsRemaining = 5;
      } else {
        state.verification.isVerified = false;
        state.verification.attemptsRemaining = Math.max(
          0,
          state.verification.attemptsRemaining - 1
        );

        if (state.verification.attemptsRemaining === 0) {
          state.verification.lockedUntil = Date.now() + 5 * 60 * 1000; // 5 min lockout
          state.verification.error =
            'Too many failed attempts. Verification locked for 5 minutes.';
        } else {
          state.verification.error = `Invalid verification code. Please check and try again (${state.verification.attemptsRemaining} attempts left).`;
        }
      }
    },
    setShopId: (state, action: PayloadAction<string>) => {
      state.shopId = action.payload;
    },
    saveDraftSuccess: (state) => {
      state.isDraftSaved = true;
      state.lastSavedAt = new Date().toISOString();
    },
    restoreDraft: (
      state,
      action: PayloadAction<Partial<OwnerOnboardingState>>
    ) => {
      if (action.payload.ownerDetails) {
        state.ownerDetails = {
          ...state.ownerDetails,
          ...action.payload.ownerDetails,
        };
      }
      if (action.payload.companyDetails) {
        state.companyDetails = {
          ...state.companyDetails,
          ...action.payload.companyDetails,
        };
      }
      if (typeof action.payload.currentStep === 'number') {
        state.currentStep = action.payload.currentStep;
      }
      state.isDraftSaved = true;
      state.lastSavedAt = action.payload.lastSavedAt || new Date().toISOString();
    },
    resetOnboarding: () => initialState,
  },
});

export const {
  setStep,
  updateOwnerDetails,
  updateCompanyDetails,
  setVerificationDigit,
  setVerificationCode,
  setVerificationChannel,
  setVerificationDestination,
  decrementCountdown,
  resetCountdown,
  verifyOtp,
  setShopId,
  saveDraftSuccess,
  restoreDraft,
  resetOnboarding,
} = ownerOnboardingSlice.actions;

export default ownerOnboardingSlice.reducer;
