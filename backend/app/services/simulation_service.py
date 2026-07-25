from typing import Optional
from backend.app.schemas.simulation_schema import SimulationResponse, RiskMetricsSchema
from backend.app.engine.ocean_engine import ocean_engine
from backend.app.utils.logger import logger


class SimulationService:
    """
    Service layer handling ocean plastic Lagrangian transport simulation queries via OceanEngine.
    """

    def get_simulation_forecast(self, region: Optional[str] = None, day: Optional[int] = None) -> SimulationResponse:
        """
        Retrieves ocean particle drift forecast data for a specified region and day via OceanEngine.
        """
        forecast_day = day if day is not None else 0
        logger.info(f"SimulationService: Fetching simulation forecast for region='{region}', day={forecast_day} via OceanEngine")

        state = ocean_engine.get_ocean_state(region=region, forecast_day=forecast_day)

        currents = [v.model_dump() for v in state.current_vectors]
        hotspots = state.hotspots or []

        return SimulationResponse(
            forecast_time=state.forecast_time,
            region=state.region,
            particles=[],
            currents=currents,
            hotspots=hotspots,
            metrics=RiskMetricsSchema(
                risk="High" if state.confidence > 0.8 else "Moderate",
                confidence=round(state.confidence * 100, 1)
            )
        )


simulation_service = SimulationService()
