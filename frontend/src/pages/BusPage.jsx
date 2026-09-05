import React, { useState, useMemo, useEffect } from 'react';
import {
  Bus,
  RotateCcw,
  Play,
  Sliders,
  ChevronDown,
  ChevronUp,
  Loader2,
  Info,
  AlertCircle,
  TrendingUp,
  Coins,
  Leaf,
  Zap,
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
import { ScenarioTable } from '../components/bus/ScenarioTable';
import { ScenarioComparison } from '../components/bus/ScenarioComparison';
import { PolicySensitivity } from '../components/bus/PolicySensitivity';
import { TradeoffChart } from '../components/bus/TradeoffChart';
import { SensitivitySummary } from '../components/bus/SensitivitySummary';
import { SystemScale } from '../components/bus/SystemScale';
import { ImpactSummary } from '../components/bus/ImpactSummary';
import { ModelAssumptions } from '../components/bus/ModelAssumptions';
import { AttackPolicyButton } from '../components/bus/AttackPolicyButton';
import { BreakingPointCard } from '../components/bus/BreakingPointCard';
import { ScenarioCaseCards } from '../components/bus/ScenarioCaseCards';
import { StressScenarioTable } from '../components/bus/StressScenarioTable';
import { CaseComparisonChart } from '../components/bus/CaseComparisonChart';
import { StressStatusSummary } from '../components/bus/StressStatusSummary';
import { PolicyRiskSection } from '../components/bus/PolicyRiskSection';
import { AIPolicyAnalyst } from '../components/bus/AIPolicyAnalyst';

// Demo data & backend simulation service
import {
  DEMO_SCENARIO_PRESETS,
  DEFAULT_ADVANCED_ASSUMPTIONS,
  calculateDemoPreview,
} from '../data/bus/demoScenarios';
import {
  runBusSimulation,
  getBusScenarios,
  runBusStressTest,
  getBusRisk,
  formatInrLakhs,
  formatPaxK,
} from '../services/busSimulation';
import { analyzePolicy } from '../services/aiAnalyst';

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

  // Advanced Assumptions State
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tripsPerBusPerDay, setTripsPerBusPerDay] = useState(10);
  const [currentWaitingTime, setCurrentWaitingTime] = useState(14);
  const [demandElasticity, setDemandElasticity] = useState(0.25);
  const [dailyFuelUse, setDailyFuelUse] = useState(120);
  const [emissionFactor, setEmissionFactor] = useState(2.31);

  // Simulation loading state & results from FastAPI backend
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [scenariosResult, setScenariosResult] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [isBackendLive, setIsBackendLive] = useState(true);

  // Attack My Policy / Stress Testing State (Commit 5)
  const [isAttacking, setIsAttacking] = useState(false);
  const [stressResult, setStressResult] = useState(null);
  const [attackError, setAttackError] = useState(null);

  // Deterministic Policy Risk Engine State (Commit 6)
  const [isRiskLoading, setIsRiskLoading] = useState(false);
  const [riskResult, setRiskResult] = useState(null);
  const [riskError, setRiskError] = useState(null);

  // AI Policy Analyst State (Commit 7)
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiAnalysisResult, setAIAnalysisResult] = useState(null);
  const [aiError, setAIError] = useState(null);

  // Inline Validation States
  const validationErrors = useMemo(() => {
    const errors = {};
    const buses = parseInt(currentBuses, 10);
    const increase = parseFloat(fleetIncrease);
    const pax = parseFloat(dailyPassengers);
    const cap = parseInt(busCapacity, 10);
    const price = parseFloat(ticketPrice);
    const cost = parseFloat(costPerBus);

    if (isNaN(buses) || buses < 1 || buses > 10000) {
      errors.currentBuses = 'Fleet must be between 1 and 10,000 buses';
    }
    if (isNaN(increase) || increase < 0 || increase > 50) {
      errors.fleetIncrease = 'Increase must be between 0% and 50%';
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

  // Local fallback demo preview (for instantaneous slider feedback)
  const localPreview = useMemo(() => {
    return calculateDemoPreview({
      currentBuses,
      fleetIncrease,
      dailyPassengers,
      busCapacity,
      ticketPrice,
      costPerBus,
    });
  }, [currentBuses, fleetIncrease, dailyPassengers, busCapacity, ticketPrice, costPerBus]);

  // Execute simulation against FastAPI backend
  const executeSimulation = async (overrideParams = null) => {
    if (!isValid && !overrideParams) return;

    setIsSimulating(true);
    setIsRiskLoading(true);
    setApiError(null);
    setRiskError(null);

    const params = overrideParams || {
      currentBuses,
      fleetIncrease,
      dailyPassengers,
      busCapacity,
      ticketPrice,
      costPerBus,
      tripsPerBusPerDay,
      currentWaitingTime,
      demandElasticity,
    };

    try {
      const [simResponse, scenResponse, stressResponse, riskResponse] = await Promise.all([
        runBusSimulation(params),
        getBusScenarios(params),
        runBusStressTest(params),
        getBusRisk(params),
      ]);
      setSimulationResult(simResponse);
      setScenariosResult(scenResponse);
      setStressResult(stressResponse);
      setRiskResult(riskResponse);
      setIsBackendLive(true);
    } catch (err) {
      console.warn('Backend simulation unreachable, using fallback calculations:', err);
      setApiError('Simulation service unavailable. Please make sure the Policy+ API is running.');
      setIsBackendLive(false);
    } finally {
      setIsSimulating(false);
      setIsRiskLoading(false);
    }
  };

  // Dedicated Attack My Policy execution
  const executeStressTest = async (overrideParams = null) => {
    if (!isValid && !overrideParams) return;

    setIsAttacking(true);
    setAttackError(null);

    const params = overrideParams || {
      currentBuses,
      fleetIncrease,
      dailyPassengers,
      busCapacity,
      ticketPrice,
      costPerBus,
      tripsPerBusPerDay,
      currentWaitingTime,
      demandElasticity,
    };

    try {
      const [stressResponse, riskResponse] = await Promise.all([
        runBusStressTest(params),
        getBusRisk(params),
      ]);
      setStressResult(stressResponse);
      setRiskResult(riskResponse);
    } catch (err) {
      console.warn('Backend stress test execution failed:', err);
      setAttackError('Stress test engine unavailable. Ensure Policy+ backend is operational.');
    } finally {
      setIsAttacking(false);
    }
  };

  // Dedicated Policy Risk evaluation
  const executeRiskEvaluation = async (overrideParams = null) => {
    if (!isValid && !overrideParams) return;

    setIsRiskLoading(true);
    setRiskError(null);

    const params = overrideParams || {
      currentBuses,
      fleetIncrease,
      dailyPassengers,
      busCapacity,
      ticketPrice,
      costPerBus,
      tripsPerBusPerDay,
      currentWaitingTime,
      demandElasticity,
    };

    try {
      const response = await getBusRisk(params);
      setRiskResult(response);
    } catch (err) {
      console.warn('Backend risk evaluation failed:', err);
      setRiskError('Policy risk engine unavailable. Ensure Policy+ backend is operational.');
    } finally {
      setIsRiskLoading(false);
    }
  };

  // Handle tier selection from Scenario Table or Charts
  const handleSelectTier = (tierPercent) => {
    const tierStr = String(tierPercent);
    setFleetIncrease(tierStr);
    if (selectedScenario !== 'proposed') setSelectedScenario('');

    executeSimulation({
      currentBuses,
      fleetIncrease: tierStr,
      dailyPassengers,
      busCapacity,
      ticketPrice,
      costPerBus,
      tripsPerBusPerDay,
      currentWaitingTime,
      demandElasticity,
    });
  };

  // Run initial simulation on load with default proposed values
  useEffect(() => {
    executeSimulation();
  }, []);

  // Handle Scenario Presets Selection
  const handleSelectScenario = (scenarioId) => {
    setSelectedScenario(scenarioId);
    const preset = DEMO_SCENARIO_PRESETS[scenarioId];
    if (preset) {
      const newFleet = String(preset.inputs.currentBuses);
      const newInc = String(preset.inputs.fleetIncrease);
      const newPax = String(preset.inputs.dailyPassengers);
      const newCap = String(preset.inputs.busCapacity);
      const newPrice = String(preset.inputs.ticketPrice);
      const newCost = String(preset.inputs.costPerBus);

      setCurrentBuses(newFleet);
      setFleetIncrease(newInc);
      setDailyPassengers(newPax);
      setBusCapacity(newCap);
      setTicketPrice(newPrice);
      setCostPerBus(newCost);

      executeSimulation({
        currentBuses: newFleet,
        fleetIncrease: newInc,
        dailyPassengers: newPax,
        busCapacity: newCap,
        ticketPrice: newPrice,
        costPerBus: newCost,
        tripsPerBusPerDay,
        currentWaitingTime,
        demandElasticity,
      });
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
    setTripsPerBusPerDay(10);
    setCurrentWaitingTime(14);
    setDemandElasticity(0.25);
    setDailyFuelUse(120);
    setEmissionFactor(2.31);
    setApiError(null);

    executeSimulation({
      currentBuses: String(defaultPreset.inputs.currentBuses),
      fleetIncrease: String(defaultPreset.inputs.fleetIncrease),
      dailyPassengers: String(defaultPreset.inputs.dailyPassengers),
      busCapacity: String(defaultPreset.inputs.busCapacity),
      ticketPrice: String(defaultPreset.inputs.ticketPrice),
      costPerBus: String(defaultPreset.inputs.costPerBus),
      tripsPerBusPerDay: 10,
      currentWaitingTime: 14,
      demandElasticity: 0.25,
    });
  };

  // Generate dynamic chart data based on deterministic equations
  const dynamicComparisonData = useMemo(() => {
    const baseFleet = parseInt(currentBuses, 10) || 100;
    const basePax = parseFloat(dailyPassengers) || 42000;
    const cap = parseInt(busCapacity, 10) || 50;
    const cost = parseFloat(costPerBus) || 8200;
    const trips = tripsPerBusPerDay || 10;
    const elasticity = demandElasticity || 0.25;

    const baseCap = baseFleet * cap * trips;
    const curPressure = baseCap > 0 ? basePax / baseCap : 0;

    const tiers = [0, 10, 15, 20, 25, 30];
    return tiers.map((inc) => {
      const fleet = Math.max(1, Math.round(baseFleet * (1 + inc / 100)));
      const dailyCap = fleet * cap * trips;
      const sDelta = ((fleet - baseFleet) / baseFleet) * 100;
      const rDelta = elasticity * sDelta;
      const pax = Math.round(basePax * (1 + rDelta / 100));
      const opexLakhs = (fleet * cost) / 100000;
      const propPressure = dailyCap > 0 ? pax / dailyCap : 0;
      const wait = curPressure > 0 && propPressure > 0
        ? Number((currentWaitingTime * ((propPressure / curPressure) ** 0.5)).toFixed(1))
        : currentWaitingTime;

      return {
        scenario: inc === 0 ? 'Current' : `+${inc}%`,
        fleet,
        ridership: Number((pax / 1000).toFixed(1)),
        cost: Number(opexLakhs.toFixed(1)),
        waitTime: wait,
      };
    });
  }, [currentBuses, dailyPassengers, busCapacity, costPerBus, tripsPerBusPerDay, demandElasticity, currentWaitingTime]);

  const dynamicSensitivityData = useMemo(() => {
    const baseFleet = parseInt(currentBuses, 10) || 100;
    const basePax = parseFloat(dailyPassengers) || 42000;
    const cap = parseInt(busCapacity, 10) || 50;
    const trips = tripsPerBusPerDay || 10;
    const elasticity = demandElasticity || 0.25;

    const baseCap = baseFleet * cap * trips;
    const curPressure = baseCap > 0 ? basePax / baseCap : 0;

    const tiers = [0, 10, 20, 30, 40];
    return tiers.map((inc) => {
      const fleet = Math.max(1, Math.round(baseFleet * (1 + inc / 100)));
      const dailyCap = fleet * cap * trips;
      const sDelta = ((fleet - baseFleet) / baseFleet) * 100;
      const rDelta = elasticity * sDelta;
      const pax = Math.round(basePax * (1 + rDelta / 100));
      const propPressure = dailyCap > 0 ? pax / dailyCap : 0;
      const wait = curPressure > 0 && propPressure > 0
        ? Number((currentWaitingTime * ((propPressure / curPressure) ** 0.5)).toFixed(1))
        : currentWaitingTime;

      return {
        fleetDelta: `${inc}%`,
        fleetNum: fleet,
        waitTime: wait,
      };
    });
  }, [currentBuses, dailyPassengers, busCapacity, tripsPerBusPerDay, demandElasticity, currentWaitingTime]);

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
              Deterministic Engine v0.3.0
            </span>
          </div>
        }
      />

      {/* BACKEND API ERROR NOTICE (IF OFFLINE) */}
      {apiError && (
        <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 p-4 shadow-soft-xs flex items-center justify-between gap-4 animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200 font-medium">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>{apiError}</span>
          </div>
          <Button
            onClick={() => executeSimulation()}
            size="sm"
            variant="secondary"
            className="text-xs shrink-0"
          >
            Retry Connection
          </Button>
        </div>
      )}

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
                    <span className="text-[10px] text-policy-600 dark:text-policy-400 font-semibold">
                      (Configurable)
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
                        <label className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold">Trips/Bus/Day</label>
                        <input
                          type="number"
                          value={tripsPerBusPerDay}
                          onChange={(e) => setTripsPerBusPerDay(parseFloat(e.target.value) || 1)}
                          min={1}
                          max={30}
                          className="w-full mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold">Base Wait Time</label>
                        <input
                          type="number"
                          value={currentWaitingTime}
                          onChange={(e) => setCurrentWaitingTime(parseFloat(e.target.value) || 0)}
                          min={0}
                          className="w-full mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold">Demand Elasticity</label>
                        <input
                          type="number"
                          step="0.05"
                          value={demandElasticity}
                          onChange={(e) => setDemandElasticity(parseFloat(e.target.value) || 0)}
                          min={0}
                          max={1}
                          className="w-full mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold">Fuel (L/Bus/Day)</label>
                        <input
                          type="number"
                          value={dailyFuelUse}
                          onChange={(e) => setDailyFuelUse(parseFloat(e.target.value) || 0)}
                          min={0}
                          className="w-full mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-xs"
                        />
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight italic pt-1">
                      Advanced assumptions are transmitted directly to the deterministic simulation engine.
                    </p>
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-2 space-y-2.5">
                <Button
                  onClick={() => executeSimulation()}
                  disabled={!isValid || isSimulating}
                  size="md"
                  variant="primary"
                  icon={isSimulating ? Loader2 : Play}
                  className="w-full font-semibold shadow-soft-sm relative"
                >
                  {isSimulating ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Executing simulation engine...
                    </span>
                  ) : (
                    'Run Simulation →'
                  )}
                </Button>

                <AttackPolicyButton
                  onClick={() => executeStressTest()}
                  isLoading={isAttacking}
                  disabled={!isValid}
                  className="w-full"
                />

                <div className="text-center">
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                    {simulationResult ? 'FastAPI deterministic simulation active' : 'Live Python mathematical model'}
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
                  Simulation Results
                </h2>
                <Badge variant={simulationResult ? 'positive' : 'accent'} size="sm">
                  {simulationResult ? 'Deterministic Output' : 'Calculated Preview'}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Auditable mathematical outputs calculated by the FastAPI simulation service.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                <Info className="w-3 h-3 text-slate-400" />
                Deterministic Scenario Engine
              </span>
            </div>
          </div>

          {/* 6 CORE KPI CARDS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Core Policy Indicators
              </span>
              <span className="text-[11px] font-mono text-policy-600 dark:text-policy-400 font-semibold">
                {simulationResult ? 'Simulated via /api/bus/simulate' : 'Dynamic preview'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {/* CARD 1: Fleet */}
              <BusMetricCard
                label="Fleet"
                baseline={simulationResult ? simulationResult.current.fleet : localPreview.fleet.baseline}
                simulated={simulationResult ? simulationResult.proposed.fleet : localPreview.fleet.simulated}
                change={simulationResult ? `+${simulationResult.impact.fleet_percent}%` : localPreview.fleet.delta}
                trend="positive"
                icon={Bus}
                detail="Total deployed vehicles"
              />

              {/* CARD 2: Daily Capacity */}
              <BusMetricCard
                label="Daily Capacity"
                baseline={simulationResult ? simulationResult.current.daily_capacity.toLocaleString() : localPreview.capacity.baseline}
                simulated={simulationResult ? simulationResult.proposed.daily_capacity.toLocaleString() : localPreview.capacity.simulated}
                change={simulationResult ? `+${simulationResult.impact.capacity_percent}%` : localPreview.capacity.delta}
                trend="positive"
                detail="Fleet × Capacity × Trips/day"
              />

              {/* CARD 3: Average Waiting Time */}
              <BusMetricCard
                label="Avg Waiting Time"
                baseline={simulationResult ? `${simulationResult.current.waiting_time_minutes} min` : localPreview.waitTime.baseline}
                simulated={simulationResult ? `${simulationResult.proposed.waiting_time_minutes} min` : localPreview.waitTime.simulated}
                change={simulationResult ? `${simulationResult.impact.waiting_time_percent}%` : localPreview.waitTime.delta}
                trend={simulationResult ? (simulationResult.impact.waiting_time_percent <= 0 ? 'positive' : 'negative') : localPreview.waitTime.trend}
                detail="Queue pressure sensitivity approximation"
              />

              {/* CARD 4: Daily Ridership */}
              <BusMetricCard
                label="Daily Ridership"
                baseline={simulationResult ? formatPaxK(simulationResult.current.daily_ridership) : localPreview.ridership.baseline}
                simulated={simulationResult ? formatPaxK(simulationResult.proposed.daily_ridership) : localPreview.ridership.simulated}
                change={simulationResult ? `+${simulationResult.impact.ridership_percent}%` : localPreview.ridership.delta}
                trend="positive"
                detail="Elasticity-adjusted passenger boardings"
              />

              {/* CARD 5: Operating Cost */}
              <BusMetricCard
                label="Operating Cost"
                baseline={simulationResult ? formatInrLakhs(simulationResult.current.operating_cost) : localPreview.cost.baseline}
                simulated={simulationResult ? formatInrLakhs(simulationResult.proposed.operating_cost) : localPreview.cost.simulated}
                change={simulationResult ? `+${simulationResult.impact.operating_cost_percent}%` : localPreview.cost.delta}
                trend="cost-increase"
                detail="Fleet × Operating cost per bus"
              />

              {/* CARD 6: Fleet Utilization */}
              <BusMetricCard
                label="Fleet Utilization"
                baseline={simulationResult ? `${simulationResult.current.utilization_percent}%` : localPreview.utilization.baseline}
                simulated={simulationResult ? `${simulationResult.proposed.utilization_percent}%` : localPreview.utilization.simulated}
                change={simulationResult ? `${simulationResult.impact.utilization_percent}%` : localPreview.utilization.delta}
                trend="neutral"
                detail="Daily ridership / Daily capacity load factor"
              />
            </div>
          </div>

          {/* FISCAL SURPLUS & EMISSIONS HIGHLIGHTS (ADDITIONAL DETERMINISTIC ENGINE INSIGHTS) */}
          {simulationResult && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                      Operating Surplus
                    </div>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white font-mono mt-0.5">
                      {formatInrLakhs(simulationResult.current.operating_surplus)} → {formatInrLakhs(simulationResult.proposed.operating_surplus)}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                  {simulationResult.impact.operating_surplus_percent}%
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                      Fleet CO₂ Emissions
                    </div>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white font-mono mt-0.5">
                      {(simulationResult.current.emissions_kg / 1000).toFixed(1)}T → {(simulationResult.proposed.emissions_kg / 1000).toFixed(1)}T CO₂/day
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-1 rounded border border-amber-200 dark:border-amber-800">
                  +{simulationResult.impact.emissions_percent}%
                </span>
              </div>
            </div>
          )}

          {/* SCENARIO COMPARISON MATRIX TABLE (COMMIT 4) */}
          <ScenarioTable
            scenarios={scenariosResult ? scenariosResult.scenarios : []}
            activePercent={parseFloat(fleetIncrease) || 0}
            onSelectTier={handleSelectTier}
          />

          {/* CHARTS SECTION */}
          <div className="space-y-6">
            {/* Chart 1: Scenario Comparison Grouped Bar Chart */}
            <ScenarioComparison
              scenarios={scenariosResult ? scenariosResult.scenarios : []}
              activePercent={parseFloat(fleetIncrease) || 0}
              onSelectTier={handleSelectTier}
            />

            {/* Side-by-side Chart 2 & Chart 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Chart 2: Policy Sensitivity Line Chart */}
              <PolicySensitivity
                scenarios={scenariosResult ? scenariosResult.scenarios : []}
                activePercent={parseFloat(fleetIncrease) || 0}
                onSelectTier={handleSelectTier}
              />

              {/* Chart 3: Cost vs Service Improvement */}
              <TradeoffChart
                scenarios={scenariosResult ? scenariosResult.scenarios : []}
                activePercent={parseFloat(fleetIncrease) || 0}
                onSelectTier={handleSelectTier}
              />
            </div>
          </div>

          {/* SENSITIVITY & ELASTICITY SYNTHESIS SUMMARY (COMMIT 4) */}
          {scenariosResult && (
            <SensitivitySummary
              current={scenariosResult.current}
              selectedScenario={scenariosResult.selected_scenario}
              assumptions={scenariosResult.assumptions}
            />
          )}

          {/* SYSTEM SCALE PICTOGRAPH */}
          <SystemScale
            buses={simulationResult ? simulationResult.proposed.fleet : localPreview.systemScale.buses}
            passengers={simulationResult ? `${formatPaxK(simulationResult.proposed.daily_ridership)} passengers/day` : `${localPreview.systemScale.passengers} passengers/day`}
            routes={localPreview.systemScale.routes}
          />

          {/* POLICY IMPACT SUMMARY & "WHAT CHANGES?" */}
          <ImpactSummary
            serviceStatus={simulationResult ? (simulationResult.impact.waiting_time_percent <= 0 ? 'Improved' : 'Congested') : localPreview.impact.service.status}
            waitTimeDelta={simulationResult ? `${simulationResult.impact.waiting_time_percent}%` : localPreview.impact.service.waitTimeDelta}
            ridershipDelta={simulationResult ? `+${simulationResult.impact.ridership_percent}%` : localPreview.impact.service.ridershipDelta}
            costStatus={simulationResult ? 'Increased' : localPreview.impact.cost.status}
            costDelta={simulationResult ? `+${simulationResult.impact.operating_cost_percent}%` : localPreview.impact.cost.costDelta}
            utilizationStatus={simulationResult ? 'Changed' : localPreview.impact.utilization.status}
            utilizationDelta={simulationResult ? `${simulationResult.impact.utilization_percent}%` : localPreview.impact.utilization.utilizationDelta}
          />

          {/* MODEL ASSUMPTIONS & AUDIT TRAIL */}
          <ModelAssumptions
            assumptions={simulationResult ? simulationResult.assumptions : {
              trips_per_bus_per_day: tripsPerBusPerDay,
              demand_elasticity: demandElasticity,
              waiting_time_alpha: 0.5,
              daily_fuel_use_per_bus: dailyFuelUse,
              emission_factor_kg_per_liter: emissionFactor,
            }}
          />

          {/* ========================================================================= */}
          {/* SECTION: ATTACK MY POLICY & STRESS TESTING (COMMIT 5)                      */}
          {/* ========================================================================= */}
          <div id="stress-test-section" className="space-y-6 pt-6 border-t border-slate-200/80 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 text-white flex items-center justify-center shadow-soft-xs">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                      ⚡ Attack My Policy & Stress Testing
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      Systematically test the selected policy (+{fleetIncrease}% fleet) against adverse demand and cost pressure.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <AttackPolicyButton
                  onClick={() => executeStressTest()}
                  isLoading={isAttacking}
                  disabled={!isValid}
                />
              </div>
            </div>

            {attackError && (
              <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 p-3.5 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
                <span>{attackError}</span>
                <Button size="sm" variant="secondary" onClick={() => executeStressTest()}>
                  Retry Attack
                </Button>
              </div>
            )}

            {/* 1. Breaking Point Assessment Card */}
            {stressResult && (
              <BreakingPointCard
                breakingPoint={stressResult.breaking_point}
                selectedFleetIncrease={parseFloat(fleetIncrease) || 0}
              />
            )}

            {/* 2. Stress Scenario Health Distribution Summary */}
            {stressResult && (
              <StressStatusSummary attackSummary={stressResult.attack_summary} />
            )}

            {/* 3. Outcome Envelope Bounds: Best vs Expected vs Worst */}
            {stressResult && (
              <ScenarioCaseCards
                bestCase={stressResult.best_case}
                expectedCase={stressResult.expected_case}
                worstCase={stressResult.worst_case}
              />
            )}

            {/* 4. Comparative Recharts Bar Chart */}
            {stressResult && (
              <CaseComparisonChart
                bestCase={stressResult.best_case}
                expectedCase={stressResult.expected_case}
                worstCase={stressResult.worst_case}
              />
            )}

            {/* 5. Adverse Scenarios Matrix Table */}
            {stressResult && (
              <StressScenarioTable
                scenarios={stressResult.stress_scenarios}
              />
            )}

            {/* 6. Stress Assumptions Audit Trail */}
            {stressResult && (
              <Card className="border border-slate-200/90 dark:border-slate-800 shadow-soft-xs bg-slate-50/50 dark:bg-slate-900/40">
                <CardContent className="p-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-mono font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                    <Info className="w-3.5 h-3.5 text-policy-600 dark:text-policy-400" />
                    <span>Stress Testing Audit Trail & Multipliers</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Adverse scenarios evaluate predefined multipliers: Demand (+10%, +20%, +30%, +25% combined) and Operating Cost (+10%, +20%).
                    The Expected Case strictly matches the standard simulation of the selected policy. The Worst Tested Case reflects compounded peak stress (+25% demand surge, +20% depot cost inflation).
                    All evaluations are deterministic and derived from the underlying mathematical simulation engine.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* ========================================================================= */}
          {/* SECTION: DETERMINISTIC POLICY RISK ENGINE (COMMIT 6)                     */}
          {/* ========================================================================= */}
          <PolicyRiskSection
            riskResult={riskResult}
            isLoading={isRiskLoading}
            error={riskError}
            onRefresh={() => executeRiskEvaluation()}
            selectedFleetIncrease={parseFloat(fleetIncrease) || 0}
          />

          {/* ========================================================================= */}
          {/* SECTION: AI POLICY ANALYST (COMMIT 7)                                    */}
          {/* ========================================================================= */}
          <AIPolicyAnalyst
            analysisResult={aiAnalysisResult}
            isLoading={isAILoading}
            error={aiError}
            onAnalyze={async (question) => {
              if (!isValid) return;
              setIsAILoading(true);
              setAIError(null);
              try {
                const params = {
                  currentBuses,
                  fleetIncrease,
                  dailyPassengers,
                  busCapacity,
                  ticketPrice,
                  costPerBus,
                  tripsPerBusPerDay,
                  currentWaitingTime,
                  demandElasticity,
                };
                const result = await analyzePolicy(params, question);
                setAIAnalysisResult(result);
              } catch (err) {
                let msg = 'AI analysis is temporarily unavailable.';
                if (typeof err?.response?.data?.detail === 'string') {
                  msg = err.response.data.detail;
                } else if (err?.response?.status === 500) {
                  msg = 'The AI service encountered a temporary server error. Please try again.';
                } else if (err?.code === 'ECONNABORTED' || err?.message?.includes('timeout')) {
                  msg = 'AI analysis timed out. The model took longer than expected to respond. Please try again.';
                } else if (err?.message) {
                  msg = err.message;
                }
                setAIError(msg);
              } finally {
                setIsAILoading(false);
              }
            }}
            selectedFleetIncrease={parseFloat(fleetIncrease) || 0}
            disabled={!isValid}
          />
        </div>
      </div>
    </div>
  );
}

export default BusPage;
