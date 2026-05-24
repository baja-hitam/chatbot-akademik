import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, PropsWithChildren {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  isLoading?: boolean;
}

const variantClassMap: Record<ButtonVariant, string> = {
  primary: 'bg-indigo-500 text-white hover:bg-indigo-400',
  secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700',
  ghost: 'text-slate-200 hover:bg-slate-800',
};

export function Button({ children, className, variant = 'primary', fullWidth, isLoading, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition',
        variantClassMap[variant],
        fullWidth ? 'w-full' : '',
        (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : '',
        className ?? '',
      ].join(' ')}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
      ) : null}
      {children}
    </button>
  );
}
