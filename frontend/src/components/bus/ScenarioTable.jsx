import React from 'react';
import {
  Layers,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../Card';
import { Badge } from '../Badge';
import { formatInrLakhs, formatPaxK } from '../../services/busSimulation';
import { cn } from '../../utils/cn';

/**
 * ScenarioTable Component
 * 
 * Interactive policy scenario comparison table showing operational and financial
 * outcomes across standard expansion tiers (0% to 50%).
 * Clicking any tier activates that scenario as the active policy intervention.
 */
export function ScenarioTable({
  scenarios = [],
  activePercent = 20,
  onSelectTier,
  className = '',
}) {
  if (!scenarios || scenarios.length === 0) {
    return null;
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Scenario Comparison Matrix
            </h3>
            <Badge variant="accent" size="sm">
              {scenarios.length} Tiers (0% – 50%)
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Click any row to load and evaluate that fleet expansion tier across the entire dashboard.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
          <span className="inline-block w-2 h-2 rounded-full bg-policy-500 animate-pulse" />
          Click row to select
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-y border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Tier</th>
                <th className="py-3 px-4 font-semibold">Fleet</th>
                <th className="py-3 px-4 font-semibold">Ridership</th>
                <th className="py-3 px-4 font-semibold">Wait Time</th>
                <th className="py-3 px-4 font-semibold">Cost / Day</th>
                <th className="py-3 px-4 font-semibold">Revenue</th>
                <th className="py-3 px-4 font-semibold text-right">Surplus / Day</th>
                <th className="py-3 px-3 text-center font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {scenarios.map((sc) => {
                const isSelected = Math.abs(sc.fleet_increase_percent - activePercent) < 0.01;
                const isBaseline = sc.fleet_increase_percent === 0;
                const surplus = sc.operating_surplus;
                const isPositiveSurplus = surplus >= 0;

                return (
                  <tr
                    key={sc.fleet_increase_percent}
                    onClick={() => onSelectTier && onSelectTier(sc.fleet_increase_percent)}
                    className={cn(
                      'cursor-pointer transition-colors duration-150 select-none group',
                      isSelected
                        ? 'bg-policy-50/80 dark:bg-policy-950/40 text-slate-900 dark:text-white font-bold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    )}
                  >
                    {/* Tier Column */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {isSelected ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-policy-600 dark:text-policy-400 shrink-0" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600 group-hover:border-policy-400 shrink-0" />
                        )}
                        <span className="font-semibold">
                          {isBaseline ? '0% (Current)' : `+${sc.fleet_increase_percent}%`}
                        </span>
                        {isSelected && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider bg-policy-600 text-white dark:bg-policy-500 dark:text-slate-950 font-extrabold shadow-soft-xs">
                            Active
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Fleet Size */}
                    <td className="py-3 px-4 whitespace-nowrap font-medium">
                      {sc.fleet} buses
                    </td>

                    {/* Daily Ridership */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{formatPaxK(sc.daily_ridership)}</span>
                        {sc.ridership_delta_percent > 0 && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                            (+{sc.ridership_delta_percent}%)
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Wait Time */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{sc.waiting_time_minutes} min</span>
                        {sc.waiting_time_delta_percent < 0 && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center">
                            <TrendingDown className="w-2.5 h-2.5 mr-0.5" />
                            {sc.waiting_time_delta_percent}%
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Operating Cost */}
                    <td className="py-3 px-4 whitespace-nowrap text-amber-700 dark:text-amber-400">
                      {formatInrLakhs(sc.operating_cost)}
                    </td>

                    {/* Revenue */}
                    <td className="py-3 px-4 whitespace-nowrap text-slate-700 dark:text-slate-300">
                      {formatInrLakhs(sc.revenue)}
                    </td>

                    {/* Operating Surplus */}
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded font-mono font-bold',
                          isPositiveSurplus
                            ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40'
                            : 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40'
                        )}
                      >
                        {isPositiveSurplus ? '+' : ''}
                        {formatInrLakhs(surplus)}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTier && onSelectTier(sc.fleet_increase_percent);
                        }}
                        className={cn(
                          'p-1.5 rounded-lg text-xs transition-all duration-150',
                          isSelected
                            ? 'bg-policy-600 text-white dark:bg-policy-400 dark:text-slate-900 shadow-soft-xs'
                            : 'text-slate-400 hover:text-policy-600 dark:hover:text-policy-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        )}
                        title={`Select +${sc.fleet_increase_percent}% scenario`}
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>* All metrics computed with deterministic elasticity (α=0.5 wait compression, ε=0.25 demand elasticity).</span>
          <span className="font-mono text-[10px] text-slate-400">Deterministic Engine v0.3.0</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default ScenarioTable;
