import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Receipt,
  Play,
  RotateCcw,
  Percent,
  Sliders,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  Flame,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';

import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { Card, CardHeader, CardContent } from '../components/Card';
import { Badge } from '../components/Badge';

// Modular GST domain components
import { GstMetricCard } from '../components/gst/GstMetricCard';
import { GstScenarioComparison } from '../components/gst/GstScenarioComparison';
import { GstStressTestSection } from '../components/gst/GstStressTestSection';
import { GstRiskSection } from '../components/gst/GstRiskSection';
import { GstAIAnalystSection } from '../components/gst/GstAIAnalystSection';
import { GstModelAssumptions } from '../components/gst/GstModelAssumptions';

// Client services
import {
  runGstSimulation,
  getGstScenarios,
  runGstStressTest,
  getGstRisk,
  formatInrCrores,
  formatPercent,
} from '../services/gstSimulation';
import { analyzePolicy } from '../services/aiAnalyst';

// Preset scenarios for rapid policy experimentation
const GST_PRESETS = [
  {
    name: 'Rate Rationalization',
    currentRate: '18',
    proposedRate: '12',
    description: '18% → 12% to boost consumption & reduce consumer tax burden',
  },
  {
    name: 'Luxury Bracket Surge',
    currentRate: '18',
    proposedRate: '28',
    description: '18% → 28% upper bracket escalation for non-essential goods',
  },
  {
    name: 'Essential Price Relief',
    currentRate: '12',
    proposedRate: '5',
    description: '12% → 5% reduction to protect vulnerable household budgets',
  },
  {
    name: 'Unified Flat Bracket',
    currentRate: '18',
    proposedRate: '15',
    description: '18% → 15% consolidation toward a single standardized rate',
  },
];

