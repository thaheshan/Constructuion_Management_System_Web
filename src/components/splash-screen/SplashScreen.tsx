'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { resetSessionCheck } from '@/store/slices/authSlice';
import { AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  children: ReactNode;
  firstScreenDuration?: number;
  secondScreenDuration?: number;
}

const DEFAULT_FIRST_SCREEN_DURATION = 1200;
const DEFAULT_SECOND_SCREEN_DURATION = 1200;

const SplashScreen = ({
  children,
  firstScreenDuration = DEFAULT_FIRST_SCREEN_DURATION,
  secondScreenDuration = DEFAULT_SECOND_SCREEN_DURATION,
}: SplashScreenProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const { isAuthenticated, isSessionInitialized, error } = useAppSelector(
    (state) => state.auth
  );

  const [showSplash, setShowSplash] = useState(pathname === '/');
  const [showBranding, setShowBranding] = useState(false);
  const [minimumDurationElapsed, setMinimumDurationElapsed] = useState(false);

  // Manage splash screen timer states based on route
  useEffect(() => {
    if (pathname !== '/') {
      setShowSplash(false);
      setShowBranding(false);
      setMinimumDurationElapsed(false);
      return;
    }

    setShowSplash(true);
    setShowBranding(false);
    setMinimumDurationElapsed(false);

    const brandingTimer = window.setTimeout(() => {
      setShowBranding(true);
    }, firstScreenDuration);

    const durationTimer = window.setTimeout(() => {
      setMinimumDurationElapsed(true);
    }, firstScreenDuration + secondScreenDuration);

    return () => {
      window.clearTimeout(brandingTimer);
      window.clearTimeout(durationTimer);
    };
  }, [pathname, firstScreenDuration, secondScreenDuration]);

  // Handle redirect once session is initialized and minimum duration has elapsed
  useEffect(() => {
    // Only redirect from the "/" root path once session is initialized and timer has elapsed
    // If there is an outage / network error, do not silently redirect to /login
    if (pathname !== '/' || !isSessionInitialized || !minimumDurationElapsed || error) {
      return;
    }

    // NOTE: setShowSplash(false) is intentionally NOT called here to prevent a flash
    // of "/" children while router.replace is in-flight. The pathname effect above
    // will hide the splash screen as soon as navigation completes.
    router.replace(isAuthenticated ? '/dashboard' : '/login');
  }, [pathname, isSessionInitialized, minimumDurationElapsed, isAuthenticated, error, router]);

  // If not on root path or splash is hidden, render page children
  if (pathname !== '/' || !showSplash) {
    return <>{children}</>;
  }

  const handleRetry = () => {
    dispatch(resetSessionCheck());
  };

  const handleProceedToLogin = () => {
    router.replace('/login');
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#f3f4f6]">
      {/* Container section without redundant role="status" */}
      <section className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#f3f4f6] px-4">
        <div className="flex w-full flex-col items-center">
          {/* Helmet Logo: Increased size for second screen branding state */}
          <div
            className={`relative transition-all duration-500 ease-out ${
              showBranding
                ? 'h-28 w-40 sm:h-36 sm:w-48 md:h-40 md:w-52'
                : 'h-36 w-52 sm:h-44 sm:w-64 md:h-48 md:w-72'
            }`}
          >
            <Image
              src="/images/Helmet.png"
              alt="Futura Constructions helmet"
              fill
              priority
              sizes="(max-width: 640px) 208px, (max-width: 768px) 256px, 288px"
              className="object-contain"
            />
          </div>

          {/* Wordmark appears in the second splash state with increased heading size */}
          {showBranding && (
            <h1 className="mt-4 max-w-full px-4 text-center text-3xl font-extrabold tracking-tight text-[#202936] sm:text-4xl md:text-5xl">
              FUTURA CONSTRUCTIONS
            </h1>
          )}
        </div>

        {/* Backend Outage / Network Error Banner (Avoids silent redirect to /login) */}
        {error && minimumDurationElapsed ? (
          <div
            role="alert"
            className="absolute bottom-16 left-4 right-4 mx-auto max-w-md rounded-xl border border-red-200 bg-white p-4 shadow-lg sm:bottom-20"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-slate-900">
                  Connection Notice
                </h2>
                <p className="mt-1 text-xs text-slate-600">{error}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-primary-700 transition"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Retry Connection
                  </button>
                  <button
                    type="button"
                    onClick={handleProceedToLogin}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                  >
                    <span>Proceed to Login</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Loading message: single role="status" and CSS-only animated dots */
          <div
            role="status"
            aria-live="polite"
            className="absolute bottom-24 left-0 flex w-full items-center justify-center text-[15px] font-normal text-[#5B6472]"
          >
            <span className="animate-pulse motion-reduce:animate-none">
              Preparing your dashboard
            </span>

            <span aria-hidden="true" className="ml-0.5 inline-flex gap-0.5">
              <span
                className="animate-splash-dot motion-reduce:animate-none"
                style={{ animationDelay: '0ms' }}
              >
                .
              </span>
              <span
                className="animate-splash-dot motion-reduce:animate-none"
                style={{ animationDelay: '200ms' }}
              >
                .
              </span>
              <span
                className="animate-splash-dot motion-reduce:animate-none"
                style={{ animationDelay: '400ms' }}
              >
                .
              </span>
            </span>
          </div>
        )}
      </section>
    </main>
  );
};

export default SplashScreen;
