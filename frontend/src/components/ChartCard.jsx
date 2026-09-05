import React from 'react';
import { Card, CardHeader, CardContent } from './Card';
import { cn } from '../utils/cn';

/**
 * ChartCard Component
 * Consistent container for Recharts data visualizations with editorial context in light and dark modes
 */
export function ChartCard({
  title,
  subtitle,
  question,
  badge,
  legend,
  children,
  className = '',
}) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h3>
            {badge && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {badge}
              </span>
            )}
          </div>
          {question && (
            <p className="text-xs font-medium text-ai-700 dark:text-ai-400">
              Q: {question}
            </p>
          )}
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {legend && (
          <div className="flex items-center gap-3 text-xs font-mono text-slate-600 dark:text-slate-300 shrink-0">
            {legend}
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-2">
        {children}
      </CardContent>
    </Card>
  );
}

export default ChartCard;
