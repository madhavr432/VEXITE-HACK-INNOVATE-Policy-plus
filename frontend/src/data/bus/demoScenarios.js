/**
 * Centralized Demo Scenarios & Data Store for Bus Policy Stress Tester
 * 
 * IMPORTANT:
 * All figures here are illustrative / synthetic demo values.
 * They provide a realistic preview for Commit 2 UI and will be wired
 * to the deterministic numerical simulation engine in Commit 3.
 */

export const DEMO_SCENARIO_PRESETS = {
  baseline: {
    id: 'baseline',
    name: 'Current Policy',
    tagline: 'Baseline',
    description: 'Current municipal operations with 100 active buses and standard schedule headways.',
    inputs: {
      currentBuses: 100,
      fleetIncrease: 0,
      dailyPassengers: 42000,
      busCapacity: 50,
      ticketPrice: 25,
      costPerBus: 8200,
    },
    metrics: {
      fleet: { baseline: 100, simulated: 100, delta: '0%', trend: 'neutral' },
      capacity: { baseline: '5,000', simulated: '5,000', delta: '0%', trend: 'neutral' },
      waitTime: { baseline: '14 min', simulated: '14 min', delta: '0%', trend: 'neutral' },
      ridership: { baseline: '42K', simulated: '42K', delta: '0%', trend: 'neutral' },
      cost: { baseline: '₹8.2L', simulated: '₹8.2L', delta: '0%', trend: 'neutral' },
      utilization: { baseline: '78%', simulated: '78%', delta: '0%', trend: 'neutral' },
    },
    systemScale: {
      buses: 100,
      passengers: '42,000',
      routes: 24,
    },
    impact: {
      service: { status: 'Baseline', waitTimeDelta: '0%', ridershipDelta: '0%' },
      cost: { status: 'Baseline', costDelta: '0%' },
      utilization: { status: 'Baseline', utilizationDelta: '0%' },
    },
  },

  proposed: {
    id: 'proposed',
    name: 'Proposed Policy',
    tagline: '+20% Fleet',
    description: 'Procuring and commissioning 20 additional buses to compress route headways during peak hours.',
    inputs: {
      currentBuses: 100,
      fleetIncrease: 20,
      dailyPassengers: 42000,
      busCapacity: 50,
      ticketPrice: 25,
      costPerBus: 8200,
    },
    metrics: {
      fleet: { baseline: 100, simulated: 120, delta: '+20%', trend: 'positive' },
      capacity: { baseline: '5,000', simulated: '6,000', delta: '+20%', trend: 'positive' },
      waitTime: { baseline: '14 min', simulated: '11 min', delta: '−21%', trend: 'positive' },
      ridership: { baseline: '42K', simulated: '47K', delta: '+12%', trend: 'positive' },
      cost: { baseline: '₹8.2L', simulated: '₹9.4L', delta: '+15%', trend: 'negative' },
      utilization: { baseline: '78%', simulated: '72%', delta: '−6%', trend: 'neutral' },
    },
    systemScale: {
      buses: 120,
      passengers: '47,000',
      routes: 24,
    },
    impact: {
      service: { status: 'Improved', waitTimeDelta: '−21%', ridershipDelta: '+12%' },
      cost: { status: 'Increased', costDelta: '+15%' },
      utilization: { status: 'Changed', utilizationDelta: '−6%' },
    },
  },

  stress: {
    id: 'stress',
    name: 'Stress Case',
    tagline: 'High Demand',
    description: 'Adverse condition combining +25% passenger demand shock with fuel inflation and traffic congestion.',
    inputs: {
      currentBuses: 100,
      fleetIncrease: 25,
      dailyPassengers: 52500,
      busCapacity: 50,
      ticketPrice: 25,
      costPerBus: 9800,
    },
    metrics: {
      fleet: { baseline: 100, simulated: 125, delta: '+25%', trend: 'positive' },
      capacity: { baseline: '5,000', simulated: '6,250', delta: '+25%', trend: 'positive' },
      waitTime: { baseline: '14 min', simulated: '15 min', delta: '+7%', trend: 'negative' },
      ridership: { baseline: '42K', simulated: '53K', delta: '+26%', trend: 'positive' },
      cost: { baseline: '₹8.2L', simulated: '₹11.2L', delta: '+36%', trend: 'negative' },
      utilization: { baseline: '78%', simulated: '64%', delta: '−14%', trend: 'neutral' },
    },
    systemScale: {
      buses: 125,
      passengers: '53,000',
      routes: 24,
    },
    impact: {
      service: { status: 'Degraded', waitTimeDelta: '+7%', ridershipDelta: '+26%' },
      cost: { status: 'Elevated', costDelta: '+36%' },
      utilization: { status: 'Strained', utilizationDelta: '−14%' },
    },
  },
};

