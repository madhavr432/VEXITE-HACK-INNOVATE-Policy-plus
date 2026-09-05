"""
GST Policy Scenario Comparison Service (Commit 8)

Generates deterministic scenario analyses across rate tiers (e.g., 0%, 5%, 8%,
12%, 15%, 18%, 20%, 25%, 28%) while always including the current baseline and
the user's proposed rate tier.
"""

from typing import List
from app.schemas.gst import (
    GSTSimulationRequest,
    GSTScenarioItem,
    GSTScenarioResponse,
)
from app.services.gst.simulation import simulate_gst_policy

DEFAULT_GST_RATE_TIERS: List[float] = [
    0.0,
    5.0,
    8.0,
    12.0,
    15.0,
    18.0,
    20.0,
    25.0,
    28.0,
]


def generate_gst_scenarios(request: GSTSimulationRequest) -> GSTScenarioResponse:
    """
    Generate multi-bracket GST policy scenarios comparing modeled revenue and demand.
    Always includes the user's specific proposed rate and current baseline rate.
    """
    sim_baseline = simulate_gst_policy(request)

    # Collect unique rate tiers including current and proposed
    rates_set = set(DEFAULT_GST_RATE_TIERS)
    rates_set.add(round(request.current_rate, 2))
    rates_set.add(round(request.proposed_rate, 2))
    sorted_rates = sorted(list(rates_set))

    scenarios: List[GSTScenarioItem] = []
    selected_scenario: GSTScenarioItem = None

    for rate in sorted_rates:
        scenario_req = GSTSimulationRequest(
            current_rate=request.current_rate,
            proposed_rate=rate,
            annual_turnover=request.annual_turnover,
            compliance_rate=request.compliance_rate,
            demand_elasticity=request.demand_elasticity,
            effective_tax_base_factor=request.effective_tax_base_factor,
        )
        sim = simulate_gst_policy(scenario_req)

        is_curr = abs(rate - request.current_rate) < 1e-4
        is_prop = abs(rate - request.proposed_rate) < 1e-4

        item = GSTScenarioItem(
            gst_rate=round(rate, 2),
            is_current=is_curr,
            is_proposed=is_prop,
            modeled_taxable_volume=sim.proposed.taxable_volume,
            modeled_gst_revenue=sim.proposed.gst_revenue,
            revenue_change=sim.impact.revenue_change,
            revenue_change_percent=sim.impact.revenue_impact_percent,
            demand_response_percent=sim.impact.demand_change_percent,
            modeled_consumer_tax_impact=sim.impact.modeled_consumer_tax_impact,
        )
        scenarios.append(item)

        if is_prop:
            selected_scenario = item

    # Fallback in case of rounding difference
    if not selected_scenario:
        selected_scenario = scenarios[0]

    return GSTScenarioResponse(
        current_rate=round(request.current_rate, 2),
        proposed_rate=round(request.proposed_rate, 2),
        current=sim_baseline.current,
        selected_scenario=selected_scenario,
        scenarios=scenarios,
        assumptions=sim_baseline.assumptions,
    )
