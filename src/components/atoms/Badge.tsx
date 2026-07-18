import type { PropsWithChildren } from 'react';
import type { AnnouncementStatus } from '../../types/domain';

interface BadgeProps extends PropsWithChildren {
  status: AnnouncementStatus;
}

const badgeMap: Record<AnnouncementStatus, string> = {
  info: 'bg-sky-500',
  warning: 'bg-amber-500',
  success: 'bg-emerald-500',
  urgent: 'bg-rose-500',
};

export function Badge({ status, children }: BadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
      <span className={['h-2.5 w-2.5 rounded-full', badgeMap[status]].join(' ')} />
      {children}
    </span>
  );
}
