import React from 'react';
import { Bus, Users, GitFork } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../Card';
import { cn } from '../../utils/cn';

/**
 * SystemScale Component
 * Visualizes physical system scale using clean, restrained vector icon matrices
 * representing active buses, passenger volume, and route corridors.
 */
export function SystemScale({
  buses = 120,
  passengers = '47K passengers/day',
  routes = 24,
  className = '',
}) {
  // 12 bus icons representing 120 buses (1 icon = 10 buses)
  const busCount = Math.max(1, Math.min(20, Math.round(Number(buses) / 10) || 12));
  // 18 person icons representing daily passengers
  const passengerIconsCount = 18;

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            System Scale
          </h3>
          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
            Physical Network
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Real-world scale represented by tangible transit operational units
        </p>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {/* 1. Fleet Pictograph */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Fleet
            </span>
            <span className="text-sm sm:text-base font-extrabold font-mono text-slate-900 dark:text-white">
              {buses} buses
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-policy-600 dark:text-policy-400 pt-1">
            {Array.from({ length: busCount }).map((_, i) => (
              <div
                key={i}
                title="1 unit = 10 buses"
                className="p-1 rounded-md bg-policy-50 dark:bg-policy-950/60 border border-policy-100 dark:border-policy-900"
              >
                <Bus className="w-3.5 h-3.5 shrink-0" />
              </div>
            ))}
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 ml-1.5">
              (1 unit = 10 buses)
            </span>
          </div>
        </div>

        {/* 2. Daily Passengers Pictograph */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Daily Passengers
            </span>
            <span className="text-sm sm:text-base font-extrabold font-mono text-slate-900 dark:text-white">
              {passengers}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-ai-600 dark:text-ai-400 pt-1">
            {Array.from({ length: passengerIconsCount }).map((_, i) => (
              <div
                key={i}
                title="1 unit = 2.5K commuters"
                className="p-1 rounded-md bg-ai-50 dark:bg-ai-950/60 border border-ai-100 dark:border-ai-900"
              >
                <Users className="w-3.5 h-3.5 shrink-0" />
              </div>
            ))}
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 ml-1.5">
              (1 unit = 2.5K commuters)
            </span>
          </div>
        </div>

        {/* 3. Routes */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Routes
            </span>
            <span className="text-sm sm:text-base font-extrabold font-mono text-slate-900 dark:text-white">
              {routes} routes
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
            <GitFork className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>14 Trunk Corridors • 10 Feeder Lines</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SystemScale;
