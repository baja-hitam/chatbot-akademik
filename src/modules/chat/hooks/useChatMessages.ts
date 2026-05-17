import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { ChatMessage } from '../../../types/domain';
import { getChatHistory, getChatSessionMessages } from '../../../services/academicApi';
import { useSendMessage } from './mutations/useSendMessage';

function formatSources(
  sources?: Array<{
    source: string;
    relevance_score?: number;
  }>
) {
  if (!sources || sources.length === 0) {
    return '';
  }

  const topSources = sources.slice(0, 3);
  const lines = topSources.map((item, index) => {
    const scoreText =
      typeof item.relevance_score === 'number' ? ` (relevansi ${(item.relevance_score * 100).toFixed(1)}%)` : '';
    return `${index + 1}. ${item.source}${scoreText}`;
  });

  return `\n\nSumber:\n${lines.join('\n')}`;
}

export function useChatMessages() {
  const queryClient = useQueryClient();
  const sendMutation = useSendMessage();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const { data: sessions = [] } = useQuery({
    queryKey: ['chat-sessions'],
    queryFn: getChatHistory,
  });

  const { data: serverMessages = [], isFetching } = useQuery({
    queryKey: ['chat-messages', activeSessionId],
    queryFn: () => (activeSessionId ? getChatSessionMessages(activeSessionId) : Promise.resolve([])),
    enabled: !!activeSessionId,
  });

  // Local state for optimistic updates during sending
  const [optimisticMessages, setOptimisticMessages] = useState<ChatMessage[]>([]);

  const handleClearChat = () => {
    setActiveSessionId(null);
    setOptimisticMessages([]);
  };

  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setOptimisticMessages([]);
  };

  const handleSendMessage = (question: string) => {
    const tempUserId = crypto.randomUUID();
    const tempAssistantId = crypto.randomUUID();

    const userMsg: ChatMessage = { id: tempUserId, role: 'user', content: question, createdAt: new Date().toISOString() };
    const pendingMsg: ChatMessage = { id: tempAssistantId, role: 'assistant', content: 'Memproses jawaban...', createdAt: new Date().toISOString() };

    setOptimisticMessages([...serverMessages, userMsg, pendingMsg]);

    sendMutation.mutate(
      { message: question, sessionId: activeSessionId ?? undefined },
      {
        onSuccess: (reply) => {
          const assistantReply: ChatMessage = {
            id: tempAssistantId,
            role: 'assistant',
            content: `${reply.answer}${formatSources(reply.sources)}`,
            createdAt: new Date().toISOString(),
          };

          setOptimisticMessages([...serverMessages, userMsg, assistantReply]);

          if (reply.session_id && reply.session_id !== activeSessionId) {
            setActiveSessionId(reply.session_id);
            queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
          } else if (activeSessionId) {
            queryClient.invalidateQueries({ queryKey: ['chat-messages', activeSessionId] });
          }
        },
        onError: (error) => {
          const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat meminta jawaban AI.';
          setOptimisticMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempAssistantId ? { ...msg, content: `Gagal memproses permintaan: ${errorMessage}` } : msg
            )
          );
        },
      }
    );
  };

  const currentMessages = optimisticMessages.length > 0 ? optimisticMessages : serverMessages;

  return {
    sessions,
    activeSessionId,
    messages: currentMessages,
    isSending: sendMutation.isPending || isFetching,
    handleSelectSession,
    handleSendMessage,
    handleClearChat,
  };
}
