"""
HYCOM Ocean Prediction System Data Provider
Interface for OPeNDAP access to Hybrid Coordinate Ocean Model sea surface height and 3D current velocities.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any

class HYCOMDataProvider(ABC):
    """
    Interface to read 1/12° global HYCOM ocean current fields.
    """

    @abstractmethod
    def fetch_opendap_slice(self, dataset_url: str, lat_range: Tuple[float, float], lng_range: Tuple[float, float]) -> Any:
        """
        Open remote dataset via xarray / netCDF4 OPeNDAP streaming.
        TODO: Stream surface velocity variables u_water_velocity, v_water_velocity.
        """
        pass

class PlaceholderHYCOMProvider(HYCOMDataProvider):

    def fetch_opendap_slice(self, dataset_url: str, lat_range: Tuple[float, float], lng_range: Tuple[float, float]) -> Any:
        # TODO: Implement xarray.open_dataset OPeNDAP reader
        return None
