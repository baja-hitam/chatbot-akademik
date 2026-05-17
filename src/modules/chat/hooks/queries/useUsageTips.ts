import { useQuery } from '@tanstack/react-query';
import { getUsageTips } from '../../../../services/academicApi';
import { USAGE_TIPS_QUERY_KEY } from '../../constants/queryKeys';

export function useUsageTips() {
  return useQuery({
    queryKey: USAGE_TIPS_QUERY_KEY,
    queryFn: getUsageTips,
  });
}