/**
 * Chart 1: Scenario Comparison (Grouped Bar Chart)
 * Illustrative progression of fleet tiers
 */
export const SCENARIO_COMPARISON_DATA = [
  { scenario: 'Current', fleet: 100, ridership: 42.0, cost: 8.2, waitTime: 14.0 },
  { scenario: '+10%', fleet: 110, ridership: 44.5, cost: 8.7, waitTime: 12.8 },
  { scenario: '+15%', fleet: 115, ridership: 45.8, cost: 9.0, waitTime: 11.9 },
  { scenario: '+20%', fleet: 120, ridership: 47.0, cost: 9.4, waitTime: 11.0 },
  { scenario: '+25%', fleet: 125, ridership: 47.8, cost: 10.1, waitTime: 10.4 },
  { scenario: '+30%', fleet: 130, ridership: 48.2, cost: 11.0, waitTime: 10.0 },
];

/**
 * Chart 2: Policy Sensitivity Line Chart
 * Average waiting time as fleet size changes
 */
export const POLICY_SENSITIVITY_DATA = [
  { fleetDelta: '0%', fleetNum: 100, waitTime: 14.0, benchmark: 14.0 },
  { fleetDelta: '10%', fleetNum: 110, waitTime: 13.0, benchmark: 14.0 },
  { fleetDelta: '20%', fleetNum: 120, waitTime: 11.0, benchmark: 14.0 },
  { fleetDelta: '30%', fleetNum: 130, waitTime: 10.0, benchmark: 14.0 },
  { fleetDelta: '40%', fleetNum: 140, waitTime: 9.0, benchmark: 14.0 },
];

/**
 * Chart 3: Cost vs Service Improvement Trade-off Data
 */
export const COST_VS_SERVICE_DATA = [
  { stage: 'Current', cost: 8.2, serviceGain: 0, waitReduction: 0, ridership: 42 },
  { stage: '+10%', cost: 8.7, serviceGain: 12, waitReduction: 7, ridership: 44.5 },
  { stage: '+15%', cost: 9.0, serviceGain: 18, waitReduction: 15, ridership: 45.8 },
  { stage: '+20%', cost: 9.4, serviceGain: 24, waitReduction: 21, ridership: 47 },
  { stage: '+25%', cost: 10.1, serviceGain: 27, waitReduction: 25, ridership: 47.8 },
  { stage: '+30%', cost: 11.0, serviceGain: 29, waitReduction: 28, ridership: 48.2 },
];

/**
 * Stress Test Preview Envelope Scenarios
 */
export const ENVELOPE_SCENARIOS = [
  {
    type: 'best',
    title: 'Best Case',
    badgeColor: 'emerald',
    icon: '🟢',
    description: 'Normal demand + favourable operating conditions with stable depot fuel prices.',
    metrics: {
      waitingTime: '10 min',
      ridership: '49K',
      cost: '₹9.1L',
      utilization: '74%',
      risk: 'Low',
    },
  },
  {
    type: 'expected',
    title: 'Expected Case',
    badgeColor: 'sky',
    icon: '🔵',
    description: 'Baseline assumptions under the proposed +20% fleet deployment schedule.',
    metrics: {
      waitingTime: '11 min',
      ridership: '47K',
      cost: '₹9.4L',
      utilization: '72%',
      risk: 'Moderate',
    },
  },
  {
    type: 'stress',
    title: 'Stress Case',
    badgeColor: 'rose',
    icon: '🔴',
    description: 'Higher demand + higher operating cost with trunk route congestion spikes.',
    metrics: {
      waitingTime: '15 min',
      ridership: '53K',
      cost: '₹11.2L',
      utilization: '64%',
      risk: 'High',
    },
  },
];

