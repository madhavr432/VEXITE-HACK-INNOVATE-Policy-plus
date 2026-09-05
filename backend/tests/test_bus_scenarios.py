import pytest
from pydantic import ValidationError
from fastapi.testclient import TestClient

from main import app
from app.schemas.bus import BusSimulationRequest
from app.services.bus.simulation import simulate_bus_policy
from app.services.bus.scenarios import generate_bus_scenarios, DEFAULT_SCENARIO_TIERS


client = TestClient(app)


def test_test1_scenario_endpoint_default_scenarios():
    """Test 1: Scenario generator returns all 9 default scenarios (0, 5, 10, 15, 20, 25, 30, 40, 50)."""
    req = BusSimulationRequest(
        current_fleet=100,
        fleet_increase_percent=20.0,
        daily_ridership=42000,
        capacity_per_bus=50,
        average_ticket_price=25.0,
        operating_cost_per_bus=8200.0,
        trips_per_bus_per_day=10.0,
    )
    result = generate_bus_scenarios(req)
    assert len(result.scenarios) == 9
    tiers = [s.fleet_increase_percent for s in result.scenarios]
    assert tiers == [0.0, 5.0, 10.0, 15.0, 20.0, 25.0, 30.0, 40.0, 50.0]


def test_test2_zero_percent_scenario_matches_base():
    """Test 2: 0% scenario should match the current/baseline simulation."""
    req = BusSimulationRequest(
        current_fleet=100,
        fleet_increase_percent=20.0,
        daily_ridership=42000,
        capacity_per_bus=50,
        average_ticket_price=25.0,
        operating_cost_per_bus=8200.0,
        trips_per_bus_per_day=10.0,
    )
    result = generate_bus_scenarios(req)
    zero_scenario = result.scenarios[0]
    assert zero_scenario.fleet_increase_percent == 0.0
    assert zero_scenario.fleet == result.current.fleet
    assert zero_scenario.daily_ridership == result.current.daily_ridership
    assert zero_scenario.daily_capacity == result.current.daily_capacity
    assert zero_scenario.operating_cost == result.current.operating_cost
    assert zero_scenario.revenue == result.current.revenue
    assert zero_scenario.operating_surplus == result.current.operating_surplus


def test_test3_twenty_percent_scenario_matches_single_simulation():
    """Test 3: 20% scenario should produce identical values to simulate_bus_policy(... fleet_increase_percent=20)."""
    req = BusSimulationRequest(
        current_fleet=100,
        fleet_increase_percent=20.0,
        daily_ridership=42000,
        capacity_per_bus=50,
        average_ticket_price=25.0,
        operating_cost_per_bus=8200.0,
        trips_per_bus_per_day=10.0,
    )
    single_res = simulate_bus_policy(req)
    multi_res = generate_bus_scenarios(req)

    twenty_scenario = next(s for s in multi_res.scenarios if s.fleet_increase_percent == 20.0)
    assert twenty_scenario.fleet == single_res.proposed.fleet
    assert twenty_scenario.daily_ridership == single_res.proposed.daily_ridership
    assert twenty_scenario.daily_capacity == single_res.proposed.daily_capacity
    assert twenty_scenario.waiting_time_minutes == single_res.proposed.waiting_time_minutes
    assert twenty_scenario.operating_cost == single_res.proposed.operating_cost
    assert twenty_scenario.revenue == single_res.proposed.revenue
    assert twenty_scenario.operating_surplus == single_res.proposed.operating_surplus
    assert twenty_scenario.emissions_kg == single_res.proposed.emissions_kg


def test_test4_fifty_percent_scenario_fleet():
    """Test 4: 50% scenario should produce the correct fleet (100 -> 150)."""
    req = BusSimulationRequest(
        current_fleet=100,
        fleet_increase_percent=20.0,
        daily_ridership=42000,
        capacity_per_bus=50,
        average_ticket_price=25.0,
        operating_cost_per_bus=8200.0,
        trips_per_bus_per_day=10.0,
    )
    multi_res = generate_bus_scenarios(req)
    fifty_scenario = next(s for s in multi_res.scenarios if s.fleet_increase_percent == 50.0)
    assert fifty_scenario.fleet == 150


def test_test5_scenario_determinism():
    """Test 5: Scenario results should be strictly deterministic (two calls produce identical output)."""
    req = BusSimulationRequest(
        current_fleet=100,
        fleet_increase_percent=20.0,
        daily_ridership=42000,
        capacity_per_bus=50,
        average_ticket_price=25.0,
        operating_cost_per_bus=8200.0,
        trips_per_bus_per_day=10.0,
    )
    res1 = generate_bus_scenarios(req)
    res2 = generate_bus_scenarios(req)
    assert res1.model_dump() == res2.model_dump()


def test_test6_mathematical_consistency_across_all_scenarios():
    """Test 6: For every generated scenario, verify all fundamental math identities hold."""
    req = BusSimulationRequest(
        current_fleet=100,
        fleet_increase_percent=20.0,
        daily_ridership=42000,
        capacity_per_bus=50,
        average_ticket_price=25.0,
        operating_cost_per_bus=8200.0,
        trips_per_bus_per_day=10.0,
    )
    multi_res = generate_bus_scenarios(req)

    for sc in multi_res.scenarios:
        # daily_capacity = fleet × capacity_per_bus × trips_per_bus_per_day
        assert sc.daily_capacity == sc.fleet * req.capacity_per_bus * req.trips_per_bus_per_day
        # operating_cost = fleet × operating_cost_per_bus
        assert sc.operating_cost == sc.fleet * req.operating_cost_per_bus
        # revenue = daily_ridership × average_ticket_price
        assert round(sc.revenue, 2) == round(sc.daily_ridership * req.average_ticket_price, 2)
        # operating_surplus = revenue - operating_cost
        assert round(sc.operating_surplus, 2) == round(sc.revenue - sc.operating_cost, 2)


def test_test7_arbitrary_selected_scenario():
    """Test 7: Support arbitrary selected percentage (e.g. 17%) while preserving standard range."""
    req = BusSimulationRequest(
        current_fleet=100,
        fleet_increase_percent=17.0,
        daily_ridership=42000,
        capacity_per_bus=50,
        average_ticket_price=25.0,
        operating_cost_per_bus=8200.0,
        trips_per_bus_per_day=10.0,
    )
    res = generate_bus_scenarios(req)
    assert res.selected_scenario.fleet_increase_percent == 17.0
    # 100 * 1.17 = 117 buses
    assert res.selected_scenario.fleet == 117
    assert len(res.scenarios) == 9


def test_test8_api_endpoint_scenarios():
    """Test 8: POST /api/bus/scenarios via FastAPI TestClient."""
    payload = {
        "current_fleet": 100,
        "fleet_increase_percent": 20,
        "daily_ridership": 42000,
        "capacity_per_bus": 50,
        "average_ticket_price": 25,
        "operating_cost_per_bus": 8200,
        "trips_per_bus_per_day": 10,
        "current_waiting_time_minutes": 14,
        "demand_elasticity": 0.25,
    }
    response = client.post("/api/bus/scenarios", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["base_fleet"] == 100
    assert len(data["scenarios"]) == 9
    assert data["selected_scenario"]["fleet"] == 120
    assert data["selected_scenario"]["operating_surplus"] == 118500.0
