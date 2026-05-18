import { useState } from 'react';
import { useSessionsQuery } from './useSessionsQuery';
import { useSessionMessagesQuery } from './useSessionMessagesQuery';
import { useSendChatMutation } from './useSendChatMutation';
import type { ChatMessage } from '../types/chatTypes';

export function useChatMessages() {
  const sessionsQuery = useSessionsQuery();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('session');
    } catch (e) {
      return null;
    }
  });
  const messagesQuery = useSessionMessagesQuery(activeSessionId);
  const sendChat = useSendChatMutation();
  const [sendingMessage, setSendingMessage] = useState<string | null>(null);

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('session', id);
      window.history.replaceState(null, '', url.toString());
    } catch (e) {
      // ignore
    }
  };

  const handleSendMessage = async (message: string) => {
    try {
      setSendingMessage(message);
      const res = await sendChat.mutateAsync({
        question: message,
        session_id: activeSessionId ?? undefined,
      });
      // If backend created/returned a session id (first chat), select it so sidebar shows the new session
      const newSessionId = res?.session_id;
      if (newSessionId) {
        const id = String(newSessionId);
        setActiveSessionId(id);
        try {
          const url = new URL(window.location.href);
          url.searchParams.set('session', id);
          window.history.replaceState(null, '', url.toString());
        } catch (e) {
          // ignore
        }
      }
    } finally {
      setSendingMessage(null);
    }
  };

  const handleClearChat = () => {
    setActiveSessionId(null);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('session');
      window.history.replaceState(null, '', url.toString());
    } catch (e) {
      // ignore
    }
  };

  // Merge query messages with the optimistic message currently being sent
  const queryMessages = messagesQuery.data ?? [];
  const messages: ChatMessage[] = [...queryMessages];
  if (sendingMessage) {
    messages.push({
      id: 'temp-user-msg-' + Date.now(),
      role: 'user',
      content: sendingMessage,
      createdAt: new Date().toISOString(),
    });
  }

  return {
    sessions: sessionsQuery.data ?? [],
    activeSessionId,
    messages,
    isSending: sendChat.isPending,
    handleSelectSession,
    handleSendMessage,
    handleClearChat,
    sessionsQuery,
    messagesQuery,
  };
}
