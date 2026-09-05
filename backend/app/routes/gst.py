from fastapi import APIRouter
from app.schemas.gst import GstStatusResponse

router = APIRouter(prefix="/api/gst", tags=["gst"])


@router.get("", response_model=GstStatusResponse)
async def get_gst_status():
    """
    Placeholder GST Policy endpoint.
    Fiscal simulation and rate bracket modeling will be introduced in Commit 6.
    """
    return GstStatusResponse(module="gst", status="ready")
