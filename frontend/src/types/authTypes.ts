export type UserRole = 'admin' | 'user' | null;

export interface AuthState {
  isAuthenticated: boolean;
  userRole: UserRole;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}