import React from 'react';
import { Info, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from './Card';
import { cn } from '../utils/cn';

/**
 * DataProvenanceDisclaimer Component
 *
 * Compact institutional disclosure explaining mathematical provenance,
 * simulation boundaries, illustrative nature of fiscal outputs, and
 * separation between deterministic calculation and AI analysis.
 */
export function DataProvenanceDisclaimer({ className = '' }) {
  return (
    <Card className={cn('border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 shadow-soft-xs', className)}>
      <CardContent className="p-4 sm:p-5 space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
            <Info className="w-3.5 h-3.5" />
          </div>
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            About these results
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
          <div className="space-y-1">
            <span className="font-semibold text-slate-800 dark:text-slate-200 block text-[11px] uppercase font-mono">
              Deterministic Models
            </span>
            <p>
              Policy+ uses deterministic simulation models with configurable assumptions. Results represent tested scenarios, not guaranteed real-world outcomes.
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-semibold text-slate-800 dark:text-slate-200 block text-[11px] uppercase font-mono">
              Illustrative Scope
            </span>
            <p>
              GST outputs and transit elasticity shifts are illustrative scenario explorations and are not official government revenue forecasts or census projections.
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-semibold text-slate-800 dark:text-slate-200 block text-[11px] uppercase font-mono">
              AI Grounding
            </span>
            <p>
              AI-generated analysis is based strictly on validated Policy+ results and assumptions. Gemini interprets outputs and does not perform autonomous calculations.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default DataProvenanceDisclaimer;
