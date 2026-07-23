"""
Hydrodynamic Ocean Current Loader Interface
Interface for fetching u, v velocity vectors from CMEMS / HYCOM ocean circulation models.
"""

from typing import List, Dict, Any, Tuple
from abc import ABC, abstractmethod

class CurrentLoader(ABC):
    """
    Interface for loading 3D ocean velocity fields (u: eastward m/s, v: northward m/s).
    """

    @abstractmethod
    def fetch_velocity_grid(self, bbox: Tuple[float, float, float, float], depth_meters: float = 0.5) -> List[Dict[str, Any]]:
        """
        Fetch u and v components for a bounding box [min_lat, min_lng, max_lat, max_lng].
        TODO: Interface with CMEMS Copernicus Marine Service API or HYCOM OPeNDAP endpoints.
        """
        pass

class PlaceholderCurrentLoader(CurrentLoader):
    """
    Placeholder Current Loader providing structured hydrodynamic vector grid.
    """

    def fetch_velocity_grid(self, bbox: Tuple[float, float, float, float], depth_meters: float = 0.5) -> List[Dict[str, Any]]:
        min_lat, min_lng, max_lat, max_lng = bbox
        grid = []
        lat_step = (max_lat - min_lat) / 5.0
        lng_step = (max_lng - min_lng) / 5.0
        
        for i in range(5):
            for j in range(5):
                lat = min_lat + i * lat_step
                lng = min_lng + j * lng_step
                u = 0.2 + (i * 0.05)
                v = 0.1 + (j * 0.04)
                mag = (u**2 + v**2)**0.5 * 1.94384  # m/s to knots
                grid.append({
                    "lat": lat,
                    "lng": lng,
                    "u": u,
                    "v": v,
                    "magnitudeKnots": round(mag, 2),
                    "directionDegrees": 45.0
                })
        return grid
