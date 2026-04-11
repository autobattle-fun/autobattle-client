'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = {
  default: 'bg-primary text-white hover:bg-primary-hover shadow-sm',
  secondary: 'bg-element text-text-main hover:bg-element-hover',
  ghost: 'bg-transparent text-text-main hover:bg-element',
  outline: 'border border-border bg-transparent text-text-main hover:bg-element',
};

const buttonSizes = {
  default: 'h-10 px-4 py-2 rounded-full text-sm',
  sm: 'h-9 px-3 rounded-full text-sm',
  lg: 'h-11 px-5 rounded-full text-sm',
  icon: 'h-9 w-9 rounded-full p-0',
};

export const Button = React.forwardRef(function Button(
  { className, variant = 'default', size = 'default', type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
        buttonVariants[variant],
        buttonSizes[size],
        className,
      )}
      {...props}
    />
  );
});