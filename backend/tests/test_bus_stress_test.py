import pytest
from fastapi.testclient import TestClient

from main import app
from app.schemas.bus import BusSimulationRequest
from app.services.bus.simulation import simulate_bus_policy
from app.services.bus.stress_test import run_bus_stress_test

client = TestClient(app)

BASE_INPUT = {
    "current_fleet": 100,
    "fleet_increase_percent": 20.0,
    "daily_ridership": 42000.0,
    "capacity_per_bus": 50,
    "average_ticket_price": 25.0,
    "operating_cost_per_bus": 8200.0,
    "trips_per_bus_per_day": 10.0,
    "current_waiting_time_minutes": 14.0,
    "demand_elasticity": 0.25,
}


def test_test1_stress_endpoint_returns_all_scenarios():
    """
    Test 1 — Stress endpoint:
    Verify POST /api/bus/stress-test returns all 7 configured stress scenarios.
    """
    response = client.post("/api/bus/stress-test", json=BASE_INPUT)
    assert response.status_code == 200
    data = response.json()

    assert "stress_scenarios" in data
    assert len(data["stress_scenarios"]) == 7

    scenario_ids = [sc["id"] for sc in data["stress_scenarios"]]
    expected_ids = [
        "baseline",
        "high_demand",
        "very_high_demand",
        "extreme_demand",
        "high_cost",
        "very_high_cost",
        "combined_adverse",
    ]
    assert scenario_ids == expected_ids
    assert data["attack_summary"]["scenarios_tested"] == 7


def test_test2_deterministic():
    """
    Test 2 — Deterministic:
    Same inputs twice produce exact identical results.
    """
    req = BusSimulationRequest(**BASE_INPUT)
    run1 = run_bus_stress_test(req)
    run2 = run_bus_stress_test(req)

    assert run1.model_dump() == run2.model_dump()

    # Via HTTP API as well
    res1 = client.post("/api/bus/stress-test", json=BASE_INPUT).json()
    res2 = client.post("/api/bus/stress-test", json=BASE_INPUT).json()
    assert res1 == res2


def test_test3_expected_case_equals_normal_simulation():
    """
    Test 3 — Expected case:
    Expected case proposed metrics must strictly equal normal simulation results.
    """
    req = BusSimulationRequest(**BASE_INPUT)
    normal_sim = simulate_bus_policy(req)
    stress_res = run_bus_stress_test(req)

    # Proposed metrics match
    assert stress_res.expected_case.results.fleet == normal_sim.proposed.fleet
    assert stress_res.expected_case.results.daily_ridership == normal_sim.proposed.daily_ridership
    assert stress_res.expected_case.results.daily_capacity == normal_sim.proposed.daily_capacity
    assert stress_res.expected_case.results.waiting_time_minutes == normal_sim.proposed.waiting_time_minutes
    assert stress_res.expected_case.results.operating_cost == normal_sim.proposed.operating_cost
    assert stress_res.expected_case.results.revenue == normal_sim.proposed.revenue
    assert stress_res.expected_case.results.operating_surplus == normal_sim.proposed.operating_surplus
    assert stress_res.expected_case.results.utilization_percent == normal_sim.proposed.utilization_percent


def test_test4_cost_stress():
    """
    Test 4 — Cost stress:
    Increasing cost multiplier increases operating cost proportionately.
    """
    req = BusSimulationRequest(**BASE_INPUT)
    stress_res = run_bus_stress_test(req)

    baseline_sc = next(sc for sc in stress_res.stress_scenarios if sc.id == "baseline")
    high_cost_sc = next(sc for sc in stress_res.stress_scenarios if sc.id == "high_cost")
    very_high_cost_sc = next(sc for sc in stress_res.stress_scenarios if sc.id == "very_high_cost")

    assert high_cost_sc.results.operating_cost > baseline_sc.results.operating_cost
    assert very_high_cost_sc.results.operating_cost > high_cost_sc.results.operating_cost

    # 10% cost multiplier: 120 buses * (8200 * 1.10 = 9020) = 1,082,400
    assert high_cost_sc.results.operating_cost == 1082400.0
    # 20% cost multiplier: 120 buses * (8200 * 1.20 = 9840) = 1,180,800
    assert very_high_cost_sc.results.operating_cost == 1180800.0


def test_test5_demand_stress():
    """
    Test 5 — Demand stress:
    Increasing demand multiplier increases demand and ridership output.
    """
    req = BusSimulationRequest(**BASE_INPUT)
    stress_res = run_bus_stress_test(req)

    baseline_sc = next(sc for sc in stress_res.stress_scenarios if sc.id == "baseline")
    high_demand_sc = next(sc for sc in stress_res.stress_scenarios if sc.id == "high_demand")
    very_high_demand_sc = next(sc for sc in stress_res.stress_scenarios if sc.id == "very_high_demand")
    extreme_demand_sc = next(sc for sc in stress_res.stress_scenarios if sc.id == "extreme_demand")

    assert high_demand_sc.results.daily_ridership > baseline_sc.results.daily_ridership
    assert very_high_demand_sc.results.daily_ridership > high_demand_sc.results.daily_ridership
    assert extreme_demand_sc.results.daily_ridership > very_high_demand_sc.results.daily_ridership


