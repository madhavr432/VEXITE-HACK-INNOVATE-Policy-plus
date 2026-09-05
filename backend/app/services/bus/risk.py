"""
Deterministic Bus Policy Risk Engine (Commit 6)

Translates validated policy metrics and stress-testing results into a single
deterministic Policy Risk Score (0-100), four-dimensional risk breakdown,
ranked top risk drivers, and transparent rule-based diagnostic reasons.

Core Principles:
- Pure deterministic mathematics (no random numbers, no ML, no Gemini API).
- Reuses the existing Bus Simulation Engine and Stress Testing Engine as the
  single source of truth.
- Interprets measurable outcomes without formula duplication.
- Centralized constants for weights, thresholds, and risk levels.
- Designed to be directly consumable by downstream AI policy interpretation (Commit 7).
"""

from typing import List, Dict, Any, Optional, Tuple
from app.schemas.bus import (
    BusSimulationRequest,
    BusSimulationResponse,
    BusStressTestResponse,
    SimulationMetrics,
    PolicyOverview,
    RiskComponentDetail,
    BusRiskResponse,
)
from app.services.bus.simulation import simulate_bus_policy
from app.services.bus.stress_test import run_bus_stress_test


# ============================================================================
# CENTRALIZED DETERMINISTIC CONFIGURATION & THRESHOLDS
# ============================================================================

# Dimension Weights (strictly summing to 1.0)
FINANCIAL_WEIGHT: float = 0.30
CAPACITY_WEIGHT: float = 0.25
DEMAND_WEIGHT: float = 0.20
UTILIZATION_WEIGHT: float = 0.25

assert round(FINANCIAL_WEIGHT + CAPACITY_WEIGHT + DEMAND_WEIGHT + UTILIZATION_WEIGHT, 4) == 1.0, (
    "Risk dimension weights must sum to exactly 1.0"
)

# Risk Level Classification Thresholds
RISK_LEVEL_LOW_MAX: float = 29.0       # 0 - 29 -> Low Risk
RISK_LEVEL_MODERATE_MAX: float = 59.0  # 30 - 59 -> Moderate Risk
RISK_LEVEL_HIGH_MAX: float = 79.0      # 60 - 79 -> High Risk
# 80 - 100 -> Critical Risk

# 1. Financial Risk Thresholds
SURPLUS_CRITICAL_THRESHOLD: float = 0.0          # Operating surplus <= 0 is deficit (100 risk)
SURPLUS_MARGIN_WARNING_PERCENT: float = 5.0      # Operating margin < 5% is warning (60-95 risk)
SURPLUS_MARGIN_HEALTHY_PERCENT: float = 15.0     # Operating margin >= 15% is healthy (5-29 risk)

# 2. Capacity Risk Thresholds
CAPACITY_LOW_THRESHOLD: float = 70.0             # <= 70% utilization -> low risk (5-25)
CAPACITY_WARNING_THRESHOLD: float = 85.0         # 70-85% utilization -> moderate risk (30-59)
CAPACITY_CRITICAL_THRESHOLD: float = 100.0       # 85-100% -> high risk (60-99); >100% -> 100 critical


