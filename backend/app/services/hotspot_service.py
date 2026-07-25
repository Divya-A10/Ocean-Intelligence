from typing import Optional
from backend.app.schemas.hotspot_schema import HotspotsResponse, HotspotSchema
from backend.app.engine.ocean_engine import ocean_engine
from backend.app.utils.logger import logger


class HotspotService:
    """
    Service layer for fetching accumulation hotspots via the OceanEngine.
    """

    def get_accumulation_hotspots(self, region: Optional[str] = None) -> HotspotsResponse:
        """
        Retrieves plastic accumulation hotspot points and risk classifications via OceanEngine.
        """
        logger.info(f"HotspotService: Retrieving accumulation hotspots for region='{region}' via OceanEngine")

        state = ocean_engine.get_ocean_state(region=region, forecast_day=0)
        raw_hotspots = state.hotspots or []

        hotspots = [
            HotspotSchema(
                id=h.get("id", "hotspot-001"),
                latitude=h.get("latitude", 15.0),
                longitude=h.get("longitude", 88.0),
                density_particles_per_km2=h.get("density_particles_per_km2", 1500.0),
                risk_level=h.get("risk_level", "High"),
                description=h.get("description", "Estuarine outflow convergence zone")
            )
            for h in raw_hotspots
        ]

        return HotspotsResponse(
            region=state.region,
            count=len(hotspots),
            hotspots=hotspots
        )


hotspot_service = HotspotService()
