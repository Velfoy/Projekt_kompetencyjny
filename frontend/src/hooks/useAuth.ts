import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@store/store';
import { loginSuccess, logout } from '@store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, userRole, isLoading } = useSelector((state: RootState) => state.auth);

  const login = (role: 'admin' | 'user') => {
    dispatch(loginSuccess(role));
  };

  const handleLogout = () => {
    dispatch(logout());
    // Dodatkowe czyszczenie (np. token w localStorage)
  };

  return { 
    isAuth: isAuthenticated, 
    role: userRole, 
    isLoading,
    login, 
    logout: handleLogout 
  };
};