import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle, Activity } from 'lucide-react';
import { Card, CardContent } from '../Card';
import { Badge } from '../Badge';

export function RiskScoreCard({ riskResult }) {
  if (!riskResult) return null;

  const { overall_score, risk_level, risk_level_label, top_risk_drivers, components } = riskResult;

  // Level specific themes
  const levelStyles = {
    low: {
      bg: 'bg-emerald-50/70 dark:bg-emerald-950/20',
      border: 'border-emerald-200 dark:border-emerald-800/60',
      text: 'text-emerald-700 dark:text-emerald-400',
      badgeVariant: 'success',
      icon: ShieldCheck,
      ring: 'ring-emerald-500/20',
      barColor: 'bg-emerald-500',
    },
    moderate: {
      bg: 'bg-amber-50/70 dark:bg-amber-950/20',
      border: 'border-amber-200 dark:border-amber-800/60',
      text: 'text-amber-700 dark:text-amber-400',
      badgeVariant: 'warning',
      icon: Shield,
      ring: 'ring-amber-500/20',
      barColor: 'bg-amber-500',
    },
    high: {
      bg: 'bg-orange-50/70 dark:bg-orange-950/20',
      border: 'border-orange-200 dark:border-orange-800/60',
      text: 'text-orange-700 dark:text-orange-400',
      badgeVariant: 'warning',
      icon: AlertTriangle,
      ring: 'ring-orange-500/20',
      barColor: 'bg-orange-500',
    },
    critical: {
      bg: 'bg-rose-50/70 dark:bg-rose-950/20',
      border: 'border-rose-200 dark:border-rose-800/60',
      text: 'text-rose-700 dark:text-rose-400',
      badgeVariant: 'danger',
      icon: ShieldAlert,
      ring: 'ring-rose-500/20',
      barColor: 'bg-rose-500',
    },
  };

  const style = levelStyles[risk_level] || levelStyles.moderate;
  const IconComponent = style.icon;

  const topDriverName = top_risk_drivers?.length > 0 && components?.[top_risk_drivers[0]]
    ? components[top_risk_drivers[0]].name
    : null;

  return (
    <Card className={`border ${style.border} ${style.bg} shadow-soft-sm transition-all overflow-hidden`}>
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left Column: Score & Badges */}
          <div className="flex items-start gap-4 sm:gap-5">
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white dark:bg-slate-900 border ${style.border} shadow-soft-xs flex items-center justify-center shrink-0`}>
              <IconComponent className={`w-7 h-7 sm:w-8 sm:h-8 ${style.text}`} />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                  Deterministic Evaluation
                </span>
                <Badge variant={style.badgeVariant} size="sm" className="font-semibold">
                  {risk_level_label}
                </Badge>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
                  {overall_score}
                </span>
                <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">
                  / 100
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                  Policy Risk Score
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
                Weighted composite score across financial, capacity, demand sensitivity, and vehicle utilization stress conditions.
              </p>
            </div>
          </div>

          {/* Right Column: Quick Diagnostics pill cards */}
          <div className="flex flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-slate-200/80 dark:border-slate-800/80 pt-4 md:pt-0 md:pl-6">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs rounded-xl p-3 border border-slate-200/70 dark:border-slate-800 flex-1 md:w-56">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold">
                Primary Risk Driver
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-policy-600 dark:text-policy-400" />
                <span>{topDriverName || 'Balanced Exposure'}</span>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs rounded-xl p-3 border border-slate-200/70 dark:border-slate-800 flex-1 md:w-56">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold">
                Tested Scenarios
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                {riskResult.key_metrics?.policy_survives_all_tests ? (
                  <span className="text-emerald-600 dark:text-emerald-400">All Tests Passed</span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400">
                    Breaches in {riskResult.key_metrics?.breaking_point_scenario || 'Stress Scenarios'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default RiskScoreCard;
