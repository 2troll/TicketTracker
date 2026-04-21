import { ButtonHTMLAttributes, forwardRef } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'glass' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
}

const sizes = {
  sm: 'h-9 px-3 text-sm rounded-xl',
  md: 'h-11 px-4 text-[15px] rounded-2xl',
  lg: 'h-14 px-6 text-base rounded-ios',
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = 'primary', size = 'md', block, className = '', children, ...rest }, ref) => {
    const base = 'press inline-flex items-center justify-center gap-2 font-semibold tracking-[-0.01em] disabled:opacity-40 disabled:pointer-events-none';
    const styles = {
      primary:
        'text-white shadow-[0_10px_30px_-10px_rgba(59,91,255,.6)] bg-gradient-to-br from-accent-500 via-accent-500 to-[#9b5bff] border border-white/20',
      glass:
        'glass text-ink',
      ghost:
        'text-ink-2 hover:text-ink bg-transparent',
      danger:
        'text-white bg-gradient-to-br from-[#ff4d6d] to-[#ff7a59] border border-white/20 shadow-[0_10px_30px_-10px_rgba(255,77,109,.55)]',
    }[variant];
    return (
      <button
        ref={ref}
        className={`${base} ${sizes[size]} ${styles} ${block ? 'w-full' : ''} ${className}`}
        {...rest}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
