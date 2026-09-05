"""
GST Policy Stress Testing & Attack Engine (Commit 8)

Deterministic adverse scenario modeling for GST policy evaluation.
Tests what happens when underlying behavioral demand elasticity or
taxpayer compliance assumptions deteriorate.

CRITICAL PRINCIPLES:
- Pure deterministic calculations (no random numbers, no ML, no Gemini)
- Reuses the core simulation engine (simulate_gst_policy) without formula duplication
- Centralized deterministic thresholds
- Illustrative scenario testing, NOT official government forecasts
"""

from typing import List, Dict, Any, Optional
from app.schemas.gst import (
    GSTSimulationRequest,
    GSTStressScenarioItem,
    GSTBreakingPoint,
    GSTStressSummary,
    GSTStressTestResponse,
)
from app.services.gst.simulation import simulate_gst_policy, percentage_change

# ============================================================================
# CENTRALIZED DETERMINISTIC THRESHOLDS & SCENARIOS
# ============================================================================

REVENUE_DETERIORATION_CRITICAL_PERCENT: float = 20.0  # >= 20% revenue drop vs baseline proposed
REVENUE_DETERIORATION_WARNING_PERCENT: float = 10.0   # >= 10% revenue drop vs baseline proposed
DEMAND_CONTRACTION_CRITICAL_PERCENT: float = 15.0     # >= 15% demand contraction
DEMAND_CONTRACTION_WARNING_PERCENT: float = 7.5       # >= 7.5% demand contraction

DEFAULT_GST_STRESS_SCENARIOS: List[Dict[str, Any]] = [
    {
        "id": "baseline",
        "name": "Baseline",
        "description": "Selected policy under current standard assumptions",
        "demand_elasticity_multiplier": 1.00,
        "compliance_multiplier": 1.00,
    },
    {
        "id": "higher_elasticity",
        "name": "Higher Demand Sensitivity",
        "description": "Taxable demand is more sensitive to rate changes (+25% elasticity)",
        "demand_elasticity_multiplier": 1.25,
        "compliance_multiplier": 1.00,
    },
    {
        "id": "much_higher_elasticity",
        "name": "Much Higher Demand Sensitivity",
        "description": "Substantial consumer substitution and demand contraction (+50% elasticity)",
        "demand_elasticity_multiplier": 1.50,
        "compliance_multiplier": 1.00,
    },
    {
        "id": "lower_compliance",
        "name": "Lower Compliance",
        "description": "Tax filing and reporting compliance drops by 10%",
        "demand_elasticity_multiplier": 1.00,
        "compliance_multiplier": 0.90,
    },
    {
        "id": "much_lower_compliance",
        "name": "Much Lower Compliance",
        "description": "Severe compliance leakage and informal avoidance (-20% compliance)",
        "demand_elasticity_multiplier": 1.00,
        "compliance_multiplier": 0.80,
    },
    {
        "id": "combined_adverse",
        "name": "Combined Adverse",
        "description": "Compounded stress: +50% demand elasticity and -20% compliance leakage",
        "demand_elasticity_multiplier": 1.50,
        "compliance_multiplier": 0.80,
    },
]


def evaluate_scenario_status(
    revenue_loss_percent: float,
    demand_change_percent: float,
) -> tuple[str, List[str]]:
    """
    Deterministically evaluate stability status (stable, warning, critical)
    based on centralized revenue and demand contraction thresholds.
    """
    reasons: List[str] = []
    is_critical = False
    is_warning = False

    # 1. Revenue deterioration evaluation
    if revenue_loss_percent >= REVENUE_DETERIORATION_CRITICAL_PERCENT:
        is_critical = True
        reasons.append(
            f"Severe revenue shortfall: {revenue_loss_percent:.1f}% below baseline proposed yield "
            f"(critical threshold: {REVENUE_DETERIORATION_CRITICAL_PERCENT:.0f}%)."
        )
    elif revenue_loss_percent >= REVENUE_DETERIORATION_WARNING_PERCENT:
        is_warning = True
        reasons.append(
            f"Moderate revenue shortfall: {revenue_loss_percent:.1f}% below baseline proposed yield "
            f"(warning threshold: {REVENUE_DETERIORATION_WARNING_PERCENT:.0f}%)."
        )

    # 2. Demand contraction evaluation
    demand_contraction = -demand_change_percent  # Positive value represents contraction
    if demand_contraction >= DEMAND_CONTRACTION_CRITICAL_PERCENT:
        is_critical = True
        reasons.append(
            f"Severe demand contraction: {demand_contraction:.1f}% contraction "
            f"(critical threshold: {DEMAND_CONTRACTION_CRITICAL_PERCENT:.0f}%)."
        )
    elif demand_contraction >= DEMAND_CONTRACTION_WARNING_PERCENT:
        is_warning = True
        reasons.append(
            f"Noticeable demand contraction: {demand_contraction:.1f}% contraction "
            f"(warning threshold: {DEMAND_CONTRACTION_WARNING_PERCENT:.1f}%)."
        )

    if is_critical:
        return "critical", reasons
    if is_warning:
        return "warning", reasons

    return "stable", ["Policy metrics remain within stable operational tolerances under tested conditions."]


