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
} from 'lucide-react';
import { formatInrCrores, formatPercent } from '../../services/gstSimulation';

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
            Evaluate policy resilience against adverse behavioral demand sensitivity and severe taxpayer compliance leakage.
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
          {isLoading ? 'Simulating Adverse Stress...' : 'Attack My GST Policy →'}
        </Button>
      </Card>
    );
  }

  const { summary, breaking_point, worst_case, stress_scenarios = [] } = stressResult;

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
              GST Policy Stress Testing
              <Badge variant={summary.policy_survives_all_tests ? 'positive' : 'negative'}>
                {summary.policy_survives_all_tests ? 'Resilient' : 'Vulnerabilities Identified'}
              </Badge>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic attack scenarios testing adverse behavioral elasticity and compliance leakage
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
          {isLoading ? 'Re-running Stress Tests...' : 'Re-run Attack Tests'}
        </Button>
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
          <div className="text-[11px] text-slate-500 text-center border-t border-slate-100 dark:border-slate-800 pt-2">
            {summary.scenarios_tested} deterministic adverse shocks evaluated
          </div>
        </Card>

        {/* Breaking Point Card */}
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
                  <span className="text-rose-600 dark:text-rose-400">Breaking Point Identified</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">No Breaking Point Detected</span>
                </>
              )}
            </span>
            {breaking_point && (
              <Badge variant="negative">
                {breaking_point.status.toUpperCase()}
              </Badge>
            )}
          </div>

          <div className="py-2">
            {breaking_point ? (
              <div className="space-y-1">
                <div className="text-base font-bold text-slate-900 dark:text-white">
                  {breaking_point.scenario_name}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {breaking_point.reason}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-600 dark:text-slate-300">
                The proposed GST policy survives all tested adverse elasticity (+50%) and compliance (-20%) shocks within safe operational thresholds.
              </p>
            )}
          </div>

          <div className="text-[11px] text-slate-500 border-t border-slate-200/50 dark:border-slate-800/80 pt-2 flex items-center justify-between">
            <span>Worst-Case Yield: <strong className="font-mono text-slate-800 dark:text-slate-200">{formatInrCrores(worst_case.modeled_gst_revenue)}</strong></span>
            <span>Scenario: <strong className="text-slate-700 dark:text-slate-300">{worst_case.name}</strong></span>
          </div>
        </Card>
      </div>

      {/* DETAILED STRESS SCENARIO TABLE */}
      <Card className="overflow-hidden">
        <CardHeader className="py-3 px-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Tested Stress Scenarios Breakdown
          </h3>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Scenario</th>
                <th className="py-2.5 px-3">Stress Conditions</th>
                <th className="py-2.5 px-3">Stressed Revenue</th>
                <th className="py-2.5 px-3">Yield Δ vs Proposed</th>
                <th className="py-2.5 px-3">Demand Contraction</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {stress_scenarios.map((sc) => {
                const isStable = sc.status === 'stable';
                const isWarning = sc.status === 'warning';
                const isCritical = sc.status === 'critical';

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
                    <td className="py-2.5 px-3">
                      <span className={sc.demand_response_percent < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600'}>
                        {formatPercent(sc.demand_response_percent, true)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      <Badge
                        variant={isStable ? 'positive' : isWarning ? 'warning' : 'negative'}
                        className="text-[10px] uppercase font-bold"
                      >
                        {sc.status}
                      </Badge>
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
