import React, { useState } from 'react';
import {
  Bus,
  RotateCcw,
  Play,
  Zap,
  Sliders,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
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
import { RiskMeter } from '../components/RiskMeter';
import { Pictograph } from '../components/Pictograph';
import { ScenarioCard } from '../components/ScenarioCard';
import { AIAnalyst } from '../components/AIAnalyst';

export function BusPage() {
  // Input State
  const [currentBuses, setCurrentBuses] = useState('100');
  const [fleetIncrease, setFleetIncrease] = useState('20');
  const [dailyPassengers, setDailyPassengers] = useState('42000');
  const [busCapacity, setBusCapacity] = useState('50');
  const [ticketPrice, setTicketPrice] = useState('25');
  const [costPerBus, setCostPerBus] = useState('8200');

  // Interactive "Attack My Policy" Stress-Testing Mode State
  const [isAttacked, setIsAttacked] = useState(false);

  // Active Applied Simulation Values
  const [simValues, setSimValues] = useState({
    fleet: 120,
    capacity: 6000,
    waitTime: 11,
    ridership: '47K',
    cost: '₹9.4L',
    utilization: 72,
    riskScore: 78,
  });

  const handleRunSimulation = () => {
    const busesNum = parseInt(currentBuses, 10) || 100;
    const increasePercent = parseInt(fleetIncrease, 10) || 0;
    const newFleet = Math.round(busesNum * (1 + increasePercent / 100));
    const capNum = parseInt(busCapacity, 10) || 50;
    const newCapacity = newFleet * capNum;

    // Deterministic simulation formulas
    const waitDelta = Math.max(8, Math.round(14 - (increasePercent * 0.15)));
    const ridershipVal = Math.round(42 * (1 + increasePercent * 0.006));
    const costVal = (8.2 * (1 + increasePercent * 0.0075)).toFixed(1);
    const utilVal = Math.max(60, Math.round(78 - (increasePercent * 0.3)));

    setSimValues({
      fleet: newFleet,
      capacity: newCapacity,
      waitTime: isAttacked ? waitDelta + 4 : waitDelta,
      ridership: `${isAttacked ? ridershipVal + 6 : ridershipVal}K`,
      cost: `₹${isAttacked ? (parseFloat(costVal) * 1.2).toFixed(1) : costVal}L`,
      utilization: isAttacked ? utilVal - 8 : utilVal,
      riskScore: isAttacked ? 92 : Math.min(95, 60 + Math.round(increasePercent * 0.9)),
    });
  };

  const handleReset = () => {
    setCurrentBuses('100');
    setFleetIncrease('20');
    setDailyPassengers('42000');
    setBusCapacity('50');
    setTicketPrice('25');
    setCostPerBus('8200');
    setIsAttacked(false);
    setSimValues({
      fleet: 120,
      capacity: 6000,
      waitTime: 11,
      ridership: '47K',
      cost: '₹9.4L',
      utilization: 72,
      riskScore: 78,
    });
  };

  const toggleAttack = () => {
    const nextAttacked = !isAttacked;
    setIsAttacked(nextAttacked);
    if (nextAttacked) {
      setSimValues((prev) => ({
        ...prev,
        waitTime: 15,
        cost: '₹11.2L',
        utilization: 64,
        riskScore: 92,
      }));
    } else {
      setSimValues((prev) => ({
        ...prev,
        waitTime: 11,
        cost: '₹9.4L',
        utilization: 72,
        riskScore: 78,
      }));
    }
  };

  // Recharts Data 1: Scenario Comparison (Grouped Bar Chart)
  const comparisonData = [
    { scenario: 'Current', ridership: 42, cost: 8.2, waitTime: 14 },
    { scenario: '+10%', ridership: 44.5, cost: 8.7, waitTime: 12.8 },
    { scenario: '+15%', ridership: 45.8, cost: 9.0, waitTime: 11.9 },
    { scenario: '+20%', ridership: 47.0, cost: 9.4, waitTime: 11.0 },
    { scenario: '+25%', ridership: 47.8, cost: 10.1, waitTime: 10.4 },
    { scenario: '+30%', ridership: 48.2, cost: 11.0, waitTime: 10.0 },
  ];

  // Recharts Data 2: Policy Sensitivity (Line Chart)
  const sensitivityData = [
    { fleetDelta: '0%', waitTime: 14.0 },
    { fleetDelta: '10%', waitTime: 12.8 },
    { fleetDelta: '20%', waitTime: 11.0 },
    { fleetDelta: '30%', waitTime: 10.0 },
    { fleetDelta: '40%', waitTime: 9.6 },
  ];

  // Recharts Data 3: Radar / Trade-off Normalization
  const tradeOffData = isAttacked ? [
    { metric: 'Service Quality', value: 65 },
    { metric: 'Cost Inflation', value: 92 },
    { metric: 'Peak Load', value: 95 },
    { metric: 'Fleet Util', value: 58 },
    { metric: 'Fiscal Buffer', value: 40 },
  ] : [
    { metric: 'Service Improvement', value: 82 },
    { metric: 'Cost Increase', value: 65 },
    { metric: 'Fleet Utilization', value: 72 },
    { metric: 'Ridership Gain', value: 78 },
    { metric: 'Fiscal Feasibility', value: 80 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      {/* 1. WORKSPACE HEADER */}
      <PageHeader
        title="Bus Policy Stress Tester"
        subtitle="Explore how transport policy changes affect system performance."
        status="● Simulation Engine Ready"
        statusVariant="positive"
        breadcrumbs={[{ label: 'Bus Policy Stress Tester' }]}
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-soft-xs">
              Synthetic Transit Engine
            </span>
          </div>
        }
      />

      {/* 2. ATTACK MY POLICY ADVERSE CONDITION CALLOUT BANNER (WHEN ACTIVATED) */}
      {isAttacked && (
        <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-800 p-5 sm:p-6 shadow-soft-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-soft-xs">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-rose-950 dark:text-rose-200 uppercase tracking-wide">
                  ATTACK MODE ACTIVE: ADVERSE ASSUMPTIONS INJECTED
                </span>
                <span className="text-[10px] font-mono font-bold bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-100 px-2 py-0.5 rounded-full">
                  STRESS LEVEL HIGH
                </span>
              </div>
              <p className="text-xs text-rose-900 dark:text-rose-200/90 mt-1 max-w-2xl leading-relaxed">
                Subjecting policy to +25% sudden monsoon passenger surge, +18% depot fuel inflation, and route trunk congestion. Operating costs rise to ₹11.2L and headway reliability degrades.
              </p>
            </div>
          </div>
          <Button
            onClick={toggleAttack}
            size="sm"
            variant="secondary"
            className="text-xs font-mono bg-white dark:bg-slate-900 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800 hover:bg-rose-100/60 shrink-0"
          >
            Deactivate Attack
          </Button>
        </div>
      )}

      {/* 3. MAIN WORKSPACE GRID: INPUT PANEL (LEFT) & SIMULATION RESULTS (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: POLICY INPUT PANEL                                           */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="sticky top-24">
            <CardHeader className="flex items-center justify-between pb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-ai-600 dark:text-ai-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Policy Intervention
                </h2>
              </div>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">
                Active Baseline
              </span>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              <PolicyInput
                label="Current Active Buses"
                value={currentBuses}
                onChange={setCurrentBuses}
                suffix="buses"
                helpText="Active municipal fleet in service"
              />

              <PolicyInput
                label="Fleet Expansion Target"
                value={fleetIncrease}
                onChange={setFleetIncrease}
                suffix="%"
                min={0}
                max={100}
                helpText="Percentage fleet expansion proposal"
              />

              <PolicyInput
                label="Average Daily Passengers"
                value={dailyPassengers}
                onChange={setDailyPassengers}
                suffix="pax"
                helpText="Estimated daily route demand"
              />

              <PolicyInput
                label="Average Bus Capacity"
                value={busCapacity}
                onChange={setBusCapacity}
                suffix="seats"
                helpText="Seated and certified standing limit"
              />

              <PolicyInput
                label="Average Ticket Price"
                value={ticketPrice}
                onChange={setTicketPrice}
                prefix="₹"
                helpText="Average standard single-trip tariff"
              />

              <PolicyInput
                label="Operating Cost per Bus"
                value={costPerBus}
                onChange={setCostPerBus}
                prefix="₹"
                suffix="/day"
                helpText="Fuel, crew wages, maintenance cost"
              />

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
                  Run Simulation →
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={handleReset}
                    size="sm"
                    pill
                    variant="secondary"
                    icon={RotateCcw}
                    className="w-full text-xs font-medium"
                  >
                    Reset
                  </Button>

                  {/* "ATTACK MY POLICY" FEATURE BUTTON */}
                  <Button
                    onClick={toggleAttack}
                    size="sm"
                    pill
                    variant={isAttacked ? 'danger' : 'accent'}
                    icon={Zap}
                    className="w-full text-xs font-semibold"
                  >
                    {isAttacked ? 'Stress Active' : '⚡ Attack Policy'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: SIMULATION RESULTS & VISUALIZATIONS                         */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 space-y-8">
          {/* Results Overview Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Simulation Results
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Comparison of baseline parameters against proposed intervention outcomes
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
              Deterministic Output
            </span>
          </div>

          {/* 6 KPI CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            <MetricCard
              label="Fleet"
              baseline={currentBuses}
              simulated={simValues.fleet}
              change={`+${fleetIncrease}%`}
              trend="positive"
              detail="Total vehicles deployed"
            />
            <MetricCard
              label="Capacity"
              baseline="5,000"
              simulated={simValues.capacity.toLocaleString()}
              change={`+${fleetIncrease}%`}
              trend="positive"
              detail="Max simultaneous volume"
            />
            <MetricCard
              label="Waiting Time"
              baseline="14 min"
              simulated={`${simValues.waitTime} min`}
              change={isAttacked ? '+7%' : '-21%'}
              trend={isAttacked ? 'negative' : 'positive'}
              detail="Average passenger queue"
            />
            <MetricCard
              label="Ridership"
              baseline="42K"
              simulated={simValues.ridership}
              change="+12%"
              trend="positive"
              detail="Projected daily boardings"
            />
            <MetricCard
              label="Operating Cost"
              baseline="₹8.2L"
              simulated={simValues.cost}
              change={isAttacked ? '+36%' : '+15%'}
              trend="negative"
              detail="Total daily service OPEX"
            />
            <MetricCard
              label="Utilization"
              baseline="78%"
              simulated={`${simValues.utilization}%`}
              change={isAttacked ? '-14%' : '-6%'}
              trend="neutral"
              detail="Passenger load factor"
            />
          </div>

          {/* ======================================================================= */}
          {/* GRAPH VISUALIZATIONS SECTION (RECHARTS)                                 */}
          {/* ======================================================================= */}
          <div className="space-y-6">
            {/* 1. Scenario Comparison — Grouped Bar Chart */}
            <ChartCard
              title="Scenario Comparison"
              question="Which scenario performs better?"
              subtitle="Comparing key vectors across fleet scale tiers"
              legend={
                <>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-sm bg-policy-600" /> Ridership (K)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" /> Cost (₹L)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Wait Time (min)
                  </span>
                </>
              }
            >
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="scenario" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="ridership" name="Ridership (K)" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="cost" name="Operating Cost (₹L)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="waitTime" name="Wait Time (min)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            {/* 2 & 3: Policy Sensitivity Line Chart & Trade-off Radar Side-by-Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 2. Policy Sensitivity Line Chart */}
              <ChartCard
                title="Policy Sensitivity"
                question="How sensitive is wait time to fleet expansion?"
                subtitle="Fleet Increase % vs Average Waiting Time"
              >
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sensitivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="fleetDelta" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[8, 16]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="waitTime"
                        name="Wait Time (min)"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: '#10b981' }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              {/* 3. Trade-Off Chart */}
              <ChartCard
                title="Impact Trade-offs"
                question="What are the balanced multidimensional vectors?"
                subtitle={isAttacked ? 'Adverse Stress-Test Normalized Scores' : 'Standard Normalized Impact Profile'}
              >
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={tradeOffData}>
                      <PolarGrid stroke="#cbd5e1" />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9, fill: '#475569' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
                      <Radar
                        name="Impact Score"
                        dataKey="value"
                        stroke={isAttacked ? '#f43f5e' : '#7c3aed'}
                        fill={isAttacked ? '#f43f5e' : '#8b5cf6'}
                        fillOpacity={0.4}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* 4. PICTOGRAPH & RISK METER                                              */}
          {/* ======================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Pictograph
              passengers={dailyPassengers}
              buses={simValues.fleet}
              routes="24"
            />
            <RiskMeter
              score={simValues.riskScore}
              label={isAttacked ? 'Critical Fragility Risk' : 'Moderate–High Risk'}
              breakdown={[
                { label: 'Capacity Risk', level: isAttacked ? 'Critical' : 'High', status: isAttacked ? 'critical' : 'warning', desc: 'Peak bottlenecks on trunk routes' },
                { label: 'Financial Risk', level: isAttacked ? 'High' : 'Moderate', status: isAttacked ? 'critical' : 'warning', desc: 'OPEX escalation beyond 25% fleet' },
                { label: 'Demand Risk', level: 'Low', status: 'positive', desc: 'Strong elastic ridership response' },
                { label: 'Accessibility Impact', level: 'Low', status: 'positive', desc: 'Broad geographical distribution' },
              ]}
            />
          </div>

          {/* ======================================================================= */}
          {/* 5. BEST / EXPECTED / WORST CASE SCENARIOS                               */}
          {/* ======================================================================= */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                Scenario Envelope Analysis
              </h3>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Sensitivity Bounds
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ScenarioCard
                type="best"
                title="Favourable Demand"
                subtitle="High off-peak absorption and stable energy costs."
                metrics={{
                  waitingTime: '10 min',
                  ridership: '49K',
                  cost: '₹9.1L',
                  risk: 'Low',
                }}
              />
              <ScenarioCard
                type="expected"
                title="Normal Operations"
                subtitle="Baseline municipal commuter trends and standard tariffs."
                metrics={{
                  waitingTime: '11 min',
                  ridership: '47K',
                  cost: '₹9.4L',
                  risk: 'Moderate',
                }}
              />
              <ScenarioCard
                type="worst"
                title="Adverse Stress Shock"
                subtitle="Peak demand surge combined with fuel inflation and gridlock."
                metrics={{
                  waitingTime: '15 min',
                  ridership: '53K',
                  cost: '₹11.2L',
                  risk: 'High',
                }}
              />
            </div>
          </div>

          {/* ======================================================================= */}
          {/* 6. AI POLICY ANALYST SECTION                                            */}
          {/* ======================================================================= */}
          <AIAnalyst
            title="AI Policy Analyst"
            badgeText="Gemini Assisted"
            summary={
              isAttacked
                ? 'Under adverse stress assumptions (+25% surge, fuel inflation), the proposed 20% fleet expansion fails to sustain waiting-time improvements due to bottlenecked depot queues. Operating expenditures surge to ₹11.2L/day, elevating fiscal risk to 92/100.'
                : 'The 20% fleet increase produces a meaningful reduction in waiting time while increasing operating costs. The model suggests diminishing returns beyond approximately 25%, making the 20–25% range worth further consideration.'
            }
            risks={[
              'Operating expenditure escalates faster beyond the 20–25% fleet addition margin.',
              'Off-peak fleet utilization drops from 78% to 72% under uniform schedule deployment.',
              'Demand elasticity depends heavily on private vehicle tolling and weather conditions.',
            ]}
            mitigations={[
              'Implement modular headway scheduling rather than fixed all-day frequency.',
              'Prioritize trunk line allocation (14 routes) before expanding feeder buses.',
              'Establish fuel hedging contracts to insulate the municipal transport budget.',
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default BusPage;
