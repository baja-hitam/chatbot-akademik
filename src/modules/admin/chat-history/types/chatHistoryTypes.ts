export interface ChatSessionRelationUser {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  kd_prodi: number;
  nama_prodi: string;
  full_name: string;
  username: string;
  email: string;
}

export interface ChatMessageDetail {
  id: string;
  sender_role: 'user' | 'bot' | string;
  content: string;
  created_at: string;
}

export interface ChatSessionHistoryResponse {
  responseStatus: boolean;
  responseMessage: string;
  responseBody: ChatSessionRelationUser[];
}

export interface ChatMessageHistoryResponse {
  responseStatus: boolean;
  responseMessage: string;
  responseBody: ChatMessageDetail[];
}
