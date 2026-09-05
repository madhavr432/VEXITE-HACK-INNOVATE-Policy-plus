import React from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../Card';
import { Badge } from '../Badge';
import { cn } from '../../utils/cn';

/**
 * BreakingPointCard Component
 *
 * Displays the first condition under which the selected policy breaches stability
 * or warning thresholds within the tested scenario envelope.
 */
export function BreakingPointCard({
  breakingPoint,
  selectedFleetIncrease = 20,
  className = '',
}) {
  const hasBreached = Boolean(breakingPoint);

  return (
    <Card
      className={cn(
        'overflow-hidden border transition-all duration-200 shadow-soft-xs',
        hasBreached
          ? breakingPoint.status === 'critical'
            ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
            : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
          : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60',
        className
      )}
    >
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border',
                hasBreached
                  ? breakingPoint.status === 'critical'
                    ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                    : 'bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                  : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
              )}
            >
              {hasBreached ? (
                breakingPoint.status === 'critical' ? (
                  <ShieldAlert className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Resilience Assessment
                </span>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                  (Selected Policy: +{selectedFleetIncrease}% Fleet)
                </span>
              </div>

              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                {hasBreached ? (
                  <span>
                    First Problematic Tested Scenario: <span className="font-extrabold">{breakingPoint.scenario_name}</span>
                  </span>
                ) : (
                  <span>Policy Survived All Tested Scenarios</span>
                )}
              </h4>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {hasBreached ? (
                  <span>
                    The selected policy enters a {breakingPoint.status} state under this tested scenario:{' '}
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {breakingPoint.reason}
                    </span>
                    .
                  </span>
                ) : (
                  <span>
                    The policy intervention maintains positive fiscal surplus, safe capacity load factors (under 90%),
                    and resilient commuter waiting times across all 7 tested adverse demand and operating cost scenarios.
                  </span>
                )}
              </p>

              {hasBreached && (
                <div className="pt-2 space-y-2">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-soft-xs">
                      <span className="text-slate-400">Demand Stress:</span>
                      <span className="font-bold">
                        {breakingPoint.demand_multiplier > 1.0
                          ? `+${Math.round((breakingPoint.demand_multiplier - 1.0) * 100)}%`
                          : 'Baseline (0%)'}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-soft-xs">
                      <span className="text-slate-400">Cost Stress:</span>
                      <span className="font-bold">
                        {breakingPoint.cost_multiplier > 1.0
                          ? `+${Math.round((breakingPoint.cost_multiplier - 1.0) * 100)}%`
                          : 'Baseline (0%)'}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                    This is the first problematic scenario among the conditions tested; it is not a guaranteed real-world breaking point.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0 self-start sm:self-center">
            <Badge
              variant={
                hasBreached
                  ? breakingPoint.status === 'critical'
                    ? 'danger'
                    : 'warning'
                  : 'positive'
              }
              size="md"
              className="font-bold font-mono tracking-tight"
            >
              {hasBreached
                ? `${breakingPoint.status.toUpperCase()} STATE`
                : 'ALL TESTS PASSED'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BreakingPointCard;
