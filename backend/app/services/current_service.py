from typing import Optional
from backend.app.schemas.current_schema import CurrentsResponse, CurrentVectorSchema
from backend.app.engine.ocean_engine import ocean_engine
from backend.app.utils.logger import logger


class CurrentService:
    """
    Service layer for fetching ocean velocity vectors and hydrodynamic currents via the Ocean Engine.
    """

    def get_ocean_currents(self, region: Optional[str] = None) -> CurrentsResponse:
        """
        Fetches ocean current vector grid for a given region via OceanEngine.
        """
        logger.info(f"CurrentService: Retrieving ocean velocity vectors for region='{region}' via OceanEngine")

        state = ocean_engine.get_ocean_state(region=region, forecast_day=0)
        vectors = [
            CurrentVectorSchema(
                latitude=v.latitude,
                longitude=v.longitude,
                u_component=v.u_component,
                v_component=v.v_component,
                velocity_knots=v.velocity_knots,
                direction=v.direction
            )
            for v in state.current_vectors
        ]

        return CurrentsResponse(
            region=state.region,
            timestamp=state.forecast_time,
            vectors=vectors
        )


current_service = CurrentService()
