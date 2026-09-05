"""
Deterministic GST Policy Risk Engine (Commit 8)

Translates validated GST simulation metrics and stress-testing outcomes into
a single deterministic Policy Risk Score (0-100), a four-dimensional risk breakdown,
ranked top risk drivers, and transparent rule-based diagnostic reasons.

Core Principles:
- Pure deterministic mathematics (no random numbers, no ML, no Gemini API).
- GST risk dimensions reflect indirect tax policy concerns:
    1. Revenue Risk (35%)
    2. Demand Risk (25%)
    3. Compliance Risk (20%)
    4. Policy Sensitivity Risk (20%)
- Strictly independent from Bus policy calculations.
- Centralized constants for weights, thresholds, and risk levels.
"""

from typing import List, Dict, Any, Tuple, Optional
from app.schemas.gst import (
    GSTSimulationRequest,
    GSTSimulationResponse,
    GSTStressTestResponse,
    GSTRiskComponentDetail,
    GSTRiskResponse,
)
from app.services.gst.simulation import simulate_gst_policy
from app.services.gst.stress_test import run_gst_stress_test

# ============================================================================
# CENTRALIZED DETERMINISTIC CONFIGURATION & THRESHOLDS
# ============================================================================

# Dimension Weights (strictly summing to 1.0)
REVENUE_WEIGHT: float = 0.35
DEMAND_WEIGHT: float = 0.25
COMPLIANCE_WEIGHT: float = 0.20
SENSITIVITY_WEIGHT: float = 0.20

assert round(REVENUE_WEIGHT + DEMAND_WEIGHT + COMPLIANCE_WEIGHT + SENSITIVITY_WEIGHT, 4) == 1.0, (
    "Risk dimension weights must sum to exactly 1.0"
)

# Risk Level Classification Thresholds
RISK_LEVEL_LOW_MAX: float = 29.0       # 0 - 29 -> Low Risk
RISK_LEVEL_MODERATE_MAX: float = 59.0  # 30 - 59 -> Moderate Risk
RISK_LEVEL_HIGH_MAX: float = 79.0      # 60 - 79 -> High Risk
# 80 - 100 -> Critical Risk


def classify_risk_level(score: float) -> Tuple[str, str]:
    """
    Deterministically convert a 0-100 score into a standardized risk level and label.
    0-29: Low Risk, 30-59: Moderate Risk, 60-79: High Risk, 80-100: Critical Risk.
    """
    rounded = round(score)
    if rounded <= RISK_LEVEL_LOW_MAX:
        return "low", "Low Risk"
    if rounded <= RISK_LEVEL_MODERATE_MAX:
        return "moderate", "Moderate Risk"
    if rounded <= RISK_LEVEL_HIGH_MAX:
        return "high", "High Risk"
    return "critical", "Critical Risk"


def calculate_revenue_risk(
    sim_result: GSTSimulationResponse,
    stress_result: Optional[GSTStressTestResponse] = None,
) -> Tuple[float, str, str, str]:
    """
    Dimension 1: Revenue Risk (0 to 100, weight: 35%).
    Evaluates fiscal yield contraction, revenue impact percentage, and adverse shortfall.
    """
    rev_impact_pct = sim_result.impact.revenue_impact_percent
    current_rev = sim_result.current.gst_revenue
    proposed_rev = sim_result.proposed.gst_revenue
    rev_delta = sim_result.impact.revenue_change

    metric_label = "Revenue Impact"
    metric_val = f"{rev_impact_pct:+.1f}% (₹{rev_delta:,.0f})"

    if rev_impact_pct < 0:
        # Fiscal contraction relative to baseline
        loss_pct = abs(rev_impact_pct)
        if loss_pct >= 30.0:
            score = min(100.0, 75.0 + (loss_pct - 30.0) * 2.5)
            reason = f"Severe fiscal contraction: Proposed rate causes a {loss_pct:.1f}% decline in modeled GST collections."
        elif loss_pct >= 15.0:
            score = 50.0 + (loss_pct - 15.0) * (25.0 / 15.0)
            reason = f"Moderate revenue contraction of {loss_pct:.1f}% requires budgetary offset or higher turnover."
        else:
            score = 25.0 + loss_pct * (25.0 / 15.0)
            reason = f"Minor fiscal contraction ({loss_pct:.1f}%), within manageable revenue variance bounds."
    else:
        # Revenue is neutral or expanding
        gain_pct = rev_impact_pct
        if gain_pct >= 20.0:
            score = 10.0
            reason = f"Strong revenue expansion (+{gain_pct:.1f}%) significantly bolsters fiscal intake."
        else:
            score = max(10.0, 25.0 - gain_pct * 0.75)
            reason = f"Positive fiscal intake (+{gain_pct:.1f}%) supports treasury collections."

    # Stress test worst case check
    if stress_result and stress_result.worst_case:
        worst_drop = stress_result.worst_case.revenue_change_percent_vs_proposed
        if worst_drop <= -25.0:
            score = min(100.0, score + 15.0)
            reason += f" Stress test flags deep revenue exposure ({worst_drop:.1f}%) under compounded adverse conditions."
        elif worst_drop <= -15.0:
            score = min(100.0, score + 8.0)
            reason += f" Stress test reveals moderate revenue sensitivity ({worst_drop:.1f}%) under adverse assumptions."

    score = max(0.0, min(100.0, score))
    return score, reason, metric_label, metric_val


