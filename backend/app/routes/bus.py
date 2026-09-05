from fastapi import APIRouter, HTTPException
from app.schemas.bus import (
    BusStatusResponse,
    BusSimulationRequest,
    BusSimulationResponse,
    BusScenariosResponse,
)
from app.services.bus.simulation import simulate_bus_policy
from app.services.bus.scenarios import generate_bus_scenarios

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
