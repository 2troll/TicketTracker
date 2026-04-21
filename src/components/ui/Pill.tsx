import { HTMLAttributes, ReactNode } from 'react';

interface Props extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'neutral' | 'accent' | 'solid';
  leading?: ReactNode;
}

export function Pill({ tone = 'neutral', leading, className = '', children, ...rest }: Props) {
  const styles = {
    neutral: 'glass text-ink',
    accent: 'bg-accent-500/15 text-accent-600 dark:text-accent-300 border border-accent-500/20',
    solid: 'bg-ink text-white',
  }[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full text-xs font-semibold ${styles} ${className}`}
      {...rest}
    >
      {leading}
      {children}
    </span>
  );
}
