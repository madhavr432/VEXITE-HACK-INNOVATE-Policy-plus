from fastapi import APIRouter
from app.schemas.bus import BusStatusResponse

router = APIRouter(prefix="/api/bus", tags=["bus"])


@router.get("", response_model=BusStatusResponse)
async def get_bus_status():
    """
    Placeholder Bus Policy endpoint.
    Simulation and stress-testing logic will be introduced in Commits 2-5.
    """
    return BusStatusResponse(module="bus", status="ready")
