import React from 'react';
import { CheckCircle2, ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * ScenarioSelector Component
 * Provides 3 distinct policy scenario selection cards:
 * 1. Current Policy (Baseline)
 * 2. Proposed Policy (+20% Fleet) [Default]
 * 3. Stress Case (High Demand)
 */
export function ScenarioSelector({
  selectedScenario = 'proposed',
  onSelectScenario,
  className = '',
}) {
  const scenarios = [
    {
      id: 'baseline',
      title: 'Current Policy',
      tagline: 'Baseline',
      description: 'Current fleet & schedule',
      badge: '100 Buses',
      icon: ShieldCheck,
      color: 'slate',
    },
    {
      id: 'proposed',
      title: 'Proposed Policy',
      tagline: '+20% Fleet',
      description: 'Expanded headway service',
      badge: '120 Buses',
      icon: TrendingUp,
      color: 'policy',
    },
    {
      id: 'stress',
      title: 'Stress Case',
      tagline: 'High Demand',
      description: '+25% shock & fuel surge',
      badge: 'Adverse Load',
      icon: AlertTriangle,
      color: 'rose',
    },
  ];

  return (
    <div className={cn('space-y-2.5', className)}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
          Scenario
        </label>
        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
          Preset Presets
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {scenarios.map((sc) => {
          const isSelected = selectedScenario === sc.id;
          const Icon = sc.icon;

          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => onSelectScenario(sc.id)}
              className={cn(
                'relative flex flex-col p-3 rounded-xl text-left transition-all duration-200 border cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-policy-500/20',
                isSelected
                  ? 'bg-policy-50/70 dark:bg-policy-950/40 border-policy-500 dark:border-policy-400 shadow-soft-sm ring-1 ring-policy-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/50'
              )}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={cn(
                    'text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded',
                    isSelected
                      ? 'bg-policy-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  )}
                >
                  {sc.tagline}
                </span>

                {isSelected ? (
                  <CheckCircle2 className="w-4 h-4 text-policy-600 dark:text-policy-400 shrink-0" />
                ) : (
                  <Icon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                )}
              </div>

              <div className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">
                {sc.title}
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                {sc.description}
              </div>

              <div className="mt-2 text-[10px] font-mono font-semibold text-slate-400 dark:text-slate-500">
                {sc.badge}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ScenarioSelector;
