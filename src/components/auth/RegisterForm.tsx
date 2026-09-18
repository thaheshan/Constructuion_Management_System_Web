'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User as UserIcon, Loader2, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginStart, loginSuccess, loginFailure, clearError } from '@/store/slices/authSlice';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface RegisterFormProps {
  redirectPath?: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ redirectPath = '/' }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [clientErrors, setClientErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const errors: typeof clientErrors = {};
    if (!name.trim()) errors.name = 'Full name is required';
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
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch(loginStart());

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      dispatch(
        loginSuccess({
          user: {
            id: 'qs_usr_' + Math.random().toString(36).substring(2, 7),
            name,
            email,
            role: 'STAFF',
          },
          token: 'qs_registered_jwt_' + Date.now(),
        })
      );

      router.push(redirectPath);
    } catch {
      dispatch(loginFailure('Registration failed. Please verify your details.'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        label="Full Name"
        type="text"
        placeholder="e.g. John Silva"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (clientErrors.name) setClientErrors((prev) => ({ ...prev, name: undefined }));
        }}
        error={clientErrors.name}
        leftIcon={<UserIcon className="w-4 h-4" />}
        required
      />

      <Input
        label="Work Email"
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
        label="Create Password"
        type="password"
        placeholder="••••••••••••"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (clientErrors.password) setClientErrors((prev) => ({ ...prev, password: undefined }));
        }}
        error={clientErrors.password}
        leftIcon={<Lock className="w-4 h-4" />}
        autoComplete="new-password"
        required
      />

      <Input
        label="Confirm Password"
        type="password"
        placeholder="••••••••••••"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          if (clientErrors.confirmPassword) setClientErrors((prev) => ({ ...prev, confirmPassword: undefined }));
        }}
        error={clientErrors.confirmPassword}
        leftIcon={<Lock className="w-4 h-4" />}
        autoComplete="new-password"
        required
      />

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
            <span>Creating account...</span>
          </>
        ) : (
          <>
            <span>Register for Quick Stop</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>
    </form>
  );
};

export default RegisterForm;
