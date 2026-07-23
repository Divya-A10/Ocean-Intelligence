from typing import Optional
from fastapi import APIRouter, Query, HTTPException, status
from backend.app.schemas.hotspot_schema import HotspotsResponse
from backend.app.services.hotspot_service import hotspot_service
from backend.app.utils.logger import logger

router = APIRouter(tags=["Hotspots"])


@router.get(
    "/hotspots",
    response_model=HotspotsResponse,
    summary="Get Plastic Accumulation Hotspots",
    description="Returns identified plastic concentration hotspot points and risk classifications."
)
def get_hotspots(
    region: Optional[str] = Query(None, description="Target ocean region name")
):
    try:
        return hotspot_service.get_accumulation_hotspots(region=region)
    except Exception as e:
        logger.error(f"Error executing hotspots endpoint: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve accumulation hotspots data"
        )
