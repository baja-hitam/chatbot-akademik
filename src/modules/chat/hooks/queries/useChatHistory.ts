import { useQuery } from '@tanstack/react-query';
import { getChatHistory } from '../../../../services/academicApi';
import { CHAT_HISTORY_QUERY_KEY } from '../../constants/queryKeys';

export function useChatHistory() {
  return useQuery({
    queryKey: CHAT_HISTORY_QUERY_KEY,
    queryFn: getChatHistory,
  });
}
