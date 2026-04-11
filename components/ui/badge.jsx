import { cn } from '@/lib/utils';

export function Badge({ className, variant = 'default', ...props }) {
  const variants = {
    default: 'bg-primary/15 text-primary border border-primary/20',
    secondary: 'bg-element text-text-main border border-border',
    outline: 'bg-transparent text-text-main border border-border',
  };

  return <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider', variants[variant], className)} {...props} />;
}