def test_test6_combined_stress():
    """
    Test 6 — Combined stress:
    Combined adverse scenario applies both demand (+25%) and cost (+20%) multipliers.
    """
    req = BusSimulationRequest(**BASE_INPUT)
    stress_res = run_bus_stress_test(req)

    baseline_sc = next(sc for sc in stress_res.stress_scenarios if sc.id == "baseline")
    combined_sc = next(sc for sc in stress_res.stress_scenarios if sc.id == "combined_adverse")

    assert combined_sc.demand_multiplier == 1.25
    assert combined_sc.cost_multiplier == 1.20
    assert combined_sc.results.daily_ridership > baseline_sc.results.daily_ridership
    assert combined_sc.results.operating_cost > baseline_sc.results.operating_cost


def test_test7_negative_surplus_triggers_critical():
    """
    Test 7 — Negative surplus:
    Create a test case where operating surplus becomes negative and verify status = critical.
    """
    # High operating cost per bus relative to ticket price ensures negative surplus
    req = BusSimulationRequest(
        current_fleet=100,
        fleet_increase_percent=20.0,
        daily_ridership=20000.0,
        capacity_per_bus=50,
        average_ticket_price=15.0,  # Revenue: 21,000 * 15 = 315,000
        operating_cost_per_bus=12000.0,  # Cost: 120 * 12,000 = 1,440,000
        trips_per_bus_per_day=10.0,
    )
    stress_res = run_bus_stress_test(req)

    baseline_sc = next(sc for sc in stress_res.stress_scenarios if sc.id == "baseline")
    assert baseline_sc.results.operating_surplus < 0
    assert baseline_sc.status == "critical"
    assert any("negative" in r.lower() for r in baseline_sc.status_reasons)


def test_test8_capacity_overload_triggers_critical():
    """
    Test 8 — Capacity:
    Create a case where utilization > 100% and verify status = critical.
    """
    # High ridership with small fleet to push utilization over 100%
    req = BusSimulationRequest(
        current_fleet=20,
        fleet_increase_percent=0.0,
        daily_ridership=30000.0,  # Capacity = 20 * 50 * 10 = 10,000 -> Utilization = 300%
        capacity_per_bus=50,
        average_ticket_price=25.0,
        operating_cost_per_bus=5000.0,
        trips_per_bus_per_day=10.0,
    )
    stress_res = run_bus_stress_test(req)

    baseline_sc = next(sc for sc in stress_res.stress_scenarios if sc.id == "baseline")
    assert baseline_sc.results.utilization_percent > 100.0
    assert baseline_sc.status == "critical"
    assert any("certified limit" in r.lower() or "capacity" in r.lower() for r in baseline_sc.status_reasons)


def test_test9_breaking_point_identification():
    """
    Test 9 — Breaking point:
    Verify the first problematic tested scenario is correctly identified.
    """
    # Configured with moderate ticket and cost where baseline is stable, but combined adverse breaks
    req = BusSimulationRequest(
        current_fleet=100,
        fleet_increase_percent=20.0,
        daily_ridership=35000.0,
        capacity_per_bus=50,
        average_ticket_price=25.0,
        operating_cost_per_bus=7500.0,
        trips_per_bus_per_day=10.0,
    )
    stress_res = run_bus_stress_test(req)

    assert stress_res.breaking_point is not None
    # Verify the breaking point corresponds to a scenario marked as warning or critical
    breaking_id = stress_res.breaking_point.scenario_id
    breaking_sc = next(sc for sc in stress_res.stress_scenarios if sc.id == breaking_id)
    assert breaking_sc.status in ["warning", "critical"]
    assert stress_res.breaking_point.reason != ""


def test_test10_no_failure_breaking_point_null():
    """
    Test 10 — No failure:
    Use a sufficiently favorable test input and verify breaking_point = null.
    """
    # Very high farebox tariff and generous capacity so surplus stays positive
    # and load factor stays well under 90% across all 7 scenarios
    req = BusSimulationRequest(
        current_fleet=100,
        fleet_increase_percent=20.0,
        daily_ridership=20000.0,  # Max capacity 120*50*10 = 60,000 -> Max load ~45%
        capacity_per_bus=50,
        average_ticket_price=100.0,  # High revenue ensures massive positive surplus
        operating_cost_per_bus=2000.0,  # Low operating cost
        trips_per_bus_per_day=10.0,
    )
    stress_res = run_bus_stress_test(req)

    assert stress_res.breaking_point is None
    assert stress_res.attack_summary.critical_scenarios == 0
    assert stress_res.attack_summary.warning_scenarios == 0
    assert stress_res.attack_summary.stable_scenarios == 7
    assert stress_res.attack_summary.policy_survives_all_tests is True
