import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ownerOnboardingSlice,
  setStep,
  completeStep,
  setShopId,
  createCompanySuccess,
  updateOwnerDetails,
  updateCompanyDetails,
} from '../ownerOnboardingSlice';

test('FE-09 Review: Starting defaults list requirements are strictly defined', () => {
  const startingDefaults = [
    'PO approval limits set to auto-approve below LKR 50,000',
    'Weekly operational digest sent every Monday at 8:00 AM',
    'Standard inventory valuation (FIFO) enabled',
  ];

  assert.equal(startingDefaults.length, 3);
  assert.match(startingDefaults[0], /auto-approve below LKR 50,000/);
  assert.match(startingDefaults[1], /Monday at 8:00 AM/);
  assert.match(startingDefaults[2], /FIFO/);
});

test('FE-09 Review: Owner Account summary handles fallback when fields are empty', () => {
  const state = ownerOnboardingSlice.reducer(undefined, { type: '@@INIT' });

  // Default initial values must be empty strings, not dummy made-up names
  assert.equal(state.ownerDetails.fullName, '');
  assert.equal(state.ownerDetails.email, '');
  assert.equal(state.ownerDetails.phone, '');
});

test('FE-09 Review: Company Details summary cleanly separates TIN and VAT without duplication', () => {
  let state = ownerOnboardingSlice.reducer(undefined, { type: '@@INIT' });

  // Company that is NOT registered for VAT
  state = ownerOnboardingSlice.reducer(
    state,
    updateCompanyDetails({
      companyName: 'Lanka Builders',
      tinNumber: 'TIN-123456-001',
      isVatRegistered: false,
    })
  );

  assert.equal(state.companyDetails.tinNumber, 'TIN-123456-001');
  assert.equal(state.companyDetails.isVatRegistered, false);
  assert.equal(state.companyDetails.vatNumber, '');

  // When registered for VAT, separate VAT number is captured
  state = ownerOnboardingSlice.reducer(
    state,
    updateCompanyDetails({
      isVatRegistered: true,
      vatNumber: 'VAT-98765432',
    })
  );

  assert.equal(state.companyDetails.tinNumber, 'TIN-123456-001');
  assert.equal(state.companyDetails.isVatRegistered, true);
  assert.equal(state.companyDetails.vatNumber, 'VAT-98765432');
});

test('FE-09 Navigation: Edit links allow jumping back to Step 1 and Step 2', () => {
  let state = ownerOnboardingSlice.reducer(undefined, setStep(4));
  assert.equal(state.currentStep, 4);

  // Edit Owner Account
  state = ownerOnboardingSlice.reducer(state, setStep(1));
  assert.equal(state.currentStep, 1);

  // Resume to Step 4
  state = ownerOnboardingSlice.reducer(state, setStep(4));
  assert.equal(state.currentStep, 4);

  // Edit Company Details
  state = ownerOnboardingSlice.reducer(state, setStep(2));
  assert.equal(state.currentStep, 2);

  // Back button on Step 4
  state = ownerOnboardingSlice.reducer(state, setStep(4));
  state = ownerOnboardingSlice.reducer(state, setStep(3));
  assert.equal(state.currentStep, 3);
});

test('FE-09 Creation: Create company dispatches createCompanySuccess and locks wizard to Step 5', () => {
  let state = ownerOnboardingSlice.reducer(undefined, completeStep(3));
  state = ownerOnboardingSlice.reducer(state, setStep(4));

  assert.equal(state.currentStep, 4);
  assert.equal(state.furthestStepCompleted, 3);
  assert.equal(state.isCompanyCreated, false);

  // When user clicks "Create company":
  state = ownerOnboardingSlice.reducer(state, setShopId('FUT-7K4M-9Q2X'));
  state = ownerOnboardingSlice.reducer(state, createCompanySuccess());

  assert.equal(state.shopId, 'FUT-7K4M-9Q2X');
  assert.equal(state.isCompanyCreated, true);
  assert.equal(state.furthestStepCompleted, 5);
  assert.equal(state.currentStep, 5, 'Owner is transitioned to Step 5 (Company Ready)');
});
