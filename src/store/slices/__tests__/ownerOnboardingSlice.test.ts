import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ownerOnboardingSlice,
  setStep,
  completeStep,
  restoreDraft,
  resetOnboarding,
  updateOwnerDetails,
} from '../ownerOnboardingSlice';

test('ownerOnboardingSlice: initialState sets default values', () => {
  const state = ownerOnboardingSlice.reducer(undefined, { type: '@@INIT' });
  assert.equal(state.currentStep, 1);
  assert.equal(state.furthestStepCompleted, 0);
  assert.equal(state.ownerDetails.fullName, '');
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

  // Does not regress if completeStep is called with a lower number
  state = ownerOnboardingSlice.reducer(state, completeStep(1));
  assert.equal(state.furthestStepCompleted, 2);
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
  let state = ownerOnboardingSlice.reducer(undefined, completeStep(3));
  state = ownerOnboardingSlice.reducer(
    state,
    updateOwnerDetails({ fullName: 'Alice' })
  );

  state = ownerOnboardingSlice.reducer(state, resetOnboarding());
  assert.equal(state.currentStep, 1);
  assert.equal(state.furthestStepCompleted, 0);
  assert.equal(state.ownerDetails.fullName, '');
});
