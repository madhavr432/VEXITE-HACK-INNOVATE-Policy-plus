import React from 'react';
import { Sparkles, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from './Card';
import { Badge } from './Badge';
import { cn } from '../utils/cn';

/**
 * AIAnalyst Component
 * Premium AI interpretation module with key risks, mitigation, and governance boundary in light/dark
 */
export function AIAnalyst({
  title = 'AI Policy Analyst',
  badgeText = 'Gemini Assisted',
  summary = 'The 20% fleet increase produces a meaningful reduction in waiting time while increasing operating costs. The model suggests diminishing returns beyond approximately 25%, making the 20–25% range worth further consideration.',
  risks = [
    'Operating expenditure escalates by 14.6% annually without proportional fare yield.',
    'Off-peak fleet utilization drops from 78% to 72% due to static scheduling.',
    'Demand projections are highly sensitive to weather and modal competition.',
  ],
  mitigations = [
    'Deploy modular headway scheduling to preserve off-peak fleet utilization.',
    'Cap peak fleet allocation to 18–20% on primary trunk lines before expanding feeders.',
    'Stage passenger fare review or institutional bulk concessions to recover OPEX delta.',
  ],
  className = '',
}) {
  return (
    <Card className={cn('border-ai-200/80 dark:border-ai-500/30 bg-white dark:bg-slate-900 overflow-hidden shadow-soft-sm', className)}>
      <CardHeader className="bg-gradient-to-r from-ai-50/70 via-white to-white dark:from-ai-950/40 dark:via-slate-900 dark:to-slate-900 flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-ai-600 text-white flex items-center justify-center shadow-soft-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                {title}
              </h3>
              <Badge variant="ai" size="sm" dot>
                {badgeText}
              </Badge>
            </div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              Generative Policy Synthesis Layer
            </span>
          </div>
        </div>

        {/* Philosophy tag */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
          <ShieldCheck className="w-3.5 h-3.5 text-ai-600 dark:text-ai-400" />
          <span>Non-Autonomous Advisor</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        {/* Narrative Synthesis Quote */}
        <div className="relative pl-4 border-l-2 border-ai-500 py-1">
          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal italic">
            "{summary}"
          </p>
        </div>

        {/* Dual Grid: Key Risks & Potential Mitigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Key Risks */}
          <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Key Policy Risks</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {risks.map((risk, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span className="leading-normal">{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Potential Mitigation */}
          <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Potential Mitigations</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {mitigations.map((mitigation, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span className="leading-normal">{mitigation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mandatory Institutional Governance Trust Statement */}
        <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Simulation calculates the numbers. AI interprets the results.
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Deterministic simulation • AI-assisted interpretation • Human-led decision
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default AIAnalyst;
