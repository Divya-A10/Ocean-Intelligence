"""
Copernicus Marine Environment Monitoring Service (CMEMS) Integration Interface
Abstract provider for retrieving high-resolution global ocean physical & biogeochemical NetCDF products.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any

class CMEMSDataProvider(ABC):
    """
    Interface to fetch CMEMS datasets:
    - GLOBAL_ANALYSISFORECAST_PHY_001_024 (3D Salinity, Temperature, U, V velocities)
    - GLOBAL_ANALYSISFORECAST_BIO_001_028 (Chlorophyll, primary production)
    """

    @abstractmethod
    def download_product(self, product_id: str, bbox: Dict[str, float], time_range: Tuple[str, str]) -> str:
        """
        Connects via copernicusmarine Python API to download sub-setted NetCDF files.
        TODO: Add copernicusmarine package dependency and OAuth credentials handshake.
        """
        pass

class PlaceholderCMEMSProvider(CMEMSDataProvider):

    def download_product(self, product_id: str, bbox: Dict[str, float], time_range: Tuple[str, str]) -> str:
        # TODO: Implement Copernicus Marine API query
        return "/tmp/cmems_mock_product.nc"
