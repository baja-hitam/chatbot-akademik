import { useState } from 'react';
import type { AnnouncementItem, AuthUser, ChatMessage, ChatSession, QuickAccessItem, UsageTipItem } from '../../../types/domain';
import { ChatPanel } from './ChatPanel';
import { SidebarPanel } from './SidebarPanel';
import { WidgetPanel } from './WidgetPanel';

interface ChatPageLayoutProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  currentMessages: ChatMessage[];
  announcements: AnnouncementItem[];
  quickAccess: QuickAccessItem[];
  usageTips: UsageTipItem[];
  isSending: boolean;
  user: AuthUser | null;
  onCreateChat: () => void;
  onSelectSession: (sessionId: string) => void;
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
  onLogout: () => void;
}

export function ChatPageLayout({
  sessions,
  activeSessionId,
  currentMessages,
  announcements,
  quickAccess,
  usageTips,
  isSending,
  user,
  onCreateChat,
  onSelectSession,
  onSendMessage,
  onClearChat,
  onLogout,
}: ChatPageLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWidgetPanelOpen, setIsWidgetPanelOpen] = useState(false);

  const closePanels = () => {
    setIsSidebarOpen(false);
    setIsWidgetPanelOpen(false);
  };

  return (
    <main className="h-dvh bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {(isSidebarOpen || isWidgetPanelOpen) && (
        <button
          type="button"
          aria-label="Tutup panel"
          onClick={closePanels}
          className="fixed inset-0 z-30 bg-white dark:bg-slate-950 xl:hidden"
        />
      )}

      <div className="mx-auto flex h-full max-w-[1800px]">
        <SidebarPanel
          isOpen={isSidebarOpen}
          sessions={sessions}
          activeSessionId={activeSessionId}
          user={user}
          onCreateChat={() => {
            onCreateChat();
            setIsSidebarOpen(false);
          }}
          onSelectSession={(id) => {
            onSelectSession(id);
            setIsSidebarOpen(false);
          }}
          onClose={() => setIsSidebarOpen(false)}
          onLogout={onLogout}
        />
        <ChatPanel
          messages={currentMessages}
          isSending={isSending}
          onSendMessage={onSendMessage}
          onClearChat={onClearChat}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenWidgetPanel={() => setIsWidgetPanelOpen(true)}
        />
        <WidgetPanel
          isOpen={isWidgetPanelOpen}
          quickAccess={quickAccess}
          announcements={announcements}
          usageTips={usageTips}
          onClose={() => setIsWidgetPanelOpen(false)}
        />
      </div>
    </main>
  );
}
