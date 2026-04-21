import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  tone?: 'glass' | 'solid';
}

export const IconButton = forwardRef<HTMLButtonElement, Props>(
  ({ icon, tone = 'glass', className = '', ...rest }, ref) => (
    <button
      ref={ref}
      className={`press w-11 h-11 rounded-full grid place-items-center ${tone === 'glass' ? 'glass' : 'bg-ink text-white'} ${className}`}
      {...rest}
    >
      {icon}
    </button>
  )
);
IconButton.displayName = 'IconButton';
