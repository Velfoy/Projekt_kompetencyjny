import { lazy } from 'react';
import type { ReactElement } from 'react';
import type { RouteObject } from 'react-router-dom';
import ProtectedRoute from '../components/ui/ProtectedRoute';

// Lazy imports
const HomePage = lazy(() => import('../pages/Home/HomePage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const ZgloszeniaPage = lazy(() => import('../pages/Zgloszenia/ZgloszeniaAdmin'));
const KalendarzPage = lazy(() => import('../pages/Kalendarz/KalendarzPage'));
const HistoriaPage = lazy(() => import('../pages/Historia/HistoriaPage'));
const ProfilePage = lazy(() => import('../pages/Profile/ProfilePage'));
const ItemDetails = lazy(() => import('../pages/ItemDetails'));
const StorageToken = lazy(() => import('../components/auth/StorageToken'));

const withProtected = (Component: ReactElement, roles: string[]) => (
  <ProtectedRoute allowedRoles={roles}>
    {Component}
  </ProtectedRoute>
);

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/user',
    element: withProtected(<HomePage />, ['user']),
  },
  {
    path: '/admin',
    element: withProtected(<HomePage />, ['admin']),
  },
  {
    path:'/itemReservation/:id',
    element:withProtected(<ItemDetails></ItemDetails>,['user','admin']),
  },
  {
    path: '/zgloszenia',
    element: withProtected(<ZgloszeniaPage />, ['user', 'admin']),
  },
  {
    path: '/kalendarz',
    element: withProtected(<KalendarzPage />, ['user', 'admin']),
  },
  {
    path: '/historia',
    element: withProtected(<HistoriaPage />, ['user', 'admin']),
  },
  {
    path: '/profile',
    element: withProtected(<ProfilePage />, ['user', 'admin']),
  },
  {
    path:'/storagetoken',
    element:<StorageToken></StorageToken>
 
  },
];
