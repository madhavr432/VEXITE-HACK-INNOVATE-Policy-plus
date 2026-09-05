/**
 * GST Policy Simulation Client Service (Commit 8)
 *
 * Connects the frontend UI to the FastAPI GST policy endpoints:
 * - POST /api/gst/simulate
 * - POST /api/gst/scenarios
 * - POST /api/gst/stress-test
 * - POST /api/gst/risk
 *
 * NOTE: Pure client transport layer. React NEVER computes final GST metrics.
 * All domain math runs on the backend.
 */

import api from './api';

/**
 * Format Indian Rupee values in Crores with standard formatting.
 * e.g., 10000000000 -> "₹1,000 Cr"
 * Or if small, in Lakhs / Thousands.
 */
export function formatInrCrores(value, precision = 2) {
  if (value === null || value === undefined || isNaN(value)) return '—';
  const num = Number(value);
  const isNeg = num < 0;
  const abs = Math.abs(num);

  // 1 Crore = 10,000,000 (10^7)
  const inCrores = abs / 1e7;
  if (inCrores >= 1) {
    const formatted = inCrores >= 100 ? inCrores.toLocaleString('en-IN', { maximumFractionDigits: 1 }) : inCrores.toFixed(precision);
    return `${isNeg ? '-' : ''}₹${formatted} Cr`;
  }
  // 1 Lakh = 100,000 (10^5)
  const inLakhs = abs / 1e5;
  if (inLakhs >= 1) {
    return `${isNeg ? '-' : ''}₹${inLakhs.toFixed(precision)} L`;
  }
  return `${isNeg ? '-' : ''}₹${abs.toLocaleString('en-IN')}`;
}

/**
 * Format percentage with explicit sign and decimals.
 */
export function formatPercent(value, includeSign = false, precision = 1) {
  if (value === null || value === undefined || isNaN(value)) return '—';
  const num = Number(value);
  const sign = includeSign && num > 0 ? '+' : '';
  return `${sign}${num.toFixed(precision)}%`;
}

/**
 * Run deterministic GST policy simulation
 */
export async function runGstSimulation(params) {
  const payload = {
    current_rate: parseFloat(params.currentRate) || 18,
    proposed_rate: parseFloat(params.proposedRate) || 12,
    annual_turnover: (parseFloat(params.annualTurnoverCr) || 1000) * 1e7, // Convert Cr to Rupees
    compliance_rate: parseFloat(params.complianceRate ?? 85),
    demand_elasticity: parseFloat(params.demandElasticity ?? 0.20),
    effective_tax_base_factor: parseFloat(params.effectiveTaxBaseFactor ?? 0.80),
  };

  const response = await api.post('/api/gst/simulate', payload);
  return response.data;
}

/**
 * Fetch multi-bracket GST rate scenario comparisons
 */
export async function getGstScenarios(params) {
  const payload = {
    current_rate: parseFloat(params.currentRate) || 18,
    proposed_rate: parseFloat(params.proposedRate) || 12,
    annual_turnover: (parseFloat(params.annualTurnoverCr) || 1000) * 1e7,
    compliance_rate: parseFloat(params.complianceRate ?? 85),
    demand_elasticity: parseFloat(params.demandElasticity ?? 0.20),
    effective_tax_base_factor: parseFloat(params.effectiveTaxBaseFactor ?? 0.80),
  };

  const response = await api.post('/api/gst/scenarios', payload);
  return response.data;
}

/**
 * Execute Attack My GST Policy adverse stress testing
 */
export async function runGstStressTest(params) {
  const payload = {
    current_rate: parseFloat(params.currentRate) || 18,
    proposed_rate: parseFloat(params.proposedRate) || 12,
    annual_turnover: (parseFloat(params.annualTurnoverCr) || 1000) * 1e7,
    compliance_rate: parseFloat(params.complianceRate ?? 85),
    demand_elasticity: parseFloat(params.demandElasticity ?? 0.20),
    effective_tax_base_factor: parseFloat(params.effectiveTaxBaseFactor ?? 0.80),
  };

  const response = await api.post('/api/gst/stress-test', payload);
  return response.data;
}

/**
 * Calculate deterministic GST Policy Risk evaluation
 */
export async function getGstRisk(params) {
  const payload = {
    current_rate: parseFloat(params.currentRate) || 18,
    proposed_rate: parseFloat(params.proposedRate) || 12,
    annual_turnover: (parseFloat(params.annualTurnoverCr) || 1000) * 1e7,
    compliance_rate: parseFloat(params.complianceRate ?? 85),
    demand_elasticity: parseFloat(params.demandElasticity ?? 0.20),
    effective_tax_base_factor: parseFloat(params.effectiveTaxBaseFactor ?? 0.80),
  };

  const response = await api.post('/api/gst/risk', payload);
  return response.data;
}
