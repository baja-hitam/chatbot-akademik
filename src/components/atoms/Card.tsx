import type { HTMLAttributes, PropsWithChildren } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement> & PropsWithChildren;

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={['rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4', className ?? ''].join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}
