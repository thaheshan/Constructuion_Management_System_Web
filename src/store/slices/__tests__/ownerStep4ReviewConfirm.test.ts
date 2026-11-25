import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ownerOnboardingSlice,
  setStep,
  completeStep,
  setShopId,
  createCompanySuccess,
  restoreCreatedCompany,
  updateCompanyDetails,
} from '../ownerOnboardingSlice';
import {
  OWNER_STARTING_DEFAULTS,
  DEFAULT_PO_AUTO_APPROVE_LIMIT_LKR,
  DEFAULT_WEEKLY_DIGEST_SCHEDULE,
  DEFAULT_INVENTORY_VALUATION,
} from '../../../constants/onboardingDefaults';
import {
  saveCreatedCompanyState,
  loadCreatedCompanyState,
  clearCreatedCompanyState,
  COMPANY_CREATED_STORAGE_KEY,
} from '../../../utils/draftStorage';

test('FE-09 Review: Starting defaults come from constants and match requirements', () => {
  assert.equal(DEFAULT_PO_AUTO_APPROVE_LIMIT_LKR, 50000);
  assert.equal(DEFAULT_WEEKLY_DIGEST_SCHEDULE, 'Monday at 8:00 AM');
  assert.equal(DEFAULT_INVENTORY_VALUATION, 'FIFO');

  assert.equal(OWNER_STARTING_DEFAULTS.length, 3);
  assert.match(OWNER_STARTING_DEFAULTS[0], /auto-approve below LKR 50,000/);
  assert.match(OWNER_STARTING_DEFAULTS[1], /Monday at 8:00 AM/);
  assert.match(OWNER_STARTING_DEFAULTS[2], /FIFO/);
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

test('FE-09 Creation: Double-submission and page refresh do not re-create company or overwrite shopId', () => {
  let state = ownerOnboardingSlice.reducer(undefined, setShopId('FUT-1111-2222'));
  state = ownerOnboardingSlice.reducer(state, createCompanySuccess());

  // Second dispatch must be a no-op on isCompanyCreated and shopId
  state = ownerOnboardingSlice.reducer(state, createCompanySuccess());
  assert.equal(state.isCompanyCreated, true);
  assert.equal(state.shopId, 'FUT-1111-2222');
  assert.equal(state.currentStep, 5);

  // Mock browser localStorage to verify persistence across page refresh
  const store = new Map<string, string>();
  const prevWindow = (globalThis as Record<string, unknown>).window;
  const prevStorage = (globalThis as Record<string, unknown>).localStorage;

  (globalThis as Record<string, unknown>).window = {};
  (globalThis as Record<string, unknown>).localStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
  };

  try {
    saveCreatedCompanyState('FUT-1111-2222');
    assert.ok(store.has(COMPANY_CREATED_STORAGE_KEY));

    const loaded = loadCreatedCompanyState();
    assert.ok(loaded);
    assert.equal(loaded.isCompanyCreated, true);
    assert.equal(loaded.shopId, 'FUT-1111-2222');

    // Simulating fresh Redux store on page refresh hydrated from persisted state
    const refreshedState = ownerOnboardingSlice.reducer(
      undefined,
      restoreCreatedCompany({ shopId: loaded.shopId })
    );
    assert.equal(refreshedState.isCompanyCreated, true);
    assert.equal(refreshedState.shopId, 'FUT-1111-2222');
    assert.equal(refreshedState.currentStep, 5);

    clearCreatedCompanyState();
    assert.equal(loadCreatedCompanyState(), null);
  } finally {
    (globalThis as Record<string, unknown>).window = prevWindow;
    (globalThis as Record<string, unknown>).localStorage = prevStorage;
  }
});
