export type UserRole = 
  | 'OWNER' 
  | 'PROJECT_MANAGER' 
  | 'SITE_SUPERVISOR' 
  | 'LABOUR_OFFICER' 
  | 'ACCOUNTANT' 
  | 'STORE_KEEPER' 
  | 'STAFF'
  | 'ADMIN'
  | 'CUSTOMER';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  name?: string;
  role: UserRole;
  phone: string;
  nic: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  fullName?: string;
  role?: UserRole | string;
  avatar?: string;
  createdAt?: string;
}

export interface AuthState {
  user: User | UserProfile | null;
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
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

