from typing import List, Optional
from pydantic import BaseModel, Field


class HotspotSchema(BaseModel):
    id: str = Field(..., description="Unique hotspot identifier")
    latitude: float = Field(..., description="Latitude coordinate")
    longitude: float = Field(..., description="Longitude coordinate")
    density_particles_per_km2: float = Field(..., description="Estimated microplastic concentration per km²")
    risk_level: str = Field(..., description="Severity classification: Low, Moderate, High, Critical")
    description: Optional[str] = Field("", description="Hotspot notes or origin description")


class HotspotsResponse(BaseModel):
    region: str = Field(..., description="Geographic region name")
    count: int = Field(0, description="Total identified hotspots count")
    hotspots: List[HotspotSchema] = Field(default_factory=list, description="List of hotspot points")