/**
 * Advanced Assumption Placeholders
 */
export const DEFAULT_ADVANCED_ASSUMPTIONS = {
  routeDistance: 18.5, // km
  fuelCost: 92.5, // ₹/liter
  tripDuration: 45, // mins
  peakDemandFactor: 1.6, // multiplier
  offPeakDemandFactor: 0.65, // multiplier
};

/**
 * Helper to compute illustrative preview calculations dynamically
 * when user moves slider or inputs before Commit 3 real model
 */
export function calculateDemoPreview(inputs) {
  const currentBuses = Math.max(1, parseInt(inputs.currentBuses, 10) || 100);
  const increasePercent = Math.max(0, parseInt(inputs.fleetIncrease, 10) || 0);
  const capacity = Math.max(1, parseInt(inputs.busCapacity, 10) || 50);
  const costPerBus = Math.max(0, parseFloat(inputs.costPerBus) || 8200);

  const simulatedFleet = Math.round(currentBuses * (1 + increasePercent / 100));
  const simulatedCapacity = simulatedFleet * capacity;
  const waitTime = Math.max(8, Math.round(14 - (increasePercent * 0.15)));
  const waitTimeDelta = Math.round(((waitTime - 14) / 14) * 100);

  const ridershipNum = Math.round(42 * (1 + (increasePercent * 0.006)));
  const ridershipDelta = Math.round(((ridershipNum - 42) / 42) * 100);

  // Scaled operating cost model (blended depot & maintenance elasticity):
  // Baseline is ₹8.2L; at +20% expansion, cost increases by +15% to ₹9.4L
  const costMultiplier = 1 + (increasePercent * 0.0075);
  const baseCost = ((currentBuses * (costPerBus || 8200)) / 100000);
  const costLakhs = (baseCost * costMultiplier).toFixed(1);
  const baselineCostLakhs = baseCost.toFixed(1);
  const costDelta = Math.round((costMultiplier - 1) * 100);

  const utilPercent = Math.max(50, Math.min(95, Math.round(78 - (increasePercent * 0.3))));
  const utilDelta = utilPercent - 78;

  return {
    fleet: {
      baseline: currentBuses,
      simulated: simulatedFleet,
      delta: `+${increasePercent}%`,
      trend: increasePercent > 0 ? 'positive' : 'neutral',
    },
    capacity: {
      baseline: (currentBuses * capacity).toLocaleString(),
      simulated: simulatedCapacity.toLocaleString(),
      delta: `+${increasePercent}%`,
      trend: increasePercent > 0 ? 'positive' : 'neutral',
    },
    waitTime: {
      baseline: '14 min',
      simulated: `${waitTime} min`,
      delta: waitTimeDelta <= 0 ? `${waitTimeDelta}%` : `+${waitTimeDelta}%`,
      trend: waitTimeDelta <= 0 ? 'positive' : 'negative',
    },
    ridership: {
      baseline: '42K',
      simulated: `${ridershipNum}K`,
      delta: ridershipDelta >= 0 ? `+${ridershipDelta}%` : `${ridershipDelta}%`,
      trend: 'positive',
    },
    cost: {
      baseline: `₹${baselineCostLakhs}L`,
      simulated: `₹${costLakhs}L`,
      delta: costDelta >= 0 ? `+${costDelta}%` : `${costDelta}%`,
      trend: costDelta > 0 ? 'negative' : 'positive',
    },
    utilization: {
      baseline: '78%',
      simulated: `${utilPercent}%`,
      delta: utilDelta >= 0 ? `+${utilDelta}%` : `${utilDelta}%`,
      trend: 'neutral',
    },
    systemScale: {
      buses: simulatedFleet,
      passengers: `${ridershipNum}K`,
      routes: 24,
    },
    impact: {
      service: {
        status: waitTimeDelta < 0 ? 'Improved' : 'Unchanged',
        waitTimeDelta: `${waitTimeDelta}%`,
        ridershipDelta: `+${ridershipDelta}%`,
      },
      cost: {
        status: costDelta > 0 ? 'Increased' : 'Stable',
        costDelta: `+${costDelta}%`,
      },
      utilization: {
        status: 'Changed',
        utilizationDelta: `${utilDelta}%`,
      },
    },
  };
}
