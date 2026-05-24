import { useState, isValidElement, cloneElement } from 'react';
import type { ReactElement } from 'react';
import type { AuthUser } from '../../types/domain';
import { AdminSidebar } from '../../modules/admin/components/AdminSidebar';

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
    <main className="h-dvh bg-slate-950 text-slate-100">
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Tutup panel"
          onClick={closePanels}
          className="fixed inset-0 z-30 bg-slate-950/60 xl:hidden"
        />
      )}

      <div className="mx-auto flex h-full max-w-[1800px]">
        <AdminSidebar
          isOpen={isSidebarOpen}
          user={user}
          onClose={() => setIsSidebarOpen(false)}
          onLogout={onLogout}
        />

        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-slate-900/50">
          {isValidElement(children)
            ? cloneElement(children as ReactElement<{ onOpenSidebar: () => void; }>, {
                onOpenSidebar: () => setIsSidebarOpen(true),
              })
            : children}
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
