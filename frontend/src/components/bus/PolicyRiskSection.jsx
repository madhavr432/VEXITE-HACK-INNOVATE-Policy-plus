import React from 'react';
import { ShieldCheck, RotateCcw, Loader2, AlertCircle, Info } from 'lucide-react';
import { Button } from '../Button';
import { Card, CardContent } from '../Card';

import { RiskScoreCard } from './RiskScoreCard';
import { RiskMeter } from './RiskMeter';
import { RiskBreakdown } from './RiskBreakdown';
import { RiskDriversCard } from './RiskDriversCard';

export function PolicyRiskSection({
  riskResult,
  isLoading,
  error,
  onRefresh,
  selectedFleetIncrease = 20,
}) {
  return (
    <div id="policy-risk-section" className="space-y-6 pt-6 border-t border-slate-200/80 dark:border-slate-800">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-soft-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Deterministic Policy Risk Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Evaluates tested exposure for the proposed +{selectedFleetIncrease}% fleet policy across four core risk dimensions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="secondary"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-xs"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Evaluating Risk...</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Recalculate Risk</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 p-3.5 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>{error}</span>
          </div>
          <Button size="sm" variant="secondary" onClick={onRefresh}>
            Retry Evaluation
          </Button>
        </div>
      )}

      {/* Loading state skeleton */}
      {isLoading && !riskResult && (
        <Card className="border border-slate-200/90 dark:border-slate-800 p-8 text-center">
          <CardContent className="flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-policy-600 animate-spin" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Calculating policy risk...
              </p>
              <p className="text-xs text-slate-400 max-w-sm">
                Evaluating deterministic financial, capacity, demand surge, and vehicle utilization stress conditions.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results content */}
      {riskResult && (
        <div className="space-y-6">
          {/* 1. Overall Score Card */}
          <RiskScoreCard riskResult={riskResult} />

          {/* 2. Visual Risk Spectrum Gauge */}
          <RiskMeter
            score={riskResult.overall_score}
            riskLevel={riskResult.risk_level}
            riskLevelLabel={riskResult.risk_level_label}
          />

          {/* 3. 4-Dimension Attribution Breakdown */}
          <RiskBreakdown components={riskResult.components} />

          {/* 4. Top Drivers & Deterministic Verdict */}
          <RiskDriversCard
            topRiskDrivers={riskResult.top_risk_drivers}
            deterministicReasons={riskResult.deterministic_reasons}
            policyVerdict={riskResult.policy_verdict}
            components={riskResult.components}
          />

          {/* 5. Institutional Disclaimer & Methodological Audit */}
          <Card className="border border-slate-200/90 dark:border-slate-800 shadow-soft-xs bg-slate-50/50 dark:bg-slate-900/40">
            <CardContent className="p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-mono font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                <Info className="w-3.5 h-3.5 text-policy-600 dark:text-policy-400" />
                <span>Deterministic Methodological Notice & Decoupled Intelligence</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Policy+ does not claim to predict real-world policy outcomes with certainty. The risk score summarizes exposure under the assumptions and stress scenarios tested by the system.
                AI-powered policy interpretation is intentionally separated from deterministic policy computation and will be introduced in the next stage.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default PolicyRiskSection;
