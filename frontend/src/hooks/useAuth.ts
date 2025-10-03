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
    const token = localStorage.getItem('auth_token');
  if (!token) return; 

  const fetchUserData = async () => {
      console.log(token ?? localStorage.length)
      const response = await fetch("backend_url" + "api/users/whoami", {
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
    window.location.href = 'https://design4all.p.lodz.pl/booking/';
  };

  const handleLogout = () => {
  localStorage.removeItem('auth_token'); // Clear the token
  dispatch(logout());
  navigate('/');
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
