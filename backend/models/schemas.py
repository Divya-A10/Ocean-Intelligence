"""
Pydantic Data Models & Schemas for FastAPI REST Endpoints
Matching contract defined in shared/types/api.ts
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Literal

class CoordinatesModel(BaseModel):
    lat: float
    lng: float

class ParticleModel(BaseModel):
    id: str | int
    lat: float
    lng: float
    density: float
    size: Literal["micro", "meso", "macro"]
    ageDays: float
    origin: Optional[str] = None
    released: Optional[str] = None
    speedKnots: Optional[float] = None
    dest: Optional[str] = None
    etaDays: Optional[float] = None
    isGlobal: Optional[bool] = False

class CurrentVectorModel(BaseModel):
    lat: float
    lng: float
    u: float  # Eastward velocity m/s
    v: float  # Northward velocity m/s
    magnitudeKnots: float
    directionDegrees: float

class HotspotModel(BaseModel):
    id: str
    name: str
    lat: float
    lng: float
    intensity: Literal["Moderate", "High", "Extreme", "Critical"]
    radiusKm: float
    estimatedTons: float

class TransportPathwayModel(BaseModel):
    name: str
    intensity: Literal["Low", "Medium", "High", "Very High", "Extreme"]

class CleanupSiteModel(BaseModel):
    name: str
    costEst: str
    estRecovery: str
    status: str

class RiskMetricsModel(BaseModel):
    speed: float
    risk: Literal["Low", "Moderate", "Elevated", "Critical"]
    accumulation: int
    confidence: int
    biodiversityIndex: int
    fisheriesImpact: int

class SimulationResponseModel(BaseModel):
    regionKey: str
    regionName: str
    coordinates: CoordinatesModel
    forecastDay: int
    timestamp: str
    oceanHealthScore: int
    globalOceanTemperature: float
    plasticHotspotsCount: int
    activeWeatherSystems: str
    satelliteSnapshot: str
    currentSpeedKnots: float
    currentDirection: str
    degradationEstimateYears: int
    uncertaintyPercentage: int
    cleanupPriorityRank: int
    biodiversityExposureIndex: int
    fisheriesImpactPercentage: int
    transportPathways: List[TransportPathwayModel]
    particles: List[ParticleModel]
    cleanupSites: List[CleanupSiteModel]
    metrics: RiskMetricsModel

class ExplainRequestModel(BaseModel):
    prompt: str
    regionKey: str
    forecastDay: Optional[int] = 3
    selectedParticleIndex: Optional[int] = 100

class CitationModel(BaseModel):
    title: str
    url: str

class ExplainResponseModel(BaseModel):
    text: str
    citations: List[CitationModel]
    confidenceIndex: int

class ReportRequestModel(BaseModel):
    regionKey: str
    reportType: Literal["impact", "briefing", "cleanup", "scientific"]

class ReportResponseModel(BaseModel):
    markdown: str
    generatedAt: str
    regionName: str

class HealthStatusModel(BaseModel):
    status: str
    service: str
    version: str
    database: str
