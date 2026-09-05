import React from 'react';
import { Settings, Info, Gauge, Zap, Fuel, Activity } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../Card';
import { cn } from '../../utils/cn';

/**
 * ModelAssumptions Component
 * Displays the transparent audit trail of empirical parameters and assumptions
 * utilized by the deterministic simulation engine.
 */
export function ModelAssumptions({
  assumptions = {
    trips_per_bus_per_day: 10,
    demand_elasticity: 0.25,
    waiting_time_alpha: 0.5,
    daily_fuel_use_per_bus: 120,
    emission_factor_kg_per_liter: 2.31,
  },
  className = '',
}) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-policy-600 dark:text-policy-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Model Assumptions & Parameters
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
            Auditable Engine
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Explicit calibration assumptions powering the deterministic simulation calculations
        </p>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {/* Assumption Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Assumption 1: Trips / day */}
          <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-1">
              <Activity className="w-3.5 h-3.5 text-policy-500" />
              <span>Trips / Bus / Day</span>
            </div>
            <div className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">
              {assumptions.trips_per_bus_per_day} <span className="text-[10px] font-normal text-slate-400">trips</span>
            </div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
              Circuit frequency
            </div>
          </div>

          {/* Assumption 2: Demand Elasticity */}
          <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-1">
              <Gauge className="w-3.5 h-3.5 text-ai-500" />
              <span>Demand Elasticity</span>
            </div>
            <div className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">
              {assumptions.demand_elasticity} <span className="text-[10px] font-normal text-slate-400">ratio</span>
            </div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
              Service sensitivity
            </div>
          </div>

          {/* Assumption 3: Waiting Time Alpha */}
          <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Wait-Time Alpha (α)</span>
            </div>
            <div className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">
              {assumptions.waiting_time_alpha} <span className="text-[10px] font-normal text-slate-400">power</span>
            </div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
              Queue pressure factor
            </div>
          </div>

          {/* Assumption 4: Fuel Consumption */}
          <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-1">
              <Fuel className="w-3.5 h-3.5 text-rose-500" />
              <span>Fuel Use / Bus</span>
            </div>
            <div className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">
              {assumptions.daily_fuel_use_per_bus} <span className="text-[10px] font-normal text-slate-400">L/day</span>
            </div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
              Depot consumption
            </div>
          </div>

          {/* Assumption 5: CO2 Factor */}
          <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-1">
              <Info className="w-3.5 h-3.5 text-emerald-500" />
              <span>CO₂ Factor</span>
            </div>
            <div className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">
              {assumptions.emission_factor_kg_per_liter} <span className="text-[10px] font-normal text-slate-400">kg/L</span>
            </div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
              Fuel carbon intensity
            </div>
          </div>
        </div>

        {/* Responsible AI / Explanatory Transparency Note */}
        <div className="rounded-xl bg-slate-100/80 dark:bg-slate-800/60 p-3 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
          <Info className="w-4 h-4 text-policy-600 dark:text-policy-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Notice on Simulation Modeling: </span>
            Simulation outputs are scenario estimates based on configurable assumptions, not guaranteed real-world forecasts. 
            Empirical demand response and queue compression use mathematical sensitivity approximations for policy decision support.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default ModelAssumptions;
