import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Zap,
  Calculator,
  BrainCircuit,
} from 'lucide-react';
import { Card, CardContent } from './Card';
import { Button } from './Button';
import { cn } from '../utils/cn';

/**
 * PolicyDecisionSummary
 *
 * Executive summary card displayed near the top of simulation results.
 * Synthesizes deterministic quantitative findings with Gemini AI strategic interpretation.
 *
 * Distinct Explainability Labels:
 * - "Calculated by Policy+" for deterministic quantitative fields
 * - "Interpreted by Gemini" for AI analytical insights
 */
export function PolicyDecisionSummary({
  module = 'bus', // 'bus' | 'gst'
  proposedPolicyTitle = '',
  riskLevel = 'moderate', // 'low' | 'moderate' | 'high' | 'critical'
  riskScore = null,
  primaryStrength = '',
  primaryConcern = '',
  stressPoint = '',
  aiAssessment = '',
  hasAiAnalysis = false,
  isAiLoading = false,
  onTriggerAi = null,
  className = '',
}) {
  const getRiskConfig = (level) => {
    const norm = (level || 'moderate').toLowerCase();
    switch (norm) {
      case 'low':
        return {
          label: 'Low Risk',
          icon: ShieldCheck,
          symbol: '🟢',
          badgeVariant: 'positive',
          border: 'border-emerald-200 dark:border-emerald-800/80',
          bg: 'bg-emerald-50/40 dark:bg-emerald-950/20',
          text: 'text-emerald-700 dark:text-emerald-300',
        };
      case 'moderate':
        return {
          label: 'Moderate Risk',
          icon: AlertTriangle,
          symbol: '🟡',
          badgeVariant: 'warning',
          border: 'border-amber-200 dark:border-amber-800/80',
          bg: 'bg-amber-50/40 dark:bg-amber-950/20',
          text: 'text-amber-700 dark:text-amber-300',
        };
      case 'high':
        return {
          label: 'High Risk',
          icon: ShieldAlert,
          symbol: '🟠',
          badgeVariant: 'warning',
          border: 'border-orange-200 dark:border-orange-800/80',
          bg: 'bg-orange-50/40 dark:bg-orange-950/20',
          text: 'text-orange-700 dark:text-orange-300',
        };
      case 'critical':
      default:
        return {
          label: 'Critical Risk',
          icon: AlertOctagon,
          symbol: '🔴',
          badgeVariant: 'danger',
          border: 'border-rose-200 dark:border-rose-800/80',
          bg: 'bg-rose-50/40 dark:bg-rose-950/20',
          text: 'text-rose-700 dark:text-rose-300',
        };
    }
  };

  const risk = getRiskConfig(riskLevel);
  const RiskIcon = risk.icon;

  return (
    <Card className={cn('overflow-hidden border shadow-soft-sm', risk.border, className)}>
      {/* Top Banner Header */}
      <div className="bg-slate-900 text-white px-5 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-ai-400 animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-300">
            Policy Decision Summary
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            ({module === 'bus' ? 'Urban Transport' : 'Fiscal Indirect Tax'})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-300 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
            <Calculator className="w-3 h-3 text-policy-400" />
            <span>Calculated by Policy+</span>
          </span>
        </div>
      </div>

      <CardContent className="p-5 sm:p-6 space-y-5 bg-white dark:bg-[#0b0f19]">
        {/* Core Grid: Policy & Risk */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* Left Column: Proposed Policy & Risk Level */}
          <div className="md:col-span-5 space-y-3.5">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Proposed Policy
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
                {proposedPolicyTitle || (module === 'bus' ? 'Fleet Expansion Intervention' : 'GST Slab Rate Realignment')}
              </h3>
            </div>

            {/* Risk Badge with dual color + text + symbol */}
            <div className="flex items-center gap-3">
              <div className={cn('flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-xs shadow-2xs', risk.bg, risk.border, risk.text)}>
                <span>{risk.symbol}</span>
                <RiskIcon className="w-4 h-4" />
                <span>{risk.label}</span>
                {riskScore !== null && (
                  <span className="opacity-80 text-[11px] font-normal">
                    ({riskScore}/100)
                  </span>
                )}
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Deterministic risk score
              </span>
            </div>
          </div>

          {/* Right Column: Deterministic Findings (Strength, Concern, Stress Point) */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Primary Strength */}
            <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Primary Strength</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                {primaryStrength || 'Demonstrates capacity elasticity.'}
              </p>
            </div>

            {/* Primary Concern */}
            <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-700 dark:text-amber-400 uppercase">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Primary Concern</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                {primaryConcern || 'Reduced financial buffer under adverse shocks.'}
              </p>
            </div>

            {/* Stress Point */}
            <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-800/40 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-rose-700 dark:text-rose-400 uppercase">
                <Zap className="w-3.5 h-3.5" />
                <span>Stress Point</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                {stressPoint || 'Adverse peak conditions.'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Strategic AI Assessment */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-500" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                AI Assessment
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 px-2 py-0.5 rounded-md border border-violet-200 dark:border-violet-800/50">
              <BrainCircuit className="w-3 h-3" />
              <span>Interpreted by Gemini</span>
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-gradient-to-br from-violet-50/40 via-slate-50/50 to-indigo-50/30 dark:from-violet-950/15 dark:via-slate-900/40 dark:to-indigo-950/10 border border-violet-200/50 dark:border-violet-800/30 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {hasAiAnalysis ? (
              <p>{aiAssessment}</p>
            ) : isAiLoading ? (
              <p className="text-violet-600 dark:text-violet-400 italic">
                Gemini is synthesizing strategic policy trade-offs from verified simulation outputs...
              </p>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-slate-500 dark:text-slate-400">
                  {aiAssessment || 'Policy appears viable under baseline assumptions, but requires monitoring under adverse demand and cost conditions.'}
                </p>
                {onTriggerAi && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={onTriggerAi}
                    className="shrink-0 text-xs font-semibold"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Analyze with Gemini
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PolicyDecisionSummary;
