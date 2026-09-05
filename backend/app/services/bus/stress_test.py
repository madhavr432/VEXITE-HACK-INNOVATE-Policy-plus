"""
Deterministic Bus Policy Stress Testing & Attack Service (Commit 5)

Evaluates the user's selected policy intervention under predefined adverse
demand surge and operating cost inflation multipliers to discover where policy
assumptions break down.

Guiding Principles:
- Pure deterministic calculations (no random numbers, no ML, no Gemini)
- Reuses the core simulation engine (simulate_bus_policy) without formula duplication
- Avoids double-elasticity by modifying baseline input ridership before simulation
- Evaluates rule-based status flags: stable, warning, critical
- Determines breaking point within tested scenarios
"""

from typing import List, Dict, Any, Optional
from app.schemas.bus import (
    BusSimulationRequest,
    SimulationMetrics,
    PolicyOverview,
    StressScenarioItem,
    CaseScenarioResult,
    BreakingPoint,
    AttackSummary,
    StressTestAssumptions,
    BusStressTestResponse,
)
from app.services.bus.simulation import simulate_bus_policy, percentage_change

# ============================================================================
# CONFIGURABLE DETERMINISTIC CONSTANTS & THRESHOLDS
# ============================================================================

# Predefined Adverse Stress Scenarios (Deterministic Multipliers)
DEFAULT_STRESS_SCENARIOS: List[Dict[str, Any]] = [
    {
        "id": "baseline",
        "name": "Baseline",
        "description": "Selected policy under current standard assumptions",
        "demand_multiplier": 1.00,
        "cost_multiplier": 1.00,
    },
    {
        "id": "high_demand",
        "name": "High Demand",
        "description": "Commuter demand surge (+10%)",
        "demand_multiplier": 1.10,
        "cost_multiplier": 1.00,
    },
    {
        "id": "very_high_demand",
        "name": "Very High Demand",
        "description": "Substantial commuter demand surge (+20%)",
        "demand_multiplier": 1.20,
        "cost_multiplier": 1.00,
    },
    {
        "id": "extreme_demand",
        "name": "Extreme Demand",
        "description": "Peak network congestion surge (+30%)",
        "demand_multiplier": 1.30,
        "cost_multiplier": 1.00,
    },
    {
        "id": "high_cost",
        "name": "High Operating Cost",
        "description": "Depot operating and fuel expenditure inflation (+10%)",
        "demand_multiplier": 1.00,
        "cost_multiplier": 1.10,
    },
    {
        "id": "very_high_cost",
        "name": "Very High Operating Cost",
        "description": "Severe depot maintenance and wage inflation (+20%)",
        "demand_multiplier": 1.00,
        "cost_multiplier": 1.20,
    },
    {
        "id": "combined_adverse",
        "name": "Combined Adverse",
        "description": "Compounded stress: Demand surge (+25%) and cost inflation (+20%)",
        "demand_multiplier": 1.25,
        "cost_multiplier": 1.20,
    },
]

# Best / Expected / Worst Case Multipliers
CASE_CONFIGS: Dict[str, Dict[str, Any]] = {
    "best": {
        "case_type": "best",
        "name": "Best Case",
        "description": "Favorable conditions: Demand +5%, Operating cost -10%",
        "demand_multiplier": 1.05,
        "cost_multiplier": 0.90,
    },
    "expected": {
        "case_type": "expected",
        "name": "Expected Case",
        "description": "Selected policy under standard baseline assumptions",
        "demand_multiplier": 1.00,
        "cost_multiplier": 1.00,
    },
    "worst": {
        "case_type": "worst",
        "name": "Worst Tested Case",
        "description": "Strongest tested adverse scenario: Demand +25%, Operating cost +20%",
        "demand_multiplier": 1.25,
        "cost_multiplier": 1.20,
    },
}

# Deterministic Policy Breakdown Thresholds
CRITICAL_SURPLUS_THRESHOLD: float = 0.0
WARNING_SURPLUS_RATIO: float = 0.5  # Surplus falls below 50% of expected case surplus
CRITICAL_UTILIZATION_THRESHOLD: float = 100.0  # Fleet capacity exceeded
WARNING_UTILIZATION_THRESHOLD: float = 90.0   # Fleet operating near maximum capacity
CRITICAL_WAIT_TIME_INCREASE_PERCENT: float = 25.0  # Waiting time degradation > 25%
WARNING_WAIT_TIME_INCREASE_PERCENT: float = 10.0   # Waiting time degradation > 10%


