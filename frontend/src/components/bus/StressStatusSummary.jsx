import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '../Card';
import { Badge } from '../Badge';
import { cn } from '../../utils/cn';

/**
 * StressStatusSummary Component
 *
 * Visual distribution of stress test results:
 * Total Tested, Stable, Warning, Critical, and survival verdict.
 */
export function StressStatusSummary({ attackSummary, className = '' }) {
  if (!attackSummary) return null;

  const total = attackSummary.scenarios_tested || 7;
  const stable = attackSummary.stable_scenarios || 0;
  const warning = attackSummary.warning_scenarios || 0;
  const critical = attackSummary.critical_scenarios || 0;

  const stablePct = Math.round((stable / total) * 100);
  const warningPct = Math.round((warning / total) * 100);
  const criticalPct = Math.round((critical / total) * 100);

  return (
    <Card className={cn('overflow-hidden shadow-soft-xs border', className)}>
      <CardContent className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Stress Scenario Health Distribution
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-base font-bold text-slate-900 dark:text-white">
                {total} Scenarios Evaluated
              </span>
              <Badge
                variant={attackSummary.policy_survives_all_tests ? 'positive' : critical > 0 ? 'danger' : 'warning'}
                size="sm"
                className="font-mono"
              >
                {attackSummary.policy_survives_all_tests
                  ? 'All Scenarios Stable'
                  : critical > 0
                  ? `${critical} Critical State Breached`
                  : `${warning} Warnings Observed`}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>{stable} Stable</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>{warning} Warning</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>{critical} Critical</span>
            </div>
          </div>
        </div>

        {/* Stacked Distribution Bar */}
        <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex shadow-inner">
          {stable > 0 && (
            <div
              style={{ width: `${stablePct}%` }}
              className="bg-emerald-500 transition-all duration-300"
              title={`Stable: ${stable} (${stablePct}%)`}
            />
          )}
          {warning > 0 && (
            <div
              style={{ width: `${warningPct}%` }}
              className="bg-amber-500 transition-all duration-300"
              title={`Warning: ${warning} (${warningPct}%)`}
            />
          )}
          {critical > 0 && (
            <div
              style={{ width: `${criticalPct}%` }}
              className="bg-rose-500 transition-all duration-300"
              title={`Critical: ${critical} (${criticalPct}%)`}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default StressStatusSummary;
