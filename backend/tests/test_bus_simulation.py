import pytest
from pydantic import ValidationError
from fastapi.testclient import TestClient

from main import app
from app.schemas.bus import BusSimulationRequest
from app.services.bus.simulation import simulate_bus_policy, percentage_change


client = TestClient(app)


def test_test1_fleet_calculation():
    """Test 1: 100 buses + 20% fleet increase produces 120 buses."""
    req = BusSimulationRequest(
        current_fleet=100,
        fleet_increase_percent=20.0,
        daily_ridership=42000,
        capacity_per_bus=50,
        average_ticket_price=25.0,
        operating_cost_per_bus=8200.0,
        trips_per_bus_per_day=10.0,
    )
    result = simulate_bus_policy(req)
    assert result.proposed.fleet == 120
    assert result.policy.proposed_fleet == 120
    assert result.impact.fleet_percent == 20.0


def test_test2_capacity_calculation():
    """Test 2: 100 buses × 50 passengers × 10 trips produces 50,000 capacity units/day."""
    req = BusSimulationRequest(
        current_fleet=100,
        fleet_increase_percent=20.0,
        daily_ridership=42000,
        capacity_per_bus=50,
        average_ticket_price=25.0,
        operating_cost_per_bus=8200.0,
        trips_per_bus_per_day=10.0,
    )
    result = simulate_bus_policy(req)
    assert result.current.daily_capacity == 50000.0
    assert result.proposed.daily_capacity == 60000.0
    assert result.impact.capacity_percent == 20.0


def test_test3_operating_cost():
    """Test 3: 100 buses × ₹8,200 operating cost produces ₹820,000/day."""
    req = BusSimulationRequest(
        current_fleet=100,
        fleet_increase_percent=20.0,
        daily_ridership=42000,
        capacity_per_bus=50,
        average_ticket_price=25.0,
        operating_cost_per_bus=8200.0,
        trips_per_bus_per_day=10.0,
    )
    result = simulate_bus_policy(req)
    assert result.current.operating_cost == 820000.0
    assert result.proposed.operating_cost == 984000.0
    assert result.impact.operating_cost_percent == 20.0


def test_test4_revenue():
    """Test 4: 42,000 passengers × ₹25 tariff produces ₹1,050,000/day."""
    req = BusSimulationRequest(
        current_fleet=100,
        fleet_increase_percent=20.0,
        daily_ridership=42000,
        capacity_per_bus=50,
        average_ticket_price=25.0,
        operating_cost_per_bus=8200.0,
        trips_per_bus_per_day=10.0,
    )
    result = simulate_bus_policy(req)
    assert result.current.revenue == 1050000.0


def test_test5_surplus():
    """Test 5: Operating surplus = Revenue (1,050,000) - Operating Cost (820,000) = ₹230,000/day."""
    req = BusSimulationRequest(
        current_fleet=100,
        fleet_increase_percent=20.0,
        daily_ridership=42000,
        capacity_per_bus=50,
        average_ticket_price=25.0,
        operating_cost_per_bus=8200.0,
        trips_per_bus_per_day=10.0,
    )
    result = simulate_bus_policy(req)
    assert result.current.operating_surplus == 230000.0
    # Proposed: 1,102,500 - 984,000 = 118,500
    assert result.proposed.operating_surplus == 118500.0


def test_test6_percentage_change():
    """Test 6: Percentage change from 100 to 120 produces 20%."""
    assert percentage_change(100.0, 120.0) == 20.0
    assert percentage_change(50.0, 60.0) == 20.0
    assert percentage_change(100.0, 80.0) == -20.0


