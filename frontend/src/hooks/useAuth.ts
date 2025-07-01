import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, logout } from '@store/slices/authSlice';
import type { RootState } from '@store/store';
import type { UserRole } from '../types/authTypes';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const { isAuthenticated, userRole, isLoading, username } = useSelector(
    (state: RootState) => state.auth
  );

 useEffect(() => {

  const fetchUserData = async () => {
      const token = localStorage.getItem('auth_token');
      console.log(token ?? localStorage.length)
      const response = await fetch(`https://localhost:7065/api/users/whoami`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // <-- here
        },
      });//

      if (!response.ok) {
        
        dispatch(loginSuccess({username: "", role: null}));
        return;
      }

      const userData = await response.json(); // Expected shape: { role: 'admin', username: 'jan.kowalski' }
      dispatch(loginSuccess(userData));
  };

  fetchUserData();
}, [dispatch]);

  const handleLogin = () => {
    window.location.href = 'https://localhost:7019/cas/login';
  };

  const handleLogout = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Make a request to your logout endpoint if needed
      await fetch('https://localhost:7065/api/users/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    }
    
    // Clear local storage
    localStorage.removeItem('auth_token');
    
    // Dispatch logout action
    dispatch(logout());
    
    // Navigate after state is updated
    navigate('/');
  } catch (error) {
    console.error('Logout failed:', error);
    // Still proceed with local logout
    localStorage.removeItem('auth_token');
    dispatch(logout());
    navigate('/');
  }
};

  return {
    isAuth: isAuthenticated,
    role: userRole,
    isLoading,
    username,
    login: handleLogin,
    logout: handleLogout,
  };
};
