import { useSearch } from '@tanstack/react-router';;
import { VerifyOtpForm } from '../components/VerifyOtpForm';

export function VerifyOtpPage() {
  const { email } = useSearch({ from: '/verify-otp' }) as { email: string };

  return <VerifyOtpForm email={email} />;
}
