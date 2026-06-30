import { httpClient } from '../../../../services/httpClient';
import type { ChatSessionRelationUser, ChatMessageDetail, ChatSessionHistoryResponse, ChatMessageHistoryResponse } from '../types/chatHistoryTypes';

export const getChatSessionsHistory = async (): Promise<ChatSessionRelationUser[]> => {
  const { data } = await httpClient.get<ChatSessionHistoryResponse>('/api/v1/sessions/history');
  return data.responseBody;
};

export const getSessionMessagesHistory = async (sessionId: string): Promise<ChatMessageDetail[]> => {
  const { data } = await httpClient.get<ChatMessageHistoryResponse>(`/api/v1/sessions/history/${sessionId}/messages`);
  return data.responseBody;
};
