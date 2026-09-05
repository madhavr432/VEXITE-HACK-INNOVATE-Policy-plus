import React from 'react';
import { cn } from '../utils/cn';

/**
 * Badge Component
 * Compact semantic status and domain tags
 */
export function Badge({
  children,
  variant = 'neutral', // 'ai' | 'neutral' | 'positive' | 'warning' | 'critical' | 'dark'
  size = 'md', // 'sm' | 'md'
  dot = false,
  icon: Icon,
  className = '',
}) {
  const variantStyles = {
    ai: 'bg-ai-50 text-ai-700 border-ai-200/80',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    positive: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    critical: 'bg-rose-50 text-rose-700 border-rose-200',
    dark: 'bg-ink text-slate-200 border-slate-800',
  };

  const dotColors = {
    ai: 'bg-ai-500',
    neutral: 'bg-slate-400',
    positive: 'bg-emerald-500',
    warning: 'bg-amber-500',
    critical: 'bg-rose-500',
    dark: 'bg-emerald-400',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border transition-colors',
        variantStyles[variant] || variantStyles.neutral,
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant] || 'bg-slate-400')} />
      )}
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span className="tracking-tight">{children}</span>
    </span>
  );
}

export default Badge;