export function GstPage() {
  // 1. Primary Policy Configuration State
  const [currentRate, setCurrentRate] = useState('18');
  const [proposedRate, setProposedRate] = useState('12');
  const [annualTurnoverCr, setAnnualTurnoverCr] = useState('1000'); // in Crores

  // Advanced Assumptions State
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [complianceRate, setComplianceRate] = useState(85);
  const [demandElasticity, setDemandElasticity] = useState(0.20);
  const [effectiveTaxBaseFactor, setEffectiveTaxBaseFactor] = useState(0.80);

  // Backend Results State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [scenariosResult, setScenariosResult] = useState(null);
  const [riskResult, setRiskResult] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Attack My Policy / Stress Testing State
  const [isAttacking, setIsAttacking] = useState(false);
  const [stressResult, setStressResult] = useState(null);

  // AI Policy Analyst State
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiAnalysisResult, setAIAnalysisResult] = useState(null);
  const [aiError, setAIError] = useState(null);

  // Validation
  const validationErrors = useMemo(() => {
    const errors = {};
    const cur = parseFloat(currentRate);
    const prop = parseFloat(proposedRate);
    const turnover = parseFloat(annualTurnoverCr);

    if (isNaN(cur) || cur < 0 || cur > 40) {
      errors.currentRate = 'Current rate must be between 0% and 40%';
    }
    if (isNaN(prop) || prop < 0 || prop > 40) {
      errors.proposedRate = 'Proposed rate must be between 0% and 40%';
    }
    if (isNaN(turnover) || turnover <= 0) {
      errors.annualTurnoverCr = 'Turnover must be greater than 0';
    }
    return errors;
  }, [currentRate, proposedRate, annualTurnoverCr]);

  const isValid = Object.keys(validationErrors).length === 0;

  // Parameters payload helper
  const getParams = useCallback(() => ({
    currentRate,
    proposedRate,
    annualTurnoverCr,
    complianceRate,
    demandElasticity,
    effectiveTaxBaseFactor,
  }), [currentRate, proposedRate, annualTurnoverCr, complianceRate, demandElasticity, effectiveTaxBaseFactor]);

  // Main simulation execution function
  const executeSimulation = useCallback(async () => {
    if (!isValid) return;

    setIsSimulating(true);
    setApiError(null);

    const params = getParams();

    try {
      // Parallel execution of simulation, scenarios, and risk
      const [simData, scenData, riskData] = await Promise.all([
        runGstSimulation(params),
        getGstScenarios(params),
        getGstRisk(params),
      ]);

      setSimulationResult(simData);
      setScenariosResult(scenData);
      setRiskResult(riskData);

      // If stress test was already active, update it too
      if (stressResult) {
        try {
          const stressData = await runGstStressTest(params);
          setStressResult(stressData);
        } catch {
          // Non-blocking
        }
      }
    } catch (err) {
      console.error('GST simulation failed:', err);
      setApiError(
        err.response?.data?.detail ||
        'Failed to connect to the GST simulation backend. Please ensure the backend server is running.'
      );
    } finally {
      setIsSimulating(false);
    }
  }, [isValid, getParams, stressResult]);

  // Run initial simulation on component mount
  useEffect(() => {
    executeSimulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Attack My Policy handler
  const handleRunAttack = async () => {
    if (!isValid) return;
    setIsAttacking(true);
    try {
      const data = await runGstStressTest(getParams());
      setStressResult(data);
    } catch (err) {
      console.error('GST stress test failed:', err);
      setApiError('Adverse stress test failed to complete.');
    } finally {
      setIsAttacking(false);
    }
  };

  // AI Policy Analyst handler
  const handleRunAIAnalysis = async (question = null) => {
    if (!isValid) return;
    setIsAILoading(true);
    setAIError(null);
    try {
      const result = await analyzePolicy(getParams(), question, 'gst');
      setAIAnalysisResult(result);
    } catch (err) {
      console.error('AI analysis failed:', err);
      setAIError(
        err.response?.data?.detail ||
        'AI analysis is temporarily unavailable. Your deterministic simulation and risk metrics remain fully active.'
      );
    } finally {
      setIsAILoading(false);
    }
  };

  // Reset to default baseline
  const handleReset = () => {
    setCurrentRate('18');
    setProposedRate('12');
    setAnnualTurnoverCr('1000');
    setComplianceRate(85);
    setDemandElasticity(0.20);
    setEffectiveTaxBaseFactor(0.80);
    setStressResult(null);
    setAIAnalysisResult(null);
    setApiError(null);
    setAIError(null);
  };

  // Apply scenario preset
  const applyPreset = (preset) => {
    setCurrentRate(preset.currentRate);
    setProposedRate(preset.proposedRate);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      {/* 1. WORKSPACE HEADER */}
      <PageHeader
        title="GST Policy Simulator"
        subtitle="Independent deterministic simulation and decision-support engine for Goods & Services Tax policy evaluation."
        status="● Fiscal Engine Ready"
        statusVariant="positive"
        breadcrumbs={[{ label: 'GST Policy Simulator' }]}
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-soft-xs">
              Domain: Indirect Taxation
            </span>
          </div>
        }
      />

      {/* ERROR BANNER IF ANY */}
      {apiError && (
        <Card className="p-4 border-rose-500/40 bg-rose-500/5 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold">Backend Communication Error</div>
            <div>{apiError}</div>
          </div>
        </Card>
      )}

      {/* 2. MAIN GRID: POLICY INPUT PANEL (LEFT) & SIMULATION RESULTS (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: POLICY INPUT PANEL                                           */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="sticky top-24">
            <CardHeader className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  GST Policy Parameters
                </h2>
              </div>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">
                Deterministic
              </span>
            </CardHeader>

            <CardContent className="space-y-5 pt-1">
              {/* Presets dropdown / pill selector */}
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                  Scenario Presets
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {GST_PRESETS.map((preset) => {
                    const isActive = currentRate === preset.currentRate && proposedRate === preset.proposedRate;
                    return (
                      <button
                        key={preset.name}
                        onClick={() => applyPreset(preset)}
                        className={`text-[11px] p-2 rounded-xl text-left border transition ${
                          isActive
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-semibold'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="font-medium truncate">{preset.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {preset.currentRate}% → {preset.proposedRate}%
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rate Configuration Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Current Rate (%)
                  </label>
                  <input
                    type="number"
                    value={currentRate}
                    onChange={(e) => setCurrentRate(e.target.value)}
                    min="0"
                    max="40"
                    step="0.5"
                    className="w-full text-sm font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                  {validationErrors.currentRate && (
                    <span className="text-[10px] text-rose-500 mt-0.5 block">{validationErrors.currentRate}</span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Proposed Rate (%)
                  </label>
                  <input
                    type="number"
                    value={proposedRate}
                    onChange={(e) => setProposedRate(e.target.value)}
                    min="0"
                    max="40"
                    step="0.5"
                    className="w-full text-sm font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                  {validationErrors.proposedRate && (
                    <span className="text-[10px] text-rose-500 mt-0.5 block">{validationErrors.proposedRate}</span>
                  )}
                </div>
              </div>

              {/* Annual Turnover Input */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Annual Taxable Turnover Baseline (₹ Cr)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-sm text-slate-400 font-mono">₹</span>
                  <input
                    type="number"
                    value={annualTurnoverCr}
                    onChange={(e) => setAnnualTurnoverCr(e.target.value)}
                    min="1"
                    step="100"
                    className="w-full text-sm font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-7 pr-12 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-400 font-mono">Cr</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Category annual economic turnover under consideration
                </span>
                {validationErrors.annualTurnoverCr && (
                  <span className="text-[10px] text-rose-500 mt-0.5 block">{validationErrors.annualTurnoverCr}</span>
                )}
              </div>

              {/* Advanced Assumptions Accordion */}
              <div className="border-t border-slate-200/70 dark:border-slate-800 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white py-1"
                >
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" />
                    Advanced Elasticity & Compliance
                  </span>
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showAdvanced && (
                  <div className="space-y-3.5 pt-3 text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-600 dark:text-slate-400">Compliance Rate:</span>
                        <strong className="font-mono text-slate-800 dark:text-slate-200">{complianceRate}%</strong>
                      </div>
                      <input
                        type="range"
                        min="30"
                        max="100"
                        step="1"
                        value={complianceRate}
                        onChange={(e) => setComplianceRate(Number(e.target.value))}
                        className="w-full accent-emerald-600"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-600 dark:text-slate-400">Demand Elasticity:</span>
                        <strong className="font-mono text-slate-800 dark:text-slate-200">{demandElasticity}</strong>
                      </div>
                      <input
                        type="range"
                        min="0.0"
                        max="1.5"
                        step="0.05"
                        value={demandElasticity}
                        onChange={(e) => setDemandElasticity(Number(e.target.value))}
                        className="w-full accent-emerald-600"
                      />
                      <span className="text-[10px] text-slate-400">Higher value = stronger consumer volume response</span>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-600 dark:text-slate-400">Effective Tax Base Factor:</span>
                        <strong className="font-mono text-slate-800 dark:text-slate-200">{effectiveTaxBaseFactor}</strong>
                      </div>
                      <input
                        type="range"
                        min="0.2"
                        max="1.0"
                        step="0.05"
                        value={effectiveTaxBaseFactor}
                        onChange={(e) => setEffectiveTaxBaseFactor(Number(e.target.value))}
                        className="w-full accent-emerald-600"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <Button
                  onClick={executeSimulation}
                  disabled={isSimulating || !isValid}
                  size="md"
                  pill
                  variant="primary"
                  icon={isSimulating ? Loader2 : Play}
                  className="w-full font-semibold shadow-soft-sm"
                >
                  {isSimulating ? 'Simulating GST Yield...' : 'Run Fiscal Simulation →'}
                </Button>

                <Button
                  onClick={handleReset}
                  size="sm"
                  pill
                  variant="secondary"
                  icon={RotateCcw}
                  className="w-full text-xs font-medium"
                >
                  Reset Parameters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: SIMULATION RESULTS & ADVANCED ENGINES                       */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 space-y-10">
          {/* 1. TOP SIMULATION METRIC KPI CARDS */}
          {simulationResult && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Simulated Fiscal Position
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Modeled outcomes for proposed {simulationResult.proposed.rate_percent}% GST slab
                  </p>
                </div>
                <Badge variant="neutral" className="text-xs font-mono">
                  Turnover: ₹{Number(annualTurnoverCr).toLocaleString()} Cr
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <GstMetricCard
                  label="Proposed GST Yield"
                  value={formatInrCrores(simulationResult.proposed.gst_revenue)}
                  baseline={formatInrCrores(simulationResult.current.gst_revenue)}
                  changePercent={formatPercent(simulationResult.impact.revenue_impact_percent, true)}
                  trend={simulationResult.impact.revenue_change >= 0 ? 'positive' : 'negative'}
                  detail="Net annual collection"
                  variant="highlight"
                />

                <GstMetricCard
                  label="Fiscal Revenue Delta"
                  value={`${simulationResult.impact.revenue_change >= 0 ? '+' : ''}${formatInrCrores(simulationResult.impact.revenue_change)}`}
                  sublabel={`${formatPercent(simulationResult.impact.revenue_impact_percent, true)} vs current`}
                  trend={simulationResult.impact.revenue_change >= 0 ? 'positive' : 'negative'}
                  detail="Treasury yield adjustment"
                />

                <GstMetricCard
                  label="Consumer Tax Delta"
                  value={formatPercent(simulationResult.impact.modeled_consumer_tax_impact, true)}
                  sublabel={`${simulationResult.current.rate_percent}% → ${simulationResult.proposed.rate_percent}%`}
                  trend={simulationResult.impact.modeled_consumer_tax_impact <= 0 ? 'positive' : 'negative'}
                  detail="Direct bracket variation"
                />

                <GstMetricCard
                  label="Demand Response"
                  value={formatPercent(simulationResult.impact.demand_change_percent, true)}
                  trend={simulationResult.impact.demand_change_percent >= 0 ? 'positive' : 'negative'}
                  detail="Elasticity-driven volume"
                />
              </div>
            </div>
          )}

          {/* 2. SCENARIO COMPARISON (TABLE & RECHARTS) */}
          {scenariosResult && (
            <GstScenarioComparison
              scenarios={scenariosResult.scenarios}
              currentRate={scenariosResult.current_rate}
              proposedRate={scenariosResult.proposed_rate}
              onSelectRate={(rateStr) => {
                setProposedRate(rateStr);
              }}
            />
          )}

          {/* 3. ATTACK MY GST POLICY (STRESS TESTING) */}
          <GstStressTestSection
            stressResult={stressResult}
            isLoading={isAttacking}
            onRunAttack={handleRunAttack}
          />

          {/* 4. DETERMINISTIC POLICY RISK ENGINE */}
          {riskResult && (
            <GstRiskSection riskResult={riskResult} />
          )}

          {/* 5. GEMINI AI POLICY ANALYST */}
          <GstAIAnalystSection
            analysisResult={aiAnalysisResult}
            isLoading={isAILoading}
            error={aiError}
            onRunAnalysis={handleRunAIAnalysis}
          />

          {/* 6. TRANSPARENT POLICY ASSUMPTIONS PANEL */}
          <GstModelAssumptions
            currentRate={currentRate}
            proposedRate={proposedRate}
            annualTurnoverCr={annualTurnoverCr}
            complianceRate={complianceRate}
            demandElasticity={demandElasticity}
            effectiveTaxBaseFactor={effectiveTaxBaseFactor}
          />
        </div>
      </div>
    </div>
  );
}
