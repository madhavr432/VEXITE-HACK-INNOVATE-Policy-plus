import React, { useState } from 'react';
import {
  Receipt,
  Play,
  RotateCcw,
  Percent,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { Card, CardHeader, CardContent } from '../components/Card';
import { MetricCard } from '../components/MetricCard';
import { PolicyInput } from '../components/PolicyInput';
import { ChartCard } from '../components/ChartCard';
import { ScenarioCard } from '../components/ScenarioCard';
import { AIAnalyst } from '../components/AIAnalyst';

export function GstPage() {
  // Fiscal Inputs
  const [taxableValue, setTaxableValue] = useState('50000'); // in Crores
  const [elasticity, setElasticity] = useState('0.65');
  const [currentRate, setCurrentRate] = useState('18');
  const [proposedRate, setProposedRate] = useState('12');

  // Computed Outputs
  const [fiscalOutputs, setFiscalOutputs] = useState({
    revenueImpact: '-₹2,450 Cr',
    revenuePercent: '-16.3%',
    priceImpact: '-5.1%',
    businessImpact: '+8.4%',
    demandResponse: '+3.9%',
  });

  const handleRunSimulation = () => {
    const base = parseFloat(taxableValue) || 50000;
    const cur = parseFloat(currentRate) || 18;
    const prop = parseFloat(proposedRate) || 12;
    const elast = parseFloat(elasticity) || 0.65;

    // Deterministic tax calculation
    const baseRev = base * (cur / 100);
    const priceDelta = ((prop - cur) / (100 + cur)) * 100;
    const demandDelta = -1 * (priceDelta * elast);
    const newBase = base * (1 + demandDelta / 100);
    const newRev = newBase * (prop / 100);
    const revDelta = newRev - baseRev;
    const revDeltaPct = (revDelta / baseRev) * 100;

    setFiscalOutputs({
      revenueImpact: `${revDelta >= 0 ? '+' : ''}₹${Math.abs(Math.round(revDelta)).toLocaleString()} Cr`,
      revenuePercent: `${revDeltaPct >= 0 ? '+' : ''}${revDeltaPct.toFixed(1)}%`,
      priceImpact: `${priceDelta.toFixed(1)}%`,
      businessImpact: `+${(demandDelta * 1.5).toFixed(1)}%`,
      demandResponse: `+${demandDelta.toFixed(1)}%`,
    });
  };

  const handleReset = () => {
    setTaxableValue('50000');
    setElasticity('0.65');
    setCurrentRate('18');
    setProposedRate('12');
    setFiscalOutputs({
      revenueImpact: '-₹2,450 Cr',
      revenuePercent: '-16.3%',
      priceImpact: '-5.1%',
      businessImpact: '+8.4%',
      demandResponse: '+3.9%',
    });
  };

  // Recharts: GST Slab Yield Comparison
  const slabComparisonData = [
    { slab: 'Current (18%)', grossYield: 9000, complianceLoss: 1100, netYield: 7900 },
    { slab: 'Proposed (12%)', grossYield: 6230, complianceLoss: 580, netYield: 5650 },
    { slab: 'Elastic Surge (+5%)', grossYield: 6540, complianceLoss: 610, netYield: 5930 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      {/* 1. WORKSPACE HEADER */}
      <PageHeader
        title="GST Policy Simulator"
        subtitle="Explore hypothetical GST policy changes and evaluate potential effects on revenue, prices, businesses and demand."
        status="● Fiscal Engine Ready"
        statusVariant="positive"
        breadcrumbs={[{ label: 'GST Policy Simulator' }]}
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-soft-xs">
              Econometric Fiscal Subsystem
            </span>
          </div>
        }
      />

      {/* 2. MAIN GRID: INPUT PANEL (LEFT) & FISCAL RESULTS (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: POLICY INPUT PANEL                                           */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="sticky top-24">
            <CardHeader className="flex items-center justify-between pb-4">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-ai-600 dark:text-ai-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Tax Policy Scenario
                </h2>
              </div>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">
                Indirect Tax Matrix
              </span>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              <PolicyInput
                label="Taxable Category Value Baseline"
                value={taxableValue}
                onChange={setTaxableValue}
                prefix="₹"
                suffix="Cr"
                helpText="Estimated annual gross taxable turnover"
              />

              <PolicyInput
                label="Demand Elasticity Coefficient"
                value={elasticity}
                onChange={setElasticity}
                step={0.05}
                min={0}
                max={2}
                helpText="Price sensitivity multiplier (e.g. 0.65)"
              />

              <div className="grid grid-cols-2 gap-3">
                <PolicyInput
                  label="Current Rate"
                  value={currentRate}
                  onChange={setCurrentRate}
                  suffix="%"
                  helpText="Baseline slab tier"
                />
                <PolicyInput
                  label="Proposed Rate"
                  value={proposedRate}
                  onChange={setProposedRate}
                  suffix="%"
                  helpText="Target policy slab"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 space-y-2.5">
                <Button
                  onClick={handleRunSimulation}
                  size="md"
                  pill
                  variant="primary"
                  icon={Play}
                  className="w-full font-semibold shadow-soft-sm"
                >
                  Run Fiscal Simulation →
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
        {/* RIGHT COLUMN: FISCAL IMPACT RESULTS                                       */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 space-y-8">
          {/* Results Overview Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Fiscal Impact Results
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Projected macroeconomic adjustments from tax bracket modification
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
              Independent Model
            </span>
          </div>

          {/* 4 FISCAL KPI CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <MetricCard
              label="Revenue Impact"
              baseline="₹9,000 Cr"
              simulated={fiscalOutputs.revenueImpact}
              change={fiscalOutputs.revenuePercent}
              trend="negative"
              detail="Estimated exchequer net delta"
            />
            <MetricCard
              label="Consumer Price"
              baseline="100.0"
              simulated={fiscalOutputs.priceImpact}
              change={fiscalOutputs.priceImpact}
              trend="positive"
              detail="Direct retail price relief"
            />
            <MetricCard
              label="Business Volume"
              baseline="Index 100"
              simulated={fiscalOutputs.businessImpact}
              change={fiscalOutputs.businessImpact}
              trend="positive"
              detail="Compliance & sales boost"
            />
            <MetricCard
              label="Demand Response"
              baseline="Baseline"
              simulated={fiscalOutputs.demandResponse}
              change={fiscalOutputs.demandResponse}
              trend="positive"
              detail="Elastic consumption surge"
            />
          </div>

          {/* RECHARTS FISCAL SLAB VISUALIZATION */}
          <ChartCard
            title="GST Rate Slab Yield Comparison"
            question="What is the net revenue trade-off after compliance adjustments?"
            subtitle="Comparing Gross Yield vs Compliance Cost & Net Exchequer Yield"
            legend={
              <>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-policy-600" /> Gross Tax Yield
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Compliance Gap
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600" /> Net Exchequer Yield
                </span>
              </>
            }
          >
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={slabComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="slab" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="grossYield" name="Gross Tax Yield (₹ Cr)" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="complianceLoss" name="Compliance Gap (₹ Cr)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="netYield" name="Net Yield (₹ Cr)" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* 3 FISCAL SCENARIO CARDS */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              Macroeconomic Elasticity Scenarios
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ScenarioCard
                type="best"
                title="High Elasticity Expansion"
                subtitle="Consumers absorb rate cut rapidly; volume compensates revenue drop."
                metrics={{
                  waitingTime: 'Price -5.8%',
                  ridership: 'Vol +6.2%',
                  cost: 'Net -₹1,200 Cr',
                  risk: 'Low',
                }}
              />
              <ScenarioCard
                type="expected"
                title="Moderate Baseline"
                subtitle="Standard macroeconomic pass-through with gradual compliance gain."
                metrics={{
                  waitingTime: 'Price -5.1%',
                  ridership: 'Vol +3.9%',
                  cost: 'Net -₹2,450 Cr',
                  risk: 'Moderate',
                }}
              />
              <ScenarioCard
                type="worst"
                title="Low Elasticity Stagnation"
                subtitle="Retailers retain margin; demand fails to compensate lower tax slab."
                metrics={{
                  waitingTime: 'Price -1.8%',
                  ridership: 'Vol +0.8%',
                  cost: 'Net -₹3,800 Cr',
                  risk: 'High',
                }}
              />
            </div>
          </div>

          {/* AI POLICY ANALYST FOR FISCAL */}
          <AIAnalyst
            title="AI Fiscal Policy Analyst"
            badgeText="Gemini Assisted"
            summary="Reducing the rate from 18% to 12% creates an initial exchequer contraction of approximately ₹2,450 Cr, but stimulates retail volumes by +3.9%. If formalization gains materialize, approximately 38% of the revenue gap can be recouped over a 24-month horizon."
            risks={[
              'Short-term fiscal deficit widening if consumption elasticity is below 0.50.',
              'Input Tax Credit (ITC) inverted duty structures for intermediate manufacturers.',
              'Unequal price pass-through by monopolistic distributors in rural markets.',
            ]}
            mitigations={[
              'Pair rate reduction with stringent anti-profiteering transparency audits.',
              'Phase rate rationalization across high-elasticity consumer staples first.',
              'Harmonize raw material input tax brackets to eliminate credit accumulation.',
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default GstPage;
