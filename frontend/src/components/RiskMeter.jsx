import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Card, CardHeader, CardContent } from './Card';
import { cn } from '../utils/cn';

/**
 * RiskMeter Component
 * Deterministic policy risk assessment with score and category breakdown in light/dark
 */
export function RiskMeter({
  score = 78,
  label = 'Moderate–High Risk',
  breakdown = [
    { label: 'Capacity Risk', level: 'High', status: 'critical', desc: 'Peak bottlenecks on trunk routes' },
    { label: 'Financial Risk', level: 'Moderate', status: 'warning', desc: 'OPEX escalation beyond 25% fleet' },
    { label: 'Demand Risk', level: 'Low', status: 'positive', desc: 'Strong elastic ridership response' },
    { label: 'Accessibility Impact', level: 'Low', status: 'positive', desc: 'Broad geographical distribution' },
  ],
  className = '',
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'critical':
        return 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800';
      case 'warning':
        return 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
      case 'positive':
      default:
        return 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
    }
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Policy Risk Assessment
            </h3>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              Deterministic Simulation Output
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
            {score} <span className="text-sm font-normal text-slate-400 dark:text-slate-500">/ 100</span>
          </div>
          <span className="text-[11px] font-mono font-semibold text-amber-700 dark:text-amber-400">
            {label}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        {/* Horizontal Risk Meter Bar */}
        <div>
          <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1.5">
            <span>0 Low Risk</span>
            <span>50 Moderate</span>
            <span>100 Critical</span>
          </div>

          <div className="relative h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700">
            {/* Color spectrum gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 opacity-80" />
            {/* Mask overlay for current position */}
            <div
              className="absolute top-0 bottom-0 right-0 bg-slate-100 dark:bg-slate-800 transition-all duration-500"
              style={{ width: `${100 - score}%` }}
            />
          </div>

          <div className="flex justify-end mt-1">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
              Engine threshold index: {score}%
            </span>
          </div>
        </div>

        {/* Categories Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          {breakdown.map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  {item.label}
                </span>
                <span className={cn('text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold', getStatusBadge(item.status))}>
                  {item.level}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default RiskMeter;
