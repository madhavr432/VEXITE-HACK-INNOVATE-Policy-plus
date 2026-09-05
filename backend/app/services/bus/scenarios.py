"""
Multi-Scenario Generation Service for Bus Policy Analysis

Generates policy sensitivity outcomes across a range of fleet increase tiers
(0%, 5%, 10%, 15%, 20%, 25%, 30%, 40%, 50%) by executing the single source-of-truth
deterministic simulation engine (simulate_bus_policy) without formula duplication.
"""

from typing import List
from app.schemas.bus import (
    BusSimulationRequest,
    BusScenariosResponse,
    ScenarioItem,
    SelectedScenario,
)
from app.services.bus.simulation import simulate_bus_policy

DEFAULT_SCENARIO_TIERS: List[float] = [
    0.0,
    5.0,
    10.0,
    15.0,
    20.0,
    25.0,
    30.0,
    40.0,
    50.0,
]


def generate_bus_scenarios(
    request: BusSimulationRequest,
    tiers: List[float] = None,
) -> BusScenariosResponse:
    """
    Evaluate multiple fleet increase scenarios using the deterministic simulation engine.
    """
    scenario_tiers = tiers if tiers is not None else DEFAULT_SCENARIO_TIERS

    # 1. Simulate the specifically requested/selected policy
    selected_res = simulate_bus_policy(request)

    selected_scenario = SelectedScenario(
        fleet_increase_percent=request.fleet_increase_percent,
        fleet=selected_res.proposed.fleet,
        daily_ridership=selected_res.proposed.daily_ridership,
        daily_capacity=selected_res.proposed.daily_capacity,
        utilization_percent=selected_res.proposed.utilization_percent,
        waiting_time_minutes=selected_res.proposed.waiting_time_minutes,
        operating_cost=selected_res.proposed.operating_cost,
        revenue=selected_res.proposed.revenue,
        operating_surplus=selected_res.proposed.operating_surplus,
        emissions_kg=selected_res.proposed.emissions_kg,
        waiting_time_delta_percent=selected_res.impact.waiting_time_percent,
        ridership_delta_percent=selected_res.impact.ridership_percent,
        operating_cost_delta_percent=selected_res.impact.operating_cost_percent,
        surplus_delta_percent=selected_res.impact.operating_surplus_percent,
    )

    # 2. Iterate through standard scenario tiers
    scenarios_list: List[ScenarioItem] = []
    for tier in scenario_tiers:
        # Clone base request with the scenario tier fleet increase
        tier_request = request.model_copy(update={"fleet_increase_percent": tier})
        tier_res = simulate_bus_policy(tier_request)

        scenarios_list.append(
            ScenarioItem(
                fleet_increase_percent=tier,
                fleet=tier_res.proposed.fleet,
                daily_ridership=tier_res.proposed.daily_ridership,
                daily_capacity=tier_res.proposed.daily_capacity,
                utilization_percent=tier_res.proposed.utilization_percent,
                waiting_time_minutes=tier_res.proposed.waiting_time_minutes,
                operating_cost=tier_res.proposed.operating_cost,
                revenue=tier_res.proposed.revenue,
                operating_surplus=tier_res.proposed.operating_surplus,
                emissions_kg=tier_res.proposed.emissions_kg,
                waiting_time_delta_percent=tier_res.impact.waiting_time_percent,
                ridership_delta_percent=tier_res.impact.ridership_percent,
                operating_cost_delta_percent=tier_res.impact.operating_cost_percent,
                surplus_delta_percent=tier_res.impact.operating_surplus_percent,
            )
        )

    return BusScenariosResponse(
        base_fleet=request.current_fleet,
        current=selected_res.current,
        selected_scenario=selected_scenario,
        scenarios=scenarios_list,
        assumptions=selected_res.assumptions,
    )
