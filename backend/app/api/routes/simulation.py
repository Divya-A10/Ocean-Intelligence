from typing import Optional
from fastapi import APIRouter, Query, HTTPException, status
from backend.app.schemas.simulation_schema import SimulationResponse
from backend.app.schemas.ocean_state import OceanState
from backend.app.services.simulation_service import simulation_service
from backend.app.engine.ocean_engine import ocean_engine
from backend.app.utils.logger import logger

router = APIRouter(tags=["Simulation & Ocean Engine"])


@router.get(
    "/simulation",
    response_model=SimulationResponse,
    summary="Get Simulation Forecast Data",
    description="Retrieves microplastic particle drift forecasts, current vectors, and hotspot parameters via Ocean Engine."
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


@router.get(
    "/engine/ocean-state",
    response_model=OceanState,
    summary="Get Standardized Ocean State Object",
    description="Directly queries the Ocean Intelligence Engine for the unified OceanState schema."
)
def get_ocean_state(
    region: Optional[str] = Query(None, description="Target ocean region name"),
    forecast_day: Optional[int] = Query(0, ge=0, le=14, description="Forecast projection day")
):
    try:
        return ocean_engine.get_ocean_state(region=region, forecast_day=forecast_day or 0)
    except Exception as e:
        logger.error(f"Error executing ocean-state endpoint: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve ocean state from Ocean Engine"
        )
