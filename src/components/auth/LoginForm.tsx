'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginStart, loginSuccess, loginFailure, clearError, mockLogin } from '@/store/slices/authSlice';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface LoginFormProps {
  redirectPath?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ redirectPath = '/' }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [clientErrors, setClientErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch(loginStart());

    try {
      // Simulated auth network latency for realistic UX
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Ready for API integration - currently uses reliable simulated authentication
      if (email.toLowerCase().includes('fail') || password === 'wrongpassword') {
        dispatch(loginFailure('Invalid credentials. Please check your email and password.'));
        return;
      }

      dispatch(
        loginSuccess({
          user: {
            id: 'qs_usr_101',
            email,
            name: email.split('@')[0].replace('.', ' ').replace(/^\w/, (c) => c.toUpperCase()),
            role: email.includes('admin') ? 'ADMIN' : 'OWNER',
          },
          token: 'qs_jwt_mock_token_' + Date.now(),
        })
      );

      router.push(redirectPath);
    } catch {
      dispatch(loginFailure('An unexpected error occurred during login. Please try again.'));
    }
  };

  const handleFillDemo = (role: 'owner' | 'admin') => {
    dispatch(clearError());
    setClientErrors({});
    if (role === 'owner') {
      setEmail('owner@quickstop.com');
      setPassword('QuickStop2026!');
    } else {
      setEmail('admin@quickstop.com');
      setPassword('QuickStop2026!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        label="Email Address"
        type="email"
        placeholder="name@quickstop.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (clientErrors.email) setClientErrors((prev) => ({ ...prev, email: undefined }));
        }}
        error={clientErrors.email}
        leftIcon={<Mail className="w-4 h-4" />}
        autoComplete="email"
        required
      />

      <Input
        label="Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••••••"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (clientErrors.password) setClientErrors((prev) => ({ ...prev, password: undefined }));
        }}
        error={clientErrors.password}
        leftIcon={<Lock className="w-4 h-4" />}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-slate-400 hover:text-slate-600 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        }
        autoComplete="current-password"
        required
      />

      <div className="flex items-center justify-between text-xs pt-1">
        <label className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-900 select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          />
          <span>Remember me</span>
        </label>
        <button
          type="button"
          onClick={() => alert('Forgot password API integration will be added in the next step.')}
          className="text-primary-600 hover:text-primary-700 font-medium hover:underline focus:outline-none"
        >
          Forgot password?
        </button>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 font-semibold"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <span>Sign in to Quick Stop</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>

      {/* Demo Credentials Helper */}
      <div className="pt-3 border-t border-slate-100 text-center">
        <p className="text-[11px] text-slate-400 mb-2">Quick Test (Auto-Fill Demo Credentials):</p>
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={() => handleFillDemo('owner')}
            className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition font-medium"
          >
            Demo Owner
          </button>
          <button
            type="button"
            onClick={() => handleFillDemo('admin')}
            className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition font-medium"
          >
            Demo Admin
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
