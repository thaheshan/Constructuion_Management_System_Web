import { StateCreator } from 'zustand';
import { UserProfile, UserRole } from '../../types/auth';

export interface AuthSlice {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  setUser: (user: UserProfile) => void;
  logout: () => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  user: null,
  role: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, role: user.role, isAuthenticated: true }),
  logout: () => set({ user: null, role: null, isAuthenticated: false }),
});
