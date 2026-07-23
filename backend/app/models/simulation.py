from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional


@dataclass
class ParticleModel:
    id: int
    latitude: float
    longitude: float
    density: float
    size: str
    age_days: int


@dataclass
class RiskMetricsModel:
    risk: str = "Unknown"
    confidence: float = 0.0


@dataclass
class SimulationModel:
    forecast_time: str
    region: str
    particles: List[ParticleModel] = field(default_factory=list)
    currents: List[Dict[str, Any]] = field(default_factory=list)
    hotspots: List[Dict[str, Any]] = field(default_factory=list)
    metrics: RiskMetricsModel = field(default_factory=RiskMetricsModel)