def run_gst_stress_test(request: GSTSimulationRequest) -> GSTStressTestResponse:
    """
    Run deterministic GST policy stress tests against the user's selected policy.
    Evaluates adverse demand elasticity surges and compliance leakage scenarios.
    """
    # 1. Baseline simulation under un-stressed proposed policy
    baseline_sim = simulate_gst_policy(request)
    baseline_proposed_revenue = baseline_sim.proposed.gst_revenue

    stress_scenarios: List[GSTStressScenarioItem] = []
    breaking_point: Optional[GSTBreakingPoint] = None

    for config in DEFAULT_GST_STRESS_SCENARIOS:
        sc_id = config["id"]
        sc_name = config["name"]
        sc_desc = config["description"]
        elast_mult = config["demand_elasticity_multiplier"]
        comp_mult = config["compliance_multiplier"]

        effective_compliance = min(100.0, max(0.0, request.compliance_rate * comp_mult))
        effective_elasticity = max(0.0, request.demand_elasticity * elast_mult)

        # Execute simulation with stressed parameters
        stressed_request = GSTSimulationRequest(
            current_rate=request.current_rate,
            proposed_rate=request.proposed_rate,
            annual_turnover=request.annual_turnover,
            compliance_rate=round(effective_compliance, 4),
            demand_elasticity=round(effective_elasticity, 4),
            effective_tax_base_factor=request.effective_tax_base_factor,
        )
        sim_result = simulate_gst_policy(stressed_request)

        stress_revenue = sim_result.proposed.gst_revenue
        revenue_change_vs_proposed = stress_revenue - baseline_proposed_revenue
        revenue_change_pct_vs_proposed = percentage_change(stress_revenue, baseline_proposed_revenue)
        revenue_loss_pct = max(0.0, -revenue_change_pct_vs_proposed)

        status, status_reasons = evaluate_scenario_status(
            revenue_loss_percent=revenue_loss_pct,
            demand_change_percent=sim_result.impact.demand_change_percent,
        )

        item = GSTStressScenarioItem(
            id=sc_id,
            name=sc_name,
            description=sc_desc,
            demand_elasticity_multiplier=elast_mult,
            compliance_multiplier=comp_mult,
            effective_compliance_rate=round(effective_compliance, 2),
            effective_elasticity=round(effective_elasticity, 4),
            modeled_taxable_volume=sim_result.proposed.taxable_volume,
            modeled_gst_revenue=round(stress_revenue, 2),
            revenue_change_vs_proposed=round(revenue_change_vs_proposed, 2),
            revenue_change_percent_vs_proposed=round(revenue_change_pct_vs_proposed, 2),
            demand_response_percent=round(sim_result.impact.demand_change_percent, 2),
            status=status,
            status_reasons=status_reasons,
        )
        stress_scenarios.append(item)

        # Detect first breaking point (non-stable scenario, skipping baseline)
        if sc_id != "baseline" and status in ("warning", "critical") and breaking_point is None:
            breaking_point = GSTBreakingPoint(
                scenario_id=sc_id,
                scenario_name=sc_name,
                status=status,
                reason=status_reasons[0] if status_reasons else "Threshold breached",
                revenue_deterioration_percent=round(revenue_loss_pct, 2),
            )

    # Worst case scenario is the one with the lowest modeled GST revenue
    worst_case = min(stress_scenarios, key=lambda s: s.modeled_gst_revenue)

    # Compute summary counts
    stable_count = sum(1 for s in stress_scenarios if s.status == "stable")
    warning_count = sum(1 for s in stress_scenarios if s.status == "warning")
    critical_count = sum(1 for s in stress_scenarios if s.status == "critical")

    summary = GSTStressSummary(
        scenarios_tested=len(stress_scenarios),
        stable_scenarios=stable_count,
        warning_scenarios=warning_count,
        critical_scenarios=critical_count,
        policy_survives_all_tests=(warning_count + critical_count == 0),
    )

    return GSTStressTestResponse(
        proposed_rate=round(request.proposed_rate, 2),
        baseline_proposed_revenue=round(baseline_proposed_revenue, 2),
        stress_scenarios=stress_scenarios,
        breaking_point=breaking_point,
        worst_case=worst_case,
        summary=summary,
        assumptions={
            "baseline_compliance_rate": request.compliance_rate,
            "baseline_demand_elasticity": request.demand_elasticity,
            "effective_tax_base_factor": request.effective_tax_base_factor,
            "revenue_critical_threshold_percent": REVENUE_DETERIORATION_CRITICAL_PERCENT,
            "revenue_warning_threshold_percent": REVENUE_DETERIORATION_WARNING_PERCENT,
            "demand_critical_threshold_percent": DEMAND_CONTRACTION_CRITICAL_PERCENT,
            "demand_warning_threshold_percent": DEMAND_CONTRACTION_WARNING_PERCENT,
        },
    )
