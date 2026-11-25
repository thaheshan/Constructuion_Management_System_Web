import test from 'node:test';
import assert from 'node:assert/strict';
import { ApiError, getBaseApiUrl, apiRequest } from '../apiClient';
import { authService } from '../authService';
import { UserProfile } from '@/types/auth';

// Helper mock user
const mockUser: UserProfile = {
  id: 'usr-123',
  fullName: 'John Doe',
  email: 'john@example.com',
  phone: '0771234567',
  role: 'OWNER',
};

// Simple in-memory mock for localStorage
const createMockLocalStorage = () => {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, String(value));
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
};

test('ApiError sets message, status, and custom data properly', () => {
  const err = new ApiError('Invalid email', 400, { field: 'email' });
  assert.equal(err.name, 'ApiError');
  assert.equal(err.message, 'Invalid email');
  assert.equal(err.status, 400);
  assert.deepEqual(err.data, { field: 'email' });
});

test('getBaseApiUrl returns default URL or sanitizes NEXT_PUBLIC_API_URL', () => {
  const originalEnv = process.env.NEXT_PUBLIC_API_URL;
  try {
    delete process.env.NEXT_PUBLIC_API_URL;
    assert.equal(getBaseApiUrl(), 'http://localhost:5000/api/v1');

    process.env.NEXT_PUBLIC_API_URL = 'https://api.cms.lk/api/v1/';
    assert.equal(getBaseApiUrl(), 'https://api.cms.lk/api/v1');
  } finally {
    if (originalEnv !== undefined) {
      process.env.NEXT_PUBLIC_API_URL = originalEnv;
    } else {
      delete process.env.NEXT_PUBLIC_API_URL;
    }
  }
});

