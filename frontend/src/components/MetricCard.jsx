import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '../utils/cn';

/**
 * MetricCard Component
 * Displays compact policy KPIs with baseline → simulated deltas and semantic indicators in both light/dark
 */
export function MetricCard({
  label,
  baseline,
  simulated,
  change,
  trend = 'neutral', // 'positive' | 'negative' | 'neutral'
  unit,
  detail,
  compact = false,
  className = '',
}) {
  const trendConfig = {
    positive: {
      text: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800',
      icon: ArrowUpRight,
    },
    negative: {
      text: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800',
      icon: ArrowDownRight,
    },
    neutral: {
      text: 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
      icon: Minus,
    },
  };

  const currentTrend = trendConfig[trend] || trendConfig.neutral;
  const TrendIcon = currentTrend.icon;

  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-all duration-150 hover:border-slate-300 dark:hover:border-slate-700 shadow-soft-xs',
        compact ? 'p-3.5' : 'p-5',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
          {label}
        </span>
        {change && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold border',
              currentTrend.text
            )}
          >
            <TrendIcon className="w-3 h-3 shrink-0" />
            {change}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        {baseline && (
          <span className="text-sm font-medium text-slate-400 dark:text-slate-500 line-through">
            {baseline}
          </span>
        )}
        <span className={cn('font-bold tracking-tight text-slate-900 dark:text-white', compact ? 'text-lg' : 'text-2xl')}>
          {simulated}
        </span>
        {unit && <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">{unit}</span>}
      </div>

      {detail && (
        <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
          {detail}
        </p>
      )}
    </div>
  );
}

export default MetricCard;