def classify_risk_level(score: float) -> Tuple[str, str]:
    """
    Deterministically convert a 0-100 score into a standardized risk level and label.
    Rounds to nearest whole integer to match UI display ranges:
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


def calculate_financial_risk(
    proposed_metrics: SimulationMetrics,
    worst_case_metrics: Optional[SimulationMetrics] = None,
) -> Tuple[float, str, str, str]:
    """
    Dimension 1: Financial Risk (0 to 100).
    Evaluates operating surplus, operating margin ratio, and adverse deficit occurrence.
    """
    surplus = proposed_metrics.operating_surplus
    revenue = proposed_metrics.revenue

    metric_label = "Operating Surplus"
    metric_val_str = f"₹{surplus / 100000:.1f}L/day"

    # Deficit check
    if surplus <= SURPLUS_CRITICAL_THRESHOLD:
        score = 100.0
        reason = f"Operating deficit of ₹{abs(surplus):,.0f}/day results in maximum financial exposure."
        return score, reason, metric_label, metric_val_str

    # Margin check
    margin_pct = (surplus / revenue * 100.0) if revenue > 0 else 0.0

    if margin_pct < SURPLUS_MARGIN_WARNING_PERCENT:
        # Scale between 60.0 and 95.0
        ratio = max(0.0, min(1.0, margin_pct / SURPLUS_MARGIN_WARNING_PERCENT))
        score = 95.0 - ratio * 35.0
        reason = f"Thin operating margin ({margin_pct:.1f}%) leaves minimal cushion against cost inflation."
    elif margin_pct < SURPLUS_MARGIN_HEALTHY_PERCENT:
        # Scale between 30.0 and 59.0
        ratio = (margin_pct - SURPLUS_MARGIN_WARNING_PERCENT) / (
            SURPLUS_MARGIN_HEALTHY_PERCENT - SURPLUS_MARGIN_WARNING_PERCENT
        )
        score = 59.0 - ratio * 29.0
        reason = f"Moderate operating margin ({margin_pct:.1f}%) provides fair baseline stability."
    else:
        # Scale between 5.0 and 25.0
        ratio = min(1.0, (margin_pct - SURPLUS_MARGIN_HEALTHY_PERCENT) / 15.0)
        score = max(5.0, 25.0 - ratio * 20.0)
        reason = f"Robust operating margin ({margin_pct:.1f}%) provides a strong financial buffer."

    # Stress adjustment: Does the worst tested case drop into deficit?
    if worst_case_metrics and worst_case_metrics.operating_surplus < 0:
        score = min(95.0, score + 15.0)
        reason += f" Enters operating deficit (₹{abs(worst_case_metrics.operating_surplus):,.0f}/day) under tested adverse conditions."

    return round(score, 1), reason, metric_label, metric_val_str


def calculate_capacity_risk(
    proposed_metrics: SimulationMetrics,
) -> Tuple[float, str, str, str]:
    """
    Dimension 2: Capacity Risk (0 to 100).
    Evaluates baseline proposed vehicle occupancy against physical capacity limits.
    """
    utilization = proposed_metrics.utilization_percent
    metric_label = "Baseline Utilization"
    metric_val_str = f"{utilization:.1f}%"

    if utilization > CAPACITY_CRITICAL_THRESHOLD:
        score = 100.0
        reason = f"Capacity exceeded ({utilization:.1f}%), causing acute commuter overcrowding and unserved demand."
    elif utilization >= CAPACITY_WARNING_THRESHOLD:
        # Scale between 60.0 and 99.0
        ratio = (utilization - CAPACITY_WARNING_THRESHOLD) / (
            CAPACITY_CRITICAL_THRESHOLD - CAPACITY_WARNING_THRESHOLD
        )
        score = 60.0 + ratio * 39.0
        reason = f"High utilization ({utilization:.1f}%) operates uncomfortably close to maximum passenger capacity."
    elif utilization >= CAPACITY_LOW_THRESHOLD:
        # Scale between 30.0 and 59.0
        ratio = (utilization - CAPACITY_LOW_THRESHOLD) / (
            CAPACITY_WARNING_THRESHOLD - CAPACITY_LOW_THRESHOLD
        )
        score = 30.0 + ratio * 29.0
        reason = f"Manageable utilization ({utilization:.1f}%) maintains balanced vehicle capacity."
    else:
        # Scale between 5.0 and 25.0
        ratio = max(0.0, utilization / CAPACITY_LOW_THRESHOLD)
        score = max(5.0, ratio * 25.0)
        reason = f"Comfortable utilization ({utilization:.1f}%) leaves substantial reserve capacity."

    return round(score, 1), reason, metric_label, metric_val_str


def calculate_demand_risk(
    stress_test_result: BusStressTestResponse,
) -> Tuple[float, str, str, str]:
    """
    Dimension 3: Demand Risk (0 to 100).
    Evaluates policy degradation under tested commuter demand surges (+10%, +20%, +30%, +25% combined).
    """
    scenario_map = {s.id: s for s in stress_test_result.stress_scenarios}

    high_demand_status = scenario_map.get("high_demand", None)
    very_high_demand_status = scenario_map.get("very_high_demand", None)
    extreme_demand_status = scenario_map.get("extreme_demand", None)
    combined_adverse_status = scenario_map.get("combined_adverse", None)

    # Check status flags in order of severity
    if high_demand_status and high_demand_status.status == "critical":
        score = 95.0
        reason = "System enters critical breakdown under a mild +10% demand surge, indicating high demand fragility."
        metric_val_str = "+10% Demand Critical"
    elif very_high_demand_status and very_high_demand_status.status == "critical":
        score = 80.0
        reason = "System withstands mild growth but breaches critical stability under moderate +20% demand surge."
        metric_val_str = "+20% Demand Critical"
    elif extreme_demand_status and extreme_demand_status.status == "critical":
        score = 65.0
        reason = "System withstands regular growth but breaches critical limits under peak +30% demand congestion."
        metric_val_str = "+30% Demand Critical"
    elif combined_adverse_status and combined_adverse_status.status == "critical":
        score = 55.0
        reason = "System withstands standalone demand growth, but becomes critical under combined demand (+25%) and cost shocks."
        metric_val_str = "Combined Adverse Critical"
    elif any(
        s.status == "warning"
        for s in [high_demand_status, very_high_demand_status, extreme_demand_status, combined_adverse_status]
        if s is not None
    ):
        score = 40.0
        reason = "Tested demand surges trigger warning-level service degradation without reaching outright failure."
        metric_val_str = "Warning Under Surge"
    else:
        score = 15.0
        reason = "Policy absorbs all tested demand surges (+10% to +30%) while preserving operational stability."
        metric_val_str = "Stable Under Surge"

    metric_label = "Demand Sensitivity"
    return round(score, 1), reason, metric_label, metric_val_str


def calculate_utilization_risk(
    proposed_metrics: SimulationMetrics,
    stress_test_result: BusStressTestResponse,
) -> Tuple[float, str, str, str]:
    """
    Dimension 4: Utilization Risk (0 to 100).
    Evaluates vehicle occupancy deterioration across baseline, high-demand (+10%),
    and extreme-demand (+30%) stress conditions.
    """
    normal_util = proposed_metrics.utilization_percent

    scenario_map = {s.id: s for s in stress_test_result.stress_scenarios}
    high_sc = scenario_map.get("high_demand")
    extreme_sc = scenario_map.get("extreme_demand")

    high_util = high_sc.results.utilization_percent if high_sc else normal_util * 1.10
    extreme_util = extreme_sc.results.utilization_percent if extreme_sc else normal_util * 1.30

    metric_label = "Peak Stressed Utilization"
    metric_val_str = f"{extreme_util:.1f}%"

    if normal_util > 100.0:
        score = 100.0
        reason = f"Normal fleet utilization already exceeds 100% ({normal_util:.1f}%), leaving zero operational headroom."
    elif high_util > 100.0:
        score = 90.0
        reason = f"Fleet utilization exceeds capacity ({high_util:.1f}%) under a mild +10% demand increase."
    elif extreme_util > 100.0:
        score = 75.0
        reason = f"Fleet utilization exceeds 100% capacity ({extreme_util:.1f}%) under peak +30% demand congestion."
    elif extreme_util >= 90.0:
        score = 55.0
        reason = f"Peak stressed utilization approaches limits ({extreme_util:.1f}%), leaving narrow operational buffer."
    elif extreme_util >= 80.0:
        score = 35.0
        reason = f"Peak stressed utilization reaches {extreme_util:.1f}%, preserving a moderate operating buffer."
    else:
        ratio = max(0.0, extreme_util / 80.0)
        score = max(5.0, ratio * 20.0)
        reason = f"Comfortable utilization headroom ({extreme_util:.1f}%) maintained across all tested adverse conditions."

    return round(score, 1), reason, metric_label, metric_val_str


def generate_policy_verdict(
    overall_score: int,
    risk_level: str,
    top_drivers: List[str],
    components: Dict[str, RiskComponentDetail],
    fleet_increase_percent: float,
) -> str:
    """
    Generate a concise deterministic policy verdict from verified mathematical facts.
    Does NOT call Gemini or use free-form AI text.
    """
    top_driver_name = components[top_drivers[0]].name if top_drivers else "Operational risk"
    second_driver_name = components[top_drivers[1]].name if len(top_drivers) > 1 else None

    if risk_level == "critical":
        verdict = (
            f"The proposed policy (+{fleet_increase_percent:.0f}% fleet) is in a critical exposure state "
            f"primarily driven by {top_driver_name}"
            + (f" and {second_driver_name}." if second_driver_name else ".")
            + " Operational or financial viability thresholds are breached under tested conditions. "
            "Policy adjustments are strongly recommended before deployment."
        )
    elif risk_level == "high":
        verdict = (
            f"The proposed policy (+{fleet_increase_percent:.0f}% fleet) operates under standard conditions "
            f"but faces elevated exposure under stress, with {top_driver_name} as the primary vulnerability. "
            "Precautionary buffers or contingency funding should be established."
        )
    elif risk_level == "moderate":
        verdict = (
            f"The proposed policy (+{fleet_increase_percent:.0f}% fleet) maintains acceptable baseline stability "
            f"with manageable exposure under adverse stress, primarily related to {top_driver_name}. "
            "The policy demonstrates reasonable operational resilience."
        )
    else:
        verdict = (
            f"The proposed policy (+{fleet_increase_percent:.0f}% fleet) demonstrates strong resilience and low exposure "
            "across all tested financial, capacity, demand, and utilization dimensions. "
            "The policy is well-buffered against anticipated operational volatility."
        )

    return verdict


def calculate_bus_policy_risk(
    request: BusSimulationRequest,
    simulation_result: Optional[BusSimulationResponse] = None,
    stress_result: Optional[BusStressTestResponse] = None,
) -> BusRiskResponse:
    """
    Calculate deterministic policy risk score, breakdown, drivers, and verdict.

    Flow:
    1. Obtain validated simulation metrics (from provided result or via simulate_bus_policy).
    2. Obtain validated stress test results (from provided result or via run_bus_stress_test).
    3. Evaluate 4 component scores (0-100) using centralized deterministic thresholds.
    4. Compute weighted composite score and classify risk level.
    5. Rank top risk drivers and synthesize deterministic reasons & verdict.
    6. Return strongly-typed BusRiskResponse.
    """
    # 1. Base simulation metrics
    if simulation_result is None:
        simulation_result = simulate_bus_policy(request)
    proposed_metrics = simulation_result.proposed

    # 2. Stress test metrics
    if stress_result is None:
        stress_result = run_bus_stress_test(request)
    worst_metrics = stress_result.worst_case.results

    # 3. Component evaluations
    fin_score, fin_reason, fin_label, fin_val = calculate_financial_risk(
        proposed_metrics, worst_metrics
    )
    cap_score, cap_reason, cap_label, cap_val = calculate_capacity_risk(
        proposed_metrics
    )
    dem_score, dem_reason, dem_label, dem_val = calculate_demand_risk(
        stress_result
    )
    utl_score, utl_reason, utl_label, utl_val = calculate_utilization_risk(
        proposed_metrics, stress_result
    )

    # 4. Dimension details
    components: Dict[str, RiskComponentDetail] = {
        "financial": RiskComponentDetail(
            name="Financial Risk",
            dimension="financial",
            score=fin_score,
            weight=FINANCIAL_WEIGHT,
            weighted_score=round(fin_score * FINANCIAL_WEIGHT, 2),
            level=classify_risk_level(fin_score)[0],
            level_label=classify_risk_level(fin_score)[1],
            primary_reason=fin_reason,
            metric_label=fin_label,
            metric_value=fin_val,
        ),
        "capacity": RiskComponentDetail(
            name="Capacity Risk",
            dimension="capacity",
            score=cap_score,
            weight=CAPACITY_WEIGHT,
            weighted_score=round(cap_score * CAPACITY_WEIGHT, 2),
            level=classify_risk_level(cap_score)[0],
            level_label=classify_risk_level(cap_score)[1],
            primary_reason=cap_reason,
            metric_label=cap_label,
            metric_value=cap_val,
        ),
        "demand": RiskComponentDetail(
            name="Demand Risk",
            dimension="demand",
            score=dem_score,
            weight=DEMAND_WEIGHT,
            weighted_score=round(dem_score * DEMAND_WEIGHT, 2),
            level=classify_risk_level(dem_score)[0],
            level_label=classify_risk_level(dem_score)[1],
            primary_reason=dem_reason,
            metric_label=dem_label,
            metric_value=dem_val,
        ),
        "utilization": RiskComponentDetail(
            name="Utilization Risk",
            dimension="utilization",
            score=utl_score,
            weight=UTILIZATION_WEIGHT,
            weighted_score=round(utl_score * UTILIZATION_WEIGHT, 2),
            level=classify_risk_level(utl_score)[0],
            level_label=classify_risk_level(utl_score)[1],
            primary_reason=utl_reason,
            metric_label=utl_label,
            metric_value=utl_val,
        ),
    }

    # 5. Composite score calculation
    raw_composite = (
        components["financial"].weighted_score
        + components["capacity"].weighted_score
        + components["demand"].weighted_score
        + components["utilization"].weighted_score
    )
    clamped_score = max(0.0, min(100.0, raw_composite))
    overall_score = round(clamped_score)

    risk_level, risk_level_label = classify_risk_level(float(overall_score))

    # 6. Rank top risk drivers by weighted contribution
    sorted_dims = sorted(
        components.keys(),
        key=lambda k: components[k].weighted_score,
        reverse=True,
    )
    top_risk_drivers = sorted_dims[:2]

    # 7. Collect deterministic reasons prioritized by top drivers
    deterministic_reasons: List[str] = [
        components[dim].primary_reason for dim in sorted_dims
    ]

    # 8. Policy verdict
    verdict = generate_policy_verdict(
        overall_score=overall_score,
        risk_level=risk_level,
        top_drivers=top_risk_drivers,
        components=components,
        fleet_increase_percent=request.fleet_increase_percent,
    )

    # 9. Key metrics summary for audit & future Gemini integration
    key_metrics = {
        "operating_surplus": proposed_metrics.operating_surplus,
        "operating_margin_percent": round(
            (proposed_metrics.operating_surplus / proposed_metrics.revenue * 100.0)
            if proposed_metrics.revenue > 0
            else -100.0,
            1,
        ),
        "utilization_percent": proposed_metrics.utilization_percent,
        "worst_case_surplus": worst_metrics.operating_surplus,
        "breaking_point_scenario": (
            stress_result.breaking_point.scenario_name
            if stress_result.breaking_point
            else None
        ),
        "policy_survives_all_tests": stress_result.attack_summary.policy_survives_all_tests,
    }

    assumptions = {
        "weights": {
            "financial": FINANCIAL_WEIGHT,
            "capacity": CAPACITY_WEIGHT,
            "demand": DEMAND_WEIGHT,
            "utilization": UTILIZATION_WEIGHT,
        },
        "thresholds": {
            "surplus_critical": SURPLUS_CRITICAL_THRESHOLD,
            "surplus_margin_warning_pct": SURPLUS_MARGIN_WARNING_PERCENT,
            "surplus_margin_healthy_pct": SURPLUS_MARGIN_HEALTHY_PERCENT,
            "capacity_low": CAPACITY_LOW_THRESHOLD,
            "capacity_warning": CAPACITY_WARNING_THRESHOLD,
            "capacity_critical": CAPACITY_CRITICAL_THRESHOLD,
            "risk_levels": {
                "low": f"0 - {int(RISK_LEVEL_LOW_MAX)}",
                "moderate": f"{int(RISK_LEVEL_LOW_MAX) + 1} - {int(RISK_LEVEL_MODERATE_MAX)}",
                "high": f"{int(RISK_LEVEL_MODERATE_MAX) + 1} - {int(RISK_LEVEL_HIGH_MAX)}",
                "critical": f"{int(RISK_LEVEL_HIGH_MAX) + 1} - 100",
            },
        },
    }

    return BusRiskResponse(
        overall_score=overall_score,
        risk_level=risk_level,
        risk_level_label=risk_level_label,
        components=components,
        top_risk_drivers=top_risk_drivers,
        deterministic_reasons=deterministic_reasons,
        policy_verdict=verdict,
        selected_policy=PolicyOverview(
            current_fleet=request.current_fleet,
            fleet_increase_percent=request.fleet_increase_percent,
            proposed_fleet=proposed_metrics.fleet,
        ),
        key_metrics=key_metrics,
        assumptions=assumptions,
    )
