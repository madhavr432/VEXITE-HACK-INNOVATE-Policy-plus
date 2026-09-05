import React, { useState, useMemo } from 'react';
import {
  Bus,
  RotateCcw,
  Play,
  Sliders,
  ChevronDown,
  ChevronUp,
  Loader2,
  Info,
} from 'lucide-react';

import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { Card, CardHeader, CardContent } from '../components/Card';
import { Badge } from '../components/Badge';

// Bus domain components
import { PolicyInput } from '../components/bus/PolicyInput';
import { PolicySlider } from '../components/bus/PolicySlider';
import { ScenarioSelector } from '../components/bus/ScenarioSelector';
import { BusMetricCard } from '../components/bus/BusMetricCard';
import { ScenarioComparison } from '../components/bus/ScenarioComparison';
import { PolicySensitivity } from '../components/bus/PolicySensitivity';
import { TradeoffChart } from '../components/bus/TradeoffChart';
import { SystemScale } from '../components/bus/SystemScale';
import { ImpactSummary } from '../components/bus/ImpactSummary';
import { StressTestPreview } from '../components/bus/StressTestPreview';

// Demo data & simulation service
import {
  DEMO_SCENARIO_PRESETS,
  DEFAULT_ADVANCED_ASSUMPTIONS,
  calculateDemoPreview,
} from '../data/bus/demoScenarios';
import { runBusSimulation } from '../services/busSimulation';

