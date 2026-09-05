import React from 'react';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export function GstMetricCard({
  label,
  value,
  baseline,
  change,
  changePercent,
  trend = 'neutral', // 'positive' | 'negative' | 'neutral'
  detail,
  sublabel,
  variant = 'default',
}) {
  const isPositive = trend === 'positive';
  const isNegative = trend === 'negative';

  return (
    <Card className={`p-4 transition-all duration-200 hover:shadow-soft-md ${
      variant === 'highlight' ? 'border-emerald-500/40 bg-emerald-500/5' : ''
    }`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        {changePercent !== undefined && changePercent !== null && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
              isPositive
                ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-950/60'
                : isNegative
                ? 'text-rose-700 bg-rose-100 dark:text-rose-300 dark:bg-rose-950/60'
                : 'text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-800'
            }`}
          >
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : isNegative ? <ArrowDownRight className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
            {changePercent}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
          {value}
        </div>
        {sublabel && (
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {sublabel}
          </div>
        )}
      </div>

      {(baseline || detail) && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          {baseline && <span>Baseline: <strong className="font-mono text-slate-700 dark:text-slate-300">{baseline}</strong></span>}
          {detail && <span className="truncate text-right">{detail}</span>}
        </div>
      )}
    </Card>
  );
}
