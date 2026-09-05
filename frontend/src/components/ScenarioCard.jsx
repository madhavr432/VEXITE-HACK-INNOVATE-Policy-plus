import React from 'react';
import { cn } from '../utils/cn';

/**
 * ScenarioCard Component
 * Displays Best, Expected, and Worst case simulated projections with dark mode support
 */
export function ScenarioCard({
  type = 'expected', // 'best' | 'expected' | 'worst'
  title,
  subtitle,
  metrics = {},
  className = '',
}) {
  const typeConfig = {
    best: {
      accent: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20',
      dot: 'bg-emerald-500',
      badge: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800',
      tag: 'BEST CASE',
    },
    expected: {
      accent: 'border-blue-200 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20',
      dot: 'bg-blue-500',
      badge: 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800',
      tag: 'EXPECTED CASE',
    },
    worst: {
      accent: 'border-rose-200 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/20',
      dot: 'bg-rose-500',
      badge: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800',
      tag: 'WORST CASE',
    },
  };

  const config = typeConfig[type] || typeConfig.expected;

  return (
    <div
      className={cn(
        'rounded-2xl border p-5 transition-all bg-white dark:bg-slate-900 shadow-soft-xs hover:shadow-soft-sm flex flex-col justify-between',
        config.accent,
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className={cn('w-2 h-2 rounded-full', config.dot)} />
            <span className={cn('text-[11px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full border', config.badge)}>
              {config.tag}
            </span>
          </div>
          {metrics.risk && (
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              Risk: <strong className="text-slate-900 dark:text-white">{metrics.risk}</strong>
            </span>
          )}
        </div>

        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          {title}
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div>
          <span className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono">Wait Time</span>
          <span className="font-bold text-slate-900 dark:text-white font-mono">{metrics.waitingTime || '—'}</span>
        </div>
        <div>
          <span className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono">Ridership</span>
          <span className="font-bold text-slate-900 dark:text-white font-mono">{metrics.ridership || '—'}</span>
        </div>
        <div>
          <span className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono">Op. Cost</span>
          <span className="font-bold text-slate-900 dark:text-white font-mono">{metrics.cost || '—'}</span>
        </div>
      </div>
    </div>
  );
}

export default ScenarioCard;
