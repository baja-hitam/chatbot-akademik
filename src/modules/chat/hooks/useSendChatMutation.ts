import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postChat } from '../services/chatServices';
import type { ChatRequest } from '../types/chatTypes';

export function useSendChatMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: ChatRequest) => postChat(payload),
    onSuccess: (data) => {
      // Invalidate both the list of sessions and the active session messages
      qc.invalidateQueries({ queryKey: ['chat', 'sessions'] });
      if (data?.session_id) {
        qc.invalidateQueries({ queryKey: ['chat', 'sessions', data.session_id] });
      }
    },
  });
}
