"""
Comprehensive Deterministic Bus Policy Risk Engine Tests (Commit 6)

Verifies:
1. Score bounds (0 <= score <= 100)
2. Weights sum exactly to 1.0 (30% + 25% + 20% + 25%)
3. Low-risk policy characteristics
4. Negative surplus triggers critical financial risk (100)
5. Capacity overload (>100% utilization) triggers critical capacity risk (100)
6. High-demand stress impact on demand risk
7. Combined adverse scenario influence
8. Mathematical determinism (reproducibility across runs)
9. Risk level classifications and boundary conditions
10. Top risk drivers correctly sorted by weighted contribution
11. FastAPI endpoint integration (POST /api/bus/risk)
"""

import pytest
from fastapi.testclient import TestClient
from main import app

from app.schemas.bus import BusSimulationRequest, BusRiskResponse
from app.services.bus.risk import (
    calculate_bus_policy_risk,
    classify_risk_level,
    FINANCIAL_WEIGHT,
    CAPACITY_WEIGHT,
    DEMAND_WEIGHT,
    UTILIZATION_WEIGHT,
    SURPLUS_CRITICAL_THRESHOLD,
    CAPACITY_CRITICAL_THRESHOLD,
)

client = TestClient(app)


@pytest.fixture
def baseline_request():
    """Standard baseline policy request"""
    return BusSimulationRequest(
        current_fleet=100,
        fleet_increase_percent=20.0,
        daily_ridership=42000.0,
        capacity_per_bus=50,
        average_ticket_price=25.0,
        operating_cost_per_bus=8200.0,
        trips_per_bus_per_day=10.0,
        current_waiting_time_minutes=14.0,
        demand_elasticity=0.25,
    )


def test_test1_score_bounds(baseline_request):
    """1. Risk score must always satisfy 0 <= score <= 100 across varied inputs"""
    variations = [
        baseline_request,
        baseline_request.model_copy(update={"fleet_increase_percent": 0.0}),
        baseline_request.model_copy(update={"fleet_increase_percent": 50.0}),
        baseline_request.model_copy(update={"average_ticket_price": 5.0, "operating_cost_per_bus": 15000.0}),
        baseline_request.model_copy(update={"daily_ridership": 100000.0, "bus_capacity": 30}),
        baseline_request.model_copy(update={"average_ticket_price": 60.0, "operating_cost_per_bus": 3000.0}),
    ]

    for req in variations:
        result = calculate_bus_policy_risk(req)
        assert isinstance(result, BusRiskResponse)
        assert 0 <= result.overall_score <= 100
        for dim, comp in result.components.items():
            assert 0.0 <= comp.score <= 100.0
            assert 0.0 <= comp.weighted_score <= 100.0


def test_test2_weight_validation():
    """2. Verify weights sum to exactly 1.0 (30% + 25% + 20% + 25%)"""
    total_weight = FINANCIAL_WEIGHT + CAPACITY_WEIGHT + DEMAND_WEIGHT + UTILIZATION_WEIGHT
    assert round(total_weight, 6) == 1.0
    assert FINANCIAL_WEIGHT == 0.30
    assert CAPACITY_WEIGHT == 0.25
    assert DEMAND_WEIGHT == 0.20
    assert UTILIZATION_WEIGHT == 0.25


def test_test3_low_risk_policy():
    """3. Highly favorable policy (high margin, abundant capacity) yields low/moderate risk"""
    healthy_req = BusSimulationRequest(
        current_fleet=200,
        fleet_increase_percent=20.0,
        daily_ridership=30000.0,
        capacity_per_bus=70,
        average_ticket_price=40.0,
        operating_cost_per_bus=4000.0,
        trips_per_bus_per_day=10.0,
    )
    result = calculate_bus_policy_risk(healthy_req)
    assert result.overall_score < 40
    assert result.risk_level in ["low", "moderate"]
    assert result.components["financial"].score <= 25.0
    assert result.components["capacity"].score <= 25.0


def test_test4_negative_surplus_critical_financial_risk(baseline_request):
    """4. Policy forced into operating deficit achieves financial risk = 100"""
    deficit_req = baseline_request.model_copy(update={
        "average_ticket_price": 5.0,        # Very low farebox revenue
        "operating_cost_per_bus": 15000.0,   # Very high operating cost
    })
    result = calculate_bus_policy_risk(deficit_req)
    assert result.components["financial"].score == 100.0
    assert result.components["financial"].level == "critical"
    assert "Operating deficit" in result.components["financial"].primary_reason
    assert result.overall_score >= 30  # Substantially elevated composite score


