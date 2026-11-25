import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ownerOnboardingSlice,
  setStep,
  completeStep,
  setShopId,
  createCompanySuccess,
  restoreCreatedCompany,
  restoreDraft,
  resetOnboarding,
  updateOwnerDetails,
  verifyOtp,
} from '../ownerOnboardingSlice';

test('ownerOnboardingSlice: initialState sets default values', () => {
  const state = ownerOnboardingSlice.reducer(undefined, { type: '@@INIT' });
  assert.equal(state.currentStep, 1);
  assert.equal(state.furthestStepCompleted, 0);
  assert.equal(state.ownerDetails.fullName, '');
  assert.equal(state.shopId, 'FUT-7K4M-9Q2X');
  assert.equal(state.isCompanyCreated, false);
  assert.equal(state.isDraftSaved, false);
});

test('ownerOnboardingSlice: setStep updates currentStep', () => {
  const state = ownerOnboardingSlice.reducer(undefined, setStep(2));
  assert.equal(state.currentStep, 2);
});

test('ownerOnboardingSlice: completeStep records furthest completed step monotonically', () => {
  let state = ownerOnboardingSlice.reducer(undefined, completeStep(1));
  assert.equal(state.furthestStepCompleted, 1);

  state = ownerOnboardingSlice.reducer(state, completeStep(2));
  assert.equal(state.furthestStepCompleted, 2);

  state = ownerOnboardingSlice.reducer(state, completeStep(3));
  assert.equal(state.furthestStepCompleted, 3);

  state = ownerOnboardingSlice.reducer(state, completeStep(4));
  assert.equal(state.furthestStepCompleted, 4);

  // Does not regress if completeStep is called with a lower number
  state = ownerOnboardingSlice.reducer(state, completeStep(1));
  assert.equal(state.furthestStepCompleted, 4);
});

test('ownerOnboardingSlice: setShopId updates shopId value', () => {
  const state = ownerOnboardingSlice.reducer(
    undefined,
    setShopId('FUT-9A8B-7C6D')
  );
  assert.equal(state.shopId, 'FUT-9A8B-7C6D');
});

test('ownerOnboardingSlice: updateOwnerDetails resets verification and regresses step when phone changes', () => {
  // Simulate completing Step 3 (verified)
  let state = ownerOnboardingSlice.reducer(undefined, completeStep(3));
  state = ownerOnboardingSlice.reducer(state, setStep(4));
  state = ownerOnboardingSlice.reducer(state, verifyOtp('123456'));
  assert.equal(state.verification.isVerified, true);
  assert.equal(state.furthestStepCompleted, 3);

  // Owner edits contact in Step 1: changes phone number
  state = ownerOnboardingSlice.reducer(
    state,
    updateOwnerDetails({ phone: '779876543' })
  );

  // Verification must be invalidated and furthest step capped back at 2
  assert.equal(state.verification.isVerified, false, 'isVerified must be reset to false');
  assert.deepEqual(state.verification.code, ['', '', '', '', '', ''], 'OTP code digits must be cleared');
  assert.equal(state.verification.error, null);
  assert.equal(state.furthestStepCompleted, 2, 'furthestStepCompleted must regress to 2 to enforce re-verification');
});

test('ownerOnboardingSlice: updateOwnerDetails resets verification when email changes', () => {
  let state = ownerOnboardingSlice.reducer(undefined, completeStep(3));
  state = ownerOnboardingSlice.reducer(state, verifyOtp('123456'));
  assert.equal(state.verification.isVerified, true);

  // Owner edits email in Step 1
  state = ownerOnboardingSlice.reducer(
    state,
    updateOwnerDetails({ email: 'newowner@futuraconst.com' })
  );

  assert.equal(state.verification.isVerified, false);
  assert.equal(state.furthestStepCompleted, 2);
});

test('ownerOnboardingSlice: createCompanySuccess locks wizard and advances to Step 5', () => {
  let state = ownerOnboardingSlice.reducer(undefined, completeStep(4));
  state = ownerOnboardingSlice.reducer(state, setStep(4));

  state = ownerOnboardingSlice.reducer(state, createCompanySuccess());
  assert.equal(state.isCompanyCreated, true);
  assert.equal(state.furthestStepCompleted, 5);
  assert.equal(state.currentStep, 5);
});

test('ownerOnboardingSlice: createCompanySuccess is idempotent and restoreCreatedCompany hydrates refresh state', () => {
  let state = ownerOnboardingSlice.reducer(undefined, setShopId('FUT-ABCD-1234'));
  state = ownerOnboardingSlice.reducer(state, createCompanySuccess());
  state = ownerOnboardingSlice.reducer(state, createCompanySuccess());

  assert.equal(state.isCompanyCreated, true);
  assert.equal(state.shopId, 'FUT-ABCD-1234');
  assert.equal(state.currentStep, 5);

  const hydrated = ownerOnboardingSlice.reducer(
    undefined,
    restoreCreatedCompany({ shopId: 'FUT-WXYZ-9999' })
  );
  assert.equal(hydrated.isCompanyCreated, true);
  assert.equal(hydrated.shopId, 'FUT-WXYZ-9999');
  assert.equal(hydrated.furthestStepCompleted, 5);
  assert.equal(hydrated.currentStep, 5);
});

test('ownerOnboardingSlice: restoreDraft strips password and confirmPassword', () => {
  const untrustedDraftPayload = {
    currentStep: 2,
    furthestStepCompleted: 1,
    ownerDetails: {
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      phonePrefix: '+94',
      phone: '771234567',
      agreedToTerms: true,
      password: 'HackedPassword123!',
      confirmPassword: 'HackedPassword123!',
    } as any,
  };

  const state = ownerOnboardingSlice.reducer(undefined, restoreDraft(untrustedDraftPayload));
  assert.equal(state.ownerDetails.fullName, 'Jane Doe');
  assert.equal(state.ownerDetails.email, 'jane@example.com');
  assert.equal((state.ownerDetails as any).password, '');
  assert.equal((state.ownerDetails as any).confirmPassword, '');
});

test('ownerOnboardingSlice: restoreDraft caps currentStep and furthestStepCompleted at 2', () => {
  // Even if draft had step 3 or 4 saved, restoring draft must never resume into OTP (step 3) or later
  const deepDraftPayload = {
    currentStep: 4,
    furthestStepCompleted: 3,
    ownerDetails: {
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      phonePrefix: '+94',
      phone: '771234567',
      agreedToTerms: true,
    },
  };

  const state = ownerOnboardingSlice.reducer(undefined, restoreDraft(deepDraftPayload));
  assert.equal(state.currentStep, 2, 'Restored step must be capped at Step 2 (Company Details)');
  assert.equal(state.furthestStepCompleted, 2, 'Restored furthest step must be capped at 2');
});

test('ownerOnboardingSlice: resetOnboarding resets state back to initial values', () => {
  let state = ownerOnboardingSlice.reducer(undefined, completeStep(4));
  state = ownerOnboardingSlice.reducer(
    state,
    updateOwnerDetails({ fullName: 'Alice' })
  );

  state = ownerOnboardingSlice.reducer(state, resetOnboarding());
  assert.equal(state.currentStep, 1);
  assert.equal(state.furthestStepCompleted, 0);
  assert.equal(state.ownerDetails.fullName, '');
  assert.equal(state.shopId, 'FUT-7K4M-9Q2X');
  assert.equal(state.isCompanyCreated, false);
});
