import React from 'react';
import { Users, Bus, GitFork } from 'lucide-react';
import { Card, CardHeader, CardContent } from './Card';
import { cn } from '../utils/cn';

/**
 * Pictograph Component
 * Makes massive policy figures visually concrete using structured iconographic arrays in light and dark
 */
export function Pictograph({
  passengers = '47,000',
  buses = '120',
  routes = '24',
  className = '',
}) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
          System Scale
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Real-world scale represented by physical transit units
        </p>
      </CardHeader>

      <CardContent className="space-y-5 pt-2">
        {/* Daily Passengers */}
        <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Daily Commuters
            </span>
            <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
              {passengers} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">passengers/day</span>
            </span>
          </div>
          {/* Micro Icon Matrix */}
          <div className="flex flex-wrap gap-1 text-ai-600 dark:text-ai-400 pt-1">
            {Array.from({ length: 18 }).map((_, i) => (
              <Users key={i} className="w-3.5 h-3.5 shrink-0 hover:text-ai-600 dark:hover:text-ai-300 transition-colors" />
            ))}
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 self-center ml-1">
              (1 unit = 2.5K commuters)
            </span>
          </div>
        </div>

        {/* Fleet Deployment */}
        <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Active Bus Fleet
            </span>
            <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
              {buses} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">buses</span>
            </span>
          </div>
          {/* Micro Icon Matrix */}
          <div className="flex flex-wrap gap-1.5 text-policy-600 dark:text-policy-400 pt-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <Bus key={i} className="w-4 h-4 shrink-0 hover:text-policy-500 transition-colors" />
            ))}
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 self-center ml-1">
              (1 unit = 10 buses)
            </span>
          </div>
        </div>

        {/* Network Routes */}
        <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Network Corridors
            </span>
            <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
              {routes} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">active routes</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-mono">
            <GitFork className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>14 Trunk Corridors • 10 Feeder Lines</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Pictograph;
