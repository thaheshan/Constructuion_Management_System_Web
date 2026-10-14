"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setCredentials,
  sessionCheckComplete,
  sessionCheckStart,
} from "@/store/slices/authSlice";

interface SplashScreenProps {
  children: ReactNode;
}

const FIRST_SCREEN_DURATION = 2000;
const SECOND_SCREEN_DURATION = 2000;

const SplashScreen = ({ children }: SplashScreenProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const { isAuthenticated, isLoading, isSessionInitialized } = useAppSelector(
    (state) => state.auth
  );

  const [showSplash, setShowSplash] = useState(pathname === "/");
  const [showBranding, setShowBranding] = useState(false);
  const [minimumDurationElapsed, setMinimumDurationElapsed] = useState(false);
  const [showLoadingDots, setShowLoadingDots] = useState(true);

  useEffect(() => {
    if (pathname !== "/") {
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
    }, FIRST_SCREEN_DURATION);

    const durationTimer = window.setTimeout(() => {
      setMinimumDurationElapsed(true);
    }, FIRST_SCREEN_DURATION + SECOND_SCREEN_DURATION);

    return () => {
      window.clearTimeout(brandingTimer);
      window.clearTimeout(durationTimer);
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const dotsTimer = window.setInterval(() => {
      setShowLoadingDots((visible) => !visible);
    }, 1400);

    return () => window.clearInterval(dotsTimer);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/" || isSessionInitialized) {
      return;
    }

    const controller = new AbortController();
    const sessionUrl =
      process.env.NEXT_PUBLIC_AUTH_SESSION_URL || "/api/v1/auth/session";

    const checkSession = async () => {
      dispatch(sessionCheckStart());

      try {
        const response = await fetch(sessionUrl, {
          credentials: "include",
          signal: controller.signal,
        });

        if (response.ok) {
          const data = await response.json();

          if (data.user) {
            dispatch(
              setCredentials({
                user: data.user,
                token: data.token ?? null,
              })
            );
            return;
          }
        }
      } catch {
        if (controller.signal.aborted) {
          return;
        }
      }

      if (!controller.signal.aborted) {
        dispatch(sessionCheckComplete());
      }
    };

    void checkSession();

    return () => controller.abort();
  }, [dispatch, isSessionInitialized, pathname]);

  useEffect(() => {
    if (pathname !== "/" || isLoading || !minimumDurationElapsed) {
      return;
    }

    setShowSplash(false);

    router.replace(isAuthenticated ? "/dashboard" : "/login");
  }, [pathname, isLoading, minimumDurationElapsed, isAuthenticated, router]);

  if (pathname !== "/" || !showSplash) {
    return <>{children}</>;
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#f3f4f6]">
      <section
        role="status"
        aria-live="polite"
        className="relative flex min-h-screen w-full items-center justify-center bg-[#f3f4f6] px-3"
      >
        <div className="flex w-full flex-col items-center">
          {/* Helmet */}
          <div
            className={`relative transition-all duration-300 ${
              showBranding
                ? "h-16 w-24 sm:h-20 sm:w-28"
                : "h-32 w-44 sm:h-36 sm:w-48"
            }`}
          >
            <Image
              src="/images/Helmet.png"
              alt="Futura Constructions helmet"
              fill
              priority
              sizes="(max-width: 640px) 128px, 144px"
              className="object-contain"
            />
          </div>

          {/* Wordmark appears in the second splash state */}
          {showBranding && (
            <h1 className="mt-2 max-w-full px-2 text-center text-2xl font-bold tracking-normal text-[#202936] sm:text-3xl lg:text-4xl">
              FUTURA CONSTRUCTIONS
            </h1>
          )}
        </div>

        {/* Loading message remains near the bottom */}
        <div
          role="status"
          aria-live="polite"
          className="absolute bottom-24 left-0 flex w-full items-center justify-center text-[15px] font-normal text-[#5B6472]"
        >
          <span className="animate-pulse">Preparing your dashboard</span>

          <span aria-hidden="true" className=" inline-flex gap-0.5">
            <span
              className={`transition-opacity delay-0 duration-300 ${
                showLoadingDots ? "opacity-100" : "opacity-0"
              }`}
            >
              .
            </span>
            <span
              className={`transition-opacity delay-200 duration-300 ${
                showLoadingDots ? "opacity-100" : "opacity-0"
              }`}
            >
              .
            </span>
            <span
              className={`transition-opacity delay-[400ms] duration-300 ${
                showLoadingDots ? "opacity-100" : "opacity-0"
              }`}
            >
              .
            </span>
          </span>
        </div>
      </section>
    </main>
  );
};

export default SplashScreen;
