from fastapi import APIRouter, HTTPException
from app.schemas.bus import (
    BusStatusResponse,
    BusSimulationRequest,
    BusSimulationResponse,
    BusScenariosResponse,
    BusStressTestResponse,
    BusRiskResponse,
)
from app.services.bus.simulation import simulate_bus_policy
from app.services.bus.scenarios import generate_bus_scenarios
from app.services.bus.stress_test import run_bus_stress_test
from app.services.bus.risk import calculate_bus_policy_risk

router = APIRouter(prefix="/api/bus", tags=["bus"])


@router.get("", response_model=BusStatusResponse)
async def get_bus_status():
    """
    Bus Policy module readiness status.
    """
    return BusStatusResponse(module="bus", status="ready")


@router.post("/simulate", response_model=BusSimulationResponse)
async def simulate_bus(request: BusSimulationRequest):
    """
    Run deterministic bus policy simulation.
    Calculates fleet scaling, daily capacity, demand elasticity ridership,
    congestion pressure waiting time, operating expenditure, farebox revenues,
    operating surplus, and carbon emissions.
    """
    try:
        result = simulate_bus_policy(request)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Simulation computation failed: {str(e)}"
        )


@router.post("/scenarios", response_model=BusScenariosResponse)
async def simulate_bus_scenarios(request: BusSimulationRequest):
    """
    Generate multi-scenario comparison and sensitivity outcomes across
    standard fleet expansion tiers (0%, 5%, 10%, 15%, 20%, 25%, 30%, 40%, 50%)
    using the unified deterministic simulation engine.
    """
    try:
        results = generate_bus_scenarios(request)
        return results
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Scenario generation failed: {str(e)}"
        )


@router.post("/stress-test", response_model=BusStressTestResponse)
async def stress_test_bus(request: BusSimulationRequest):
    """
    Execute Attack My Policy stress testing against the user's selected policy.
    Evaluates adverse demand surge and operating cost inflation scenarios,
    determines Best/Expected/Worst bounds, flags rule-based stability thresholds,
    and identifies the breaking point within tested scenarios.
    """
    try:
        results = run_bus_stress_test(request)
        return results
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Stress test computation failed: {str(e)}"
        )


@router.post("/risk", response_model=BusRiskResponse)
async def evaluate_bus_risk(request: BusSimulationRequest):
    """
    Execute Deterministic Policy Risk Engine assessment (Commit 6).
    Reuses the validated simulation engine and stress-test engine outputs
    to evaluate Financial Risk (30%), Capacity Risk (25%), Demand Risk (20%),
    and Utilization Risk (25%) into an overall Policy Risk Score (0-100),
    identifies top risk drivers, and generates transparent rule-based reasons and verdict.
    """
    try:
        results = calculate_bus_policy_risk(request)
        return results
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Policy risk computation failed: {str(e)}"
        )


