import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../../../app/providers/authContext';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { ChatPanel } from '../components/ChatPanel';
import { useAnnouncementsQuery } from '../hooks/useAnnouncementsQuery';
import { useQuickAccessQuery } from '../hooks/useQuickAccessQuery';
import { useUsageTipsQuery } from '../hooks/useUsageTipsQuery';
import { useChatMessages } from '../hooks/useChatMessages';

export function ChatPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const announcementsQuery = useAnnouncementsQuery();
  const quickAccessQuery = useQuickAccessQuery();
  const usageTipsQuery = useUsageTipsQuery();
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
    return <div className="grid h-dvh place-items-center bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300">Memuat dashboard...</div>;
  }

  return (
    <DashboardLayout
      sessions={chat.sessions}
      activeSessionId={chat.activeSessionId}
      announcements={announcementsQuery.data ?? []}
      quickAccess={quickAccessQuery.data ?? []}
      usageTips={usageTipsQuery.data ?? []}
      user={auth.user}
      onCreateChat={chat.handleClearChat}
      onSelectSession={chat.handleSelectSession}
      onLogout={handleLogout}
    >
      <ChatPanel
        messages={chat.messages}
        isSending={chat.isSending}
        isLoadingMessages={chat.messagesQuery.isLoading && chat.activeSessionId !== null}
        onSendMessage={chat.handleSendMessage}
        onClearChat={chat.handleClearChat}
      />
    </DashboardLayout>
  );
}
