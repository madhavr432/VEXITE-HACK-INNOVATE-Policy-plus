/**
 * AI Policy Analyst Service (Commit 7 & 8)
 *
 * Communicates with the FastAPI Gemini AI endpoint for both Bus and GST modules.
 * The API key is NEVER in the frontend — Gemini calls go through the backend.
 *
 * POST /api/ai/analyze-policy
 *   ← { module: 'bus' | 'gst', policy?: ..., gst_policy?: ..., question?: string }
 *   → AIPolicyAnalysisResponse
 */

import api from './api';

/**
 * Request AI policy analysis from the Gemini-powered backend analyst.
 *
 * The backend re-runs deterministic engines and assembles the validated
 * analysis context before calling Gemini. The frontend only sends policy inputs.
 *
 * @param {Object} params - Policy configuration inputs
 * @param {string|null} question - Optional targeted analyst question
 * @param {string} module - 'bus' or 'gst'
 * @returns {Promise<Object>} Structured AI analysis response
 */
export async function analyzePolicy(params, question = null, module = 'bus') {
  let payload;

  if (module === 'gst') {
    payload = {
      module: 'gst',
      gst_policy: {
        current_rate: parseFloat(params.currentRate) || 18,
        proposed_rate: parseFloat(params.proposedRate) || 12,
        annual_turnover: (parseFloat(params.annualTurnoverCr) || 1000) * 1e7,
        compliance_rate: parseFloat(params.complianceRate ?? 85),
        demand_elasticity: parseFloat(params.demandElasticity ?? 0.20),
        effective_tax_base_factor: parseFloat(params.effectiveTaxBaseFactor ?? 0.80),
      },
      question: question && question.trim().length > 0 ? question.trim() : null,
    };
  } else {
    payload = {
      module: 'bus',
      policy: {
        current_fleet: parseInt(params.currentBuses, 10) || 100,
        fleet_increase_percent: parseFloat(params.fleetIncrease) || 0,
        daily_ridership: parseFloat(params.dailyPassengers) || 0,
        capacity_per_bus: parseInt(params.busCapacity, 10) || 50,
        average_ticket_price: parseFloat(params.ticketPrice) || 0,
        operating_cost_per_bus: parseFloat(params.costPerBus) || 0,
        trips_per_bus_per_day: parseFloat(params.tripsPerBusPerDay ?? 10.0),
        current_waiting_time_minutes: parseFloat(params.currentWaitingTime ?? 14.0),
        demand_elasticity: parseFloat(params.demandElasticity ?? 0.25),
      },
      question: question && question.trim().length > 0 ? question.trim() : null,
    };
  }

  const response = await api.post('/api/ai/analyze-policy', payload, {
    // Allow longer timeout for Gemini API calls
    timeout: 60000,
  });
  return response.data;
}

export default { analyzePolicy };
