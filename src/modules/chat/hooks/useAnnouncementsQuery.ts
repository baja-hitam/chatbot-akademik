import { useQuery } from '@tanstack/react-query';
import { getAnnouncements } from '../services/chatServices';

export function useAnnouncementsQuery() {
  return useQuery({
    queryKey: ['dashboard', 'announcements'],
    queryFn: getAnnouncements,
    staleTime: 1000 * 60,
  });
}
