import { useQuery } from '@tanstack/react-query';
import { getAnnouncements } from '../../../../services/academicApi';
import { ANNOUNCEMENTS_QUERY_KEY } from '../../constants/queryKeys';

export function useAnnouncements() {
  return useQuery({
    queryKey: ANNOUNCEMENTS_QUERY_KEY,
    queryFn: getAnnouncements,
  });
}