def test_test7_validation_rules():
    """Test 7: Reject invalid inputs per validation specifications."""
    # Negative fleet rejected
    with pytest.raises(ValidationError):
        BusSimulationRequest(
            current_fleet=-5,
            fleet_increase_percent=20,
            daily_ridership=42000,
            capacity_per_bus=50,
            average_ticket_price=25,
            operating_cost_per_bus=8200,
        )

    # Fleet increase > 50 rejected
    with pytest.raises(ValidationError):
        BusSimulationRequest(
            current_fleet=100,
            fleet_increase_percent=75,
            daily_ridership=42000,
            capacity_per_bus=50,
            average_ticket_price=25,
            operating_cost_per_bus=8200,
        )

    # Negative ridership rejected
    with pytest.raises(ValidationError):
        BusSimulationRequest(
            current_fleet=100,
            fleet_increase_percent=20,
            daily_ridership=-1000,
            capacity_per_bus=50,
            average_ticket_price=25,
            operating_cost_per_bus=8200,
        )

    # Zero capacity rejected
    with pytest.raises(ValidationError):
        BusSimulationRequest(
            current_fleet=100,
            fleet_increase_percent=20,
            daily_ridership=42000,
            capacity_per_bus=0,
            average_ticket_price=25,
            operating_cost_per_bus=8200,
        )

    # Zero trips per day rejected (ge=1)
    with pytest.raises(ValidationError):
        BusSimulationRequest(
            current_fleet=100,
            fleet_increase_percent=20,
            daily_ridership=42000,
            capacity_per_bus=50,
            average_ticket_price=25,
            operating_cost_per_bus=8200,
            trips_per_bus_per_day=0,
        )

    # Negative ticket price rejected
    with pytest.raises(ValidationError):
        BusSimulationRequest(
            current_fleet=100,
            fleet_increase_percent=20,
            daily_ridership=42000,
            capacity_per_bus=50,
            average_ticket_price=-10,
            operating_cost_per_bus=8200,
        )


def test_test8_zero_value_safety():
    """Test 8: Percentage calculations and waiting-time calculations handle zero safely without crashing."""
    assert percentage_change(0.0, 0.0) == 0.0
    assert percentage_change(0.0, 100.0) == 100.0

    # Test with 0 ridership
    req = BusSimulationRequest(
        current_fleet=100,
        fleet_increase_percent=0.0,
        daily_ridership=0.0,
        capacity_per_bus=50,
        average_ticket_price=0.0,
        operating_cost_per_bus=0.0,
        trips_per_bus_per_day=10.0,
        current_waiting_time_minutes=0.0,
    )
    result = simulate_bus_policy(req)
    assert result.current.daily_ridership == 0.0
    assert result.current.utilization_percent == 0.0
    assert result.proposed.waiting_time_minutes == 0.0


def test_complete_verification_example():
    """
    Test section 27 verification example end-to-end:
    Current fleet: 100, increase: 20%, ridership: 42,000, capacity: 50,
    trips: 10, ticket: 25, cost: 8,200, wait: 14 min, elasticity: 0.25
    """
    req = BusSimulationRequest(
        current_fleet=100,
        fleet_increase_percent=20.0,
        daily_ridership=42000,
        capacity_per_bus=50,
        trips_per_bus_per_day=10.0,
        average_ticket_price=25.0,
        operating_cost_per_bus=8200.0,
        current_waiting_time_minutes=14.0,
        demand_elasticity=0.25,
    )
    res = simulate_bus_policy(req)

    assert res.proposed.fleet == 120
    assert res.current.daily_capacity == 50000.0
    assert res.proposed.daily_capacity == 60000.0
    assert res.current.utilization_percent == 84.0
    assert res.proposed.daily_ridership == 44100.0
    assert res.current.operating_cost == 820000.0
    assert res.proposed.operating_cost == 984000.0
    assert res.current.revenue == 1050000.0
    assert res.proposed.revenue == 1102500.0
    assert res.current.operating_surplus == 230000.0
    assert res.proposed.operating_surplus == 118500.0
    # Waiting time: 14 * (0.735 / 0.84)^0.5 = 14 * (0.875^0.5) ≈ 13.10 min
    assert round(res.proposed.waiting_time_minutes, 1) == 13.1


def test_api_endpoint_simulation():
    """Test POST /api/bus/simulate endpoint via FastAPI TestClient."""
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
    response = client.post("/api/bus/simulate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["policy"]["proposed_fleet"] == 120
    assert data["proposed"]["daily_capacity"] == 60000
    assert data["proposed"]["daily_ridership"] == 44100
    assert data["current"]["operating_surplus"] == 230000
    assert data["proposed"]["operating_surplus"] == 118500
    assert "trips_per_bus_per_day" in data["assumptions"]
    assert data["assumptions"]["demand_elasticity"] == 0.25
