import React from 'react';
import { cn } from '../utils/cn';

/**
 * Card Component
 * Large rounded institutional card with full Light and Dark mode contrast
 */
export function Card({
  children,
  className = '',
  hover = false,
  border = true,
  as: Component = 'div',
  ...props
}) {
  return (
    <Component
      className={cn(
        'rounded-2xl transition-all duration-200',
        'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-soft-sm',
        border && 'border border-slate-200/90 dark:border-slate-800',
        hover && 'hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-soft-md',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={cn('px-6 py-5 border-b border-slate-100 dark:border-slate-800/80', className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }) {
  return <div className={cn('p-6', className)}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={cn('px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 rounded-b-2xl', className)}>
      {children}
    </div>
  );
}

export default Card;
