import React from 'react';
import {
  Settings,
  Info,
  Gauge,
  Zap,
  Fuel,
  Activity,
  Bus,
  Users,
  Coins,
  Clock,
  Leaf,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../Card';
import { cn } from '../../utils/cn';

/**
 * ModelAssumptions Component
 *
 * Displays the transparent audit trail of empirical parameters and assumptions
 * utilized by the deterministic simulation engine.
 *
 * Requirement 6:
 * Clearly visible "Simulation Assumptions" section showing all 11 relevant parameters:
 * - current fleet
 * - fleet increase
 * - daily ridership
 * - bus capacity
 * - trips/day
 * - ticket price
 * - operating cost
 * - waiting time
 * - demand elasticity
 * - emission factor
 * - fuel usage
 * And mandatory note: "Illustrative assumptions — not official forecasts."
 */
export function ModelAssumptions({
  currentFleet = 100,
  fleetIncrease = 20,
  dailyRidership = 42000,
  busCapacity = 50,
  tripsPerBusPerDay = 10,
  ticketPrice = 25,
  costPerBus = 8200,
  currentWaitingTime = 14,
  demandElasticity = 0.25,
  emissionFactor = 2.31,
  dailyFuelUse = 120,
  assumptions = {},
  className = '',
}) {
  const trips = assumptions?.trips_per_bus_per_day ?? tripsPerBusPerDay;
  const elasticity = assumptions?.demand_elasticity ?? demandElasticity;
  const fuel = assumptions?.daily_fuel_use_per_bus ?? dailyFuelUse;
  const emissions = assumptions?.emission_factor_kg_per_liter ?? emissionFactor;

  const items = [
    {
      label: 'Current Fleet',
      value: `${Number(currentFleet).toLocaleString()} buses`,
      sub: 'Base fleet size',
      icon: Bus,
    },
    {
      label: 'Fleet Increase',
      value: `+${fleetIncrease}%`,
      sub: 'Target intervention',
      icon: TrendingUpIcon,
    },
    {
      label: 'Daily Ridership',
      value: `${Number(dailyRidership).toLocaleString()} pax/day`,
      sub: 'Baseline route demand',
      icon: Users,
    },
    {
      label: 'Bus Capacity',
      value: `${busCapacity} passengers`,
      sub: 'Seated & standing limit',
      icon: Bus,
    },
    {
      label: 'Trips / Bus / Day',
      value: `${trips} circuits`,
      sub: 'Daily vehicle turnaround',
      icon: Activity,
    },
    {
      label: 'Ticket Price',
      value: `₹${ticketPrice}`,
      sub: 'Average tariff/trip',
      icon: Coins,
    },
    {
      label: 'Operating Cost',
      value: `₹${Number(costPerBus).toLocaleString()}/day`,
      sub: 'Cost per vehicle/day',
      icon: Coins,
    },
    {
      label: 'Waiting Time',
      value: `${currentWaitingTime} min`,
      sub: 'Base headway delay',
      icon: Clock,
    },
    {
      label: 'Demand Elasticity',
      value: `${elasticity}`,
      sub: 'Service frequency response',
      icon: Gauge,
    },
    {
      label: 'Emission Factor',
      value: `${emissions} kg/L`,
      sub: 'CO₂ per liter diesel',
      icon: Leaf,
    },
    {
      label: 'Fuel Usage',
      value: `${fuel} L/bus/day`,
      sub: 'Average depot burn rate',
      icon: Fuel,
    },
  ];

  return (
    <Card className={cn('overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-soft-xs', className)}>
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-policy-600 dark:text-policy-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Simulation Assumptions
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
            Calculated by Policy+ Engine
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Full calibration parameters transmitted to the deterministic simulation engine.
        </p>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* 11 Parameters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2.5">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1"
              >
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-mono">
                  <Icon className="w-3 h-3 text-policy-500 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                <div className="text-xs font-bold font-mono text-slate-900 dark:text-white truncate">
                  {item.value}
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                  {item.sub}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mandatory Responsible Simulation Disclaimer */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="font-medium font-sans">
              <strong>Illustrative assumptions — not official forecasts.</strong> Results model sensitivity under tested conditions and require validated local telemetry prior to real-world infrastructure deployment.
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TrendingUpIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

export default ModelAssumptions;