def evaluate_scenario_status(
    proposed_metrics: SimulationMetrics,
    expected_metrics: SimulationMetrics,
) -> tuple[str, List[str]]:
    """
    Deterministically evaluate the health status (stable, warning, critical)
    and specific breakdown reasons for a stressed scenario.
    """
    reasons: List[str] = []
    status = "stable"

    surplus = proposed_metrics.operating_surplus
    expected_surplus = expected_metrics.operating_surplus
    utilization = proposed_metrics.utilization_percent
    wait_time = proposed_metrics.waiting_time_minutes
    expected_wait_time = expected_metrics.waiting_time_minutes

    wait_time_delta_percent = percentage_change(expected_wait_time, wait_time)

    # 1. Critical Rule Checks (Any critical condition sets status = "critical")
    is_critical = False

    # Financial critical check: Operating surplus < 0
    if surplus < CRITICAL_SURPLUS_THRESHOLD:
        is_critical = True
        reasons.append("Operating surplus became negative")

    # Capacity critical check: Utilization > 100%
    if utilization > CRITICAL_UTILIZATION_THRESHOLD:
        is_critical = True
        reasons.append(f"Fleet capacity exceeded certified limit ({utilization:.1f}%)")

    # Waiting time critical check: Waiting time increase > 25%
    if wait_time_delta_percent > CRITICAL_WAIT_TIME_INCREASE_PERCENT:
        is_critical = True
        reasons.append(f"Commuter waiting time degraded severely (+{wait_time_delta_percent:.1f}%)")


    if is_critical:
        return "critical", reasons

    # 2. Warning Rule Checks (Triggered only if not critical)
    is_warning = False

    # Financial warning check: Surplus dropped by > 50% vs expected
    if expected_surplus > 0 and surplus < (expected_surplus * WARNING_SURPLUS_RATIO):
        is_warning = True
        reasons.append("Operating surplus declined significantly (>50% reduction)")

    # Capacity warning check: Utilization > 90%
    if utilization > WARNING_UTILIZATION_THRESHOLD:
        is_warning = True
        reasons.append(f"Fleet operating near maximum certified capacity ({utilization:.1f}% load factor)")

    # Waiting time warning check: Waiting time increase > 10%
    if wait_time_delta_percent > WARNING_WAIT_TIME_INCREASE_PERCENT:
        is_warning = True
        reasons.append(f"Commuter waiting time increased noticeably (+{wait_time_delta_percent:.1f}%)")

    if is_warning:
        return "warning", reasons

    return "stable", reasons


