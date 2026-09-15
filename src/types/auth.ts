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
  phone: string;
  nic: string;
}
