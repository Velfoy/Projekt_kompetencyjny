export type UserRole = 'admin' | 'user' | null;

export interface AuthState {
  isAuthenticated: boolean;
  userRole: UserRole;
  username: string | null;
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
export interface DaySchedule {
  day: string;
  from: string;
  to: string;
}