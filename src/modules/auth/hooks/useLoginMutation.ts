import { useMutation } from "@tanstack/react-query";
import { login } from "../services/authServices";
import type { LoginPayload } from "../types/authTypes";

export function useLoginMutation() {
  return useMutation({
    mutationFn: (input: LoginPayload) => login(input),
  });
}
