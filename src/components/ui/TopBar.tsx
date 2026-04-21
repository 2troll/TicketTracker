import { ReactNode } from 'react';

interface Props {
  title?: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  large?: boolean;
}

export function TopBar({ title, subtitle, leading, trailing, large }: Props) {
  return (
    <div className="pt-safe px-5">
      <div className="flex items-center justify-between gap-3 h-12">
        <div className="w-11 flex justify-start">{leading}</div>
        {!large && title && (
          <h1 className="text-[17px] font-bold tracking-[-0.01em] truncate">{title}</h1>
        )}
        <div className="w-11 flex justify-end">{trailing}</div>
      </div>
      {large && (title || subtitle) && (
        <div className="mt-1">
          {subtitle && (
            <div className="text-xs font-semibold uppercase tracking-widest text-ink-3">{subtitle}</div>
          )}
          {title && (
            <h1 className="text-[34px] font-extrabold tracking-[-0.03em] leading-tight">{title}</h1>
          )}
        </div>
      )}
    </div>
  );
}
