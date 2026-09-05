import React from 'react';
import {
  Clock,
  Users,
  Banknote,
  Percent,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../Card';
import { cn } from '../../utils/cn';

/**
 * ImpactSummary Component
 * Displays the 3-column policy impact summary (Service, Cost, Utilization)
 * combined with the "What changes?" trade-off causal explanation section.
 */
export function ImpactSummary({
  serviceStatus = 'Improved',
  waitTimeDelta = '−21%',
  ridershipDelta = '+12%',
  costStatus = 'Increased',
  costDelta = '+15%',
  utilizationStatus = 'Changed',
  utilizationDelta = '−6%',
  className = '',
}) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Policy Impact Summary
          </h3>
          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
            Synthesized Overview
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          High-level operational delta across key governance pillars
        </p>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        {/* 3-Column Policy Impact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Column 1: SERVICE */}
          <div className="p-4 rounded-xl border border-emerald-200/90 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Service
              </span>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200">
                {serviceStatus}
              </span>
            </div>

            <div className="space-y-2 mt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Waiting time:
                </span>
                <span className="font-mono font-extrabold text-emerald-700 dark:text-emerald-300 text-sm">
                  {waitTimeDelta}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Ridership:
                </span>
                <span className="font-mono font-extrabold text-emerald-700 dark:text-emerald-300 text-sm">
                  {ridershipDelta}
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: COST */}
          <div className="p-4 rounded-xl border border-amber-200/90 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Cost
              </span>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/80 text-amber-800 dark:text-amber-200">
                {costStatus}
              </span>
            </div>

            <div className="space-y-2 mt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <Banknote className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Operating cost:
                </span>
                <span className="font-mono font-extrabold text-amber-800 dark:text-amber-300 text-sm">
                  {costDelta}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight pt-1">
                Linear expansion of fuel, crew wages, and maintenance overhead.
              </p>
            </div>
          </div>

          {/* Column 3: UTILIZATION */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Utilization
              </span>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {utilizationStatus}
              </span>
            </div>

            <div className="space-y-2 mt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <Percent className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                  Fleet utilization:
                </span>
                <span className="font-mono font-extrabold text-slate-800 dark:text-slate-200 text-sm">
                  {utilizationDelta}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight pt-1">
                Slight load factor dilution during off-peak and turnaround intervals.
              </p>
            </div>
          </div>
        </div>

        {/* Trade-Off Section: "What changes?" */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-policy-600 dark:text-policy-400" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              What changes?
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* 1. Fleet Capacity */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft-xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white mb-1">
                <span>Fleet Capacity</span>
                <span className="inline-flex items-center text-emerald-600 font-extrabold">
                  <ArrowUp className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="flex items-start gap-1 text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                <ChevronRight className="w-3 h-3 shrink-0 text-slate-400 mt-0.5" />
                <span>More fleet capacity → More available service</span>
              </div>
            </div>

            {/* 2. Ridership */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft-xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white mb-1">
                <span>Ridership</span>
                <span className="inline-flex items-center text-emerald-600 font-extrabold">
                  <ArrowUp className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="flex items-start gap-1 text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                <ChevronRight className="w-3 h-3 shrink-0 text-slate-400 mt-0.5" />
                <span>More service → Potential reduction in waiting time</span>
              </div>
            </div>

            {/* 3. Waiting Time */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft-xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white mb-1">
                <span>Waiting Time</span>
                <span className="inline-flex items-center text-emerald-600 font-extrabold">
                  <ArrowDown className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="flex items-start gap-1 text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                <ChevronRight className="w-3 h-3 shrink-0 text-slate-400 mt-0.5" />
                <span>Frequency increase compresses passenger wait queues</span>
              </div>
            </div>

            {/* 4. Operating Cost */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft-xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white mb-1">
                <span>Operating Cost</span>
                <span className="inline-flex items-center text-amber-600 font-extrabold">
                  <ArrowUp className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="flex items-start gap-1 text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                <ChevronRight className="w-3 h-3 shrink-0 text-slate-400 mt-0.5" />
                <span>More buses → Higher operating costs</span>
              </div>
            </div>

            {/* 5. Utilization */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft-xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white mb-1">
                <span>Utilization</span>
                <span className="inline-flex items-center text-slate-500 font-extrabold">
                  <ArrowDown className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="flex items-start gap-1 text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                <ChevronRight className="w-3 h-3 shrink-0 text-slate-400 mt-0.5" />
                <span>Marginal capacity expansion dilutes average load factor</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ImpactSummary;
