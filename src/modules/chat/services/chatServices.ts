import { httpClient } from '../../../services/httpClient';
import axios from 'axios';
import type {
  ChatSession,
  ChatSessionResponse,
  ChatMessage,
  ChatMessageDetail,
  ChatRequest,
  ChatResponse,
  AnnouncementItem,
  QuickAccessItem,
  UsageTipItem,
  ResponseApi
} from '../types/chatTypes';

export async function getSessions(): Promise<ChatSession[]> {
  try {
    const res = await httpClient.get<ResponseApi<ChatSessionResponse[]>>('/api/v1/sessions');
    const items = res.data.responseBody ?? [];
    return items.map((it) => ({
      id: String(it.id),
      title: it.title,
      updatedAt: it.updated_at || it.created_at,
      messages: [],
    }));
  } catch (error) {
    if (axios.isAxiosError<{ responseMessage?: string }>(error)) {
      throw new Error(
        error.response?.data?.responseMessage ??
        'Gagal memuat sesi chat.',
        { cause: error }
      );
    }
    throw new Error('Terjadi kesalahan saat memuat sesi chat.', { cause: error });
  }
}

export async function getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
  try {
    const res = await httpClient.get<ResponseApi<ChatMessageDetail[]>>(`/api/v1/sessions/${sessionId}/messages`);
    const items = res.data.responseBody ?? [];
    return items.map((msg) => ({
      id: String(msg.id),
      role: msg.sender_role === 'user' ? 'user' : 'assistant',
      content: msg.content,
      createdAt: msg.created_at,
    }));
  } catch (error) {
    if (axios.isAxiosError<{ responseMessage?: string }>(error)) {
      throw new Error(
        error.response?.data?.responseMessage ??
        'Gagal memuat pesan chat.',
        { cause: error }
      );
    }
    throw new Error('Terjadi kesalahan saat memuat pesan chat.', { cause: error });
  }
}

export async function postChat(payload: ChatRequest): Promise<ChatResponse> {
  try {
    const res = await httpClient.post<ResponseApi<ChatResponse>>('/api/v1/chat', payload);
    return res.data.responseBody;
  } catch (error) {
    if (axios.isAxiosError<{ responseMessage?: string }>(error)) {
      throw new Error(
        error.response?.data?.responseMessage ??
          'Gagal mengirim pesan chat.',
        { cause: error }
      );
    }
    throw new Error('Terjadi kesalahan saat mengirim pesan chat.', { cause: error });
  }
}

export async function getAnnouncements(): Promise<AnnouncementItem[]> {
  try {
    const { data } = await httpClient.get<Array<{ id: string; title: string; created_at: string; status: any }>>(
      '/api/v1/announcements/'
    );
    const items = data ?? [];
    return items.map((item) => ({
      id: item.id,
      title: item.title,
      date: item.created_at,
      status: item.status,
    }));
  } catch (error) {
    if (axios.isAxiosError<{ responseMessage?: string; detail?: string }>(error)) {
      throw new Error(
        error.response?.data?.responseMessage ??
          error.response?.data?.detail ??
          'Gagal memuat pengumuman.',
        { cause: error }
      );
    }
    throw new Error('Terjadi kesalahan saat memuat pengumuman.', { cause: error });
  }
}

export async function getQuickAccessItems(): Promise<QuickAccessItem[]> {
  try {
    const { data } = await httpClient.get<{ data: QuickAccessItem[] }>('/mock/quick-access.json');
    return data.data ?? [];
  } catch (error) {
    if (axios.isAxiosError<{ responseMessage?: string; detail?: string }>(error)) {
      throw new Error(
        error.response?.data?.responseMessage ??
          error.response?.data?.detail ??
          'Gagal memuat menu akses cepat.',
        { cause: error }
      );
    }
    throw new Error('Terjadi kesalahan saat memuat menu akses cepat.', { cause: error });
  }
}

export async function getUsageTips(): Promise<UsageTipItem[]> {
  try {
    const { data } = await httpClient.get<{ data: UsageTipItem[] }>('/mock/usage-tips.json');
    return data.data ?? [];
  } catch (error) {
    if (axios.isAxiosError<{ responseMessage?: string; detail?: string }>(error)) {
      throw new Error(
        error.response?.data?.responseMessage ??
          error.response?.data?.detail ??
          'Gagal memuat tips penggunaan.',
        { cause: error }
      );
    }
    throw new Error('Terjadi kesalahan saat memuat tips penggunaan.', { cause: error });
  }
}
