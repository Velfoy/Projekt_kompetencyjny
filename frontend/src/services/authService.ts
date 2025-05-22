// import type { LoginCredentials } from '../types/authTypes';

// // Mock API calls - replace with actual API calls
// export const authService = {
//   login: async (credentials: LoginCredentials): Promise<{ role: 'admin' | 'user' }> => {
//     // Simulate API delay
//     await new Promise(resolve => setTimeout(resolve, 500));
    
//     // Mock validation - replace with real authentication
//     if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
//       return { role: 'admin' };
//     } else if (credentials.email === 'user@example.com' && credentials.password === 'user123') {
//       return { role: 'user' };
//     }
//     throw new Error('Invalid credentials');
//   },

//   logout: async (): Promise<void> => {
//     // Clear tokens or session
//     await new Promise(resolve => setTimeout(resolve, 200));
//   },
// };