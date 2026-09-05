from fastapi import APIRouter, HTTPException
from app.schemas.bus import (
    BusStatusResponse,
    BusSimulationRequest,
    BusSimulationResponse,
)
from app.services.bus.simulation import simulate_bus_policy

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
