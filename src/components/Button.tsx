import { twMerge } from 'tailwind-merge';
import React from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap';

const variantClasses: Record<Variant, string> = {
  primary: 'bg-primary text-primary-foreground hover:opacity-90',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary/70 ring-1 ring-border',
  outline:
    'bg-transparent text-foreground ring-1 ring-border hover:bg-accent/10',
  ghost: 'bg-transparent text-foreground hover:bg-accent/10',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  icon: 'h-9 w-9',
};

export default React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'ghost', size = 'md', className, children, ...props },
  ref,
) {
  const merged = twMerge(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  return (
    <button className={merged} ref={ref} {...props}>
      {children}
    </button>
  );
});