test('apiRequest handles successful JSON responses', async () => {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      return new Response(JSON.stringify({ success: true, data: { count: 42 } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    };

    const res = await apiRequest<{ success: boolean; data: { count: number } }>('/test-endpoint');
    assert.equal(res.success, true);
    assert.equal(res.data.count, 42);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('apiRequest parses and throws ApiError from structured server error', async () => {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async () => {
      return new Response(JSON.stringify({ message: 'User account is locked' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    };

    await assert.rejects(
      async () => {
        await apiRequest('/forbidden-route');
      },
      (err: any) => {
        assert.ok(err instanceof ApiError);
        assert.equal(err.status, 403);
        assert.equal(err.message, 'User account is locked');
        return true;
      }
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('apiRequest falls back to standard HTTP status messages on blank error body', async () => {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async () => {
      return new Response('', {
        status: 401,
      });
    };

    await assert.rejects(
      async () => {
        await apiRequest('/unauthorized-route');
      },
      (err: any) => {
        assert.ok(err instanceof ApiError);
        assert.equal(err.status, 401);
        assert.equal(err.message, 'Invalid credentials. Please verify and try again.');
        return true;
      }
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('authService.login sends email payload when identifier has @', async () => {
  const originalFetch = globalThis.fetch;
  let capturedBody: any = null;

  try {
    globalThis.fetch = async (_input, init) => {
      capturedBody = JSON.parse(init?.body as string);
      return new Response(
        JSON.stringify({
          user: mockUser,
          token: 'jwt-token-xyz',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    };

    const result = await authService.login({
      identifier: 'Test@Example.com ',
      password: 'SecurePassword123!',
    });

    assert.deepEqual(capturedBody, {
      email: 'test@example.com',
      password: 'SecurePassword123!',
    });
    assert.deepEqual(result.user, mockUser);
    assert.equal(result.token, 'jwt-token-xyz');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('authService.login sends phone payload when identifier is phone number', async () => {
  const originalFetch = globalThis.fetch;
  let capturedBody: any = null;

  try {
    globalThis.fetch = async (_input, init) => {
      capturedBody = JSON.parse(init?.body as string);
      return new Response(
        JSON.stringify({
          user: mockUser,
          token: 'token-abc',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    };

    await authService.login({
      identifier: ' 0771234567 ',
      password: 'Password123!',
    });

    assert.deepEqual(capturedBody, {
      phone: '0771234567',
      password: 'Password123!',
      identifier: '0771234567',
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('authService.login rejects when response user shape is invalid', async () => {
  const originalFetch = globalThis.fetch;

  try {
    globalThis.fetch = async () => {
      return new Response(
        JSON.stringify({
          user: { invalid: 'shape' },
          token: 'some-token',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    };

    await assert.rejects(
      async () => {
        await authService.login({
          identifier: 'user@cms.lk',
          password: 'Password123!',
        });
      },
      /invalid user profile format/
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('authService.sendOtp cleans phone whitespace and posts to /auth/otp/send', async () => {
  const originalFetch = globalThis.fetch;
  let capturedBody: any = null;
  let capturedUrl = '';

  try {
    globalThis.fetch = async (input, init) => {
      capturedUrl = String(input);
      capturedBody = JSON.parse(init?.body as string);
      return new Response(
        JSON.stringify({ success: true, message: 'OTP sent' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    };

    const res = await authService.sendOtp({ phone: '+94 77 123 4567' });
    assert.ok(capturedUrl.includes('/auth/otp/send'));
    assert.deepEqual(capturedBody, { phone: '+94771234567' });
    assert.equal(res.success, true);
    assert.equal(res.message, 'OTP sent');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('authService.verifyOtp validates OTP code and returns authenticated session', async () => {
  const originalFetch = globalThis.fetch;
  let capturedBody: any = null;

  try {
    globalThis.fetch = async (_input, init) => {
      capturedBody = JSON.parse(init?.body as string);
      return new Response(
        JSON.stringify({
          user: mockUser,
          token: 'otp-verified-token',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    };

    const res = await authService.verifyOtp({
      phone: '+94 77 999 8888',
      code: ' 123456 ',
    });

    assert.deepEqual(capturedBody, {
      phone: '+94779998888',
      code: '123456',
    });
    assert.deepEqual(res.user, mockUser);
    assert.equal(res.token, 'otp-verified-token');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('authService.forgotPassword trims identifier and sends recovery request', async () => {
  const originalFetch = globalThis.fetch;
  let capturedBody: any = null;
  let capturedUrl = '';

  try {
    globalThis.fetch = async (input, init) => {
      capturedUrl = String(input);
      capturedBody = JSON.parse(init?.body as string);
      return new Response(
        JSON.stringify({ success: true, message: 'Reset email sent' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    };

    const res = await authService.forgotPassword({ identifier: ' user@domain.com ' });
    assert.ok(capturedUrl.includes('/auth/forgot-password'));
    assert.deepEqual(capturedBody, { identifier: 'user@domain.com' });
    assert.equal(res.success, true);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('authService.getSession returns valid user or null on failure', async () => {
  const originalFetch = globalThis.fetch;

  try {
    // 1. Success case
    globalThis.fetch = async () => {
      return new Response(JSON.stringify({ user: mockUser }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    };
    const user = await authService.getSession();
    assert.deepEqual(user, mockUser);

    // 2. 401 Unauthorized case
    globalThis.fetch = async () => {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    };
    const nullUser = await authService.getSession();
    assert.equal(nullUser, null);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('authService.logout clears token and handles failure gracefully', async () => {
  const originalFetch = globalThis.fetch;
  const mockStorage = createMockLocalStorage();
  mockStorage.setItem('cms_auth_token', 'token-to-be-removed');

  // Assign window mock for localStorage
  const originalWindow = (globalThis as any).window;
  (globalThis as any).window = { localStorage: mockStorage };

  try {
    // Even if logout endpoint returns 500, local token must be cleared
    globalThis.fetch = async () => {
      return new Response('Server error', { status: 500 });
    };

    await authService.logout();
    assert.equal(mockStorage.getItem('cms_auth_token'), null);
  } finally {
    globalThis.fetch = originalFetch;
    (globalThis as any).window = originalWindow;
  }
});
