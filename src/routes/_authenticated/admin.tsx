import { createFileRoute, redirect } from '@tanstack/react-router';
import { AdminLayoutRouteComponent } from '../../components/layout/AdminLayout';

export const Route = createFileRoute('/_authenticated/admin')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/login' });
    }
    // Check if user is admin
    if (context.auth.user?.role !== 'admin') {
      throw redirect({ to: '/' });
    }
  },
  component: AdminLayoutRouteComponent,
});