def calculate_demand_risk(
    sim_result: GSTSimulationResponse,
    request: GSTSimulationRequest,
) -> Tuple[float, str, str, str]:
    """
    Dimension 2: Demand Risk (0 to 100, weight: 25%).
    Evaluates consumer price increase, demand contraction, and elasticity vulnerability.
    """
    demand_change = sim_result.impact.demand_change_percent
    metric_label = "Modeled Demand Response"
    metric_val = f"{demand_change:+.1f}%"

    if demand_change < 0:
        contraction = abs(demand_change)
        # Higher contraction = higher consumer resistance & volume loss
        if contraction >= 15.0:
            score = min(100.0, 75.0 + (contraction - 15.0) * 2.5)
            reason = (
                f"High consumer demand contraction ({contraction:.1f}%) driven by rate hike and "
                f"elasticity ({request.demand_elasticity:.2f}) risks depressing formal trade volume."
            )
        elif contraction >= 7.5:
            score = 50.0 + (contraction - 7.5) * (25.0 / 7.5)
            reason = (
                f"Noticeable demand contraction ({contraction:.1f}%) indicates consumer sensitivity "
                f"to modeled tax rate change."
            )
        else:
            score = 25.0 + contraction * (25.0 / 7.5)
            reason = f"Mild demand contraction ({contraction:.1f}%) suggests relatively price-inelastic demand."
    else:
        # Rate cut stimulates demand
        expansion = demand_change
        score = max(5.0, 20.0 - expansion * 1.5)
        reason = (
            f"Rate reduction yields {expansion:.1f}% modeled demand expansion, lowering consumer "
            f"price burden and encouraging compliance."
        )

    score = max(0.0, min(100.0, score))
    return score, reason, metric_label, metric_val


def calculate_compliance_risk(
    request: GSTSimulationRequest,
) -> Tuple[float, str, str, str]:
    """
    Dimension 3: Compliance Risk (0 to 100, weight: 20%).
    Evaluates baseline compliance rate assumption and rate-induced avoidance incentives.
    """
    comp_rate = request.compliance_rate
    metric_label = "Compliance Rate"
    metric_val = f"{comp_rate:.1f}%"

    leakage = 100.0 - comp_rate
    if leakage >= 40.0:
        score = min(100.0, 75.0 + (leakage - 40.0) * 1.25)
        reason = f"Low baseline compliance ({comp_rate:.1f}%) introduces severe revenue leakage and evasion vulnerability."
    elif leakage >= 20.0:
        score = 45.0 + (leakage - 20.0) * 1.5
        reason = f"Moderate non-compliance ({leakage:.1f}% gap) presents collection sensitivity under rate revisions."
    else:
        score = max(5.0, leakage * 2.25)
        reason = f"High baseline compliance ({comp_rate:.1f}%) provides a resilient taxpayer reporting foundation."

    # If proposed rate is high (e.g. > 20%), tax avoidance incentive increases
    if request.proposed_rate >= 28.0:
        score = min(100.0, score + 15.0)
        reason += f" Elevated proposed rate ({request.proposed_rate:.0f}%) heightens tax avoidance and classification disputes."
    elif request.proposed_rate > 20.0:
        score = min(100.0, score + 8.0)
        reason += f" Upper-bracket proposed rate ({request.proposed_rate:.0f}%) moderately escalates compliance risk."

    score = max(0.0, min(100.0, score))
    return score, reason, metric_label, metric_val


