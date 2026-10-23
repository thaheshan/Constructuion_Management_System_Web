'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  sessionCheckStart,
  sessionCheckComplete,
  sessionCheckFailure,
  sessionCheckAbort,
  setCredentials,
} from '@/store/slices/authSlice';
import { isValidUserProfile } from '@/types/auth';

interface AuthBootstrapProps {
  children: React.ReactNode;
}

/**
 * AuthBootstrap: Hydrates authentication session once across all routes on initial app mount.
 * Keeps the visual splash screen decoupled from auth hydration logic.
 */
export function AuthBootstrap({ children }: AuthBootstrapProps) {
  const dispatch = useAppDispatch();
  const { isSessionInitialized } = useAppSelector((state) => state.auth);
  const activeControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Only hydrate if session has not yet been initialized
    if (isSessionInitialized) {
      return;
    }

    const controller = new AbortController();
    activeControllerRef.current = controller;
    const sessionUrl =
      process.env.NEXT_PUBLIC_AUTH_SESSION_URL || '/api/v1/auth/session';

    const checkSession = async () => {
      dispatch(sessionCheckStart());

      try {
        const response = await fetch(sessionUrl, {
          credentials: 'include',
          signal: controller.signal,
        });

        if (response.ok) {
          const data = await response.json();

          if (isValidUserProfile(data?.user)) {
            // Note: Session is backed by an httpOnly cookie with credentials: 'include'.
            // We avoid keeping sensitive JWT tokens in Redux memory to minimize XSS exposure.
            dispatch(
              setCredentials({
                user: data.user,
                token: null,
              })
            );
            return;
          } else {
            console.warn(
              '[AuthBootstrap] Session check payload missing or invalid user profile:',
              data
            );
            dispatch(sessionCheckComplete());
            return;
          }
        } else if (response.status === 401 || response.status === 403) {
          // Standard unauthenticated state
          dispatch(sessionCheckComplete());
          return;
        } else {
          // 5xx server error or other unexpected status: treat differently from 401
          dispatch(
            sessionCheckFailure(
              `Authentication service is temporarily unavailable (HTTP ${response.status}). Please try again later.`
            )
          );
          return;
        }
      } catch (err: unknown) {
        if (controller.signal.aborted) {
          // Reset loading state on abort without marking session initialized
          dispatch(sessionCheckAbort());
          return;
        }

        // Network error / connection failure: distinct from 401
        dispatch(
          sessionCheckFailure(
            'Unable to connect to authentication server. Please check your network connection.'
          )
        );
        return;
      }
    };

    void checkSession();

    return () => {
      controller.abort();
    };
  }, [dispatch, isSessionInitialized]);

  return <>{children}</>;
}

export default AuthBootstrap;
