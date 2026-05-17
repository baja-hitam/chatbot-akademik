import { useMutation } from '@tanstack/react-query';
import type { VerifyOtpPayload } from '../types/authTypes';
import { verifyOtpAndLogin } from '../services/authServices';

export function useVerifyOtpMutation() {
  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => verifyOtpAndLogin(payload),
  });
}
