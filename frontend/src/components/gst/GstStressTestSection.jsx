import React from 'react';
import { Card, CardHeader, CardContent } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';
import {
  ShieldAlert,
  ShieldCheck,
  Flame,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Loader2,
  Target,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { formatInrCrores, formatPercent } from '../../services/gstSimulation';

/**
 * GstStressTestSection Component
 *
 * Attack My Policy stress testing for the GST policy module.
 *
 * Features:
 * - Clear explanation: "Attack My Policy: We deliberately test your policy against adverse conditions to identify where it becomes vulnerable."
 * - Outcome Envelope Bounds: BEST CASE, EXPECTED CASE, WORST TESTED CASE
 * - First Problematic Tested Scenario with mandatory disclaimer
 * - Table showing: Scenario | Status | Key Impact
 */
export function GstStressTestSection({
  stressResult,
  isLoading,
  onRunAttack,
}) {
  if (!stressResult) {
    return (
      <Card className="border-dashed border-2 border-slate-200 dark:border-slate-800 p-8 text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
          <Flame className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Attack My GST Policy
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
            We deliberately test your policy against adverse conditions to identify where it becomes vulnerable.
          </p>
        </div>
        <Button
          onClick={onRunAttack}
          disabled={isLoading}
          variant="danger"
          pill
          icon={isLoading ? Loader2 : Flame}
          className="mx-auto shadow-soft-sm font-semibold"
        >
          {isLoading ? 'Stress-testing your policy...' : '⚡ Attack My GST Policy →'}
        </Button>
      </Card>
    );
  }

  const { summary, breaking_point, worst_case, stress_scenarios = [] } = stressResult;

  // Derive Best, Expected, Worst tested cases
  const expectedScenario = stress_scenarios.find((s) => s.id === 'baseline') || stress_scenarios[0];
  const worstScenario = worst_case || stress_scenarios.find((s) => s.status === 'critical') || stress_scenarios[stress_scenarios.length - 1];
  const bestScenario = stress_scenarios.find((s) => s.revenue_change_percent_vs_proposed >= 0 && s.status === 'stable') || expectedScenario;

  return (
    <div className="space-y-6">
      {/* SECTION HEADER WITH ATTACK TRIGGER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              ⚡ Attack My GST Policy
              <Badge variant={summary.policy_survives_all_tests ? 'positive' : 'negative'}>
                {summary.policy_survives_all_tests ? 'Resilient' : 'Vulnerabilities Identified'}
              </Badge>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              We deliberately test your policy against adverse conditions to identify where it becomes vulnerable.
            </p>
          </div>
        </div>

        <Button
          onClick={onRunAttack}
          disabled={isLoading}
          variant="secondary"
          size="sm"
          pill
          icon={isLoading ? Loader2 : Flame}
          className="font-medium text-xs"
        >
          {isLoading ? 'Stress-testing your policy...' : 'Re-run Attack Tests'}
        </Button>
      </div>

      {/* 3 OUTCOME ENVELOPE BOUNDS (BEST CASE, EXPECTED CASE, WORST TESTED CASE) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Outcome Envelope Bounds
          </span>
          <span className="text-[11px] font-mono text-slate-400 italic">
            *Worst tested scenario, not a guarantee.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. BEST CASE */}
          <Card className="border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {bestScenario?.name || 'Favorable Elasticity'}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    High compliance, resilient consumption
                  </p>
                </div>
              </div>
              <Badge variant="positive" size="sm" className="font-mono text-[10px] font-bold">
                BEST CASE
              </Badge>
            </div>
            <div className="pt-2 border-t border-emerald-200/40 dark:border-emerald-900/40 flex items-baseline justify-between font-mono">
              <span className="text-xs text-slate-500">Stressed Yield:</span>
              <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                {formatInrCrores(bestScenario?.modeled_gst_revenue)}
              </span>
            </div>
          </Card>

          {/* 2. EXPECTED CASE */}
          <Card className="border border-sky-200 dark:border-sky-900/60 bg-sky-50/20 dark:bg-sky-950/10 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {expectedScenario?.name || 'Standard Baseline'}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Configured policy assumptions
                  </p>
                </div>
              </div>
              <Badge variant="accent" size="sm" className="font-mono text-[10px] font-bold">
                EXPECTED CASE
              </Badge>
            </div>
            <div className="pt-2 border-t border-sky-200/40 dark:border-sky-900/40 flex items-baseline justify-between font-mono">
              <span className="text-xs text-slate-500">Stressed Yield:</span>
              <span className="text-base font-extrabold text-sky-700 dark:text-sky-400">
                {formatInrCrores(expectedScenario?.modeled_gst_revenue)}
              </span>
            </div>
          </Card>

          {/* 3. WORST TESTED CASE */}
          <Card className="border border-rose-200 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {worstScenario?.name || 'Compounded Stagflation'}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Severe compliance leakage & contraction
                  </p>
                </div>
              </div>
              <Badge variant="danger" size="sm" className="font-mono text-[10px] font-bold">
                WORST TESTED CASE
              </Badge>
            </div>
            <div className="pt-2 border-t border-rose-200/40 dark:border-rose-900/40 flex items-baseline justify-between font-mono">
              <span className="text-xs text-slate-500">Stressed Yield:</span>
              <span className="text-base font-extrabold text-rose-700 dark:text-rose-400">
                {formatInrCrores(worstScenario?.modeled_gst_revenue)}
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* SUMMARY BADGES & BREAKING POINT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Scenario Health Counts */}
        <Card className="p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Scenarios Status
          </span>
          <div className="flex items-center justify-around py-2">
            <div className="text-center">
              <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {summary.stable_scenarios}
              </div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Stable</span>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold font-mono text-amber-500">
                {summary.warning_scenarios}
              </div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Warning</span>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400">
                {summary.critical_scenarios}
              </div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Critical</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 text-center border-t border-slate-100 dark:border-slate-800 pt-2 font-mono">
            {summary.scenarios_tested} deterministic adverse shocks evaluated
          </div>
        </Card>

        {/* First Problematic Tested Scenario Card */}
        <Card className={`p-4 md:col-span-2 flex flex-col justify-between ${
          breaking_point
            ? 'border-rose-500/40 bg-rose-500/5'
            : 'border-emerald-500/40 bg-emerald-500/5'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              {breaking_point ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span className="text-rose-600 dark:text-rose-400">First Problematic Tested Scenario</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Policy Survived All Tested Shocks</span>
                </>
              )}
            </span>
            {breaking_point && (
              <Badge variant="negative" size="sm" className="font-mono font-bold uppercase">
                {breaking_point.status} STATE
              </Badge>
            )}
          </div>

          <div className="py-2 space-y-1">
            {breaking_point ? (
              <>
                <div className="text-base font-bold text-slate-900 dark:text-white">
                  {breaking_point.scenario_name}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {breaking_point.reason}
                </p>
                <p className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg mt-1">
                  This is the first problematic scenario among the conditions tested; it is not a guaranteed real-world breaking point.
                </p>
              </>
            ) : (
              <p className="text-xs text-slate-600 dark:text-slate-300">
                The proposed GST policy survives all tested adverse elasticity (+50%) and compliance (-20%) shocks within safe operational thresholds.
              </p>
            )}
          </div>

          <div className="text-[11px] text-slate-500 border-t border-slate-200/50 dark:border-slate-800/80 pt-2 flex items-center justify-between">
            <span>Worst-Case Tested Yield: <strong className="font-mono text-slate-800 dark:text-slate-200">{formatInrCrores(worst_case?.modeled_gst_revenue)}</strong></span>
            <span>Scenario: <strong className="text-slate-700 dark:text-slate-300">{worst_case?.name}</strong></span>
          </div>
        </Card>
      </div>

      {/* DETAILED STRESS SCENARIO TABLE */}
      <Card className="overflow-hidden border border-slate-200/90 dark:border-slate-800">
        <CardHeader className="py-3 px-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Tested Stress Scenarios Breakdown
            </h3>
            <p className="text-xs text-slate-500">Systematic adverse shocks evaluated by the deterministic engine</p>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Scenario | Status | Key Impact
          </span>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Scenario</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Key Impact</th>
                <th className="py-2.5 px-3">Stress Conditions</th>
                <th className="py-2.5 px-3">Stressed Revenue</th>
                <th className="py-2.5 px-3">Yield Δ vs Proposed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {stress_scenarios.map((sc) => {
                const isStable = sc.status === 'stable';
                const isWarning = sc.status === 'warning';
                const isCritical = sc.status === 'critical';

                const statusBadge = isStable
                  ? { label: 'Stable', symbol: '🟢', variant: 'positive' }
                  : isWarning
                  ? { label: 'Warning', symbol: '🟡', variant: 'warning' }
                  : { label: 'Critical', symbol: '🔴', variant: 'negative' };

                return (
                  <tr
                    key={sc.id}
                    className={`transition-colors ${
                      isCritical
                        ? 'bg-rose-500/5 dark:bg-rose-500/10'
                        : isWarning
                        ? 'bg-amber-500/5 dark:bg-amber-500/10'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-sans">
                      <div className="font-bold text-slate-900 dark:text-white">{sc.name}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">{sc.description}</div>
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      <div className="flex items-center gap-1.5">
                        <span>{statusBadge.symbol}</span>
                        <Badge
                          variant={statusBadge.variant}
                          className="text-[10px] uppercase font-bold"
                        >
                          {statusBadge.label}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      <span className={sc.revenue_change_percent_vs_proposed < 0 ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-emerald-600 dark:text-emerald-400 font-semibold'}>
                        {sc.revenue_change_percent_vs_proposed < 0 ? 'Revenue contraction' : 'Revenue expansion'} ({formatPercent(sc.revenue_change_percent_vs_proposed, true)})
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                      <div>Elast: {sc.effective_elasticity.toFixed(2)} ({sc.demand_elasticity_multiplier}x)</div>
                      <div>Comp: {sc.effective_compliance_rate.toFixed(0)}% ({sc.compliance_multiplier}x)</div>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                      {formatInrCrores(sc.modeled_gst_revenue)}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={sc.revenue_change_percent_vs_proposed < 0 ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-slate-600'}>
                        {formatPercent(sc.revenue_change_percent_vs_proposed, true)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default GstStressTestSection;
