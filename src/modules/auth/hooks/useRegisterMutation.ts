import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../services/authServices';
import type { RegisterPayload } from '../types/authTypes';

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (input: RegisterPayload) => registerUser(input),
  });
}
