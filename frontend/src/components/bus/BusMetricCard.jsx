import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * BusMetricCard Component
 * Displays individual KPI with baseline → simulated delta, custom icon,
 * clear semantic indicators (positive, cost-increase warning, neutral).
 */
export function BusMetricCard({
  label,
  baseline,
  simulated,
  change,
  trend = 'neutral', // 'positive' | 'negative' | 'cost-increase' | 'neutral'
  icon: Icon,
  detail,
  className = '',
}) {
  const trendStyles = {
    positive: {
      badge: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      icon: ArrowUpRight,
    },
    negative: {
      badge: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      icon: ArrowDownRight,
    },
    'cost-increase': {
      badge: 'bg-amber-50 dark:bg-amber-950/50 text-amber-750 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      icon: ArrowUpRight,
    },
    neutral: {
      badge: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      icon: Minus,
    },
  };

  const currentTrend = trendStyles[trend] || trendStyles.neutral;
  const TrendIcon = currentTrend.icon;

  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-soft-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-150',
        className
      )}
    >
      {/* Top row: Label & Delta Badge */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5">
          {Icon && <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />}
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
            {label}
          </span>
        </div>

        {change && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold border shrink-0',
              currentTrend.badge
            )}
          >
            <TrendIcon className="w-3 h-3 shrink-0" />
            {change}
          </span>
        )}
      </div>

      {/* Main Value row: Baseline → Simulated */}
      <div className="flex items-baseline flex-wrap gap-2 my-1">
        {baseline && (
          <span className="text-sm sm:text-base font-semibold text-slate-400 dark:text-slate-500 font-mono">
            {baseline}
          </span>
        )}
        {baseline && simulated && (
          <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 self-center shrink-0" />
        )}
        <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
          {simulated}
        </span>
      </div>

      {/* Detail explanation text */}
      {detail && (
        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
          {detail}
        </p>
      )}
    </div>
  );
}

export default BusMetricCard;
