"""
API Routes Package
"""
from backend.app.api.routes.health import router as health_router
from backend.app.api.routes.simulation import router as simulation_router
from backend.app.api.routes.currents import router as currents_router
from backend.app.api.routes.hotspots import router as hotspots_router
from backend.app.api.routes.explain import router as explain_router
from backend.app.api.routes.reports import router as reports_router

__all__ = [
    "health_router",
    "simulation_router",
    "currents_router",
    "hotspots_router",
    "explain_router",
    "reports_router"
]
