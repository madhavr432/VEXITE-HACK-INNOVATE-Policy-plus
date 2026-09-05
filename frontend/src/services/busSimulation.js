/**
 * Bus Simulation Service Interface (Commit 3)
 * 
 * Directly connected to FastAPI deterministic numerical simulation engine:
 * POST /api/bus/simulate
 */

import api from './api';
import { DEMO_SCENARIO_PRESETS } from '../data/bus/demoScenarios';

/**
 * Format currency in Indian Rupees (Lakhs)
 */
export function formatInrLakhs(val) {
  if (val === null || val === undefined) return '₹0L';
  const num = Number(val);
  const lakhs = (num / 100000).toFixed(1);
  return `₹${lakhs}L`;
}

/**
 * Format passenger count with 'K' suffix
 */
export function formatPaxK(val) {
  if (val === null || val === undefined) return '0K';
  const num = Number(val);
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return num.toLocaleString();
}

/**
 * Execute real deterministic simulation via FastAPI backend.
 *
 * @param {Object} params - Policy intervention parameters from form
 * @returns {Promise<Object>} Backend simulation response
 */
export async function runBusSimulation(params) {
  const payload = {
    current_fleet: parseInt(params.currentBuses, 10) || 100,
    fleet_increase_percent: parseFloat(params.fleetIncrease) || 0,
    daily_ridership: parseFloat(params.dailyPassengers) || 0,
    capacity_per_bus: parseInt(params.busCapacity, 10) || 50,
    average_ticket_price: parseFloat(params.ticketPrice) || 0,
    operating_cost_per_bus: parseFloat(params.costPerBus) || 0,
    trips_per_bus_per_day: parseFloat(params.tripsPerBusPerDay ?? 10.0),
    current_waiting_time_minutes: parseFloat(params.currentWaitingTime ?? 14.0),
    demand_elasticity: parseFloat(params.demandElasticity ?? 0.25),
  };

  const response = await api.post('/api/bus/simulate', payload);
  return response.data;
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
  formatInrLakhs,
  formatPaxK,
};
