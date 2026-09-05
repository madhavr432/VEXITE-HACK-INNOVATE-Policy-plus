import React from 'react';
import { Card, CardHeader, CardContent } from '../Card';
import { Info, HelpCircle, FileText } from 'lucide-react';
import { formatPercent, formatInrCrores } from '../../services/gstSimulation';

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
      <CardHeader className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Transparent Policy Model Assumptions
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400 uppercase">
          Configurable Parameters
        </span>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Baseline Slab</span>
            <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">{currentRate}%</span>
          </div>

          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Proposed Slab</span>
            <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">{proposedRate}%</span>
          </div>

          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Gross Turnover</span>
            <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">₹{Number(annualTurnoverCr).toLocaleString()} Cr</span>
          </div>

          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Compliance Rate</span>
            <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">{complianceRate}%</span>
          </div>

          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Demand Elasticity</span>
            <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">{demandElasticity}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tax Base Factor</span>
            <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">{effectiveTaxBaseFactor}</span>
          </div>
        </div>

        {/* Official Transparency Disclaimer */}
        <div className="text-[11px] text-slate-500 dark:text-slate-400 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800 dark:text-slate-200">Official Disclaimer:</strong>{' '}
            GST simulation results are illustrative scenario outputs based on user-configurable behavioral elasticity and compliance parameters. They do not constitute official Ministry of Finance or GST Council revenue forecasts.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
