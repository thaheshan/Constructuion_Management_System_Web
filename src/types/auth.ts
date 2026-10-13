export type UserRole = 
  | 'OWNER' 
  | 'PROJECT_MANAGER' 
  | 'SITE_SUPERVISOR' 
  | 'LABOUR_OFFICER' 
  | 'ACCOUNTANT' 
  | 'STORE_KEEPER' 
  | 'STAFF';

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

export interface AuthState {
  user: UserProfile | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
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
