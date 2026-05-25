import { BookOpen, LayoutDashboard, LogOut, UserCircle2, X, Users } from 'lucide-react';
import type { AuthUser } from '../../../types/domain';
import { Button } from '../../../components/atoms/Button';
import { Link } from '@tanstack/react-router';

interface AdminSidebarProps {
  isOpen: boolean;
  user: AuthUser | null;
  onClose: () => void;
  onLogout: () => void;
}

export function AdminSidebar({
  isOpen,
  user,
  onClose,
  onLogout,
}: AdminSidebarProps) {
  return (
    <aside
      className={[
        'fixed inset-y-0 left-0 z-40 flex h-full w-[280px] flex-col border-r border-slate-800 bg-slate-900 p-4 transition-transform duration-200 lg:static lg:z-auto',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ].join(' ')}
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-500 text-white">
            <LayoutDashboard size={18} />
          </div>
          <p className="text-sm font-semibold tracking-wide text-slate-200">Admin Panel</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-2 text-slate-300 hover:bg-slate-800 lg:hidden"
          aria-label="Tutup menu"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 space-y-2">
        <Link
          to="/admin"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white"
          activeProps={{ className: 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20' }}
          activeOptions={{ exact: true }}
          onClick={onClose}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>
        <Link
          to="/admin/prodi"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white"
          activeProps={{ className: 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20' }}
          onClick={onClose}
        >
          <BookOpen size={18} />
          Master Prodi
        </Link>
        <Link
          to="/admin/users"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white"
          activeProps={{ className: 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20' }}
          onClick={onClose}
        >
          <Users size={18} />
          Manajemen Pengguna
        </Link>
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-800">
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
          <UserCircle2 size={24} className="text-indigo-300" />
          <div className="min-w-0">
            <p className="truncate text-sm text-slate-200">{user?.full_name ?? 'Admin'}</p>
            <p className="truncate text-xs text-slate-500">{user?.role ?? 'admin'}</p>
          </div>
        </div>
        <Button variant="ghost" fullWidth onClick={onLogout}>
          <LogOut size={16} />
          Logout
        </Button>
      </div>
    </aside>
  );
}
