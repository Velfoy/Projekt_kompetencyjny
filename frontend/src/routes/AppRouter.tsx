import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routesConfig';
import MainLayout from "../components/layout/MainLayout";
import Error from '../pages/Error';
import { Suspense } from 'react';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <Error />,
    children: routes
  }
]);

const AppRouter = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default AppRouter;