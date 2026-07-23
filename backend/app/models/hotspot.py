from dataclasses import dataclass, field
from typing import List


@dataclass
class HotspotModel:
    id: str
    latitude: float
    longitude: float
    density_particles_per_km2: float
    risk_level: str
    description: str = ""


@dataclass
class HotspotsDataModel:
    region: str
    count: int
    hotspots: List[HotspotModel] = field(default_factory=list)
