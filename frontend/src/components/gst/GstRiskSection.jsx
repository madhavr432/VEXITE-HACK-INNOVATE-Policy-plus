import React from 'react';
import { Card, CardHeader, CardContent } from '../Card';
import { Badge } from '../Badge';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  TrendingDown,
  Percent,
  Activity,
  Award,
  AlertOctagon,
  Calculator,
  ChevronRight,
} from 'lucide-react';

/**
 * GstRiskSection Component
 *
 * Deterministic Policy Risk Engine presentation for GST policy.
 * Sourced strictly from Python backend calculation.
 */
export function GstRiskSection({ riskResult }) {
  if (!riskResult) return null;

  const {
    overall_score,
    risk_level,
    risk_level_label,
    components = {},
    top_risk_drivers = [],
    deterministic_reasons = [],
    policy_verdict,
  } = riskResult;

  const getLevelColor = (level) => {
    switch (level) {
      case 'low':
        return {
          label: 'Low Risk',
          symbol: '🟢',
          bg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
          badge: 'positive',
          bar: 'bg-emerald-500',
        };
      case 'moderate':
        return {
          label: 'Moderate Risk',
          symbol: '🟡',
          bg: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
          badge: 'warning',
          bar: 'bg-amber-500',
        };
      case 'high':
        return {
          label: 'High Risk',
          symbol: '🟠',
          bg: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30',
          badge: 'warning',
          bar: 'bg-orange-500',
        };
      case 'critical':
      default:
        return {
          label: 'Critical Risk',
          symbol: '🔴',
          bg: 'bg-red-500/15 text-red-800 dark:text-red-300 border-red-500/40',
          badge: 'negative',
          bar: 'bg-red-600',
        };
    }
  };

  const overallColors = getLevelColor(risk_level);

  return (
    <div className="space-y-6">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3 gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Deterministic Policy Risk Engine
            <div className="flex items-center gap-1.5 text-xs">
              <span>{overallColors.symbol}</span>
              <Badge variant={overallColors.badge}>
                {risk_level_label || overallColors.label}
              </Badge>
            </div>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Four-dimensional weighted risk assessment grounded strictly in mathematical simulation outputs
          </p>
        </div>
        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 self-start sm:self-center">
          Calculated by Policy+
        </span>
      </div>

      {/* OVERALL SCORE & POLICY VERDICT BANNER */}
      <Card className={`p-6 border ${overallColors.bg}`}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Risk Gauge */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 pb-4 md:pb-0 md:pr-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Policy Risk Score
            </span>
            <div className="text-5xl font-extrabold font-mono tracking-tight my-1">
              {overall_score}
              <span className="text-xl font-normal text-slate-400 dark:text-slate-500">/100</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 font-bold">
              <span>{overallColors.symbol}</span>
              <span className="text-xs">{risk_level_label || overallColors.label}</span>
            </div>

            {/* Progress meter bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-4 overflow-hidden">
              <div
                className={`h-full ${overallColors.bar} transition-all duration-500`}
                style={{ width: `${overall_score}%` }}
              />
            </div>
            <div className="flex justify-between w-full text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
              <span>0 Low</span>
              <span>30 Mod</span>
              <span>60 High</span>
              <span>100 Crit</span>
            </div>
          </div>

          {/* Verdict and Top Drivers */}
          <div className="md:col-span-8 space-y-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                Deterministic Policy Verdict
              </span>
              <p className="text-sm font-medium text-slate-900 dark:text-white mt-1 leading-relaxed">
                {policy_verdict}
              </p>
            </div>

            {/* TOP RISK DRIVERS (01, 02, 03 FORMAT) */}
            <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/80 space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                Top Risk Drivers
              </span>
              <div className="space-y-2">
                {top_risk_drivers.slice(0, 3).map((driverKey, idx) => {
                  const comp = components[driverKey];
                  const rankNum = String(idx + 1).padStart(2, '0');
                  if (!comp) {
                    return (
                      <div key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                        <span className="font-mono font-bold text-policy-600">{rankNum}</span>
                        <span>{driverKey}</span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={driverKey}
                      className="p-2.5 rounded-lg bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-policy-600 dark:text-policy-400">
                            {rankNum}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {comp.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          Contribution: {comp.weighted_score.toFixed(1)} pts
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 pl-6 leading-snug">
                        {comp.primary_reason}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 4 RISK DIMENSION BREAKDOWN WITH WEIGHTS & CONTRIBUTIONS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Risk Breakdown & Attribution
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Σ Weights = 100%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(components).map(([key, comp]) => {
            const compColors = getLevelColor(comp.level);
            const weightPercent = Math.round(comp.weight * 100);

            return (
              <Card key={key} className="p-4 flex flex-col justify-between space-y-3 border border-slate-200/90 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {comp.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {weightPercent}% weight
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                      {comp.score}
                      <span className="text-xs font-normal text-slate-400">/100</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{compColors.symbol}</span>
                      <Badge variant={compColors.badge} className="text-[10px] uppercase font-bold">
                        {comp.level}
                      </Badge>
                    </div>
                  </div>
                  {/* Micro bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full ${compColors.bar} transition-all duration-500`}
                      style={{ width: `${comp.score}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex justify-between text-[11px] font-mono text-slate-500">
                    <span>Contribution:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{comp.weighted_score.toFixed(1)} pts</strong>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-500">
                    <span>{comp.metric_label}:</span>
                    <strong className="text-slate-700 dark:text-slate-300">{comp.metric_value}</strong>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-3 leading-snug font-sans">
                    {comp.primary_reason}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default GstRiskSection;
