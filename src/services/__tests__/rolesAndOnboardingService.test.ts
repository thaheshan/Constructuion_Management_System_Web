import test from 'node:test';
import assert from 'node:assert/strict';
import { rolesService } from '../rolesService';
import { onboardingService } from '../onboardingService';

test('rolesService.getRoles fetches roles from /roles', async () => {
  const originalFetch = globalThis.fetch;
  let capturedUrl = '';

  try {
    globalThis.fetch = async (input) => {
      capturedUrl = String(input);
      return new Response(
        JSON.stringify([
          {
            id: 'role-1',
            code: 'OWNER',
            name: 'Owner',
            description: 'Company owner',
            scope: 'COMPANY_WIDE',
            tags: ['BILLING'],
            requiresApproval: false,
          },
        ]),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    };

    const roles = await rolesService.getRoles();
    assert.ok(capturedUrl.includes('/roles'));
    assert.equal(roles.length, 1);
    assert.equal(roles[0].code, 'OWNER');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('onboardingService.saveOwnerDetails canonicalizes phone and posts to /onboarding/owner/details', async () => {
  const originalFetch = globalThis.fetch;
  let capturedUrl = '';
  let capturedBody: any = null;

  try {
    globalThis.fetch = async (input, init) => {
      capturedUrl = String(input);
      capturedBody = JSON.parse(init?.body as string);
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Saved',
          step: 1,
          status: 'IN_PROGRESS',
          owner: {
            id: 'usr-1',
            fullName: 'Kamal Perera',
            email: 'kamal@futura.lk',
            phone: '+94771234567',
            nic: '199012345678',
            role: 'OWNER',
            isMasterOwner: true,
          },
          tokens: {
            accessToken: 'sample-jwt-token',
            refreshToken: 'sample-refresh-token',
            tokenType: 'Bearer',
            expiresIn: 900,
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    };

    const result = await onboardingService.saveOwnerDetails({
      fullName: 'Kamal Perera',
      email: 'Kamal@Futura.lk ',
      phonePrefix: '+94',
      phone: '077 123 4567',
      password: 'SecurePassword123!',
      agreedToTerms: true,
      companyName: 'Futura Construction',
    });

    assert.ok(capturedUrl.includes('/onboarding/owner/details'));
    assert.equal(capturedBody.phone, '+94771234567');
    assert.equal(capturedBody.email, 'kamal@futura.lk');
    assert.equal(capturedBody.nic, '199012345678');
    assert.equal(result.success, true);
    assert.equal(result.tokens?.accessToken, 'sample-jwt-token');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('onboardingService.getDraft sends GET to /onboarding/draft', async () => {
  const originalFetch = globalThis.fetch;
  let capturedUrl = '';

  try {
    globalThis.fetch = async (input) => {
      capturedUrl = String(input);
      return new Response(
        JSON.stringify({
          success: true,
          step: 1,
          status: 'IN_PROGRESS',
          draft: { id: 'd-1', step: 1, data: {} },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    };

    const draft = await onboardingService.getDraft();
    assert.ok(capturedUrl.includes('/onboarding/draft'));
    assert.equal(draft.success, true);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
