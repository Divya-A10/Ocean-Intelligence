"""
Sentinel-2 Optical & Thermal Satellite Data Provider
Retrieves 10m high-resolution multispectral imagery for detecting floating marine debris surface anomalies.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any

class SentinelDataProvider(ABC):
    """
    Interface to fetch ESA Copernicus Sentinel-2 MSI L2A reflectance products.
    Used for calculated Floating Debris Index (FDI) and Normalized Difference Vegetation Index (NDVI) anomaly masking.
    """

    @abstractmethod
    def search_scenes(self, bbox: Dict[str, float], cloud_cover_max: float = 20.0) -> List[Dict[str, Any]]:
        """
        Search Sentinel Hub STAC API for cloud-free satellite passes over target coastal region.
        TODO: Integrate pystac_client / Sentinel Hub API.
        """
        pass

class PlaceholderSentinelProvider(SentinelDataProvider):

    def search_scenes(self, bbox: Dict[str, float], cloud_cover_max: float = 20.0) -> List[Dict[str, Any]]:
        # TODO: Implement STAC API search
        return [
            {
                "scene_id": "S2A_MSIL2A_20260715T043701_N0500_R033_T46QDG",
                "acquisition_date": "2026-07-15",
                "cloud_cover": 4.2,
                "fdi_anomaly_detected": True
            }
        ]
