import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, UserRole } from '../../types/authTypes';

const initialState: AuthState = {
  isAuthenticated: true, 
  userRole: 'admin',
  username: 'test',
  isLoading: false,
  error: null,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ role: UserRole; username: string }>) {
        state.isAuthenticated = true;
        state.userRole = action.payload.role;
        state.username = action.payload.username;
        state.isLoading = false;
        state.error = null;
      },
    loginFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.userRole = null;
      state.username = null;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;