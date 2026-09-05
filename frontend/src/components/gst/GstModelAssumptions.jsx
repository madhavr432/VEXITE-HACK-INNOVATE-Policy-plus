import React from 'react';
import { Card, CardHeader, CardContent } from '../Card';
import { Info, FileText } from 'lucide-react';

/**
 * GstModelAssumptions Component
 *
 * Clearly visible Simulation Assumptions panel for GST policy.
 * Sourced deterministically from policy parameters and simulation engine.
 */
export function GstModelAssumptions({
  currentRate,
  proposedRate,
  annualTurnoverCr,
  complianceRate,
  demandElasticity,
  effectiveTaxBaseFactor,
}) {
  return (
    <Card className="border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-policy-600 dark:text-policy-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Simulation Assumptions
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded uppercase">
          Calculated by Policy+
        </span>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Current GST Rate</span>
            <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">{currentRate}%</span>
          </div>

          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Proposed GST Rate</span>
            <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">{proposedRate}%</span>
          </div>

          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Taxable Turnover</span>
            <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">₹{Number(annualTurnoverCr).toLocaleString()} Cr</span>
          </div>

          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Compliance Rate</span>
            <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">{complianceRate}%</span>
          </div>

          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Demand Elasticity</span>
            <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">{demandElasticity}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Effective Tax Base</span>
            <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">{effectiveTaxBaseFactor}</span>
          </div>
        </div>

        {/* Mandatory Responsible Simulation Disclaimer */}
        <div className="text-xs text-amber-900 dark:text-amber-200 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>Illustrative assumptions — not official forecasts.</strong>{' '}
            GST simulation results are illustrative scenario explorations based on user-configurable behavioral elasticity and compliance parameters. They do not constitute official Ministry of Finance or GST Council revenue estimates.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default GstModelAssumptions;
