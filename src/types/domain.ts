export type AnnouncementStatus = 'info' | 'warning' | 'success' | 'urgent';
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

export interface NavigationItem {
  id: string;
  label: string;
  category: string;
}

export interface QuickAccessItem {
  id: string;
  title: string;
  description: string;
  href: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  date: string;
  status: AnnouncementStatus;
}

export interface UsageTipItem {
  id: string;
  title: string;
  example: string;
}

export interface ApiListResponse<T> {
  data: T[];
}

export interface ChatReply {
  answer: string;
  session_id?: string;
  sources?: Array<{
    content: string;
    source: string;
    category?: string;
    relevance_score?: number;
    document_year?: number | null;
    is_latest?: boolean;
    ocr_used?: boolean;
  }>;
}

export interface AuthUser {
  username: string;
  nama_prodi: string;
  full_name: string;
  email: string;
  is_verified?: boolean;
  role?: string;
}
