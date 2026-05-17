import { useQuery } from '@tanstack/react-query';
import { getQuickAccessItems } from '../../../../services/academicApi';
import { QUICK_ACCESS_QUERY_KEY } from '../../constants/queryKeys';

export function useQuickAccess() {
  return useQuery({
    queryKey: QUICK_ACCESS_QUERY_KEY,
    queryFn: getQuickAccessItems,
  });
}
