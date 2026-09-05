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
} from 'lucide-react';

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
          bg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
          badge: 'positive',
          bar: 'bg-emerald-500',
        };
      case 'moderate':
        return {
          bg: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
          badge: 'warning',
          bar: 'bg-amber-500',
        };
      case 'high':
        return {
          bg: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30',
          badge: 'negative',
          bar: 'bg-rose-500',
        };
      case 'critical':
      default:
        return {
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
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          Deterministic Policy Risk Engine
          <Badge variant={overallColors.badge}>
            {risk_level_label}
          </Badge>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Four-dimensional weighted risk assessment grounded strictly in mathematical simulation outputs
        </p>
      </div>

      {/* OVERALL SCORE & POLICY VERDICT BANNER */}
      <Card className={`p-6 border ${overallColors.bg}`}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Risk Gauge */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 pb-4 md:pb-0 md:pr-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Composite Policy Risk
            </span>
            <div className="text-5xl font-extrabold font-mono tracking-tight my-1">
              {overall_score}
              <span className="text-xl font-normal text-slate-400 dark:text-slate-500">/100</span>
            </div>
            <Badge variant={overallColors.badge} className="mt-1 font-bold">
              {risk_level_label}
            </Badge>

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
          <div className="md:col-span-8 space-y-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Deterministic Policy Verdict
              </span>
              <p className="text-sm font-medium text-slate-900 dark:text-white mt-1 leading-relaxed">
                {policy_verdict}
              </p>
            </div>

            {top_risk_drivers.length > 0 && (
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  Top Risk Drivers:
                </span>
                {top_risk_drivers.map((driver) => (
                  <span
                    key={driver}
                    className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-soft-xs"
                  >
                    {driver}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* 4 RISK DIMENSION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(components).map(([key, comp]) => {
          const compColors = getLevelColor(comp.level);

          return (
            <Card key={key} className="p-4 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {comp.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {Math.round(comp.weight * 100)}% wt
                </span>
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                    {comp.score}
                    <span className="text-xs font-normal text-slate-400">/100</span>
                  </div>
                  <Badge variant={compColors.badge} className="text-[10px] uppercase font-bold">
                    {comp.level}
                  </Badge>
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
  );
}
