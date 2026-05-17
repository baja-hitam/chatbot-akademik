import { RouterProvider } from '@tanstack/react-router';
import { useAuth } from './authContext';
import { router } from '../router';

export function AppRouterProvider() {
  const auth = useAuth();

  return <RouterProvider router={router} context={{ auth }} />;
}