export function BusPage() {
  // 1. Primary Policy Configuration State
  const [currentBuses, setCurrentBuses] = useState('100');
  const [fleetIncrease, setFleetIncrease] = useState('20');
  const [dailyPassengers, setDailyPassengers] = useState('42000');
  const [busCapacity, setBusCapacity] = useState('50');
  const [ticketPrice, setTicketPrice] = useState('25');
  const [costPerBus, setCostPerBus] = useState('8200');

  // Scenario selection preset ('baseline' | 'proposed' | 'stress')
  const [selectedScenario, setSelectedScenario] = useState('proposed');

  // Collapsible Advanced Assumptions state (initially collapsed)
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedAssumptions, setAdvancedAssumptions] = useState(DEFAULT_ADVANCED_ASSUMPTIONS);

  // Simulation loading state
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasRunSimulation, setHasRunSimulation] = useState(false);

  // Inline Validation States
  const validationErrors = useMemo(() => {
    const errors = {};
    const buses = parseInt(currentBuses, 10);
    const increase = parseInt(fleetIncrease, 10);
    const pax = parseInt(dailyPassengers, 10);
    const cap = parseInt(busCapacity, 10);
    const price = parseFloat(ticketPrice);
    const cost = parseFloat(costPerBus);

    if (isNaN(buses) || buses < 1 || buses > 10000) {
      errors.currentBuses = 'Fleet must be between 1 and 10,000 buses';
    }
    if (isNaN(increase) || increase < 0 || increase > 100) {
      errors.fleetIncrease = 'Increase must be between 0% and 100%';
    }
    if (isNaN(pax) || pax < 0) {
      errors.dailyPassengers = 'Ridership cannot be negative';
    }
    if (isNaN(cap) || cap < 1) {
      errors.busCapacity = 'Capacity must be at least 1 passenger';
    }
    if (isNaN(price) || price < 0) {
      errors.ticketPrice = 'Price cannot be negative';
    }
    if (isNaN(cost) || cost < 0) {
      errors.costPerBus = 'Operating cost cannot be negative';
    }

    return errors;
  }, [currentBuses, fleetIncrease, dailyPassengers, busCapacity, ticketPrice, costPerBus]);

  const isValid = Object.keys(validationErrors).length === 0;

  // Active Calculated Preview Metrics (Dynamic demo calculation)
  const activeMetrics = useMemo(() => {
    return calculateDemoPreview({
      currentBuses,
      fleetIncrease,
      dailyPassengers,
      busCapacity,
      ticketPrice,
      costPerBus,
    });
  }, [currentBuses, fleetIncrease, dailyPassengers, busCapacity, ticketPrice, costPerBus]);

  // Handle Scenario Presets Selection
  const handleSelectScenario = (scenarioId) => {
    setSelectedScenario(scenarioId);
    const preset = DEMO_SCENARIO_PRESETS[scenarioId];
    if (preset) {
      setCurrentBuses(String(preset.inputs.currentBuses));
      setFleetIncrease(String(preset.inputs.fleetIncrease));
      setDailyPassengers(String(preset.inputs.dailyPassengers));
      setBusCapacity(String(preset.inputs.busCapacity));
      setTicketPrice(String(preset.inputs.ticketPrice));
      setCostPerBus(String(preset.inputs.costPerBus));
    }
  };

  // Run Simulation Handler with 1s visual feedback
  const handleRunSimulation = async () => {
    if (!isValid) return;

    setIsSimulating(true);
    try {
      await runBusSimulation({
        currentBuses,
        fleetIncrease,
        dailyPassengers,
        busCapacity,
        ticketPrice,
        costPerBus,
      });
      setHasRunSimulation(true);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Reset to default proposed values
  const handleReset = () => {
    const defaultPreset = DEMO_SCENARIO_PRESETS.proposed;
    setCurrentBuses(String(defaultPreset.inputs.currentBuses));
    setFleetIncrease(String(defaultPreset.inputs.fleetIncrease));
    setDailyPassengers(String(defaultPreset.inputs.dailyPassengers));
    setBusCapacity(String(defaultPreset.inputs.busCapacity));
    setTicketPrice(String(defaultPreset.inputs.ticketPrice));
    setCostPerBus(String(defaultPreset.inputs.costPerBus));
    setSelectedScenario('proposed');
    setAdvancedAssumptions(DEFAULT_ADVANCED_ASSUMPTIONS);
    setHasRunSimulation(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* 1. TOP HEADER & BREADCRUMB */}
      <PageHeader
        title="Bus Policy Stress Tester"
        subtitle="Explore how changes in transport policy can affect service, capacity and operating costs."
        status="● Simulation Engine Ready"
        statusVariant="positive"
        breadcrumbs={[{ label: 'Bus Policies' }]}
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-soft-xs">
              Commit 2 Interface
            </span>
          </div>
        }
      />

      {/* 2. MAIN WORKSPACE GRID: CONFIGURATION (LEFT) & SIMULATION PREVIEW (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: POLICY CONFIGURATION PANEL (30–35%)                          */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="sticky top-20 shadow-soft-sm">
            <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-policy-50 dark:bg-policy-950/60 border border-policy-200 dark:border-policy-800 flex items-center justify-center text-policy-600 dark:text-policy-400">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                      Policy Intervention
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Define the scenario you want to test.
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              {/* Scenario Preset Selector */}
              <ScenarioSelector
                selectedScenario={selectedScenario}
                onSelectScenario={handleSelectScenario}
              />

              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 space-y-3.5">
                {/* INPUT 1: Current Bus Fleet */}
                <PolicyInput
                  label="Current Bus Fleet"
                  value={currentBuses}
                  onChange={setCurrentBuses}
                  suffix="buses"
                  min={1}
                  max={10000}
                  helpText="Current operational fleet"
                  error={validationErrors.currentBuses}
                />

                {/* INPUT 2: Fleet Increase Slider */}
                <PolicySlider
                  label="Fleet Increase"
                  value={fleetIncrease}
                  onChange={(val) => {
                    setFleetIncrease(val);
                    if (selectedScenario !== 'proposed') setSelectedScenario('');
                  }}
                  min={0}
                  max={50}
                  step={5}
                  helpText="Select expansion from 0% to 50%"
                />

                {/* INPUT 3: Average Daily Ridership */}
                <PolicyInput
                  label="Average Daily Ridership"
                  value={dailyPassengers}
                  onChange={setDailyPassengers}
                  suffix="passengers/day"
                  min={0}
                  helpText="Estimated daily route demand"
                  error={validationErrors.dailyPassengers}
                />

                {/* INPUT 4: Average Bus Capacity */}
                <PolicyInput
                  label="Average Bus Capacity"
                  value={busCapacity}
                  onChange={setBusCapacity}
                  suffix="passengers"
                  min={1}
                  helpText="Seated and certified standing limit"
                  error={validationErrors.busCapacity}
                />

                {/* INPUT 5: Average Ticket Price */}
                <PolicyInput
                  label="Average Ticket Price"
                  value={ticketPrice}
                  onChange={setTicketPrice}
                  prefix="₹"
                  min={0}
                  helpText="Average standard single-trip tariff"
                  error={validationErrors.ticketPrice}
                />

                {/* INPUT 6: Operating Cost / Bus */}
                <PolicyInput
                  label="Operating Cost / Bus"
                  value={costPerBus}
                  onChange={setCostPerBus}
                  prefix="₹"
                  suffix="per day"
                  min={0}
                  helpText="Fuel, crew wages, maintenance cost"
                  error={validationErrors.costPerBus}
                />
              </div>

              {/* COLLAPSIBLE ADVANCED ASSUMPTIONS */}
              <div className="border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between p-3 bg-slate-50/70 dark:bg-slate-800/40 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                >
                  <span className="flex items-center gap-1.5 font-mono">
                    <span>Advanced Assumptions</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      (UI Only)
                    </span>
                  </span>
                  {showAdvanced ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {showAdvanced && (
                  <div className="p-3.5 space-y-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-xs animate-in fade-in duration-150">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[11px] text-slate-600 dark:text-slate-400">Route Dist</label>
                        <input
                          type="text"
                          value={`${advancedAssumptions.routeDistance} km`}
                          disabled
                          className="w-full mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-600 dark:text-slate-400">Fuel Cost</label>
                        <input
                          type="text"
                          value={`₹${advancedAssumptions.fuelCost}/L`}
                          disabled
                          className="w-full mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[11px] text-slate-600 dark:text-slate-400">Trip Duration</label>
                        <input
                          type="text"
                          value={`${advancedAssumptions.tripDuration} min`}
                          disabled
                          className="w-full mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-600 dark:text-slate-400">Peak Demand</label>
                        <input
                          type="text"
                          value={`${advancedAssumptions.peakDemandFactor}x`}
                          disabled
                          className="w-full mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-600 dark:text-slate-400">Off-Peak Demand</label>
                      <input
                        type="text"
                        value={`${advancedAssumptions.offPeakDemandFactor}x`}
                        disabled
                        className="w-full mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 font-mono text-xs"
                      />
                    </div>

                    <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight italic pt-1">
                      Advanced assumptions will be used by the simulation engine in the next stage.
                    </p>
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-2 space-y-2">
                <Button
                  onClick={handleRunSimulation}
                  disabled={!isValid || isSimulating}
                  size="md"
                  variant="primary"
                  icon={isSimulating ? Loader2 : Play}
                  className="w-full font-semibold shadow-soft-sm relative"
                >
                  {isSimulating ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing policy scenario...
                    </span>
                  ) : (
                    'Run Simulation →'
                  )}
                </Button>

                {/* Subtitle disclaimer */}
                <div className="text-center">
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                    Demo simulation preview
                  </span>
                </div>

                <Button
                  onClick={handleReset}
                  size="sm"
                  variant="secondary"
                  icon={RotateCcw}
                  className="w-full text-xs font-medium"
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: SIMULATION PREVIEW & RESULTS WORKSPACE (65–70%)             */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header Section for Preview */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Simulation Preview
                </h2>
                <Badge variant="accent" size="sm">
                  Illustrative Data
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Example output for the selected policy scenario.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                <Info className="w-3 h-3 text-slate-400" />
                Illustrative / Synthetic Data
              </span>
            </div>
          </div>

          {/* 6 KPI CARDS (PREVIEW) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Core Policy Indicators
              </span>
              <span className="text-[11px] font-mono text-policy-600 dark:text-policy-400">
                Preview calculation
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {/* CARD 1: Fleet */}
              <BusMetricCard
                label="Fleet"
                baseline={activeMetrics.fleet.baseline}
                simulated={activeMetrics.fleet.simulated}
                change={activeMetrics.fleet.delta}
                trend="positive"
                icon={Bus}
                detail="Total deployed vehicles"
              />

              {/* CARD 2: Daily Capacity */}
              <BusMetricCard
                label="Daily Capacity"
                baseline={activeMetrics.capacity.baseline}
                simulated={activeMetrics.capacity.simulated}
                change={activeMetrics.capacity.delta}
                trend="positive"
                detail="Simultaneous seat & stand capacity"
              />

              {/* CARD 3: Average Waiting Time */}
              <BusMetricCard
                label="Avg Waiting Time"
                baseline={activeMetrics.waitTime.baseline}
                simulated={activeMetrics.waitTime.simulated}
                change={activeMetrics.waitTime.delta}
                trend={activeMetrics.waitTime.trend}
                detail="Average commuter stop delay"
              />

              {/* CARD 4: Daily Ridership */}
              <BusMetricCard
                label="Daily Ridership"
                baseline={activeMetrics.ridership.baseline}
                simulated={activeMetrics.ridership.simulated}
                change={activeMetrics.ridership.delta}
                trend="positive"
                detail="Projected daily passenger boardings"
              />

              {/* CARD 5: Operating Cost */}
              <BusMetricCard
                label="Operating Cost"
                baseline={activeMetrics.cost.baseline}
                simulated={activeMetrics.cost.simulated}
                change={activeMetrics.cost.delta}
                trend="cost-increase"
                detail="Estimated daily fleet operational OPEX"
              />

              {/* CARD 6: Fleet Utilization */}
              <BusMetricCard
                label="Fleet Utilization"
                baseline={activeMetrics.utilization.baseline}
                simulated={activeMetrics.utilization.simulated}
                change={activeMetrics.utilization.delta}
                trend="neutral"
                detail="Average seat occupancy ratio"
              />
            </div>
          </div>

          {/* CHARTS SECTION */}
          <div className="space-y-6">
            {/* Chart 1: Scenario Comparison Grouped Bar Chart */}
            <ScenarioComparison />

            {/* Side-by-side Chart 2 & Chart 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Chart 2: Policy Sensitivity Line Chart */}
              <PolicySensitivity />

              {/* Chart 3: Cost vs Service Improvement */}
              <TradeoffChart />
            </div>
          </div>

          {/* SYSTEM SCALE PICTOGRAPH */}
          <SystemScale
            buses={activeMetrics.systemScale.buses}
            passengers={`${activeMetrics.systemScale.passengers} passengers/day`}
            routes={activeMetrics.systemScale.routes}
          />

          {/* POLICY IMPACT SUMMARY & "WHAT CHANGES?" */}
          <ImpactSummary
            serviceStatus={activeMetrics.impact.service.status}
            waitTimeDelta={activeMetrics.impact.service.waitTimeDelta}
            ridershipDelta={activeMetrics.impact.service.ridershipDelta}
            costStatus={activeMetrics.impact.cost.status}
            costDelta={activeMetrics.impact.cost.costDelta}
            utilizationStatus={activeMetrics.impact.utilization.status}
            utilizationDelta={activeMetrics.impact.utilization.utilizationDelta}
          />

          {/* STRESS TEST PREVIEW ENVELOPE */}
          <StressTestPreview
            onSelectEnvelopeScenario={(type) => {
              if (type === 'stress') {
                handleSelectScenario('stress');
              } else if (type === 'best') {
                handleSelectScenario('proposed');
              } else {
                handleSelectScenario('baseline');
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default BusPage;
