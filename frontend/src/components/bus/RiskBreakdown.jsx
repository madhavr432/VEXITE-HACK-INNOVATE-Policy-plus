import React from 'react';
import { Card, CardHeader, CardContent } from '../Card';
import { Badge } from '../Badge';
import { Coins, Users, TrendingUp, Gauge, Info } from 'lucide-react';

export function RiskBreakdown({ components }) {
  if (!components) return null;

  const dimensionIcons = {
    financial: Coins,
    capacity: Users,
    demand: TrendingUp,
    utilization: Gauge,
  };

  const getLevelBadge = (level) => {
    switch (level) {
      case 'low':
        return <Badge variant="success" size="sm">Low Risk</Badge>;
      case 'moderate':
        return <Badge variant="warning" size="sm">Moderate</Badge>;
      case 'high':
        return <Badge variant="warning" size="sm">High Risk</Badge>;
      case 'critical':
        return <Badge variant="danger" size="sm">Critical</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{level}</Badge>;
    }
  };

  const getBarColor = (level) => {
    switch (level) {
      case 'low':
        return 'bg-emerald-500';
      case 'moderate':
        return 'bg-amber-500';
      case 'high':
        return 'bg-orange-500';
      case 'critical':
        return 'bg-rose-500';
      default:
        return 'bg-slate-400';
    }
  };

  const dims = [
    { key: 'financial', ...components.financial },
    { key: 'capacity', ...components.capacity },
    { key: 'demand', ...components.demand },
    { key: 'utilization', ...components.utilization },
  ];

  return (
    <Card className="border border-slate-200/90 dark:border-slate-800 shadow-soft-xs">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Dimensional Attribution
            </h4>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              Risk Component Breakdown & Weights
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              Calculated by Policy+
            </span>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Σ Weights = 100%
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2 pb-5 px-5 sm:px-6 space-y-4">
        {dims.map((item) => {
          const Icon = dimensionIcons[item.key] || Gauge;
          const weightPercent = Math.round(item.weight * 100);

          return (
            <div
              key={item.key}
              className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 space-y-2.5 transition-all hover:border-slate-300 dark:hover:border-slate-700"
            >
              {/* Top Row: Title, Weight, Score */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
                    <Icon className="w-3.5 h-3.5 text-policy-600 dark:text-policy-400" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {item.name}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 ml-2">
                      (Weight: {weightPercent}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getLevelBadge(item.level)}
                  <div className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                    {item.score} <span className="text-[10px] text-slate-400 font-normal">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Progress Meter */}
              <div className="space-y-1">
                <div className="w-full h-2 rounded-full bg-slate-200/80 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getBarColor(item.level)} transition-all duration-500`}
                    style={{ width: `${Math.min(100, Math.max(0, item.score))}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>{item.metric_label}: <strong className="text-slate-600 dark:text-slate-300 font-medium">{item.metric_value}</strong></span>
                  <span>Contribution: <strong className="text-slate-600 dark:text-slate-300 font-medium">{item.weighted_score.toFixed(1)} pts</strong></span>
                </div>
              </div>

              {/* Reason Snippet */}
              <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug flex items-start gap-1.5 pt-0.5 border-t border-slate-200/40 dark:border-slate-800/40">
                <Info className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                <span>{item.primary_reason}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default RiskBreakdown;
