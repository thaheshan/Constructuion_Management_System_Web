"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  ArrowRight,
  MessageSquareText,
  Monitor,
  Loader2,
  AlertCircle,
  Mail,
  Lock,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  clearError,
} from "@/store/slices/authSlice";
import { UserRole } from "@/types/auth";

interface SignInFormProps {
  redirectPath?: string;
  onSwitchToSmsOtp: (prefilledIdentifier?: string) => void;
  onSwitchToKiosk: () => void;
  onForgotPassword: (identifier?: string) => void;
  onOpenHelp: () => void;
  onOpenPrivacy: () => void;
  onOpenLegal: () => void;
}

export const SignInForm: React.FC<SignInFormProps> = ({
  redirectPath: defaultRedirect = "/",
  onSwitchToSmsOtp,
  onSwitchToKiosk,
  onForgotPassword,
  onOpenHelp,
  onOpenPrivacy,
  onOpenLegal,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Field validation errors
  const [errors, setErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});

  // Restore remembered email on mount if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cms_remembered_identifier");
      if (saved) {
        setIdentifier(saved);
        setRememberMe(true);
      }
    }
  }, []);

  const validate = () => {
    const errs: { identifier?: string; password?: string } = {};

    const trimmed = identifier.trim();
    if (!trimmed) {
      errs.identifier = "Email or mobile number is required";
    } else {
      // Validate either valid email format OR valid phone format
      const isEmail = /\S+@\S+\.\S+/.test(trimmed);
      const isPhone = /^(\+?[0-9]{7,15}|0[0-9]{9})$/.test(
        trimmed.replace(/[\s-]/g, ""),
      );
      if (!isEmail && !isPhone) {
        errs.identifier = "Please enter a valid email address or mobile number";
      }
    }

    if (!password) {
      errs.password = "Password is required";
    } else if (password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch(loginStart());

    // Resolve target path
    const targetRedirect = searchParams.get("redirect") || defaultRedirect;

    try {
      // Realistic simulated network latency
      await new Promise((resolve) => setTimeout(resolve, 600));

      const cleanId = identifier.trim().toLowerCase();

      // Explicit fail trigger for testing invalid credentials scenario
      if (
        cleanId.startsWith("fail") ||
        password === "wrongpassword" ||
        password === "fail"
      ) {
        dispatch(
          loginFailure(
            "Invalid credentials. Please check your email or mobile and password.",
          ),
        );
        return;
      }

      // Handle "Remember me"
      if (typeof window !== "undefined") {
        if (rememberMe) {
          localStorage.setItem("cms_remembered_identifier", identifier.trim());
        } else {
          localStorage.removeItem("cms_remembered_identifier");
        }
      }

      // Determine role based on credential conventions
      let assignedRole: UserRole = "STAFF";
      let fullName = "Site Team Member";

      if (cleanId.includes("@")) {
        const username = cleanId.split("@")[0];
        if (username === "owner" || username.startsWith("owner.")) {
          assignedRole = "OWNER";
          fullName = "Kasun Rajapaksa (Owner)";
        } else if (username === "pm" || username.startsWith("pm.")) {
          assignedRole = "PROJECT_MANAGER";
          fullName = "Nimal Jayawardena (Project Manager)";
        } else if (
          username === "supervisor" ||
          username.startsWith("supervisor.")
        ) {
          assignedRole = "SITE_SUPERVISOR";
          fullName = "Chaminda Silva (Site Supervisor)";
        } else if (
          username === "accountant" ||
          username.startsWith("accountant.")
        ) {
          assignedRole = "ACCOUNTANT";
          fullName = "Priyanka Bandara (Accountant)";
        } else if (username === "store" || username.startsWith("store.")) {
          assignedRole = "STORE_KEEPER";
          fullName = "Dinesh Fernando (Store Keeper)";
        } else {
          fullName = username
            .replace(".", " ")
            .split(" ")
            .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
            .join(" ");
        }
      } else {
        // Mobile phone user login
        assignedRole = "SITE_SUPERVISOR";
        fullName = `Site Supervisor (${identifier.trim()})`;
      }

      dispatch(
        loginSuccess({
          user: {
            id: "cms_usr_" + Math.random().toString(36).substring(2, 9),
            email: cleanId.includes("@") ? cleanId : `${cleanId}@futura.lk`,
            fullName,
            role: assignedRole,
            phone: !cleanId.includes("@") ? cleanId : undefined,
          },
          token: "cms_auth_jwt_" + Date.now(),
        }),
      );

      router.push(targetRedirect);
    } catch {
      dispatch(
        loginFailure(
          "An unexpected error occurred during login. Please try again.",
        ),
      );
    }
  };

  return (
    <div className="w-full">
      {/* Title & Subtitle */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome back
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
          <span className="hidden sm:inline">
            Sign in to continue to your dashboard.
          </span>
          <span className="sm:hidden">Sign in to continue.</span>
        </p>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200/80 text-red-700 text-xs font-medium flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block">Sign In Failed</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Main Credentials Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Email or Mobile Input */}
        <div className="space-y-1.5">
          <label
            htmlFor="signin-identifier"
            className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700"
          >
            EMAIL OR MOBILE
          </label>
          <div className="relative rounded-xl shadow-sm">
            <input
              id="signin-identifier"
              type="text"
              name="identifier"
              autoComplete="username"
              placeholder="e.g. john@futura.com or +947..."
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (errors.identifier)
                  setErrors((prev) => ({ ...prev, identifier: undefined }));
                if (error) dispatch(clearError());
              }}
              className={`block w-full rounded-xl border text-sm transition focus:outline-none focus:ring-2 py-3 px-3.5 text-slate-900 placeholder:text-slate-400 ${
                errors.identifier
                  ? "border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-red-100"
                  : "border-slate-200 bg-slate-50/50 hover:border-slate-300 focus:border-futura-500 focus:ring-futura-100 focus:bg-white"
              }`}
            />
          </div>
          {errors.identifier && (
            <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1 animate-fadeIn">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.identifier}</span>
            </p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="signin-password"
              className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              PASSWORD
            </label>
            <button
              type="button"
              onClick={() => onForgotPassword(identifier)}
              className="text-xs font-bold text-futura-500 hover:text-futura-600 hover:underline transition"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative rounded-xl shadow-sm">
            <input
              id="signin-password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password)
                  setErrors((prev) => ({ ...prev, password: undefined }));
                if (error) dispatch(clearError());
              }}
              className={`block w-full rounded-xl border text-sm transition focus:outline-none focus:ring-2 py-3 pl-3.5 pr-11 text-slate-900 placeholder:text-slate-400 ${
                errors.password
                  ? "border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-red-100"
                  : "border-slate-200 bg-slate-50/50 hover:border-slate-300 focus:border-futura-500 focus:ring-futura-100 focus:bg-white"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1 animate-fadeIn">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.password}</span>
            </p>
          )}
        </div>

        {/* Remember me Checkbox */}
        <div className="flex items-center pt-0.5">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-600 hover:text-slate-900 select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-futura-500 focus:ring-futura-500 cursor-pointer"
            />
            <span>Remember me</span>
          </label>
        </div>

        {/* Sign In Primary Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-futura-500 hover:bg-futura-600 active:bg-futura-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-futura-500/25 transition duration-150 flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed group mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>

        {/* OR Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-slate-200 w-full my-4" />
          <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 absolute">
            OR
          </span>
        </div>

        {/* Sign in with SMS code (OTP) Button */}
        <button
          type="button"
          onClick={() => onSwitchToSmsOtp(identifier)}
          className="w-full py-3 px-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100 text-slate-800 font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2.5 shadow-sm group"
        >
          <MessageSquareText className="w-5 h-5 text-slate-500 group-hover:text-slate-700 transition mt-1" />
          <span className="hidden sm:inline">Sign in with SMS code (OTP)</span>
          <span className="sm:hidden">Sign in with SMS</span>
        </button>

        {/* Switch to Kiosk Terminal Mode */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onSwitchToKiosk}
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition py-1 group mt-3"
          >
            <Monitor className="w-4 h-4 text-slate-500 group-hover:text-slate-700 transition" />
            <span>Switch to Kiosk Terminal Mode</span>
          </button>
        </div>
      </form>

      {/* Footer Below Card Content */}
      <div className="mt-8 text-center space-y-3">
        <p className="text-xs text-slate-500">
          Need an account?{" "}
          <a
            href="/register"
            className="font-bold text-slate-900 hover:text-futura-600 hover:underline transition"
          >
            Signup
          </a>
        </p>

        {/* Legal & Help Center Links */}
        <div className="flex items-center justify-center gap-2 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-slate-400 pt-1">
          <button
            type="button"
            onClick={onOpenHelp}
            className="hover:text-slate-600 transition"
          >
            HELP CENTER
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="hover:text-slate-600 transition"
          >
            PRIVACY POLICY
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={onOpenLegal}
            className="hover:text-slate-600 transition"
          >
            LEGAL
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
