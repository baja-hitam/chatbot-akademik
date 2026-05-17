import { createFileRoute, redirect } from '@tanstack/react-router';
import { VerifyOtpPage } from '../modules/auth/pages/VerifyOtpPage';

interface VerifyOtpSearch {
  email: string;
}

export const Route = createFileRoute('/verify-otp')({
  validateSearch: (search: Record<string, unknown>): VerifyOtpSearch => {
    return {
      email: (search.email as string) || '',
    };
  },
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: '/' });
    }
    if (!search.email) {
      throw redirect({ to: '/login' });
    }
  },
  component: VerifyOtpPage,
});
