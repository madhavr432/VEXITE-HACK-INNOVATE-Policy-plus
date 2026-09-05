/**
 * Bus Simulation Service Interface (Prepared for Commit 3)
 * 
 * In Commit 2: Provides mock asynchronous execution simulating backend roundtrip
 * without running actual mathematical modeling or Gemini AI.
 * In Commit 3: Will be connected directly to FastAPI deterministic simulation routes.
 */

import { DEMO_SCENARIO_PRESETS, calculateDemoPreview } from '../data/bus/demoScenarios';

/**
 * Execute a bus policy simulation scenario.
 * Returns a Promise that resolves with simulated scenario outcomes.
 *
 * @param {Object} params - Policy intervention parameters
 * @returns {Promise<Object>} Formatted simulation results
 */
export async function runBusSimulation(params) {
  // Commit 2: Short artificial async latency simulating computational turnaround
  await new Promise((resolve) => setTimeout(resolve, 850));

  // In Commit 3, this will call: await api.post('/api/bus/simulate', params);
  const preview = calculateDemoPreview(params);

  return {
    success: true,
    mode: 'demo_preview',
    timestamp: new Date().toISOString(),
    metrics: preview,
  };
}

/**
 * Fetch available baseline scenario presets
 */
export async function getBusPresets() {
  return DEMO_SCENARIO_PRESETS;
}

export default {
  runBusSimulation,
  getBusPresets,
};
