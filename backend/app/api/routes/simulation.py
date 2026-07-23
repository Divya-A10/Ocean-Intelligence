from typing import Optional
from fastapi import APIRouter, Query, HTTPException, status
from backend.app.schemas.simulation_schema import SimulationResponse
from backend.app.services.simulation_service import simulation_service
from backend.app.utils.logger import logger

router = APIRouter(tags=["Simulation"])


@router.get(
    "/simulation",
    response_model=SimulationResponse,
    summary="Get Simulation Forecast Data",
    description="Retrieves microplastic particle drift forecasts, current vectors, and hotspot parameters."
)
def get_simulation(
    region: Optional[str] = Query(None, description="Target ocean region (e.g. 'Bay of Bengal', 'Singapore Strait')"),
    day: Optional[int] = Query(None, ge=0, le=14, description="Forecast projection day (0-14)")
):
    try:
        return simulation_service.get_simulation_forecast(region=region, day=day)
    except Exception as e:
        logger.error(f"Error executing simulation forecast endpoint: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve simulation forecast data"
        )
