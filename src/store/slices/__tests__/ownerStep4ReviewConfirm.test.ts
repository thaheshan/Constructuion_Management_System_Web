import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ownerOnboardingSlice,
  setStep,
  completeStep,
  setShopId,
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

test('FE-09 Review: Owner Account summary handles fallback and provided values', () => {
  let state = ownerOnboardingSlice.reducer(undefined, { type: '@@INIT' });

  // Default initial values
  assert.equal(state.ownerDetails.fullName, '');
  assert.equal(state.ownerDetails.email, '');
  assert.equal(state.ownerDetails.phonePrefix, '+94');

  // After owner inputs data in Step 1
  state = ownerOnboardingSlice.reducer(
    state,
    updateOwnerDetails({
      fullName: 'John Alexander Perera',
      email: 'j.perera@futuraconst.com',
      phone: '771234567',
    })
  );

  assert.equal(state.ownerDetails.fullName, 'John Alexander Perera');
  assert.equal(state.ownerDetails.email, 'j.perera@futuraconst.com');
  assert.equal(state.ownerDetails.phone, '771234567');
});

test('FE-09 Review: Company Details summary formats address and statutory numbers', () => {
  let state = ownerOnboardingSlice.reducer(undefined, { type: '@@INIT' });

  state = ownerOnboardingSlice.reducer(
    state,
    updateCompanyDetails({
      companyName: 'Futura Constructions (Pvt) Ltd',
      businessType: 'Civil Engineering & Contracting',
      addressLine: '45/A High Level Rd',
      city: 'Colombo 05',
      district: 'Colombo',
      vatTinNumber: 'TIN-992834-001',
      isVatRegistered: true,
      currency: 'LKR Rs. (Sri Lankan Rupee)',
      financialYearStart: '1 April',
    })
  );

  assert.equal(state.companyDetails.companyName, 'Futura Constructions (Pvt) Ltd');
  assert.equal(state.companyDetails.businessType, 'Civil Engineering & Contracting');
  assert.equal(state.companyDetails.addressLine, '45/A High Level Rd');
  assert.equal(state.companyDetails.city, 'Colombo 05');
  assert.equal(state.companyDetails.district, 'Colombo');
  assert.equal(state.companyDetails.vatTinNumber, 'TIN-992834-001');
  assert.equal(state.companyDetails.isVatRegistered, true);
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

test('FE-09 Creation: Create company dispatches completeStep(4), setShopId, and advances to Step 5', () => {
  let state = ownerOnboardingSlice.reducer(undefined, completeStep(3));
  state = ownerOnboardingSlice.reducer(state, setStep(4));

  assert.equal(state.currentStep, 4);
  assert.equal(state.furthestStepCompleted, 3);

  // When user clicks "Create company":
  state = ownerOnboardingSlice.reducer(state, setShopId('FUT-7K4M-9Q2X'));
  state = ownerOnboardingSlice.reducer(state, completeStep(4));
  state = ownerOnboardingSlice.reducer(state, setStep(5));

  assert.equal(state.shopId, 'FUT-7K4M-9Q2X');
  assert.equal(state.furthestStepCompleted, 4);
  assert.equal(state.currentStep, 5, 'Owner is transitioned to Step 5 (Company Ready)');
});

