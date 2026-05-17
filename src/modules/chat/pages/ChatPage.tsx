import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../../../app/providers/authContext';
import { ChatPageLayout } from '../components/ChatPageLayout';
import { useAnnouncements } from '../hooks/queries/useAnnouncements';
import { useQuickAccess } from '../hooks/queries/useQuickAccess';
import { useUsageTips } from '../hooks/queries/useUsageTips';
import { useChatMessages } from '../hooks/useChatMessages';

export function ChatPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const announcementsQuery = useAnnouncements();
  const quickAccessQuery = useQuickAccess();
  const usageTipsQuery = useUsageTips();
  const chat = useChatMessages();

  const handleLogout = async () => {
    auth.logout();
    await navigate({ to: '/login' });
  };

  if (
    announcementsQuery.isPending ||
    quickAccessQuery.isPending ||
    usageTipsQuery.isPending
  ) {
    return <div className="grid h-dvh place-items-center bg-slate-950 text-slate-300">Memuat dashboard...</div>;
  }

  return (
    <ChatPageLayout
      sessions={chat.sessions}
      activeSessionId={chat.activeSessionId}
      currentMessages={chat.messages}
      announcements={announcementsQuery.data ?? []}
      quickAccess={quickAccessQuery.data ?? []}
      usageTips={usageTipsQuery.data ?? []}
      isSending={chat.isSending}
      user={auth.user}
      onCreateChat={chat.handleClearChat}
      onSelectSession={chat.handleSelectSession}
      onSendMessage={chat.handleSendMessage}
      onClearChat={chat.handleClearChat}
      onLogout={handleLogout}
    />
  );
}
