import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  Coins,
  Percent,
  Bus,
  ShieldCheck,
  Target,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../Card';
import { Badge } from '../Badge';
import { formatInrLakhs, formatPaxK } from '../../services/busSimulation';
import { cn } from '../../utils/cn';

/**
 * ScenarioCaseCards Component
 *
 * Displays three analytical outcome bounds for the selected policy:
 * Best Case, Expected Case, and Worst Tested Case.
 */
export function ScenarioCaseCards({
  bestCase,
  expectedCase,
  worstCase,
  className = '',
}) {
  if (!bestCase || !expectedCase || !worstCase) {
    return null;
  }

  const cases = [
    {
      data: bestCase,
      badgeLabel: 'BEST CASE',
      theme: {
        border: 'border-emerald-200 dark:border-emerald-900/60',
        bg: 'bg-emerald-50/20 dark:bg-emerald-950/10',
        badge: 'positive',
        iconBg: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
        surplusText: 'text-emerald-700 dark:text-emerald-400',
      },
      icon: ShieldCheck,
      subtitle: 'Favorable: Demand +5%, Cost -10%',
    },
    {
      data: expectedCase,
      badgeLabel: 'EXPECTED CASE',
      theme: {
        border: 'border-sky-200 dark:border-sky-900/60',
        bg: 'bg-sky-50/20 dark:bg-sky-950/10',
        badge: 'accent',
        iconBg: 'bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400',
        surplusText: 'text-sky-700 dark:text-sky-400',
      },
      icon: Target,
      subtitle: 'Baseline: Standard Model Assumptions',
    },
    {
      data: worstCase,
      badgeLabel: 'WORST TESTED CASE',
      theme: {
        border: 'border-rose-200 dark:border-rose-900/60',
        bg: 'bg-rose-50/20 dark:bg-rose-950/10',
        badge: 'danger',
        iconBg: 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400',
        surplusText: 'text-rose-700 dark:text-rose-400',
      },
      icon: AlertTriangle,
      subtitle: 'Worst Tested Scenario: Demand +25%, Cost +20%',
    },
  ];

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-slate-700 dark:text-slate-300">
            Outcome Envelope Bounds
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Comparative performance envelope derived deterministically from the simulation engine.
          </p>
        </div>
        <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 italic">
          *Worst tested scenario, not a guarantee.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cases.map(({ data, badgeLabel, theme, icon: Icon, subtitle }) => {
          const res = data.results;
          const isSurplusDeficit = res.operating_surplus < 0;

          return (
            <Card
              key={data.case_type}
              className={cn(
                'relative overflow-hidden border shadow-soft-xs transition-all duration-150',
                theme.border,
                theme.bg
              )}
            >
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', theme.iconBg)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                        {data.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                        {subtitle}
                      </p>
                    </div>
                  </div>
                  <Badge variant={theme.badge} size="sm" className="font-mono font-bold tracking-tight text-[10px]">
                    {badgeLabel || data.case_type.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-3 space-y-3 text-xs">
                {/* 2x3 Metric Grid */}
                <div className="grid grid-cols-2 gap-2.5 font-mono">
                  {/* Metric 1: Fleet */}
                  <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
                      <Bus className="w-3 h-3" />
                      <span>Fleet Size</span>
                    </div>
                    <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {res.fleet} buses
                    </div>
                  </div>

                  {/* Metric 2: Ridership */}
                  <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
                      <Users className="w-3 h-3" />
                      <span>Ridership</span>
                    </div>
                    <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {formatPaxK(res.daily_ridership)}
                    </div>
                  </div>

                  {/* Metric 3: Waiting Time */}
                  <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
                      <Clock className="w-3 h-3" />
                      <span>Waiting Time</span>
                    </div>
                    <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {res.waiting_time_minutes} min
                    </div>
                  </div>

                  {/* Metric 4: Utilization */}
                  <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
                      <Percent className="w-3 h-3" />
                      <span>Utilization</span>
                    </div>
                    <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {res.utilization_percent}%
                    </div>
                  </div>

                  {/* Metric 5: Operating Cost */}
                  <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
                      <Coins className="w-3 h-3" />
                      <span>Operating Cost</span>
                    </div>
                    <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {formatInrLakhs(res.operating_cost)}
                    </div>
                  </div>

                  {/* Metric 6: Operating Surplus */}
                  <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
                      <Coins className="w-3 h-3" />
                      <span>Net Surplus</span>
                    </div>
                    <div
                      className={cn(
                        'font-extrabold text-sm',
                        isSurplusDeficit
                          ? 'text-rose-600 dark:text-rose-400'
                          : theme.surplusText
                      )}
                    >
                      {formatInrLakhs(res.operating_surplus)}
                    </div>
                  </div>
                </div>

                <div className="pt-1 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span>Revenue: {formatInrLakhs(res.revenue)}</span>
                  <span>Cap: {res.daily_capacity.toLocaleString()} pax</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default ScenarioCaseCards;
