import { useState, isValidElement, cloneElement } from 'react';
import type { ReactElement } from 'react';
import type { AuthUser } from '../../types/domain';
import { AdminSidebar } from '../../modules/admin/components/AdminSidebar';
import { Menu, LayoutDashboard } from 'lucide-react';
import { ThemeToggle } from '../../components/molecules/ThemeToggle';

interface AdminLayoutProps {
  user: AuthUser | null;
  onLogout: () => void;
  children: React.ReactNode;
}

export function AdminLayout({
  user,
  onLogout,
  children,
}: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closePanels = () => {
    setIsSidebarOpen(false);
  };

  return (
    <main className="h-dvh bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col overflow-hidden">
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Tutup panel"
          onClick={closePanels}
          className="fixed inset-0 z-30 bg-slate-900/60 dark:bg-slate-950/60 lg:hidden cursor-default"
        />
      )}

      <div className="mx-auto flex h-full w-full max-w-[1800px] overflow-hidden">
        <AdminSidebar
          isOpen={isSidebarOpen}
          user={user}
          onClose={() => setIsSidebarOpen(false)}
          onLogout={onLogout}
        />

        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-slate-100/50 dark:bg-slate-900/50">
          {/* Mobile Header */}
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-500 text-white">
                <LayoutDashboard size={18} />
              </div>
              <p className="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-200">Admin Panel</p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-md p-2 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Buka menu"
            >
              <Menu size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1">
            {isValidElement(children)
              ? cloneElement(children as ReactElement<{ onOpenSidebar: () => void; }>, {
                  onOpenSidebar: () => setIsSidebarOpen(true),
                })
              : children}
          </div>
        </div>
      </div>
    </main>
  );
}

import { Outlet, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../../app/providers/authContext';

export function AdminLayoutRouteComponent() {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    auth.logout();
    await navigate({ to: '/login' });
  };

  return (
    <AdminLayout user={auth.user} onLogout={handleLogout}>
      <Outlet />
    </AdminLayout>
  );
}
