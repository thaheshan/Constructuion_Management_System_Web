import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import ownerOnboardingReducer from './slices/ownerOnboardingSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      ownerOnboarding: ownerOnboardingReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

