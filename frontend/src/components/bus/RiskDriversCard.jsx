import React from 'react';
import { Card, CardHeader, CardContent } from '../Card';
import { Badge } from '../Badge';
import { AlertCircle, CheckCircle2, ChevronRight, FileText, Calculator } from 'lucide-react';

/**
 * RiskDriversCard Component
 *
 * Formats top risk drivers with 01, 02, 03 ranking and clear diagnostic explanations.
 * Purely deterministic, sourced from backend risk evaluation.
 */
export function RiskDriversCard({
  topRiskDrivers = [],
  deterministicReasons = [],
  policyVerdict = '',
  components = {},
}) {
  const driversToDisplay = topRiskDrivers.slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* 1. Top Risk Drivers (Numbered 01, 02, 03) */}
      <Card className="lg:col-span-7 border border-slate-200/90 dark:border-slate-800 shadow-soft-xs">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-policy-600 dark:text-policy-400" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Top Risk Drivers
              </h4>
            </div>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              Calculated by Policy+
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-5 space-y-4">
          {driversToDisplay.map((driverKey, idx) => {
            const comp = components[driverKey];
            if (!comp) return null;
            const rankNum = String(idx + 1).padStart(2, '0');

            return (
              <div
                key={driverKey}
                className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60"
              >
                <div className="text-sm font-mono font-extrabold text-policy-600 dark:text-policy-400 shrink-0 mt-0.5">
                  {rankNum}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {comp.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Contribution: {comp.weighted_score.toFixed(1)} pts
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {comp.primary_reason}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Diagnostic Reasons bullets */}
          {deterministicReasons.length > 0 && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 space-y-1.5">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Rule-Based Diagnostic Signals
              </span>
              {deterministicReasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 leading-snug">
                  <ChevronRight className="w-3.5 h-3.5 text-policy-500 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Deterministic Policy Verdict */}
      <Card className="lg:col-span-5 border border-slate-200/90 dark:border-slate-800 shadow-soft-xs flex flex-col justify-between">
        <div>
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-policy-600 dark:text-policy-400" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Policy Verdict
              </h4>
            </div>
          </CardHeader>

          <CardContent className="p-5 space-y-3">
            <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 leading-relaxed text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white text-xs mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-policy-600 dark:text-policy-400" />
                <span>Deterministic Resilience Synthesis</span>
              </div>
              <p>{policyVerdict || 'Evaluating policy resilience under baseline and stress assumptions...'}</p>
            </div>
          </CardContent>
        </div>

        <div className="px-5 pb-5">
          <div className="p-2.5 rounded-lg bg-slate-100/60 dark:bg-slate-800/40 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between font-mono">
            <span>Formulaic rule evaluation</span>
            <span className="text-[10px] uppercase font-bold text-policy-600 dark:text-policy-400">
              Deterministic Engine
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default RiskDriversCard;
