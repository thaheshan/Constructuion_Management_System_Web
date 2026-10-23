import test from 'node:test';
import assert from 'node:assert/strict';
import authReducer, {
  sessionCheckStart,
  sessionCheckComplete,
  sessionCheckFailure,
  sessionCheckAbort,
  setCredentials,
  resetSessionCheck,
} from '../authSlice';
import { isValidUserProfile, UserProfile } from '../../../types/auth';

test('authSlice: sessionCheckStart sets isLoading to true and clears error', () => {
  const previousState = {
    user: null,
    role: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    isSessionInitialized: false,
    error: 'Old error',
  };

  const nextState = authReducer(previousState, sessionCheckStart());
  assert.equal(nextState.isLoading, true);
  assert.equal(nextState.error, null);
  assert.equal(nextState.isSessionInitialized, false);
});

test('authSlice: sessionCheckAbort resets isLoading to false without marking session initialized', () => {
  const previousState = {
    user: null,
    role: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    isSessionInitialized: false,
    error: null,
  };

  const nextState = authReducer(previousState, sessionCheckAbort());
  assert.equal(nextState.isLoading, false);
  assert.equal(nextState.isSessionInitialized, false);
});

test('authSlice: setCredentials resets isLoading to false and marks session initialized and authenticated', () => {
  const previousState = {
    user: null,
    role: null,
    token: null,
    isAuthenticated: false,
    isLoading: true, // was set by sessionCheckStart
    isSessionInitialized: false,
    error: null,
  };

  const mockUser: UserProfile = {
    id: 'user_123',
    email: 'engineer@futura.com',
    fullName: 'Jane Doe',
    role: 'PROJECT_MANAGER',
  };

  const nextState = authReducer(
    previousState,
    setCredentials({ user: mockUser, token: null })
  );

  // Confirms setCredentials does NOT leave isLoading stuck as true
  assert.equal(nextState.isLoading, false);
  assert.equal(nextState.isSessionInitialized, true);
  assert.equal(nextState.isAuthenticated, true);
  assert.equal(nextState.user?.email, 'engineer@futura.com');
  assert.equal(nextState.role, 'PROJECT_MANAGER');
  assert.equal(nextState.token, null);
});

test('authSlice: sessionCheckComplete marks session initialized as unauthenticated', () => {
  const previousState = {
    user: null,
    role: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    isSessionInitialized: false,
    error: null,
  };

  const nextState = authReducer(previousState, sessionCheckComplete());
  assert.equal(nextState.isLoading, false);
  assert.equal(nextState.isSessionInitialized, true);
  assert.equal(nextState.isAuthenticated, false);
});

test('authSlice: sessionCheckFailure captures network/5xx error message', () => {
  const previousState = {
    user: null,
    role: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    isSessionInitialized: false,
    error: null,
  };

  const nextState = authReducer(
    previousState,
    sessionCheckFailure('Backend service unavailable (HTTP 503)')
  );
  assert.equal(nextState.isLoading, false);
  assert.equal(nextState.isSessionInitialized, true);
  assert.equal(nextState.isAuthenticated, false);
  assert.equal(nextState.error, 'Backend service unavailable (HTTP 503)');
});

test('authSlice: resetSessionCheck clears initialized state for retry', () => {
  const previousState = {
    user: null,
    role: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    isSessionInitialized: true,
    error: 'Network failure',
  };

  const nextState = authReducer(previousState, resetSessionCheck());
  assert.equal(nextState.isSessionInitialized, false);
  assert.equal(nextState.error, null);
  assert.equal(nextState.isLoading, false);
});

test('isValidUserProfile validates user profile shapes', () => {
  assert.equal(
    isValidUserProfile({
      id: '1',
      email: 'test@example.com',
      fullName: 'Test User',
      role: 'STAFF',
    }),
    true
  );

  assert.equal(isValidUserProfile(null), false);
  assert.equal(isValidUserProfile({}), false);
  assert.equal(
    isValidUserProfile({
      id: '1',
      email: 'invalid-email',
      fullName: 'Test User',
      role: 'INVALID_ROLE',
    }),
    false
  );
  assert.equal(
    isValidUserProfile({
      id: '',
      email: 'test@example.com',
      fullName: 'Test',
      role: 'STAFF',
    }),
    false
  );
});

test('Redirect decision logic: authenticated vs unauthenticated', () => {
  function getRedirectTarget(isSessionInitialized: boolean, isAuthenticated: boolean) {
    if (!isSessionInitialized) return null;
    return isAuthenticated ? '/dashboard' : '/login';
  }

  assert.equal(getRedirectTarget(false, false), null);
  assert.equal(getRedirectTarget(false, true), null);
  assert.equal(getRedirectTarget(true, true), '/dashboard');
  assert.equal(getRedirectTarget(true, false), '/login');
});
