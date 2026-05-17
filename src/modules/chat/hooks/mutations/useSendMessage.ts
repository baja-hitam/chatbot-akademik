import { useMutation } from '@tanstack/react-query';
import { sendChatMessage } from '../../../../services/academicApi';

export function useSendMessage() {
  return useMutation({
    mutationFn: ({ message, sessionId }: { message: string; sessionId?: string }) =>
      sendChatMessage(message, sessionId),
  });
}