def calculate_sensitivity_risk(
    sim_result: GSTSimulationResponse,
    stress_result: GSTStressTestResponse,
) -> Tuple[float, str, str, str]:
    """
    Dimension 4: Policy Sensitivity Risk (0 to 100, weight: 20%).
    Evaluates how easily the policy's fiscal outcomes deteriorate when assumptions shift.
    """
    baseline_rev = sim_result.proposed.gst_revenue
    worst_rev = stress_result.worst_case.modeled_gst_revenue

    if baseline_rev > 0:
        adverse_drop_pct = max(0.0, ((baseline_rev - worst_rev) / baseline_rev) * 100.0)
    else:
        adverse_drop_pct = 0.0

    metric_label = "Worst Stress Shortfall"
    metric_val = f"-{adverse_drop_pct:.1f}%"

    if adverse_drop_pct >= 30.0:
        score = min(100.0, 75.0 + (adverse_drop_pct - 30.0) * 2.5)
        reason = (
            f"High policy sensitivity: Compounded adverse stress induces a {adverse_drop_pct:.1f}% "
            f"revenue drop below baseline expectations."
        )
    elif adverse_drop_pct >= 15.0:
        score = 45.0 + (adverse_drop_pct - 15.0) * 2.0
        reason = (
            f"Moderate sensitivity: Revenue deteriorates by {adverse_drop_pct:.1f}% when compliance "
            f"and demand elasticity assumptions worsen."
        )
    else:
        score = max(5.0, adverse_drop_pct * 3.0)
        reason = (
            f"Resilient policy design: Revenue variance remains restricted to {adverse_drop_pct:.1f}% "
            f"even under stressed assumption scenarios."
        )

    score = max(0.0, min(100.0, score))
    return score, reason, metric_label, metric_val


