import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import type { AuthContextValue } from '../app/providers/authContext';

export const Route = createRootRouteWithContext<{ auth: AuthContextValue }>()({
  component: () => <Outlet />,
});
