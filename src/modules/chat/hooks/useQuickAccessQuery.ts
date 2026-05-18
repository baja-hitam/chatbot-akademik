import { useQuery } from '@tanstack/react-query';
import { getQuickAccessItems } from '../services/chatServices';

export function useQuickAccessQuery() {
  return useQuery({
    queryKey: ['dashboard', 'quickAccess'],
    queryFn: getQuickAccessItems,
    staleTime: 1000 * 60,
  });
}
