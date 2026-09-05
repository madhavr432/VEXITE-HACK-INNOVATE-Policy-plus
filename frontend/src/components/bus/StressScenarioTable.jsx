import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../Card';
import { Badge } from '../Badge';
import { formatInrLakhs, formatPaxK } from '../../services/busSimulation';
import { cn } from '../../utils/cn';

/**
 * StressScenarioTable Component
 *
 * Comprehensive audit table showing all 7 deterministic stress test scenarios
 * with multipliers, key outcomes, and rule-based status badges.
 */
export function StressScenarioTable({
  scenarios = [],
  className = '',
}) {
  const [expandedRow, setExpandedRow] = useState(null);

  if (!scenarios || scenarios.length === 0) {
    return null;
  }

  const toggleRow = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  return (
    <Card className={cn('overflow-hidden shadow-soft-sm border', className)}>
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Adverse Stress Scenarios Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluated across systematic demand surge and operating cost inflation multipliers.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
            7 Scenarios Tested
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300 font-mono">
            <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Scenario</th>
                <th className="py-3 px-3 font-semibold text-center">Demand</th>
                <th className="py-3 px-3 font-semibold text-center">Cost</th>
                <th className="py-3 px-3 font-semibold text-right">Ridership</th>
                <th className="py-3 px-3 font-semibold text-right">Op Cost</th>
                <th className="py-3 px-3 font-semibold text-right">Surplus</th>
                <th className="py-3 px-3 font-semibold text-right">Utilization</th>
                <th className="py-3 px-3 font-semibold text-right">Wait Time</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {scenarios.map((sc) => {
                const res = sc.results;
                const isCritical = sc.status === 'critical';
                const isWarning = sc.status === 'warning';
                const isStable = sc.status === 'stable';
                const isDeficit = res.operating_surplus < 0;
                const isExpanded = expandedRow === sc.id;

                const rowBg = isCritical
                  ? 'bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                  : isWarning
                  ? 'bg-amber-50/30 dark:bg-amber-950/10 hover:bg-amber-50 dark:hover:bg-amber-950/20'
                  : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40';

                return (
                  <React.Fragment key={sc.id}>
                    <tr
                      onClick={() => toggleRow(sc.id)}
                      className={cn(
                        'transition-colors cursor-pointer',
                        rowBg,
                        isExpanded && 'border-b-0'
                      )}
                    >
                      {/* Scenario Name & Description */}
                      <td className="py-3 px-4 font-sans font-medium text-slate-900 dark:text-white">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs">{sc.name}</span>
                          {sc.status_reasons && sc.status_reasons.length > 0 && (
                            <span className="text-[10px] text-slate-400 hover:text-slate-600">
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 font-normal">
                          {sc.description}
                        </div>
                      </td>

                      {/* Demand Multiplier */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={cn(
                            'px-1.5 py-0.5 rounded text-[11px]',
                            sc.demand_multiplier > 1.0
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold'
                              : 'text-slate-500'
                          )}
                        >
                          {sc.demand_multiplier > 1.0
                            ? `+${Math.round((sc.demand_multiplier - 1.0) * 100)}%`
                            : '1.00×'}
                        </span>
                      </td>

                      {/* Cost Multiplier */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={cn(
                            'px-1.5 py-0.5 rounded text-[11px]',
                            sc.cost_multiplier > 1.0
                              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-bold'
                              : 'text-slate-500'
                          )}
                        >
                          {sc.cost_multiplier > 1.0
                            ? `+${Math.round((sc.cost_multiplier - 1.0) * 100)}%`
                            : '1.00×'}
                        </span>
                      </td>

                      {/* Ridership */}
                      <td className="py-3 px-3 text-right text-slate-800 dark:text-slate-200">
                        {formatPaxK(res.daily_ridership)}
                      </td>

                      {/* Operating Cost */}
                      <td className="py-3 px-3 text-right text-slate-800 dark:text-slate-200">
                        {formatInrLakhs(res.operating_cost)}
                      </td>

                      {/* Surplus */}
                      <td className="py-3 px-3 text-right font-bold">
                        <span
                          className={cn(
                            isDeficit
                              ? 'text-rose-600 dark:text-rose-400 font-extrabold'
                              : 'text-emerald-700 dark:text-emerald-400'
                          )}
                        >
                          {formatInrLakhs(res.operating_surplus)}
                        </span>
                      </td>

                      {/* Utilization */}
                      <td className="py-3 px-3 text-right">
                        <span
                          className={cn(
                            res.utilization_percent > 100
                              ? 'text-rose-600 dark:text-rose-400 font-bold'
                              : res.utilization_percent > 90
                              ? 'text-amber-600 dark:text-amber-400 font-semibold'
                              : 'text-slate-700 dark:text-slate-300'
                          )}
                        >
                          {res.utilization_percent}%
                        </span>
                      </td>

                      {/* Waiting Time */}
                      <td className="py-3 px-3 text-right text-slate-800 dark:text-slate-200">
                        {res.waiting_time_minutes}m
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4 text-center">
                        <Badge
                          variant={
                            isCritical ? 'danger' : isWarning ? 'warning' : 'positive'
                          }
                          size="sm"
                          className="font-mono text-[10px] font-bold uppercase tracking-tight"
                        >
                          {isCritical && '🔴 '}
                          {isWarning && '🟡 '}
                          {isStable && '🟢 '}
                          {sc.status}
                        </Badge>
                      </td>
                    </tr>

                    {/* Expandable Breakdown Drawer */}
                    {isExpanded && sc.status_reasons && sc.status_reasons.length > 0 && (
                      <tr className={cn(rowBg, 'border-b border-slate-200/60 dark:border-slate-800')}>
                        <td colSpan={9} className="py-2.5 px-6 font-sans text-xs">
                          <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                            <span className="font-semibold text-[11px] uppercase tracking-wider text-slate-400 shrink-0 font-mono">
                              Threshold Diagnostics:
                            </span>
                            <ul className="list-disc list-inside space-y-0.5 text-xs">
                              {sc.status_reasons.map((reason, idx) => (
                                <li key={idx} className="font-medium">
                                  {reason}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default StressScenarioTable;
