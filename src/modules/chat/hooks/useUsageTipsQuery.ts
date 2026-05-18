import { useQuery } from '@tanstack/react-query';
import { getUsageTips } from '../services/chatServices';

export function useUsageTipsQuery() {
  return useQuery({
    queryKey: ['dashboard', 'usageTips'],
    queryFn: getUsageTips,
    staleTime: 1000 * 60,
  });
}
