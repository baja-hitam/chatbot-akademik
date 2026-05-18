import { useQuery } from '@tanstack/react-query';
import { getSessions } from '../services/chatServices';

export function useSessionsQuery() {
  return useQuery({
    queryKey: ['chat', 'sessions'],
    queryFn: getSessions,
    staleTime: 1000 * 60,
  });
}