def test_test5_capacity_overload_critical_capacity_risk(baseline_request):
    """5. Policy with utilization > 100% achieves capacity risk = 100"""
    overload_req = baseline_request.model_copy(update={
        "current_fleet": 50,
        "fleet_increase_percent": 0.0,
        "daily_ridership": 120000.0,       # Extreme passenger load
        "capacity_per_bus": 40,
        "trips_per_bus_per_day": 8.0,      # Capacity: 50 * 40 * 8 = 16,000 << 120,000
    })
    result = calculate_bus_policy_risk(overload_req)
    assert result.components["capacity"].score == 100.0
    assert result.components["capacity"].level == "critical"
    assert "Capacity exceeded" in result.components["capacity"].primary_reason


def test_test6_high_demand_stress_elevates_demand_risk(baseline_request):
    """6. Demand risk increases when the selected policy encounters stress under high demand"""
    fragile_req = baseline_request.model_copy(update={
        "current_fleet": 80,
        "fleet_increase_percent": 5.0,
        "daily_ridership": 38000.0,
        "capacity_per_bus": 48,
        "trips_per_bus_per_day": 10.0,
    })
    result = calculate_bus_policy_risk(fragile_req)
    # The demand risk should be evaluated from stress test scenarios
    assert result.components["demand"].score >= 40.0
    assert result.components["demand"].weighted_score > 0


def test_test7_combined_adverse_scenario_influence(baseline_request):
    """7. Combined adverse stress is captured in risk metrics and audit assumptions"""
    result = calculate_bus_policy_risk(baseline_request)
    assert "worst_case_surplus" in result.key_metrics
    assert "breaking_point_scenario" in result.key_metrics
    assert "weights" in result.assumptions
    assert "thresholds" in result.assumptions


def test_test8_mathematical_determinism(baseline_request):
    """8. Exactly identical inputs yield bit-for-bit identical risk results across repeated runs"""
    res1 = calculate_bus_policy_risk(baseline_request)
    res2 = calculate_bus_policy_risk(baseline_request)

    assert res1.overall_score == res2.overall_score
    assert res1.risk_level == res2.risk_level
    assert res1.policy_verdict == res2.policy_verdict
    assert res1.top_risk_drivers == res2.top_risk_drivers

    for dim in ["financial", "capacity", "demand", "utilization"]:
        assert res1.components[dim].score == res2.components[dim].score
        assert res1.components[dim].weighted_score == res2.components[dim].weighted_score
        assert res1.components[dim].primary_reason == res2.components[dim].primary_reason


def test_test9_risk_level_boundaries():
    """9. Test boundary scores around 29, 30, 59, 60, 79, 80"""
    assert classify_risk_level(0.0) == ("low", "Low Risk")
    assert classify_risk_level(29.0) == ("low", "Low Risk")
    assert classify_risk_level(29.4) == ("low", "Low Risk")
    assert classify_risk_level(30.0) == ("moderate", "Moderate Risk")
    assert classify_risk_level(59.0) == ("moderate", "Moderate Risk")
    assert classify_risk_level(60.0) == ("high", "High Risk")
    assert classify_risk_level(79.0) == ("high", "High Risk")
    assert classify_risk_level(80.0) == ("critical", "Critical Risk")
    assert classify_risk_level(100.0) == ("critical", "Critical Risk")


def test_test10_top_risk_drivers_ranking(baseline_request):
    """10. Verify top risk drivers are sorted deterministically by weighted contribution"""
    result = calculate_bus_policy_risk(baseline_request)
    assert len(result.top_risk_drivers) >= 1

    d1 = result.top_risk_drivers[0]
    if len(result.top_risk_drivers) > 1:
        d2 = result.top_risk_drivers[1]
        assert result.components[d1].weighted_score >= result.components[d2].weighted_score

    # Reasons list should correspond to drivers
    assert len(result.deterministic_reasons) == 4


def test_test11_api_endpoint_risk(baseline_request):
    """11. Test POST /api/bus/risk endpoint integration"""
    response = client.post("/api/bus/risk", json=baseline_request.model_dump())
    assert response.status_code == 200
    data = response.json()

    assert "overall_score" in data
    assert "risk_level" in data
    assert "risk_level_label" in data
    assert "components" in data
    assert "top_risk_drivers" in data
    assert "policy_verdict" in data
    assert "key_metrics" in data
    assert "assumptions" in data

    assert data["risk_level"] in ["low", "moderate", "high", "critical"]
    assert len(data["components"]) == 4
    for dim in ["financial", "capacity", "demand", "utilization"]:
        assert dim in data["components"]
        comp = data["components"][dim]
        assert "score" in comp
        assert "weight" in comp
        assert "weighted_score" in comp
        assert "primary_reason" in comp
