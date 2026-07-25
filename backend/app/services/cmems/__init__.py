"""
CMEMS (Copernicus Marine Environment Monitoring Service) Integration Module.
Contains the dedicated Loader and Processor layers for acquiring and transforming NetCDF data.
"""

from backend.app.services.cmems.loader import cmems_loader, CMEMSLoader
from backend.app.services.cmems.processor import cmems_processor, CMEMSProcessor

__all__ = ["cmems_loader", "CMEMSLoader", "cmems_processor", "CMEMSProcessor"]
