from typing import Optional
from fastapi import APIRouter, Query, HTTPException, status
from backend.app.schemas.current_schema import CurrentsResponse
from backend.app.services.current_service import current_service
from backend.app.utils.logger import logger

router = APIRouter(tags=["Ocean Currents"])


@router.get(
    "/currents",
    response_model=CurrentsResponse,
    summary="Get Ocean Current Velocity Vectors",
    description="Returns surface current velocity vectors and directional headings for visualization."
)
def get_currents(
    region: Optional[str] = Query(None, description="Target ocean region name")
):
    try:
        return current_service.get_ocean_currents(region=region)
    except Exception as e:
        logger.error(f"Error executing ocean currents endpoint: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve ocean current vector grid"
        )
