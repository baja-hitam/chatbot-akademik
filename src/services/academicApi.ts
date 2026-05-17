import type {
  AnnouncementItem,
  ApiListResponse,
  ChatMessage,
  ChatReply,
  ChatSession,
  QuickAccessItem,
  UsageTipItem,
} from '../types/domain';
import { httpClient } from './httpClient';
import axios from 'axios';

export async function getChatHistory(): Promise<ChatSession[]> {
  const { data } = await httpClient.get<ApiListResponse<ChatSession>>('/mock/chat-history.json');
  return data.data;
}

export async function getAnnouncements(): Promise<AnnouncementItem[]> {
  const { data } = await httpClient.get<Array<AnnouncementItem & { created_at: string }>>('/api/v1/announcements/');
  // Transform date
  return data.map((item) => ({
    ...item,
    date: item.created_at, // Mapping from backend to UI field
  }));
}

export async function getQuickAccessItems(): Promise<QuickAccessItem[]> {
  const { data } = await httpClient.get<ApiListResponse<QuickAccessItem>>('/mock/quick-access.json');
  return data.data;
}

export async function getUsageTips(): Promise<UsageTipItem[]> {
  const { data } = await httpClient.get<ApiListResponse<UsageTipItem>>('/mock/usage-tips.json');
  return data.data;
}

export async function getChatSessionMessages(sessionId: string): Promise<ChatMessage[]> {
  const sessions = await getChatHistory();
  const session = sessions.find((item) => item.id === sessionId);
  return session?.messages ?? [];
}

export async function sendChatMessage(message: string, sessionId?: string): Promise<ChatReply> {
  try {
    const { data } = await httpClient.post<ChatReply | { data: ChatReply }>('/api/v1/chat', {
      question: message,
      ...(sessionId ? { session_id: sessionId } : {}),
    });
    const payload = 'data' in data ? data.data : data;
    return payload;
  } catch (error) {
    if (axios.isAxiosError<{ detail?: string; message?: string }>(error)) {
      const backendMessage = error.response?.data?.detail ?? error.response?.data?.message;
      throw new Error(backendMessage ?? 'Gagal terhubung ke AI lokal.', { cause: error });
    }
    throw error;
  }
}
