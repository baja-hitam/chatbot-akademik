import { History, LogOut, Plus, UserCircle2, X } from 'lucide-react';
import type { ChatSession } from '../../../types/domain';
import type { AuthUser } from '../../auth/types/authTypes';
import { Button } from '../../../components/atoms/Button';

interface SidebarPanelProps {
  isOpen: boolean;
  sessions: ChatSession[];
  activeSessionId: string | null;
  user: AuthUser | null;
  onCreateChat: () => void;
  onSelectSession: (sessionId: string) => void;
  onClose: () => void;
  onLogout: () => void;
}

export function SidebarPanel({
  isOpen,
  sessions,
  activeSessionId,
  user,
  onCreateChat,
  onSelectSession,
  onClose,
  onLogout,
}: SidebarPanelProps) {
  return (
    <aside
      className={[
        'fixed inset-y-0 left-0 z-40 flex h-full w-[280px] flex-col border-r border-slate-800 bg-slate-900 p-4 transition-transform duration-200 lg:static lg:z-auto',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ].join(' ')}
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Riwayat Chat</p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-2 text-slate-300 hover:bg-slate-800 lg:hidden"
          aria-label="Tutup menu"
        >
          <X size={18} />
        </button>
      </div>

      <Button variant="secondary" fullWidth onClick={onCreateChat}>
        <Plus size={16} /> New Chat
      </Button>

      <nav className="mt-4 flex-1 overflow-y-auto space-y-1 pr-1">
        {sessions.map((session) => {
          const isActive = session.id === activeSessionId;
          return (
            <button 
              key={session.id} 
              onClick={() => onSelectSession(session.id)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                isActive 
                  ? 'bg-indigo-500/20 text-indigo-100 border border-indigo-500/30' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100 border border-transparent'
              }`}
            >
              {/* <MessageSquare size={16} className={isActive ? 'text-indigo-400' : 'text-slate-500'} /> */}
              <span className="truncate">{session.title}</span>
            </button>
          );
        })}
        {sessions.length === 0 && (
          <p className="text-sm text-slate-500 text-center mt-4">Belum ada riwayat chat.</p>
        )}
      </nav>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-400">
        <div className="mb-1 flex items-center gap-2 text-slate-300">
          <History size={14} />
          Chat aktif
        </div>
        Fokus saat ini hanya kirim pertanyaan ke AI dengan parameter <code>question</code>.
      </div>

      <div className="mt-auto flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
        <UserCircle2 size={24} className="text-indigo-300" />
        <div className="min-w-0">
          <p className="truncate text-sm text-slate-200">{user?.full_name ?? 'Mahasiswa'}</p>
          <p className="truncate text-xs text-slate-500">{user?.username ?? '-'}</p>
          <p className="truncate text-xs text-slate-500">{user?.nama_prodi ?? '-'}</p>
        </div>
      </div>
      <Button variant="ghost" fullWidth className="mt-2" onClick={onLogout}>
        <LogOut size={16} />
        Logout
      </Button>
    </aside>
  );
}
