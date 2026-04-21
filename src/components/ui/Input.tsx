import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, leading, trailing, className = '', ...rest }, ref) => (
    <label className="block">
      {label && (
        <span className="block text-[11px] font-semibold tracking-wider uppercase text-ink-3 mb-1.5 pl-1">
          {label}
        </span>
      )}
      <div className="glass rounded-2xl flex items-center gap-2 px-3 h-12">
        {leading && <div className="text-ink-3 shrink-0">{leading}</div>}
        <input
          ref={ref}
          className={`flex-1 bg-transparent outline-none text-[16px] placeholder:text-ink-3 ${className}`}
          {...rest}
        />
        {trailing}
      </div>
    </label>
  )
);
Input.displayName = 'Input';
