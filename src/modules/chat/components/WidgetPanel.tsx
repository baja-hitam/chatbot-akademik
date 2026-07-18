import { X } from 'lucide-react';
import type { AnnouncementItem, QuickAccessItem, UsageTipItem } from '../../../types/domain';
import { Badge } from '../../../components/atoms/Badge';
import { Card } from '../../../components/atoms/Card';

interface WidgetPanelProps {
  isOpen: boolean;
  quickAccess: QuickAccessItem[];
  announcements: AnnouncementItem[];
  usageTips: UsageTipItem[];
  onClose: () => void;
}

export function WidgetPanel({ isOpen, quickAccess, announcements, usageTips, onClose }: WidgetPanelProps) {
  return (
    <aside
      className={[
        'fixed inset-y-0 right-0 z-40 h-full w-[320px] space-y-4 overflow-y-auto border-l border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 transition-transform duration-200 xl:static xl:z-auto',
        isOpen ? 'translate-x-0' : 'translate-x-full xl:translate-x-0',
      ].join(' ')}
    >
      <div className="flex justify-between xl:justify-end">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 xl:hidden">Informasi</p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 xl:hidden"
          aria-label="Tutup panel"
        >
          <X size={18} />
        </button>
      </div>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Akses Cepat</h2>
        <div className="grid grid-cols-2 gap-2">
          {quickAccess.map((item) => (
            <a key={item.id} href={item.href} className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-3 text-xs text-slate-700 dark:text-slate-300 hover:border-indigo-400">
              <p className="font-medium text-slate-900 dark:text-slate-100">{item.title}</p>
              <p className="mt-1">{item.description}</p>
            </a>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Pengumuman Terbaru</h2>
        <div className="space-y-3">
          {announcements.map((item) => (
            <div key={item.id} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3">
              <Badge status={item.status}>{item.date}</Badge>
              <p className="mt-2 text-sm text-slate-800 dark:text-slate-200">{item.title}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Tips Penggunaan</h2>
        <div className="space-y-3">
          {usageTips.map((item) => (
            <div key={item.id} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.title}</p>
              <code className="mt-1 block rounded bg-slate-50 dark:bg-slate-900 px-2 py-1 text-xs text-indigo-200">{item.example}</code>
            </div>
          ))}
        </div>
      </Card>
    </aside>
  );
}
