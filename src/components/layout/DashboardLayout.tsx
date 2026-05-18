import { useState, isValidElement, cloneElement, ReactElement } from 'react';
import type { AnnouncementItem, AuthUser, ChatSession, QuickAccessItem, UsageTipItem } from '../../types/domain';
import { SidebarPanel } from '../../modules/chat/components/SidebarPanel';
import { WidgetPanel } from '../../modules/chat/components/WidgetPanel';

interface DashboardLayoutProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  announcements: AnnouncementItem[];
  quickAccess: QuickAccessItem[];
  usageTips: UsageTipItem[];
  user: AuthUser | null;
  onCreateChat: () => void;
  onSelectSession: (sessionId: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export function DashboardLayout({
  sessions,
  activeSessionId,
  announcements,
  quickAccess,
  usageTips,
  user,
  onCreateChat,
  onSelectSession,
  onLogout,
  children,
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWidgetPanelOpen, setIsWidgetPanelOpen] = useState(false);

  const closePanels = () => {
    setIsSidebarOpen(false);
    setIsWidgetPanelOpen(false);
  };

  return (
    <main className="h-dvh bg-slate-950 text-slate-100">
      {(isSidebarOpen || isWidgetPanelOpen) && (
        <button
          type="button"
          aria-label="Tutup panel"
          onClick={closePanels}
          className="fixed inset-0 z-30 bg-slate-950/60 xl:hidden"
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

        <div className="flex min-w-0 flex-1 flex-col">
          {isValidElement(children)
            ? cloneElement(children as ReactElement<any>, {
                onOpenSidebar: () => setIsSidebarOpen(true),
                onOpenWidgetPanel: () => setIsWidgetPanelOpen(true),
              })
            : children}
        </div>

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
