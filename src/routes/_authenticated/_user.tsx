import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_user')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/login' });
    }
    if (context.auth.user?.role === 'admin') {
      throw redirect({ to: '/admin' });
    }
  },
  component: () => <Outlet />,
})