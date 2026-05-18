export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface ChatSessionResponse {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessageDetail {
  id: string;
  sender_role: string;
  content: string;
  created_at: string;
}

export interface ChatRequest {
  question: string;
  category?: string;
  session_id?: string;
}

export interface ResponseApi<T> {
  responseStatus: boolean;
  responseMessage: string;
  responseBody: T;
}

export interface SourceDocument {
  content: string;
  source: string;
  category?: string;
  relevance_score?: number;
  document_year?: number | null;
  is_latest?: boolean;
  ocr_used?: boolean;
}

export interface ChatResponse {
  answer: string;
  processing_time: number;
  session_id?: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  date: string;
  status: 'info' | 'warning' | 'success' | 'urgent';
}

export interface QuickAccessItem {
  id: string;
  title: string;
  description: string;
  href: string;
}

export interface UsageTipItem {
  id: string;
  title: string;
  example: string;
}
