"""
Simulation, Currents, and Hotspots REST Endpoints
"""

from fastapi import APIRouter, Query
from typing import List, Optional
from backend.models.schemas import SimulationResponseModel, CurrentVectorModel, HotspotModel
from backend.simulation.forecast_engine import ForecastEngine
from backend.simulation.current_loader import PlaceholderCurrentLoader
from backend.simulation.hotspot_analysis import PlaceholderHotspotAnalyzer

router = APIRouter(tags=["Simulation"])
forecast_engine = ForecastEngine()
current_loader = PlaceholderCurrentLoader()
hotspot_analyzer = PlaceholderHotspotAnalyzer()

@router.get("/simulation", response_model=SimulationResponseModel)
def get_simulation(
    region: str = Query("bay-of-bengal", description="Region key"),
    day: int = Query(0, description="Forecast day index (0-7)")
):
    """
    GET /simulation
    Returns complete simulation state for specified region and forecast day.
    """
    forecast_data = forecast_engine.generate_region_forecast(region, day)
    return forecast_data

@router.get("/currents", response_model=List[CurrentVectorModel])
def get_currents(
    region: str = Query("bay-of-bengal", description="Region key")
):
    """
    GET /currents
    Returns ocean hydrodynamic velocity grid (u, v vectors).
    """
    coords = {
        "bay-of-bengal": (10.0, 80.0, 20.0, 95.0),
        "singapore-strait": (0.5, 102.5, 2.0, 105.0),
        "north-pacific-gyre": (25.0, -150.0, 45.0, -130.0),
        "mediterranean-sea": (30.0, -5.0, 45.0, 25.0)
    }
    bbox = coords.get(region, (10.0, 80.0, 20.0, 95.0))
    grid = current_loader.fetch_velocity_grid(bbox)
    return grid

@router.get("/hotspots", response_model=List[HotspotModel])
def get_hotspots(
    region: str = Query("bay-of-bengal", description="Region key")
):
    """
    GET /hotspots
    Returns spatial density plastic accumulation hotspots.
    """
    simulation_data = forecast_engine.generate_region_forecast(region, 0)
    particles = simulation_data["particles"]
    hotspots = hotspot_analyzer.calculate_hotspots(particles)
    return hotspots
