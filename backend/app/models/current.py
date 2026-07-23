from dataclasses import dataclass, field
from typing import List


@dataclass
class CurrentVectorModel:
    latitude: float
    longitude: float
    u_component: float
    v_component: float
    velocity_knots: float
    direction: str = "North-East"


@dataclass
class CurrentsDataModel:
    region: str
    timestamp: str
    vectors: List[CurrentVectorModel] = field(default_factory=list)
