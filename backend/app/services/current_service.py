from typing import Optional
from backend.app.schemas.current_schema import CurrentsResponse, CurrentVectorSchema
from backend.app.data.placeholders import PLACEHOLDER_CURRENTS
from backend.app.utils.logger import logger


class CurrentService:
    """
    Service layer for fetching ocean velocity vectors and hydrodynamic currents.
    """

    def get_ocean_currents(self, region: Optional[str] = None) -> CurrentsResponse:
        """
        Fetches ocean current vector grid for a given region.
        """
        logger.info(f"CurrentService: Retrieving ocean velocity vectors for region='{region}'")

        # TODO: Connect to satellite altimetry and CMEMS surface velocity fields
        # TODO: Compute tidal current constituents and wind drag coefficients

        target_region = region if region else PLACEHOLDER_CURRENTS["region"]
        vectors = [
            CurrentVectorSchema(**vec) for vec in PLACEHOLDER_CURRENTS["vectors"]
        ]

        return CurrentsResponse(
            region=target_region,
            timestamp=PLACEHOLDER_CURRENTS["timestamp"],
            vectors=vectors
        )


current_service = CurrentService()