def run_bus_stress_test(
    request: BusSimulationRequest,
    scenarios_config: Optional[List[Dict[str, Any]]] = None,
) -> BusStressTestResponse:
    """
    Execute deterministic attack testing against the user's selected policy.
    
    The workflow:
    1. Simulate the selected policy under normal assumptions (Expected Case).
    2. Simulate Best Case and Worst Tested Case.
    3. Evaluate all predefined adverse stress scenarios.
    4. Deterministically classify each scenario: stable, warning, critical.
    5. Identify the breaking point within tested scenarios.
    6. Return complete structured response for explainable decision support.
    """
    scenario_defs = scenarios_config if scenarios_config is not None else DEFAULT_STRESS_SCENARIOS

    # 1. Expected Case (Normal simulation of selected policy)
    expected_sim = simulate_bus_policy(request)
    baseline_metrics = expected_sim.current
    expected_proposed_metrics = expected_sim.proposed

    expected_case = CaseScenarioResult(
        case_type="expected",
        name=CASE_CONFIGS["expected"]["name"],
        description=CASE_CONFIGS["expected"]["description"],
        demand_multiplier=1.00,
        cost_multiplier=1.00,
        results=expected_proposed_metrics,
        impact_vs_baseline=expected_sim.impact,
    )

    # 2. Best Case Simulation
    # Stressed baseline ridership = BaseRidership * 1.05
    # Stressed operating cost = BaseCost * 0.90
    best_config = CASE_CONFIGS["best"]
    best_request = request.model_copy(update={
        "daily_ridership": round(request.daily_ridership * best_config["demand_multiplier"]),
        "operating_cost_per_bus": round(request.operating_cost_per_bus * best_config["cost_multiplier"], 2),
    })
    best_sim = simulate_bus_policy(best_request)
    best_case = CaseScenarioResult(
        case_type="best",
        name=best_config["name"],
        description=best_config["description"],
        demand_multiplier=best_config["demand_multiplier"],
        cost_multiplier=best_config["cost_multiplier"],
        results=best_sim.proposed,
        impact_vs_baseline=best_sim.impact,
    )

    # 3. Worst Tested Case Simulation
    # Stressed baseline ridership = BaseRidership * 1.25
    # Stressed operating cost = BaseCost * 1.20
    worst_config = CASE_CONFIGS["worst"]
    worst_request = request.model_copy(update={
        "daily_ridership": round(request.daily_ridership * worst_config["demand_multiplier"]),
        "operating_cost_per_bus": round(request.operating_cost_per_bus * worst_config["cost_multiplier"], 2),
    })
    worst_sim = simulate_bus_policy(worst_request)
    worst_case = CaseScenarioResult(
        case_type="worst",
        name=worst_config["name"],
        description=worst_config["description"],
        demand_multiplier=worst_config["demand_multiplier"],
        cost_multiplier=worst_config["cost_multiplier"],
        results=worst_sim.proposed,
        impact_vs_baseline=worst_sim.impact,
    )

    # 4. Evaluate Stressed Scenarios
    stress_results: List[StressScenarioItem] = []
    stable_count = 0
    warning_count = 0
    critical_count = 0

    first_critical_scenario: Optional[StressScenarioItem] = None
    first_warning_scenario: Optional[StressScenarioItem] = None

    for sc in scenario_defs:
        d_mult = sc["demand_multiplier"]
        c_mult = sc["cost_multiplier"]

        # Apply stress conditions to baseline inputs:
        # Important: Stressed baseline demand becomes the input demand to simulate_bus_policy.
        # This ensures elasticity is applied once and not compounded incorrectly.
        stressed_ridership_input = round(request.daily_ridership * d_mult)
        stressed_cost_input = round(request.operating_cost_per_bus * c_mult, 2)

        stressed_req = request.model_copy(update={
            "daily_ridership": stressed_ridership_input,
            "operating_cost_per_bus": stressed_cost_input,
        })
        sc_sim = simulate_bus_policy(stressed_req)
        sc_proposed = sc_sim.proposed

        # Evaluate deterministic status
        status, reasons = evaluate_scenario_status(sc_proposed, expected_proposed_metrics)

        if status == "critical":
            critical_count += 1
        elif status == "warning":
            warning_count += 1
        else:
            stable_count += 1

        waiting_time_delta = percentage_change(
            expected_proposed_metrics.waiting_time_minutes,
            sc_proposed.waiting_time_minutes,
        )
        cost_delta = percentage_change(
            expected_proposed_metrics.operating_cost,
            sc_proposed.operating_cost,
        )
        surplus_delta = percentage_change(
            expected_proposed_metrics.operating_surplus,
            sc_proposed.operating_surplus,
        )

        item = StressScenarioItem(
            id=sc["id"],
            name=sc["name"],
            description=sc["description"],
            demand_multiplier=d_mult,
            cost_multiplier=c_mult,
            results=sc_proposed,
            status=status,
            status_reasons=reasons,
            waiting_time_delta_percent=waiting_time_delta,
            operating_cost_delta_percent=cost_delta,
            surplus_delta_percent=surplus_delta,
        )
        stress_results.append(item)

        # Track first critical / warning for breaking point discovery
        if status == "critical" and first_critical_scenario is None:
            first_critical_scenario = item
        elif status == "warning" and first_warning_scenario is None:
            first_warning_scenario = item

    # 5. Determine Breaking Point within tested scenarios
    # First priority: first critical scenario; Secondary: first warning scenario if no critical
    breaking_point: Optional[BreakingPoint] = None
    if first_critical_scenario is not None:
        breaking_point = BreakingPoint(
            scenario_id=first_critical_scenario.id,
            scenario_name=first_critical_scenario.name,
            status="critical",
            demand_multiplier=first_critical_scenario.demand_multiplier,
            cost_multiplier=first_critical_scenario.cost_multiplier,
            reason=first_critical_scenario.status_reasons[0] if first_critical_scenario.status_reasons else "Critical policy breakdown threshold reached",
        )
    elif first_warning_scenario is not None:
        breaking_point = BreakingPoint(
            scenario_id=first_warning_scenario.id,
            scenario_name=first_warning_scenario.name,
            status="warning",
            demand_multiplier=first_warning_scenario.demand_multiplier,
            cost_multiplier=first_warning_scenario.cost_multiplier,
            reason=first_warning_scenario.status_reasons[0] if first_warning_scenario.status_reasons else "Policy warning threshold exceeded",
        )

    # 6. Attack Summary
    total_tested = len(stress_results)
    attack_summary = AttackSummary(
        scenarios_tested=total_tested,
        stable_scenarios=stable_count,
        warning_scenarios=warning_count,
        critical_scenarios=critical_count,
        policy_survives_all_tests=(critical_count == 0 and warning_count == 0),
    )

    # 7. Stress Assumptions Audit
    assumptions_audit = StressTestAssumptions(
        demand_scenarios=["+10%", "+20%", "+30%", "+25% (combined)"],
        cost_scenarios=["+10%", "+20%"],
        best_case={"demand_multiplier": 1.05, "cost_multiplier": 0.90},
        expected_case={"demand_multiplier": 1.00, "cost_multiplier": 1.00},
        worst_case={"demand_multiplier": 1.25, "cost_multiplier": 1.20},
        thresholds={
            "critical_surplus": CRITICAL_SURPLUS_THRESHOLD,
            "warning_surplus_ratio": WARNING_SURPLUS_RATIO,
            "critical_utilization": CRITICAL_UTILIZATION_THRESHOLD,
            "warning_utilization": WARNING_UTILIZATION_THRESHOLD,
            "critical_wait_time_increase": CRITICAL_WAIT_TIME_INCREASE_PERCENT,
            "warning_wait_time_increase": WARNING_WAIT_TIME_INCREASE_PERCENT,
        },
    )

    return BusStressTestResponse(
        selected_policy=PolicyOverview(
            current_fleet=request.current_fleet,
            fleet_increase_percent=request.fleet_increase_percent,
            proposed_fleet=expected_sim.proposed.fleet,
        ),
        baseline=baseline_metrics,
        best_case=best_case,
        expected_case=expected_case,
        worst_case=worst_case,
        stress_scenarios=stress_results,
        breaking_point=breaking_point,
        attack_summary=attack_summary,
        assumptions=assumptions_audit,
    )
