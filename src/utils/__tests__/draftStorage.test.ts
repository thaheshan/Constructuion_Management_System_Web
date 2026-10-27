import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidDraft,
  DRAFT_EXPIRY_MS,
  OwnerOnboardingDraft,
} from '../draftStorage';

test('isValidDraft: rejects null, undefined, and non-objects', () => {
  assert.equal(isValidDraft(null), false);
  assert.equal(isValidDraft(undefined), false);
  assert.equal(isValidDraft('string'), false);
  assert.equal(isValidDraft(123), false);
});

test('isValidDraft: rejects drafts older than 7 days', () => {
  const expiredDraft: OwnerOnboardingDraft = {
    version: 1,
    savedAt: Date.now() - (DRAFT_EXPIRY_MS + 1000), // Expired 1 second past 7 days
    currentStep: 2,
    furthestStepCompleted: 1,
    ownerDetails: {
      fullName: 'John Silva',
      email: 'john@example.com',
      phonePrefix: '+94',
      phone: '771234567',
      agreedToTerms: true,
    },
    companyDetails: {
      companyName: 'Acme Builders',
    },
  };

  assert.equal(isValidDraft(expiredDraft), false);
});

test('isValidDraft: accepts valid draft within 7 days', () => {
  const freshDraft: OwnerOnboardingDraft = {
    version: 1,
    savedAt: Date.now() - 1000 * 60 * 60, // 1 hour ago
    currentStep: 2,
    furthestStepCompleted: 1,
    ownerDetails: {
      fullName: 'John Silva',
      email: 'john@example.com',
      phonePrefix: '+94',
      phone: '771234567',
      agreedToTerms: true,
    },
    companyDetails: {
      companyName: 'Acme Builders',
    },
  };

  assert.equal(isValidDraft(freshDraft), true);
});

test('isValidDraft: strictly rejects draft containing password or confirmPassword', () => {
  const insecureDraft = {
    version: 1,
    savedAt: Date.now(),
    currentStep: 2,
    furthestStepCompleted: 1,
    ownerDetails: {
      fullName: 'John Silva',
      email: 'john@example.com',
      phonePrefix: '+94',
      phone: '771234567',
      agreedToTerms: true,
      password: 'SecretPassword123!',
    },
    companyDetails: {},
  };

  assert.equal(isValidDraft(insecureDraft), false);

  const confirmInsecureDraft = {
    version: 1,
    savedAt: Date.now(),
    currentStep: 2,
    furthestStepCompleted: 1,
    ownerDetails: {
      fullName: 'John Silva',
      email: 'john@example.com',
      phonePrefix: '+94',
      phone: '771234567',
      agreedToTerms: true,
      confirmPassword: 'SecretPassword123!',
    },
    companyDetails: {},
  };

  assert.equal(isValidDraft(confirmInsecureDraft), false);
});

test('isValidDraft: rejects malformed ownerDetails or missing timestamps', () => {
  assert.equal(
    isValidDraft({
      savedAt: 'invalid-date',
      ownerDetails: { fullName: 'John', email: 'john@example.com' },
      companyDetails: {},
    }),
    false
  );

  assert.equal(
    isValidDraft({
      savedAt: Date.now(),
      ownerDetails: null,
      companyDetails: {},
    }),
    false
  );

  assert.equal(
    isValidDraft({
      savedAt: Date.now(),
      ownerDetails: { fullName: 123, email: 'john@example.com' },
      companyDetails: {},
    }),
    false
  );
});
