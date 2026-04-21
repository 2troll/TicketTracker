import { HTMLAttributes, forwardRef } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  tone?: 'default' | 'strong';
  padded?: boolean;
}

export const Glass = forwardRef<HTMLDivElement, Props>(
  ({ tone = 'default', padded, className = '', children, ...rest }, ref) => (
    <div
      ref={ref}
      className={`${tone === 'strong' ? 'glass-strong' : 'glass'} rounded-ios ${padded ? 'p-4' : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
);
Glass.displayName = 'Glass';
