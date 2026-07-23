"""
Atmospheric & Wind Forcing Data Provider (ERA5 Reanalysis / NOAA GFS)
Extracts 10-meter surface wind vectors (u10, v10) for Stokes drift and windage transport calculations.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any

class WeatherDataProvider(ABC):

    @abstractmethod
    def get_surface_winds(self, bbox: Dict[str, float]) -> Dict[str, Any]:
        """
        Fetch 10m wind fields (u10, v10) to calculate windage factor on floating polymers.
        TODO: Query ECMWF CDS API for ERA5 reanalysis or NOAA NOMADS GFS operational forecast.
        """
        pass

class PlaceholderWeatherProvider(WeatherDataProvider):

    def get_surface_winds(self, bbox: Dict[str, float]) -> Dict[str, Any]:
        # TODO: Implement ECMWF CDS API or NOAA GFS client
        return {
            "u10": 3.5,
            "v10": 2.1,
            "speed_knots": 8.0,
            "direction_degrees": 230.0
        }
