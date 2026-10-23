export type UserRole = 
  | 'OWNER' 
  | 'PROJECT_MANAGER' 
  | 'SITE_SUPERVISOR' 
  | 'LABOUR_OFFICER' 
  | 'ACCOUNTANT' 
  | 'STORE_KEEPER' 
  | 'STAFF';

export const VALID_USER_ROLES: readonly UserRole[] = [
  'OWNER',
  'PROJECT_MANAGER',
  'SITE_SUPERVISOR',
  'LABOUR_OFFICER',
  'ACCOUNTANT',
  'STORE_KEEPER',
  'STAFF',
] as const;

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  nic?: string;
  avatar?: string;
  createdAt?: string;
}

export function isValidUserProfile(user: unknown): user is UserProfile {
  if (!user || typeof user !== 'object') {
    return false;
  }
  const candidate = user as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    candidate.id.trim().length > 0 &&
    typeof candidate.email === 'string' &&
    candidate.email.includes('@') &&
    typeof candidate.fullName === 'string' &&
    candidate.fullName.trim().length > 0 &&
    typeof candidate.role === 'string' &&
    VALID_USER_ROLES.includes(candidate.role as UserRole)
  );
}

export interface AuthState {
  user: UserProfile | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSessionInitialized: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
}
