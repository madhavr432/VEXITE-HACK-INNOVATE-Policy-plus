import React from 'react';
import {
  Clock,
  Coins,
  Users,
  Scale,
  Sparkles,
  ArrowRight,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../Card';
import { Badge } from '../Badge';
import { formatInrLakhs, formatPaxK } from '../../services/busSimulation';
import { cn } from '../../utils/cn';

/**
 * SensitivitySummary Component
 * 
 * A structured four-quadrant analytical policy summary card detailing
 * Service, Financial, Demand, and Trade-off responses for the active scenario.
 */
export function SensitivitySummary({
  current = {},
  selectedScenario = null,
  assumptions = {},
  className = '',
}) {
  if (!selectedScenario) return null;

  const waitDelta = selectedScenario.waiting_time_delta_percent || 0;
  const costDelta = selectedScenario.operating_cost_delta_percent || 0;
  const ridershipDelta = selectedScenario.ridership_delta_percent || 0;
  const surplusDelta = selectedScenario.surplus_delta_percent || 0;

  const addedBuses = selectedScenario.fleet - (current.fleet || 100);
  const waitMinutesSaved = ((current.waiting_time_minutes || 14) - selectedScenario.waiting_time_minutes).toFixed(1);
  const addedCost = selectedScenario.operating_cost - (current.operating_cost || 0);
  const addedRiders = Math.round(selectedScenario.daily_ridership - (current.daily_ridership || 0));

  // Marginal cost per minute of waiting time saved per passenger
  const marginalCostPerMinute = waitMinutesSaved > 0
    ? (addedCost / parseFloat(waitMinutesSaved)).toFixed(0)
    : 0;

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Policy Sensitivity & Elasticity Synthesis
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Deterministic policy behavior at +{selectedScenario.fleet_increase_percent}% fleet expansion ({selectedScenario.fleet} buses)
              </p>
            </div>
          </div>
          <Badge variant="accent" size="sm">
            Auditable Synthesis
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* QUADRANT 1: Service Response */}
          <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Service Response (Wait & Headway)</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">
                {waitDelta}% wait
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Adding <strong className="text-slate-900 dark:text-white font-mono">+{addedBuses} buses</strong> shortens average passenger waiting time from <span className="font-mono">{current.waiting_time_minutes || 14} min</span> to <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{selectedScenario.waiting_time_minutes} min</strong> (saving ~{waitMinutesSaved} min per commute).
            </p>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              Capacity: {current.daily_capacity?.toLocaleString()} → {selectedScenario.daily_capacity?.toLocaleString()} seats/day
            </div>
          </div>

          {/* QUADRANT 2: Financial Response */}
          <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <Coins className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Financial Response (OpEx & Surplus)</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/60">
                +{costDelta}% OpEx
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Daily operational expenditure scales from <span className="font-mono">{formatInrLakhs(current.operating_cost)}</span> to <strong className="text-amber-700 dark:text-amber-400 font-mono">{formatInrLakhs(selectedScenario.operating_cost)}</strong>. Daily operating surplus shifts by <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{surplusDelta}%</span> ({formatInrLakhs(selectedScenario.operating_surplus)}/day).
            </p>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              Daily Farebox Revenue: {formatInrLakhs(selectedScenario.revenue)}
            </div>
          </div>

          {/* QUADRANT 3: Demand Response */}
          <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Demand Response (Ridership Growth)</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800/60">
                +{ridershipDelta}% boardings
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              At an assumed service elasticity of <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{assumptions.demand_elasticity ?? 0.25}</span>, increased frequency stimulates <strong className="text-indigo-600 dark:text-indigo-400 font-mono">+{addedRiders.toLocaleString()} new riders/day</strong> (reaching {formatPaxK(selectedScenario.daily_ridership)} daily boardings).
            </p>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              Fleet Utilization: {current.utilization_percent}% → {selectedScenario.utilization_percent}%
            </div>
          </div>

          {/* QUADRANT 4: Trade-off Analysis */}
          <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <Scale className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                <span>Trade-off Analysis & Marginal Cost</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/40 px-2 py-0.5 rounded border border-violet-200 dark:border-violet-800/60">
                ₹{marginalCostPerMinute}/min saved
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Each minute of commuter waiting time saved costs approximately <strong className="text-violet-600 dark:text-violet-400 font-mono">₹{marginalCostPerMinute} in daily operational expenditure</strong>, offering a clear cost-benefit yardstick for transport committee reviews.
            </p>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              Daily Fleet Carbon: {(selectedScenario.emissions_kg / 1000).toFixed(1)}T CO₂/day
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SensitivitySummary;