def calculate_gst_policy_risk(
    request: GSTSimulationRequest,
    simulation_result: Optional[GSTSimulationResponse] = None,
    stress_result: Optional[GSTStressTestResponse] = None,
) -> GSTRiskResponse:
    """
    Evaluate deterministic multi-dimensional policy risk for GST rate intervention.
    Calculates Revenue Risk (35%), Demand Risk (25%), Compliance Risk (20%),
    and Policy Sensitivity Risk (20%), yielding a composite score (0-100).
    """
    # Ensure underlying deterministic calculations are present
    if simulation_result is None:
        simulation_result = simulate_gst_policy(request)
    if stress_result is None:
        stress_result = run_gst_stress_test(request)

    # 1. Calculate the 4 dimensions
    rev_score, rev_reason, rev_label, rev_val = calculate_revenue_risk(simulation_result, stress_result)
    dem_score, dem_reason, dem_label, dem_val = calculate_demand_risk(simulation_result, request)
    comp_score, comp_reason, comp_label, comp_val = calculate_compliance_risk(request)
    sens_score, sens_reason, sens_label, sens_val = calculate_sensitivity_risk(simulation_result, stress_result)

    # 2. Build component details
    rev_level, rev_level_label = classify_risk_level(rev_score)
    dem_level, dem_level_label = classify_risk_level(dem_score)
    comp_level, comp_level_label = classify_risk_level(comp_score)
    sens_level, sens_level_label = classify_risk_level(sens_score)

    components: Dict[str, GSTRiskComponentDetail] = {
        "revenue": GSTRiskComponentDetail(
            name="Revenue Risk",
            dimension="revenue",
            score=round(rev_score, 1),
            weight=REVENUE_WEIGHT,
            weighted_score=round(rev_score * REVENUE_WEIGHT, 2),
            level=rev_level,
            level_label=rev_level_label,
            primary_reason=rev_reason,
            metric_label=rev_label,
            metric_value=rev_val,
        ),
        "demand": GSTRiskComponentDetail(
            name="Demand Risk",
            dimension="demand",
            score=round(dem_score, 1),
            weight=DEMAND_WEIGHT,
            weighted_score=round(dem_score * DEMAND_WEIGHT, 2),
            level=dem_level,
            level_label=dem_level_label,
            primary_reason=dem_reason,
            metric_label=dem_label,
            metric_value=dem_val,
        ),
        "compliance": GSTRiskComponentDetail(
            name="Compliance Risk",
            dimension="compliance",
            score=round(comp_score, 1),
            weight=COMPLIANCE_WEIGHT,
            weighted_score=round(comp_score * COMPLIANCE_WEIGHT, 2),
            level=comp_level,
            level_label=comp_level_label,
            primary_reason=comp_reason,
            metric_label=comp_label,
            metric_value=comp_val,
        ),
        "sensitivity": GSTRiskComponentDetail(
            name="Policy Sensitivity Risk",
            dimension="sensitivity",
            score=round(sens_score, 1),
            weight=SENSITIVITY_WEIGHT,
            weighted_score=round(sens_score * SENSITIVITY_WEIGHT, 2),
            level=sens_level,
            level_label=sens_level_label,
            primary_reason=sens_reason,
            metric_label=sens_label,
            metric_value=sens_val,
        ),
    }

    # 3. Aggregate composite risk score
    overall_float = (
        rev_score * REVENUE_WEIGHT
        + dem_score * DEMAND_WEIGHT
        + comp_score * COMPLIANCE_WEIGHT
        + sens_score * SENSITIVITY_WEIGHT
    )
    overall_score = int(round(max(0.0, min(100.0, overall_float))))
    overall_level, overall_level_label = classify_risk_level(overall_score)

    # 4. Identify top risk drivers sorted by weighted contribution descending
    sorted_comps = sorted(components.values(), key=lambda c: c.weighted_score, reverse=True)
    top_drivers = [c.name for c in sorted_comps if c.score >= 30.0]
    if not top_drivers:
        top_drivers = [sorted_comps[0].name]

    # Collect deterministic diagnostic reasons from components
    deterministic_reasons = [c.primary_reason for c in sorted_comps]

    # 5. Deterministic Policy Verdict
    if overall_score >= 80:
        policy_verdict = (
            f"CRITICAL RISK ({overall_score}/100): The proposed GST rate adjustment carries severe "
            f"fiscal or behavioral vulnerability. Primary exposures: {', '.join(top_drivers[:2])}. "
            f"Re-evaluating the proposed rate or strengthening compliance safeguards is strongly recommended."
        )
    elif overall_score >= 60:
        policy_verdict = (
            f"HIGH RISK ({overall_score}/100): The proposed rate shift introduces material sensitivity "
            f"in {top_drivers[0]}. Close monitoring of taxable transaction volumes and compliance will be essential."
        )
    elif overall_score >= 30:
        policy_verdict = (
            f"MODERATE RISK ({overall_score}/100): Balanced policy intervention within acceptable fiscal "
            f"tolerances. Primary consideration remains {top_drivers[0]} under adverse economic conditions."
        )
    else:
        policy_verdict = (
            f"LOW RISK ({overall_score}/100): Highly resilient policy configuration. Both fiscal revenue "
            f"intake and modeled demand response remain stable across tested scenarios."
        )

    return GSTRiskResponse(
        overall_score=overall_score,
        risk_level=overall_level,
        risk_level_label=overall_level_label,
        components=components,
        top_risk_drivers=top_drivers,
        deterministic_reasons=deterministic_reasons,
        policy_verdict=policy_verdict,
        proposed_rate=round(request.proposed_rate, 2),
        key_metrics={
            "revenue_impact_percent": simulation_result.impact.revenue_impact_percent,
            "demand_response_percent": simulation_result.impact.demand_change_percent,
            "current_gst_revenue": simulation_result.current.gst_revenue,
            "proposed_gst_revenue": simulation_result.proposed.gst_revenue,
            "breaking_point_scenario": stress_result.breaking_point.scenario_name if stress_result.breaking_point else "None",
            "worst_case_revenue": stress_result.worst_case.modeled_gst_revenue,
        },
        assumptions={
            "weights": {
                "revenue": REVENUE_WEIGHT,
                "demand": DEMAND_WEIGHT,
                "compliance": COMPLIANCE_WEIGHT,
                "sensitivity": SENSITIVITY_WEIGHT,
            },
            "disclaimer": "Illustrative policy simulation based on configurable assumptions, not an official government revenue forecast.",
        },
    )
