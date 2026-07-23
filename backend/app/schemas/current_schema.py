from typing import List, Optional
from pydantic import BaseModel, Field


class CurrentVectorSchema(BaseModel):
    latitude: float = Field(..., description="Latitude coordinate")
    longitude: float = Field(..., description="Longitude coordinate")
    u_component: float = Field(..., description="Eastward water velocity (m/s)")
    v_component: float = Field(..., description="Northward water velocity (m/s)")
    velocity_knots: float = Field(..., description="Current speed in knots")
    direction: Optional[str] = Field("North-East", description="Compass heading direction")


class CurrentsResponse(BaseModel):
    region: str = Field(..., description="Geographic region name")
    timestamp: Optional[str] = Field(None, description="Observation or forecast timestamp")
    vectors: List[CurrentVectorSchema] = Field(default_factory=list, description="Array of current vector points")
