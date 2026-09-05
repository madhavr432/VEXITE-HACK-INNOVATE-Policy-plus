import React from 'react';
import { Card, CardHeader, CardContent } from '../Card';
import { Badge } from '../Badge';
import { AlertCircle, CheckCircle2, ChevronRight, FileText } from 'lucide-react';

export function RiskDriversCard({ topRiskDrivers = [], deterministicReasons = [], policyVerdict = '', components = {} }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 1. Top Risk Drivers & Rule-Based Reasons */}
      <Card className="border border-slate-200/90 dark:border-slate-800 shadow-soft-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-policy-600 dark:text-policy-400" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Top Risk Drivers & Signals
            </h4>
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            Primary Vulnerability Attribution
          </div>
        </CardHeader>

        <CardContent className="pt-2 pb-5 px-5 sm:px-6 space-y-3">
          {/* Top Drivers tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500 font-medium">Ranked Drivers:</span>
            {topRiskDrivers.map((driverKey, idx) => {
              const comp = components[driverKey];
              if (!comp) return null;
              return (
                <div
                  key={driverKey}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <span className="w-4 h-4 rounded-full bg-policy-600 text-white text-[10px] font-mono flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <span>{comp.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">({comp.weighted_score.toFixed(1)} pts)</span>
                </div>
              );
            })}
          </div>

          {/* Diagnostic Reasons */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {deterministicReasons.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <ChevronRight className="w-3.5 h-3.5 text-policy-500 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 2. Deterministic Policy Verdict */}
      <Card className="border border-slate-200/90 dark:border-slate-800 shadow-soft-xs flex flex-col justify-between">
        <div>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-policy-600 dark:text-policy-400" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Deterministic Policy Verdict
              </h4>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              Decision Intelligence Summary
            </div>
          </CardHeader>

          <CardContent className="pt-2 pb-4 px-5 sm:px-6">
            <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 leading-relaxed text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white text-xs mb-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-policy-600 dark:text-policy-400" />
                <span>Synthesis of Tested Conditions</span>
              </div>
              <p>{policyVerdict || 'Evaluating policy resilience under baseline and stress assumptions...'}</p>
            </div>
          </CardContent>
        </div>

        <div className="px-5 sm:px-6 pb-4">
          <div className="p-2.5 rounded-lg bg-slate-100/60 dark:bg-slate-800/40 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Formulaic rule-based synthesis</span>
            <span className="font-mono text-[10px] uppercase font-bold text-policy-600 dark:text-policy-400">
              Policy+ Risk Engine
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default RiskDriversCard;
