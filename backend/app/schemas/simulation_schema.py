from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class ParticleSchema(BaseModel):
    id: Optional[int] = Field(None, description="Particle identifier")
    latitude: float = Field(..., description="Latitude coordinate")
    longitude: float = Field(..., description="Longitude coordinate")
    density: Optional[float] = Field(None, description="Particle density concentration")
    size: Optional[str] = Field(None, description="Particle size classification (e.g. micro, meso, macro)")
    age_days: Optional[int] = Field(None, description="Age of particle drift in days")


class RiskMetricsSchema(BaseModel):
    risk: str = Field("Unknown", description="Risk level string")
    confidence: float = Field(0.0, description="Prediction confidence percentage")


class SimulationResponse(BaseModel):
    forecast_time: str = Field(..., description="ISO 8601 timestamp of simulation forecast")
    region: str = Field(..., description="Target ocean geographic region")
    particles: List[ParticleSchema] = Field(default_factory=list, description="Lagrangian particle state array")
    currents: List[Dict[str, Any]] = Field(default_factory=list, description="Ocean current vector grid")
    hotspots: List[Dict[str, Any]] = Field(default_factory=list, description="Accumulation hotspot points")
    metrics: RiskMetricsSchema = Field(default_factory=RiskMetricsSchema, description="Simulation risk metrics")

    model_config = {
        "json_schema_extra": {
            "example": {
                "forecast_time": "2026-07-23T12:00:00Z",
                "region": "Bay of Bengal",
                "particles": [],
                "currents": [],
                "hotspots": [],
                "metrics": {
                    "risk": "Unknown",
                    "confidence": 0
                }
            }
        }
    }
