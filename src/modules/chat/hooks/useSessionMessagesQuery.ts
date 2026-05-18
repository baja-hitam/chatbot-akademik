import { useQuery } from '@tanstack/react-query';
import { getSessionMessages } from '../services/chatServices';

export function useSessionMessagesQuery(sessionId: string | null) {
  return useQuery({
    queryKey: ['chat', 'sessions', sessionId],
    queryFn: () => (sessionId ? getSessionMessages(sessionId) : Promise.resolve([])),
    enabled: Boolean(sessionId),
    staleTime: 1000 * 30,
  });
}
